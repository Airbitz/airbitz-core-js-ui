import { EdgeAccount } from 'edge-core-js'
import * as React from 'react'
import { Keyboard } from 'react-native'
import { sprintf } from 'sprintf-js'

import s from '../common/locales/strings'
import { ButtonsModal } from '../components/modals/ButtonsModal'
import { Airship } from '../components/services/AirshipInstance'
import * as Constants from '../constants/index'
import {
  enableTouchId,
  isTouchDisabled,
  isTouchEnabled,
  supportsTouchId
} from '../keychain'
import { Dispatch, GetState, Imports } from '../types/ReduxTypes'
import { hasSecurityAlerts } from '../util/hasSecurityAlerts'
import { setMostRecentUsers } from './PreviousUsersActions'

/**
 * The user has just logged in, so figure out what do to next.
 */
export const completeLogin = (account: EdgeAccount) => async (
  dispatch: Dispatch,
  getState: GetState,
  imports: Imports
) => {
  await setMostRecentUsers(account.username)

  // Problem logins:
  const { skipSecurityAlerts = false } = imports
  if (!skipSecurityAlerts && hasSecurityAlerts(account)) {
    dispatch({ type: 'START_SECURITY_ALERT', data: account })
    return
  }

  // Recovery logins:
  if (account.recoveryLogin) {
    await Airship.show(bridge => (
      <ButtonsModal
        bridge={bridge}
        message={s.strings.recovery_successful}
        buttons={{ ok: { label: s.strings.ok } }}
      />
    ))
    dispatch({ type: 'START_RESECURE', data: account })
    return
  }

  // Normal logins:
  await twofaReminder(account)
  dispatch(submitLogin(account))
}

/**
 * The resecure workflow calls this when it is done.
 */
export function completeResecure() {
  return (dispatch: Dispatch, getState: GetState, imports: Imports) => {
    const { account } = getState()
    if (account == null) return

    if (imports.onLogin != null) dispatch(submitLogin(account))
    else imports.onComplete()
  }
}

/**
 * Everything is done, and we can pass the account to the outside world.
 */
export const submitLogin = (account: EdgeAccount) => async (
  dispatch: Dispatch,
  getState: GetState,
  imports: Imports
) => {
  const { onLogin } = imports

  account.watch('loggedIn', loggedIn => {
    if (!loggedIn) dispatch({ type: 'RESET_APP' })
  })

  const touchDisabled = await isTouchDisabled(account.username)
  if (!touchDisabled) {
    await enableTouchId(account).catch(e => {
      console.log(e) // Fail quietly
    })
  }

  const isTouchSupported = await supportsTouchId()
  const touchEnabled = await isTouchEnabled(account.username)
  const touchIdInformation = {
    isTouchSupported,
    isTouchEnabled: touchEnabled
  }

  dispatch({ type: 'LOGIN_SUCCEESS' })
  Airship.clear()
  if (onLogin != null) onLogin(account, touchIdInformation)
}

