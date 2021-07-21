import * as React from 'react'
import { View } from 'react-native'

import s from '../../common/locales/strings'
import { WorkflowState } from '../../reducers/WorkflowReducer'
import * as Styles from '../../styles/index'
import { Branding } from '../../types/Branding'
import { Dispatch, RootState } from '../../types/ReduxTypes'
import { MaybeProvideLoginUi } from '../publicApi/LoginUiProvider'
import {
  PublicChangePasswordScreen,
  ResecurePasswordScreen
} from '../screens/existingAccout/ChangePasswordScreen'
import {
  PublicChangePinScreen,
  ResecurePinScreen
} from '../screens/existingAccout/ChangePinScreen'
import { PublicChangeRecoveryScreen } from '../screens/existingAccout/ChangeRecoveryScreen'
import { OtpRepairScreen } from '../screens/existingAccout/OtpRepairScreen'
import { SecurityAlertsScreen } from '../screens/existingAccout/SecurityAlertsScreen'
import { LandingScreen } from '../screens/LandingScreen'
import { LoadingScreen } from '../screens/LoadingScreen'
import { NewAccountPasswordScreen } from '../screens/newAccount/NewAccountPasswordScreen'
import { NewAccountPinScreen } from '../screens/newAccount/NewAccountPinScreen'
import { NewAccountReviewScreen } from '../screens/newAccount/NewAccountReviewScreen'
import { NewAccountUsernameScreen } from '../screens/newAccount/NewAccountUsernameScreen'
import { NewAccountWelcomeScreen } from '../screens/newAccount/NewAccountWelcomeScreen'
import { TermsAndConditionsScreen } from '../screens/newAccount/TermsAndConditionsScreen'
import { OtpErrorScreen } from '../screens/OtpErrorScreen'
import { PasswordLoginScreen } from '../screens/PasswordLoginScreen'
import { PinLoginScreen } from '../screens/PinLoginScreen'
import { RecoveryLoginScreen } from '../screens/RecoveryLoginScreen'
import { WaitScreen } from '../screens/WaitScreen'
import { connect } from '../services/ReduxStore'
import { ThemeProvider } from '../services/ThemeContext'

interface OwnProps {
  branding: Branding
  showHeader: boolean
}
interface StateProps {
  workflow: WorkflowState
}
type Props = OwnProps & StateProps

class RouterComponent extends React.Component<Props> {
  render() {
    const { ScreenStyle } = Styles
    return (
      <ThemeProvider>
        <MaybeProvideLoginUi>
          <View accessible style={ScreenStyle}>
            {this.renderContent()}
          </View>
        </MaybeProvideLoginUi>
      </ThemeProvider>
    )
  }

  renderContent() {
    switch (this.props.workflow.currentKey) {
      case 'changePasswordWF':
        return <PublicChangePasswordScreen showHeader={this.props.showHeader} />
      case 'changePinWF':
        return <PublicChangePinScreen showHeader={this.props.showHeader} />
      case 'changeRecoveryWF':
        return <PublicChangeRecoveryScreen showHeader={this.props.showHeader} />
      case 'createWF':
        return this.getCreateScreen()
      case 'landingWF':
        return <LandingScreen branding={this.props.branding} />
      case 'loadingWF':
        return <LoadingScreen branding={this.props.branding} />
      case 'otpWF':
        return <OtpErrorScreen />
      case 'otpRepairWF':
        return <OtpRepairScreen />
      case 'passwordWF':
        return <PasswordLoginScreen branding={this.props.branding} />
      case 'pinWF':
        return <PinLoginScreen branding={this.props.branding} />
      case 'recoveryLoginWF':
        return <RecoveryLoginScreen />
      case 'resecureWF':
        return this.getResecureScreen()
      case 'securityAlertWF':
        return <SecurityAlertsScreen />
    }
  }

  getCreateScreen() {
    switch (this.props.workflow.currentSceneIndex) {
      case 0:
        return <NewAccountWelcomeScreen branding={this.props.branding} />
      case 1:
        return <NewAccountUsernameScreen branding={this.props.branding} />
      case 2:
        return <NewAccountPasswordScreen />
      case 3:
        return <NewAccountPinScreen />
      case 4:
        return <TermsAndConditionsScreen branding={this.props.branding} />
      case 5:
        return (
          <WaitScreen
            title={s.strings.good_job}
            message={s.strings.hang_tight + '\n' + s.strings.secure_account}
          />
        )
      case 6:
        return <NewAccountReviewScreen />
      default:
        return <NewAccountWelcomeScreen branding={this.props.branding} />
    }
  }

  getResecureScreen() {
    switch (this.props.workflow.currentSceneIndex) {
      case 0:
        return <ResecurePasswordScreen showHeader={this.props.showHeader} />
      case 1:
        return <ResecurePinScreen showHeader={this.props.showHeader} />
    }
  }
}

export const Router = connect<StateProps, {}, OwnProps>(
  (state: RootState) => ({
    workflow: state.workflow
  }),
  (dispatch: Dispatch) => ({})
)(RouterComponent)
