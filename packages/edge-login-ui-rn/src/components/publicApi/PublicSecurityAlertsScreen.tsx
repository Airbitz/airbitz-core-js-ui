import { EdgeAccount, EdgeContext } from 'edge-core-js'
import * as React from 'react'

import { Router } from '../navigation/Router'
import { ReduxStore } from '../services/ReduxStore'

interface Props {
  account: EdgeAccount
  context: EdgeContext
  onComplete: () => void
}

export function SecurityAlertsScreen(props: Props): React.ReactNode {
  const { account, context, onComplete } = props

  return (
    <ReduxStore
      imports={{
        accountOptions: {},
        context,
        onComplete
      }}
      initialAction={{
        type: 'START_SECURITY_ALERT',
        data: account
      }}
    >
      <Router branding={{}} showHeader />
    </ReduxStore>
  )
}
