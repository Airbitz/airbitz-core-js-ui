import { EdgeAccount, EdgeAccountOptions, EdgeContext } from 'edge-core-js'

export type LoginAttempt =
  | {
      type: 'password'
      username: string
      password: string
    }
  | {
      type: 'pin'
      username: string
      pin: string
    }
  | {
      type: 'recovery'
      recoveryKey: string
      username: string
      answers: string[]
    }

export async function attemptLogin(
  context: EdgeContext,
  attempt: LoginAttempt,
  opts: EdgeAccountOptions
): Promise<EdgeAccount> {
  if (attempt.type === 'password') {
    return await context.loginWithPassword(
      attempt.username,
      attempt.password,
      opts
    )
  }
  if (attempt.type === 'pin') {
    return await context.loginWithPIN(attempt.username, attempt.pin, opts)
  }
  return await context.loginWithRecovery2(
    attempt.recoveryKey,
    attempt.username,
    attempt.answers,
    opts
  )
}