async function twofaReminder(account: EdgeAccount) {
  const { otpKey, dataStore } = account
  const pluginList = await dataStore.listStoreIds()
  const storeName = pluginList.includes(Constants.OTP_REMINDER_STORE_NAME)
    ? Constants.OTP_REMINDER_STORE_NAME
    : null
  const itemList = storeName
    ? await dataStore.listItemIds(Constants.OTP_REMINDER_STORE_NAME)
    : null
  const createdAtString =
    itemList && itemList.includes(Constants.OTP_REMINDER_KEY_NAME_CREATED_AT)
      ? await dataStore.getItem(
          Constants.OTP_REMINDER_STORE_NAME,
          Constants.OTP_REMINDER_KEY_NAME_CREATED_AT
        )
      : null
  const createdAt = createdAtString ? parseInt(createdAtString) : null
  const reminderCreatedAtDate = createdAt
    ? createdAt + Constants.OTP_REMINDER_MILLISECONDS
    : null
  const lastOtpCheckString =
    itemList &&
    itemList.includes(Constants.OTP_REMINDER_KEY_NAME_LAST_OTP_CHECKED)
      ? await dataStore.getItem(
          Constants.OTP_REMINDER_STORE_NAME,
          Constants.OTP_REMINDER_KEY_NAME_LAST_OTP_CHECKED
        )
      : null
  const lastOtpCheck = lastOtpCheckString ? parseInt(lastOtpCheckString) : null
  const reminderLastOtpCheckDate = lastOtpCheck
    ? lastOtpCheck + Constants.OTP_REMINDER_MILLISECONDS
    : null
  const dontAsk =
    itemList && itemList.includes(Constants.OTP_REMINDER_KEY_NAME_DONT_ASK)
      ? await dataStore.getItem(
          Constants.OTP_REMINDER_STORE_NAME,
          Constants.OTP_REMINDER_KEY_NAME_DONT_ASK
        )
      : null

  const enableOtp = async account => {
    await account.enableOtp()
    return await Airship.show(bridge => (
      <ButtonsModal
        bridge={bridge}
        title={s.strings.otp_authentication_header}
        message={sprintf(s.strings.otp_authentication_message, account.otpKey)}
        buttons={{ ok: { label: s.strings.ok } }}
      />
    ))
  }

  const createOtpCheckModal = async () => {
    Keyboard.dismiss()
    const result = await Airship.show(bridge => (
      <ButtonsModal
        bridge={bridge}
        title={s.strings.otp_reset_modal_header}
        message={s.strings.otp_reset_modal_message}
        buttons={{
          yes: { label: s.strings.enable },
          no: { label: s.strings.skip_button, type: 'secondary' }
        }}
      />
    ))
    return result === 'yes'
  }

  const createOtpCheckModalDontAsk = async () => {
    Keyboard.dismiss()
    return await Airship.show(bridge => (
      <ButtonsModal
        bridge={bridge}
        title={s.strings.otp_reset_modal_header}
        message={s.strings.otp_reset_modal_message}
        buttons={{
          enable: { label: s.strings.enable, type: 'primary' },
          cancel: { label: s.strings.skip_button, type: 'secondary' },
          dontAsk: {
            label: s.strings.otp_reset_modal_dont_ask,
            type: 'secondary'
          }
        }}
      />
    ))
  }

  if (otpKey) {
    return true
  }

  if (dontAsk) {
    return true
  }

  if (!storeName) {
    const resolve = await createOtpCheckModal()
    if (resolve) {
      await enableOtp(account)
      await account.dataStore.setItem(
        Constants.OTP_REMINDER_STORE_NAME,
        Constants.OTP_REMINDER_KEY_NAME_LAST_OTP_CHECKED,
        Date.now().toString()
      )
      return true
    }
    await account.dataStore.setItem(
      Constants.OTP_REMINDER_STORE_NAME,
      Constants.OTP_REMINDER_KEY_NAME_LAST_OTP_CHECKED,
      Date.now().toString()
    )
    return false
  }

  if (
    lastOtpCheckString &&
    lastOtpCheck &&
    reminderLastOtpCheckDate &&
    Date.now() > reminderLastOtpCheckDate
  ) {
    const resolve = await createOtpCheckModalDontAsk()
    if (resolve === 'enable') {
      await enableOtp(account)
      return true
    }
    if (resolve === 'dontAsk') {
      await account.dataStore.setItem(
        Constants.OTP_REMINDER_STORE_NAME,
        Constants.OTP_REMINDER_KEY_NAME_DONT_ASK,
        'true'
      )
      return false
    }
    await account.dataStore.setItem(
      Constants.OTP_REMINDER_STORE_NAME,
      Constants.OTP_REMINDER_KEY_NAME_LAST_OTP_CHECKED,
      Date.now().toString()
    )
    return false
  }

  if (lastOtpCheckString) {
    return true
  }

  if (
    createdAtString &&
    createdAt &&
    reminderCreatedAtDate &&
    Date.now() > reminderCreatedAtDate
  ) {
    const resolve = await createOtpCheckModal()
    if (resolve) {
      await enableOtp(account)
      await account.dataStore.setItem(
        Constants.OTP_REMINDER_STORE_NAME,
        Constants.OTP_REMINDER_KEY_NAME_LAST_OTP_CHECKED,
        Date.now().toString()
      )
      return true
    }
    await account.dataStore.setItem(
      Constants.OTP_REMINDER_STORE_NAME,
      Constants.OTP_REMINDER_KEY_NAME_LAST_OTP_CHECKED,
      Date.now().toString()
    )
    return false
  }

  return true
}
