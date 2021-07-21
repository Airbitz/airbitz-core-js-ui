import { OtpError } from 'edge-core-js'

import { Dispatch, GetState, Imports } from '../types/ReduxTypes'

/**
 * Returns true if we can't find the voucher in the pending list.
 */
export const hasReadyVoucher = (otpError: OtpError) => async (
  dispatch: Dispatch,
  getState: GetState,
  imports: Imports
): Promise<boolean> => {
  const { context } = imports
  const { voucherId } = otpError
  if (voucherId == null) return false

  // Is that voucher pending?
  const messages = await context.fetchLoginMessages()
  for (const username of Object.keys(messages)) {
    const { pendingVouchers } = messages[username]
    for (const voucher of pendingVouchers) {
      if (voucher.voucherId === voucherId) return false
    }
  }
  return true
}

export const requestOtpReset = () => async (
  dispatch: Dispatch,
  getState: GetState,
  imports: Imports
): Promise<void> => {
  const state = getState()
  const { otpAttempt, otpError } = state.login
  const { context } = imports
  if (otpAttempt == null || otpError == null) {
    throw new Error('No OTP retry data')
  }
  const { resetToken } = otpError
  if (resetToken == null) {
    throw new Error('No OTP reset token')
  }

  const date = await context.requestOtpReset(otpAttempt.username, resetToken)
  dispatch({ type: 'OTP_RESET_REQUEST', data: date })
}
