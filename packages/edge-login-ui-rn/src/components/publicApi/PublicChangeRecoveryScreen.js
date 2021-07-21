// @flow

import { type EdgeAccount, type EdgeContext } from 'edge-core-js'
import * as React from 'react'

import { initializeChangeRecovery } from '../../actions/PasswordRecoveryActions.js'
import { Router } from '../navigation/Router.js'
import { ReduxStore } from '../services/ReduxStore.js'

type Props = {
  account: EdgeAccount,
  context: EdgeContext,
  showHeader?: boolean,
  onComplete(): void,
  onChangeRecoveryModal?: (status: boolean) => void
}

export function PasswordRecoveryScreen(props: Props): React.Node {
  const { account, context, onComplete, showHeader = false, onChangeRecoveryModal } = props

  return (
    <ReduxStore
      imports={{
        accountOptions: {},
        context,
        onComplete
      }}
      initialAction={initializeChangeRecovery(account)}
    >
      <Router branding={{}} showHeader={showHeader} onChangeRecoveryModal={onChangeRecoveryModal} />
    </ReduxStore>
  )
}
