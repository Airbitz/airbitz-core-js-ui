import { sprintf } from 'sprintf-js'
import passwordCheck from 'zxcvbn'

import s from '../common/locales/strings'
import { Airship } from '../components/services/AirshipInstance'
import * as Constants from '../constants/index'
import { enableTouchId, isTouchDisabled } from '../keychain'
import { Dispatch, GetState, Imports } from '../types/ReduxTypes'
import { logEvent } from '../util/analytics'
import { getPreviousUsers, setMostRecentUsers } from './PreviousUsersActions'

export interface CreateUserData {
  username: string
  password: string
  pin: string
}

export function validatePin(pin: string) {
  return (dispatch: Dispatch, getState: GetState, imports: Imports) => {
    let error = null
    if (pin.length !== 4) {
      error = s.strings.four_digit_pin_error
    }
    if (pin.length > 4) {
      return
    }
    dispatch({ type: 'CREATE_UPDATE_PIN', data: { pin, error } })
  }
}
export function checkUsernameForAvailabilty(data: string) {
  return async (dispatch: Dispatch, getState: GetState, imports: Imports) =>
    await imports.context
      .usernameAvailable(data)
      .then(async response => {
        if (response) {
          const obj = {
            username: data,
            error: null
          }
          logEvent(`Signup_Username_Available`)
          dispatch({ type: 'CREATE_UPDATE_USERNAME', data: obj })
          dispatch({ type: 'WORKFLOW_NEXT' })
          return
        }
        const obj = {
          username: data,
          error: s.strings.username_exists_error
        }
        logEvent(`Signup_Username_Unavailable`)
        dispatch({ type: 'CREATE_UPDATE_USERNAME', data: obj })
      })
      .catch(e => {
        console.log(e.message)
      })
}

function isASCII(str: string) {
  // eslint-disable-next-line no-control-regex
  return /^[\x00-\x7F]*$/.test(str)
}

export function validateUsername(data: string) {
  return (dispatch: Dispatch, getState: GetState, imports: Imports) => {
    // TODO evaluate client side evaluations.
    let error = data.length > 2 ? null : s.strings.username_3_characters_error // TODO: Localize string
    error = isASCII(data) ? error : s.strings.username_ascii_error // TODO: localize
    const obj = {
      username: data,
      error: error
    }
    dispatch({ type: 'CREATE_UPDATE_USERNAME', data: obj })
  }
}
export function validateConfirmPassword(confirmPassword: string) {
  return (dispatch: Dispatch, getState: GetState, imports: Imports) => {
    const state = getState()
    // dispatch(openLoading()) Legacy dealt with state for showing a spinner
    // the timeout is a hack until we put in interaction manager.
    let error = null
    if (confirmPassword !== state.create.password) {
      error = s.strings.confirm_password_error
    }
    dispatch({
      type: 'AUTH_UPDATE_CONFIRM_PASSWORD',
      data: { password: confirmPassword, error }
    })
  }
}
export function validatePassword(data: string) {
  return (dispatch: Dispatch, getState: GetState, imports: Imports) => {
    const context = imports.context
    let error = null
    // dispatch(openLoading()) Legacy dealt with state for showing a spinner
    // the timeout is a hack until we put in interaction manager.
    const passwordEval = context.checkPasswordRules(data)
    const passwordCheckResult = passwordCheck(data)
    let passwordCheckString

    if (
      passwordCheckResult &&
      passwordCheckResult.crack_times_display &&
      passwordCheckResult.crack_times_display.online_no_throttling_10_per_second
    ) {
      passwordCheckString =
        passwordCheckResult.crack_times_display
          .online_no_throttling_10_per_second
    }

    passwordCheckString = sprintf(
      s.strings.it_would_take_xx_to_crack,
      passwordCheckString
    )
    if (passwordCheckResult.score < 3) {
      passwordCheckString += s.strings.recommend_choosing_a_stronger
    }

    if (!passwordEval.passed) {
      error = s.strings.password_error // TODO localize.
    }

    dispatch({
      type: 'AUTH_UPDATE_PASSWORD',
      data: {
        password: data,
        passwordStatus: passwordEval,
        passwordCheckString,
        error: error
      }
    })
  }
}

export function createUser(data: CreateUserData) {
  return (dispatch: Dispatch, getState: GetState, imports: Imports) => {
    const { context } = imports
    dispatch({ type: 'WORKFLOW_NEXT' })
    setTimeout(async () => {
      try {
        const abcAccount = await context.createAccount(
          data.username,
          data.password,
          data.pin,
          imports.accountOptions
        )
        abcAccount.watch('loggedIn', loggedIn => {
          if (!loggedIn) dispatch({ type: 'RESET_APP' })
        })
        const touchDisabled = await isTouchDisabled(abcAccount.username)
        if (!touchDisabled) {
          await enableTouchId(abcAccount).catch(e => {
            console.log(e) // Fail quietly
          })
        }
        dispatch({ type: 'CREATE_ACCOUNT_SUCCESS', data: abcAccount })
        dispatch({ type: 'WORKFLOW_NEXT' })
        logEvent('Signup_Create_User_Success')
        await setMostRecentUsers(abcAccount.username)
        await abcAccount.dataStore.setItem(
          Constants.OTP_REMINDER_STORE_NAME,
          Constants.OTP_REMINDER_KEY_NAME_CREATED_AT,
          Date.now().toString()
        )
        dispatch(getPreviousUsers())
      } catch (e) {
        console.log(e)
        dispatch({ type: 'CREATE_ACCOUNT_FAIL', data: e.message })
        dispatch({ type: 'WORKFLOW_BACK' })
      }
    }, 300)
  }
}

export const confirmAndFinish = () => (
  dispatch: Dispatch,
  getState: GetState,
  imports: Imports
) => {
  const { account } = getState()
  const { onLogin } = imports
  if (account == null) return

  Airship.clear()
  if (onLogin != null) onLogin(account)
}
