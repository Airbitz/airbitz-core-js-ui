import { EdgeAccount, EdgeContext, OtpError } from 'edge-core-js'
import * as React from 'react'

import { Router } from '../navigation/Router'
import { ReduxStore } from '../services/ReduxStore'

interface Props {
  account: EdgeAccount
  context: EdgeContext
  onComplete: () => void
  otpError: OtpError
}

export function OtpRepairScreen(props: Props): React.ReactNode {
  const { account, context, onComplete, otpError } = props

  return (
    <ReduxStore
      imports={{
        accountOptions: {},
        context,
        onComplete
      }}
      initialAction={{
        type: 'START_OTP_REPAIR',
        data: { account, error: otpError }
      }}
    >
      <Router branding={{}} showHeader />
    </ReduxStore>
  )
}
