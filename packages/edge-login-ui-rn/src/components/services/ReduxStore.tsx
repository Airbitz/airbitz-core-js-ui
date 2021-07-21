import * as React from 'react'
import { connect as rawConnect, Provider } from 'react-redux'
import { applyMiddleware, createStore, Store } from 'redux'
import thunk from 'redux-thunk'

import { launchPasswordRecovery } from '../../actions/LoginAction'
import { rootReducer, RootState } from '../../reducers/RootReducer'
import { Action, Dispatch, GetState, Imports } from '../../types/ReduxTypes'
import { showError } from './AirshipInstance'

interface Props {
  children?: React.ReactNode
  initialAction:
    | Action
    | ((dispatch: Dispatch, getState: GetState, i: Imports) => unknown)
  imports: Imports
}

/**
 * Consolidates our Redux setup logic into one place.
 */
export class ReduxStore extends React.Component<Props> {
  store: Store<RootState, Action>

  constructor(props: Props) {
    super(props)
    const { imports } = this.props

    this.store = createStore(
      rootReducer,
      undefined,
      applyMiddleware(thunk.withExtraArgument(imports))
    )

    new Promise(resolve => {
      // $FlowFixMe Flow doesn't know about thunks at this point.
      resolve(this.store.dispatch(this.props.initialAction))
    }).catch(showError)
  }

  componentDidUpdate(prev: Props) {
    const { recoveryKey } = this.props.imports
    if (recoveryKey && recoveryKey !== prev.imports.recoveryKey) {
      // $FlowFixMe Flow doesn't know about thunks at this point.
      this.store.dispatch(launchPasswordRecovery(recoveryKey))
    }
  }

  render() {
    const { children } = this.props
    return <Provider store={this.store}>{children}</Provider>
  }
}

type Connector<ExtraProps, OwnProps> = (
  component: React.ComponentType<ExtraProps & OwnProps>
) => React.ComponentType<OwnProps>

/**
 * The react-redux connect function, locked to our own Redux types
 * and fixed to take the same parameters as the TypeScript version.
 */
export function connect<StateProps, DispatchProps, OwnProps>(
  mapStateToProps: (state: RootState, ownProps: OwnProps) => StateProps,
  mapDispatchToProps?: (dispatch: Dispatch, ownProps: OwnProps) => DispatchProps
): Connector<StateProps & DispatchProps, OwnProps> {
  // $FlowFixMe
  return rawConnect(mapStateToProps, mapDispatchToProps)
}
