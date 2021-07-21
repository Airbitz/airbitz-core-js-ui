import * as React from 'react'
import { AirshipToast, makeAirship } from 'react-native-airship'

import { AlertDropdown } from '../common/AlertDropdown'

export const Airship = makeAirship()

/**
 * Shows an error alert to the user.
 * Used when some user-requested operation fails.
 */
export function showError(error: unknown): void {
  console.log(error)

  // TODO: Run the errors through our translation infrastructure:
  const message = error instanceof Error ? error.message : String(error)

  Airship.show(bridge => <AlertDropdown bridge={bridge} message={message} />)
}

/**
 * Shows an error warning to the user.
 * Used when some user-requested operation succeeds but with a warning.
 */
export function showWarning(message: string): void {
  Airship.show(bridge => (
    <AlertDropdown bridge={bridge} message={message} warning />
  ))
}

/**
 * Shows a message to the user.
 * Used when some user-requested operation succeeds.
 */
export function showToast(message: string): void {
  Airship.show(bridge => <AirshipToast bridge={bridge} message={message} />)
}
