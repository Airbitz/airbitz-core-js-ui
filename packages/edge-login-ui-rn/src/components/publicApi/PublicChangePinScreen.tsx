import { EdgeAccount, EdgeContext } from 'edge-core-js'
import * as React from 'react'

import { Router } from '../navigation/Router'
import { ReduxStore } from '../services/ReduxStore'

interface Props {
  account: EdgeAccount
  context: EdgeContext
  showHeader?: boolean
  onComplete: () => void
}

export function ChangePinScreen(props: Props): React.ReactNode {
  const { account, context, onComplete, showHeader = false } = props

  return (
    <ReduxStore
      imports={{
        accountOptions: {},
        context,
        onComplete
      }}
      initialAction={{
        type: 'START_CHANGE_PIN',
        data: account
      }}
    >
      <Router branding={{}} showHeader={showHeader} />
    </ReduxStore>
  )
}
