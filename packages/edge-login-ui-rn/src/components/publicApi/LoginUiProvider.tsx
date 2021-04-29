import * as React from 'react'

import { useContext } from '../../util/hooks'
import { Airship } from '../services/AirshipInstance'

/**
 * We use this context to determine if `LoginUiProvider` is mounted.
 */
const loginUiContext = React.createContext(false)

interface Props {
  children: React.ReactNode
}

/**
 * Provides modals and other services for the login UI.
 * In the future, this will be our injection point for branding &
 * theme customizations.
 */
export function LoginUiProvider(props: Props): JSX.Element {
  return (
    <loginUiContext.Provider value>
      <Airship>{props.children}</Airship>
    </loginUiContext.Provider>
  )
}

export function MaybeProvideLoginUi(props: {
  children: JSX.Element
}): JSX.Element {
  const { children } = props
  const hasProvider = useContext(loginUiContext)

  return hasProvider ? children : <LoginUiProvider>{children}</LoginUiProvider>
}
