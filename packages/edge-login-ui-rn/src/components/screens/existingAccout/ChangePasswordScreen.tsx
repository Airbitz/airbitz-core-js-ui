import { EdgeAccount, EdgePasswordRules } from 'edge-core-js'
import * as React from 'react'
import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native'

import {
  validateConfirmPassword,
  validatePassword
} from '../../../actions/CreateAccountActions'
import { onComplete } from '../../../actions/WorkflowActions'
import s from '../../../common/locales/strings'
import * as Constants from '../../../constants/index'
import * as Styles from '../../../styles/index'
import { Dispatch, RootState } from '../../../types/ReduxTypes'
import { scale } from '../../../util/scaling'
import { getAccount } from '../../../util/selectors'
import { PasswordStatus } from '../../abSpecific/PasswordStatusComponent'
import { Button } from '../../common/Button'
import { FormField } from '../../common/FormField'
import { Header } from '../../common/Header'
import SafeAreaView from '../../common/SafeAreaViewGradient'
import { ButtonsModal } from '../../modals/ButtonsModal'
import { Airship, showError } from '../../services/AirshipInstance'
import { connect } from '../../services/ReduxStore'

interface OwnProps {
  showHeader?: boolean
}
interface StateProps {
  account: EdgeAccount
  confirmPassword: string
  confirmPasswordErrorMessage: string
  createPasswordErrorMessage: string
  error?: string
  error2?: string
  password: string
  passwordStatus: EdgePasswordRules | null
}
interface DispatchProps {
  onDone: () => void
  onBack?: () => void
  onSkip?: () => void
  validateConfirmPassword: (password: string) => void
  validatePassword: (password: string) => void
}
type Props = OwnProps & StateProps & DispatchProps

interface State {
  focusFirst: boolean
  focusSecond: boolean
  isProcessing: boolean
}

class ChangePasswordScreenComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isProcessing: false,
      focusFirst: true,
      focusSecond: false
    }
  }

  handleFocusSwitch = () => {
    this.setState({
      focusFirst: false,
      focusSecond: true
    })
  }

  handleSubmit = () => {
    const { account, password, onDone } = this.props
    if (
      !this.props.passwordStatus ||
      this.props.error !== '' ||
      this.props.error2 !== ''
    ) {
      return
    }
    if (
      this.props.password &&
      this.props.password !== this.props.confirmPassword
    ) {
      this.props.validateConfirmPassword(this.props.confirmPassword)
      return
    }

    Keyboard.dismiss()
    this.setState({ isProcessing: true })
    account
      .changePassword(password)
      .then(onDone)
      .catch(error => {
        this.setState({ isProcessing: false })
        showError(error)
      })
  }

  renderHeader = () => {
    if (this.props.showHeader) {
      return <Header onBack={this.props.onBack} onSkip={this.props.onSkip} />
    }
    return null
  }

  renderInterior = () => {
    return (
      <View style={styles.innerView}>
        <PasswordStatus />
        <FormField
          autoFocus={this.state.focusFirst}
          error={this.props.createPasswordErrorMessage}
          label={s.strings.new_password}
          onChangeText={(password: string) =>
            this.props.validatePassword(password)
          }
          onSubmitEditing={this.handleFocusSwitch}
          returnKeyType="next"
          secureTextEntry
          style={styles.inputBox}
          value={this.props.password}
        />
        <View style={{ height: scale(20) }} />
        <FormField
          autoFocus={this.state.focusSecond}
          error={this.props.confirmPasswordErrorMessage}
          returnKeyType="go"
          secureTextEntry
          value={this.props.confirmPassword}
          label={s.strings.re_enter_new_password}
          onChangeText={(password: string) =>
            this.props.validateConfirmPassword(password)
          }
          onSubmitEditing={this.handleSubmit}
          style={styles.inputBox}
        />
        <View style={{ height: scale(40) }} />
        <Button
          onPress={this.handleSubmit}
          downStyle={styles.nextButton.downStyle}
          downTextStyle={styles.nextButton.downTextStyle}
          upStyle={styles.nextButton.upStyle}
          upTextStyle={styles.nextButton.upTextStyle}
          label={s.strings.done}
          isThinking={this.state.isProcessing}
          doesThink
        />
      </View>
    )
  }

  renderMain = () => {
    if (this.state.focusSecond) {
      return (
        <KeyboardAvoidingView
          style={styles.pageContainer}
          contentContainerStyle={styles.pageContainer}
          behavior="position"
          keyboardVerticalOffset={-150}
        >
          {this.renderInterior()}
        </KeyboardAvoidingView>
      )
    }
    return <View style={styles.pageContainer}>{this.renderInterior()}</View>
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.screen}>
          {this.renderHeader()}
          <ScrollView keyboardShouldPersistTaps="always">
            {this.renderMain()}
            <View style={{ backgroundColor: Constants.WHITE, height: 360 }} />
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = {
  screen: { ...Styles.ScreenStyle },
  pageContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1
  },
  innerView: {
    height: '100%',
    width: '100%',
    alignItems: 'center'
  },
  nextButton: {
    upStyle: Styles.PrimaryButtonUpScaledStyle,
    upTextStyle: Styles.PrimaryButtonUpTextScaledStyle,
    downTextStyle: Styles.PrimaryButtonUpTextScaledStyle,
    downStyle: Styles.PrimaryButtonDownScaledStyle
  },
  inputBox: {
    ...Styles.MaterialInputOnWhiteScaled,
    marginTop: scale(15)
  }
}

