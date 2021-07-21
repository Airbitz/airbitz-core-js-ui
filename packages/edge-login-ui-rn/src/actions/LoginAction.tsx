import * as React from 'react'

import s from '../common/locales/strings'
import { TextInputModal } from '../components/modals/TextInputModal'
import { Airship, showError } from '../components/services/AirshipInstance'
import { getLoginKey } from '../keychain'
import { Dispatch, GetState, Imports } from '../types/ReduxTypes'
import { attemptLogin, LoginAttempt } from '../util/loginAttempt'
import { completeLogin } from './LoginCompleteActions'

/**
 * Logs the user in, using password, PIN, or recovery.
 * There is no error handling in here, since components do that best.
 */
export const login = (attempt: LoginAttempt, otpKey?: string) => async (
  dispatch: Dispatch,
  getState: GetState,
  imports: Imports
): Promise<void> => {
  const { accountOptions, context } = imports

  const account = await attemptLogin(context, attempt, {
    ...accountOptions,
    otp: otpKey, // Legacy property name
    otpKey
  })
  dispatch(completeLogin(account))
}

export const loginWithTouch = (username: string) => async (
  dispatch: Dispatch,
  getState: GetState,
  imports: Imports
) => {
  const { context, accountOptions } = imports
  const loginKey = await getLoginKey(
    username,
    `Touch to login user: "${username}"`,
    s.strings.login_with_password
  )
  if (loginKey == null) return

  dispatch({ type: 'AUTH_LOGGING_IN_WITH_PIN' })
  const account = await context.loginWithKey(username, loginKey, accountOptions)
  dispatch(completeLogin(account))
}

export function loginWithPin(username: string, pin: string) {
  return (dispatch: Dispatch, getState: GetState, imports: Imports) => {
    const { context } = imports
    setTimeout(async () => {
      try {
        const abcAccount = await context.loginWithPIN(
          username,
          pin,
          imports.accountOptions
        )
        dispatch(completeLogin(abcAccount))
      } catch (e) {
        console.log('LOG IN WITH PIN ERROR ', e)
        if (e.name === 'OtpError') {
          dispatch({
            type: 'OTP_ERROR',
            data: {
              attempt: { type: 'pin', username, pin },
              error: e
            }
          })
          return
        }
        const message =
          e.name === 'PasswordError'
            ? s.strings.invalid_pin
            : e.name === 'UsernameError'
            ? s.strings.pin_not_enabled
            : e.name === 'NetworkError'
            ? `${e.message} ${s.strings.pin_network_error_full_password}`
            : e.message
        dispatch({
          type: 'LOGIN_PIN_FAIL',
          data: {
            message,
            wait: e.wait
          }
        })
        if (e.wait) {
          setTimeout(() => {
            dispatch(processWait(message))
          }, 1000)
        }
      }
    }, 300)
    // the timeout is a hack until we put in interaction manager.
  }
}
export function processWait(message: string) {
  return (dispatch: Dispatch, getState: GetState, imports: Imports) => {
    const state = getState()
    const wait = state.login.wait
    console.log('RL: wait ', wait)
    if (wait > 0) {
      // console.log('RL: got more than 1', wait)
      dispatch({
        type: 'LOGIN_PIN_FAIL',
        data: {
          message,
          wait: wait - 1
        }
      })
      setTimeout(() => {
        dispatch(processWait(message))
      }, 1000)
    }
  }
}

/**
 * Ask the user for the username that goes with a recovery key,
 * then launches the questions scene.
 */
export const launchPasswordRecovery = (recoveryKey: string) => async (
  dispatch: Dispatch,
  getState: GetState,
  imports: Imports
) => {
  const { context } = imports

  async function handleSubmit(username: string): Promise<boolean | string> {
    try {
      const questions = await context.fetchRecovery2Questions(
        recoveryKey,
        username
      )
      dispatch({
        type: 'START_RECOVERY_LOGIN',
        data: { recoveryKey, userQuestions: questions, username }
      })
      return true
    } catch (error) {
      showError(
        error != null && error.name === 'UsernameError'
          ? s.strings.recovery_by_username_error
          : error
      )
      return false
    }
  }

  Airship.show(bridge => (
    <TextInputModal
      bridge={bridge}
      onSubmit={handleSubmit}
      title={s.strings.password_recovery}
      message={s.strings.recover_by_username}
      inputLabel={s.strings.username}
    />
  ))
}
