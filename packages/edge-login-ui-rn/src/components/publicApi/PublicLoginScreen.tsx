import { EdgeAccountOptions, EdgeContext } from 'edge-core-js'
import * as React from 'react'

import { initializeLogin } from '../../actions/LoginInitActions'
import { updateFontStyles } from '../../constants/Fonts'
import { ParentButton } from '../../types/Branding'
import { OnLogin } from '../../types/ReduxTypes'
import { Router } from '../navigation/Router'
import { ReduxStore } from '../services/ReduxStore'
import { changeFont } from '../services/ThemeContext'

interface Props {
  context: EdgeContext

  // Branding stuff:
  appId?: string
  appName?: string
  backgroundImage?: any
  fontDescription?: { regularFontFamily: string }
  landingScreenText?: string
  parentButton?: ParentButton
  primaryLogo?: any
  primaryLogoCallback?: () => void

  // Options passed to the core login methods:
  accountOptions: EdgeAccountOptions

  // Called when the login completes:
  onLogin: OnLogin

  // The recoveryKey from the user's email, to trigger recovery login:
  recoveryLogin?: string

  // Do not show the security alerts screen during login,
  // since the app plans to show the `SecurityAlertsScreen` itself
  // based on `hasSecurityAlerts` and `watchSecurityAlerts`:
  skipSecurityAlerts?: boolean

  // The username to select, if present on the device:
  username?: string

  // Call that overwrites the internal checkAndRequestNotifications function. Executed on Login initialization:
  customPermissionsFunction?: () => void
}

export class LoginScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props)

    const { fontDescription } = props
    if (fontDescription != null) {
      changeFont(fontDescription.regularFontFamily)
      updateFontStyles(fontDescription.regularFontFamily)
    }
  }

  render() {
    return (
      <ReduxStore
        imports={{
          accountOptions: this.props.accountOptions,
          context: this.props.context,
          onComplete: () => {},
          onLogin: this.props.onLogin,
          recoveryKey: this.props.recoveryLogin,
          skipSecurityAlerts: this.props.skipSecurityAlerts,
          username: this.props.username,
          customPermissionsFunction: this.props.customPermissionsFunction
        }}
        initialAction={initializeLogin()}
      >
        <Router
          branding={{
            appId: this.props.appId,
            appName: this.props.appName,
            backgroundImage: this.props.backgroundImage,
            landingScreenText: this.props.landingScreenText,
            parentButton: this.props.parentButton,
            primaryLogo: this.props.primaryLogo,
            primaryLogoCallback: this.props.primaryLogoCallback
          }}
          showHeader
        />
      </ReduxStore>
    )
  }
}