export const PublicChangePasswordScreen = connect<
  StateProps,
  DispatchProps,
  OwnProps
>(
  (state: RootState) => ({
    account: getAccount(state),
    confirmPassword: state.create.confirmPassword || '',
    confirmPasswordErrorMessage: state.create.confirmPasswordErrorMessage ?? '',
    createPasswordErrorMessage: state.create.createPasswordErrorMessage ?? '',
    error: state.create.confirmPasswordErrorMessage || '',
    error2: state.create.createPasswordErrorMessage || '',
    password: state.create.password || '',
    passwordStatus: state.create.passwordStatus
  }),
  (dispatch: Dispatch) => ({
    onDone() {
      Airship.show(bridge => (
        <ButtonsModal
          bridge={bridge}
          title={s.strings.password_changed}
          message={s.strings.pwd_change_modal}
          buttons={{ ok: { label: s.strings.ok } }}
        />
      ))
        .then(() => dispatch(onComplete()))
        .catch(showError)
    },
    onBack() {
      dispatch(onComplete())
    },
    validateConfirmPassword(password: string) {
      dispatch(validateConfirmPassword(password))
    },
    validatePassword(password: string) {
      dispatch(validatePassword(password))
    }
  })
)(ChangePasswordScreenComponent)

export const ResecurePasswordScreen = connect<
  StateProps,
  DispatchProps,
  OwnProps
>(
  (state: RootState) => ({
    account: getAccount(state),
    confirmPassword: state.create.confirmPassword || '',
    confirmPasswordErrorMessage: state.create.confirmPasswordErrorMessage ?? '',
    createPasswordErrorMessage: state.create.createPasswordErrorMessage ?? '',
    error: state.create.confirmPasswordErrorMessage || '',
    error2: state.create.createPasswordErrorMessage || '',
    password: state.create.password || '',
    passwordStatus: state.create.passwordStatus
  }),
  (dispatch: Dispatch) => ({
    onDone() {
      dispatch({ type: 'WORKFLOW_NEXT' })
    },
    onSkip() {
      dispatch(dispatch({ type: 'WORKFLOW_NEXT' }))
    },
    validateConfirmPassword(password: string) {
      dispatch(validateConfirmPassword(password))
    },
    validatePassword(password: string) {
      dispatch(validatePassword(password))
    }
  })
)(ChangePasswordScreenComponent)
