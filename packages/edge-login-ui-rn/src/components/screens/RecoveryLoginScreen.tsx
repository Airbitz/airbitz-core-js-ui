import { OtpError } from 'edge-core-js'
import * as React from 'react'
import { Text, View } from 'react-native'

import { login } from '../../actions/LoginAction'
import s from '../../common/locales/strings'
import * as Constants from '../../constants/index'
import * as Styles from '../../styles/index'
import { Dispatch, RootState } from '../../types/ReduxTypes'
import { LoginAttempt } from '../../util/loginAttempt'
import { Button } from '../common/Button'
import { FormField } from '../common/FormField'
import { Header } from '../common/Header'
import SafeAreaViewGradient from '../common/SafeAreaViewGradient'
import { connect } from '../services/ReduxStore'

interface OwnProps {
  showHeader?: boolean
}
interface StateProps {
  question1: string
  question2: string
  recoveryKey: string
  username: string
}
interface DispatchProps {
  onBack: () => void
  login: (attempt: LoginAttempt) => Promise<void>
  saveOtpError: (otpAttempt: LoginAttempt, otpError: OtpError) => void
}
type Props = OwnProps & StateProps & DispatchProps

interface State {
  answer1: string
  answer2: string
  errorOne: boolean
  errorTwo: boolean
  errorMessage: string
}

class RecoveryLoginScreenComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      answer1: '',
      answer2: '',
      errorOne: false,
      errorTwo: false,
      errorMessage: ''
    }
  }

  renderHeader = () => {
    if (this.props.showHeader) {
      return <Header onBack={this.props.onBack} />
    }
    return null
  }

  handleSubmit = () => {
    const { login, recoveryKey, saveOtpError, username } = this.props

    const errorOne = this.state.answer1.length < 1
    const errorTwo = this.state.answer2.length < 1
    this.setState({ errorOne, errorTwo })
    if (errorOne || errorTwo) return

    const attempt: LoginAttempt = {
      type: 'recovery',
      recoveryKey,
      username,
      answers: [this.state.answer1, this.state.answer2]
    }
    login(attempt).catch(error => {
      if (error != null && error.name === 'OtpError') {
        saveOtpError(attempt, error)
      } else {
        console.log(error)
        const errorMessage =
          error != null
            ? error.name === 'PasswordError'
              ? s.strings.recovery_error
              : error.message
            : 'Unknown error'
        this.setState({ errorMessage })
      }
    })
  }

  handleAnswer1 = (arg: string) => {
    this.setState({
      answer1: arg
    })
  }

  handleAnswer2 = (arg: string) => {
    this.setState({
      answer2: arg
    })
  }

  renderError() {
    if (this.state.errorMessage) {
      return (
        <View>
          <View style={styles.shim} />
          <Text style={styles.errorText}>{this.state.errorMessage}</Text>
          <View style={styles.shim} />
        </View>
      )
    }
    return <View style={styles.shim} />
  }

  render() {
    // const middle = this.renderForm(RecoverPasswordSceneStyles)
    const form1Style = this.state.errorOne ? styles.inputError : styles.input
    const form2Style = this.state.errorTwo ? styles.inputError : styles.input

    return (
      <SafeAreaViewGradient>
        <View style={styles.screen}>
          {this.renderHeader()}
          <View style={styles.body}>
            <View style={styles.questionRow}>
              <Text style={styles.questionText}>{this.props.question1}</Text>
            </View>
            <View style={styles.answerRow}>
              <FormField
                style={form1Style}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.handleAnswer1}
                value={this.state.answer1}
                label={s.strings.your_answer_label}
                error={s.strings.answer_case_sensitive}
              />
            </View>
            <View style={styles.shim} />
            <View style={styles.questionRow}>
              <Text style={styles.questionText}>{this.props.question2}</Text>
            </View>
            <View style={styles.answerRow}>
              <FormField
                style={form2Style}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={this.handleAnswer2}
                value={this.state.answer2}
                label={s.strings.your_answer_label}
                error={s.strings.answer_case_sensitive}
              />
            </View>
            <View style={styles.buttonContainer}>
              {this.renderError()}
              <Button
                onPress={this.handleSubmit}
                downStyle={styles.submitButton.downStyle}
                downTextStyle={styles.submitButton.downTextStyle}
                upStyle={styles.submitButton.upStyle}
                upTextStyle={styles.submitButton.upTextStyle}
                label={s.strings.submit}
              />
            </View>
          </View>
        </View>
      </SafeAreaViewGradient>
    )
  }
}

const styles = {
  screen: {
    ...Styles.ScreenStyle,
    marginTop: 5
  },
  body: {
    padding: 18
  },
  questionRow: {
    height: 50,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: Constants.GRAY_2
  },
  questionText: {
    color: Constants.GRAY_2,
    fontSize: 18
  },
  answerRow: {
    width: '100%',
    height: 100
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center'
    // height: THEME.BUTTONS.HEIGHT
  },
  input: {
    ...Styles.MaterialInputOnWhite,
    errorColor: Constants.GRAY_2,
    baseColor: Constants.GRAY_2,
    textColor: Constants.GRAY_2,
    titleTextStyle: {
      color: Constants.GRAY_2
    },
    affixTextStyle: {
      color: Constants.GRAY_2
    },
    container: { ...Styles.MaterialInputOnWhite.container, width: '100%' }
  },
  inputError: {
    ...Styles.MaterialInputOnWhite,
    errorColor: Constants.ACCENT_RED,
    baseColor: Constants.ACCENT_RED,
    textColor: Constants.ACCENT_RED,
    titleTextStyle: {
      color: Constants.ACCENT_RED
    },
    affixTextStyle: {
      color: Constants.ACCENT_RED
    },
    container: { ...Styles.MaterialInputOnWhite.container, width: '100%' }
  },
  shim: {
    height: 20
  },
  submitButton: {
    upStyle: Styles.PrimaryButtonUpStyle,
    upTextStyle: Styles.PrimaryButtonUpTextStyle,
    downTextStyle: Styles.PrimaryButtonUpTextStyle,
    downStyle: Styles.PrimaryButtonDownStyle
  },
  errorText: {
    color: Constants.ACCENT_RED,
    width: '90%',
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 5
  }
} as const

export const RecoveryLoginScreen = connect<StateProps, DispatchProps, OwnProps>(
  (state: RootState) => ({
    question1:
      state.passwordRecovery.userQuestions.length > 0
        ? state.passwordRecovery.userQuestions[0]
        : s.strings.choose_recovery_question,
    question2:
      state.passwordRecovery.userQuestions.length > 1
        ? state.passwordRecovery.userQuestions[1]
        : s.strings.choose_recovery_question,
    recoveryKey: state.passwordRecovery.recoveryKey || '',
    showHeader: true,
    username: state.login.username
  }),
  (dispatch: Dispatch) => ({
    onBack() {
      dispatch({ type: 'START_PASSWORD_LOGIN' })
    },
    async login(attempt) {
      return await dispatch(login(attempt))
    },
    saveOtpError(attempt, error) {
      dispatch({ type: 'OTP_ERROR', data: { attempt, error } })
    }
  })
)(RecoveryLoginScreenComponent)
