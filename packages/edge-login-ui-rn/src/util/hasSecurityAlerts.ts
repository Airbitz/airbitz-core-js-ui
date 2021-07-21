import { EdgeAccount } from 'edge-core-js'

type Unsubscribe = () => void

/**
 * Returns true if the application should show the SecurityAlertsScreen.
 */
export function hasSecurityAlerts(account: EdgeAccount): boolean {
  const { otpResetDate, pendingVouchers = [] } = account
  return otpResetDate != null || pendingVouchers.length > 0
}

/**
 * Calls a callback when the account gains or loses security alerts.
 */
export function watchSecurityAlerts(
  account: EdgeAccount,
  onChange: (hasAlerts: boolean) => void
): Unsubscribe {
  const callback = () => {
    onChange(hasSecurityAlerts(account))
  }
  const cleanups = [
    account.watch('otpResetDate', callback),
    account.watch('pendingVouchers', callback)
  ]
  return () => cleanups.forEach(cleanup => cleanup())
}
