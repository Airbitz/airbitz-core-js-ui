// @flow

import { type EdgeAccount, type EdgeRecoveryQuestionChoice } from 'edge-core-js'
import * as React from 'react'
import { Dimensions, FlatList, Keyboard, Platform, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import {
  sendRecoveryEmail,
  shareRecovery
} from '../../../actions/PasswordRecoveryActions.js'
import { onComplete } from '../../../actions/WorkflowActions.js'
import s from '../../../common/locales/strings.js'
import * as Colors from '../../../constants/Colors.js'
import * as Styles from '../../../styles/index.js'
import { type Dispatch, type RootState } from '../../../types/ReduxTypes.js'
import { isIphoneX } from '../../../util/isIphoneX.js'
import { scale } from '../../../util/scaling.js'
import { getAccount } from '../../../util/selectors.js'
import { Button } from '../../common/Button.js'
import { FormField } from '../../common/FormField.js'
import { Header } from '../../common/Header.js'
import { TextRowComponent } from '../../common/ListItems/TextRowComponent.js'
import { TextAndIconButton } from '../../common/TextAndIconButton.js'
import { type ButtonInfo, ButtonsModal } from '../../modals/ButtonsModal.js'
import { TextInputModal } from '../../modals/TextInputModal.js'
import { Airship, showError } from '../../services/AirshipInstance.js'
import { connect } from '../../services/ReduxStore.js'
import { MessageText, Strong } from '../../themed/ThemedText.js'

type OwnProps = {
  showHeader: boolean,
  onChangeRecoveryModal?: (status: boolean) => void
}
type StateProps = {
  account: EdgeAccount,
  isEnabled: boolean,
  questionsList: EdgeRecoveryQuestionChoice[],
  userQuestions: string[]
}
type DispatchProps = {
  onBack(): void,
  onDone(): void
}
type Props = OwnProps & StateProps & DispatchProps

type State = {
  question1: string,
  question2: string,
  answer1: string,
  answer2: string,
  showQuestionPicker: boolean,
  focusFirst: boolean,
  focusSecond: boolean,
  errorOne: boolean,
  errorTwo: boolean,
  errorQuestionOne: boolean,
  errorQuestionTwo: boolean
}

class ChangeRecoveryScreenComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const [
      question1 = s.strings.choose_recovery_question,
      question2 = s.strings.choose_recovery_question
    ] = props.userQuestions
    this.state = {
      question1,
      question2,
      answer1: '',
      answer2: '',
      showQuestionPicker: false,
      focusFirst: false,
      focusSecond: false,
      errorOne: false,
      errorTwo: false,
      errorQuestionOne: false,
      errorQuestionTwo: false
    }
  }

  renderHeader = () => {
    if (this.props.showHeader) {
      return <Header onBack={this.props.onBack} />
    }
    return null
  }

  handleDisable = () => {
    this.disableRecovery().catch(showError)
  }

  onChangeRecoveryModalHandler = (status: boolean) => {
    const { onChangeRecoveryModal } = this.props
    if (onChangeRecoveryModal) {
      onChangeRecoveryModal(status)
    }
  }

  handleSubmit = () => {
    // Launch Modal full Screen
    const errorOne = this.state.answer1.length < 4
    const errorTwo = this.state.answer2.length < 4
    const errorQuestionOne =
      this.state.question1 === s.strings.choose_recovery_question
    const errorQuestionTwo =
      this.state.question2 === s.strings.choose_recovery_question

    this.setState({
      errorOne,
      errorTwo,
      errorQuestionOne,
      errorQuestionTwo
    })
    if (errorOne || errorTwo || errorQuestionOne || errorQuestionTwo) {
      return
    }
    this.enableRecovery().catch(showError)
  }

  handleQuestion1 = () => {
    this.setState({
      showQuestionPicker: true,
      focusFirst: true,
      focusSecond: false
    })
  }

  handleQuestion2 = () => {
    this.setState({
      showQuestionPicker: true,
      focusFirst: false,
      focusSecond: true
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

  handleQuestionSelected = (data: EdgeRecoveryQuestionChoice) => {
    const question = data.question
    if (this.state.focusFirst) {
      this.setState({
        question1: question,
        showQuestionPicker: false
      })
      return
    }
    this.setState({
      question2: question,
      showQuestionPicker: false
    })
  }

  async enableRecovery(): Promise<void> {
    const buttons: { [key: string]: ButtonInfo } = {
      email: {
        label: s.strings.confirm_email,
        onPress: this.handleEnableEmail
      },
      share: {
        label: s.strings.confirm_share,
        onPress: this.handleEnableShare
      },
      cancel: { label: s.strings.cancel, type: 'secondary' }
    }
    if (Platform.OS === 'android') delete buttons.email

    // Ask which way to send the key:
    await Airship.show(bridge => {
      this.onChangeRecoveryModalHandler(true)
      return (
        <ButtonsModal
          bridge={bridge}
          title={s.strings.confirm_recovery_questions}
          buttons={buttons}
        >
          <MessageText>{this.state.question1}</MessageText>
          <MessageText>
            <Strong>{this.state.answer1}</Strong>
          </MessageText>
          <MessageText>{this.state.question2}</MessageText>
          <MessageText>
            <Strong>{this.state.answer2}</Strong>
          </MessageText>
        </ButtonsModal>
      )
    }).then(() => this.onChangeRecoveryModalHandler(false))
  }

  handleEnableEmail = async (): Promise<boolean> => {
    const { account, onDone } = this.props

    const emailAddress: string | void = await Airship.show(bridge => (
      <TextInputModal
        bridge={bridge}
        title={s.strings.save_recovery_token}
        message={s.strings.recovery_instructions_complete}
        inputLabel={s.strings.email_address}
        submitLabel={s.strings.next_label}
        keyboardType="email-address"
        returnKeyType="go"
      />
    ))
    if (emailAddress == null) return false
    const recoveryKey = await account.changeRecovery(
      [this.state.question1, this.state.question2],
      [this.state.answer1, this.state.answer2]
    )
    try {
      await sendRecoveryEmail(emailAddress, account.username, recoveryKey)
    } catch (error) {
      await Airship.show(bridge => (
        <ButtonsModal
          bridge={bridge}
          title={s.strings.send_email_error_header}
          message={s.strings.email_error_modal}
          buttons={{ ok: { label: s.strings.ok } }}
        />
      ))
      return false
    }
    onDone()
    return true
  }

  handleEnableShare = async (): Promise<boolean> => {
    const { account, onDone } = this.props

    const recoveryKey = await account.changeRecovery(
      [this.state.question1, this.state.question2],
      [this.state.answer1, this.state.answer2]
    )
    await shareRecovery(account.username, recoveryKey)
    onDone()
    return true
  }

  async disableRecovery(): Promise<void> {
    const { account, onDone } = this.props
    await account.deleteRecovery()
    Keyboard.dismiss()
    this.setState({
      question1: s.strings.choose_recovery_question,
      question2: s.strings.choose_recovery_question
    })
    await Airship.show(bridge => (
      <ButtonsModal
        bridge={bridge}
        message={s.strings.recovery_disabled}
        buttons={{ ok: { label: s.strings.ok } }}
      />
    ))
    onDone()
  }

  renderItems = (item: { item: EdgeRecoveryQuestionChoice }) => {
    return (
      <TextRowComponent
        data={item.item}
        title={item.item.question}
        onPress={this.handleQuestionSelected}
        numberOfLines={3}
      />
    )
  }

  getQuestions = () => {
    const { questionsList } = this.props
    const { focusFirst, focusSecond, question1, question2 } = this.state
    const questionFilter = focusFirst ? question2 : focusSecond ? question1 : ''
    return questionsList.filter(item => item.question !== questionFilter)
  }

  renderQuestions = () => {
    return (
      <View style={styles.body}>
        <FlatList
          style={styles.questionsList}
          data={this.getQuestions()}
          renderItem={this.renderItems}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  renderForm = () => {
    const form1Style = this.state.errorOne ? styles.inputError : styles.input
    const form2Style = this.state.errorTwo ? styles.inputError : styles.input
    const errorMessageOne = this.state.errorOne
      ? s.strings.answers_four_chanracters
      : s.strings.answer_case_sensitive
    const errorMessageTwo = this.state.errorTwo
      ? s.strings.answers_four_chanracters
      : s.strings.answer_case_sensitive
    const questionOneStyle = this.state.errorQuestionOne
      ? styles.textIconButtonErrorError
      : styles.textIconButton
    const questionTwoStyle = this.state.errorQuestionTwo
      ? styles.textIconButtonErrorError
      : styles.textIconButton

    return (
      <View style={styles.body}>
        <View style={styles.questionRow}>
          <TextAndIconButton
            onPress={this.handleQuestion1}
            icon={
              <MaterialIcon
                style={questionOneStyle.icon}
                name="keyboard-arrow-down"
                size={questionOneStyle.iconSize}
              />
            }
            style={questionOneStyle}
            numberOfLines={2}
            title={this.state.question1}
          />
        </View>
        <View style={styles.answerRow}>
          <FormField
            style={form1Style}
            autoFocus={this.state.focusFirst || this.props.isEnabled}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={this.handleAnswer1}
            value={this.state.answer1}
            label={s.strings.your_answer_label}
            error={errorMessageOne}
          />
        </View>
        <View style={styles.questionRow}>
          <TextAndIconButton
            onPress={this.handleQuestion2}
            icon={
              <MaterialIcon
                style={questionTwoStyle.icon}
                name="keyboard-arrow-down"
                size={questionTwoStyle.iconSize}
              />
            }
            style={questionTwoStyle}
            numberOfLines={2}
            title={this.state.question2}
          />
        </View>
        <View style={styles.answerRow}>
          <FormField
            style={form2Style}
            autoFocus={this.state.focusSecond}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={this.handleAnswer2}
            value={this.state.answer2}
            label={s.strings.your_answer_label}
            error={errorMessageTwo}
          />
        </View>
        {this.renderButtons()}
      </View>
    )
  }

  renderButtons() {
    if (this.props.isEnabled) {
      return (
        <View style={styles.buttonContainer}>
          <View style={styles.shim} />
          <Button
            onPress={this.handleSubmit}
            downStyle={styles.submitButton.downStyle}
            downTextStyle={styles.submitButton.downTextStyle}
            upStyle={styles.submitButton.upStyle}
            upTextStyle={styles.submitButton.upTextStyle}
            label={s.strings.save}
          />
          <View style={styles.shim} />
          <Button
            onPress={this.handleDisable}
            downStyle={styles.disableButton.downStyle}
            downTextStyle={styles.disableButton.downTextStyle}
            upStyle={styles.disableButton.upStyle}
            upTextStyle={styles.disableButton.upTextStyle}
            label={s.strings.disable_password_recovery}
          />
        </View>
      )
    }
    return (
      <View style={styles.buttonContainer}>
        <View style={styles.shim} />
        <Button
          onPress={this.handleSubmit}
          downStyle={styles.submitButton.downStyle}
          downTextStyle={styles.submitButton.downTextStyle}
          upStyle={styles.submitButton.upStyle}
          upTextStyle={styles.submitButton.upTextStyle}
          label={s.strings.done}
        />
      </View>
    )
  }

  render() {
    const middle = this.state.showQuestionPicker
      ? this.renderQuestions()
      : this.renderForm()
    return (
      <View style={styles.screen}>
        {this.renderHeader()}
        {middle}
      </View>
    )
  }
}

const styles = {
  screen: { ...Styles.ScreenStyle },
  body: {
    padding: scale(18)
  },
  questionRow: {
    height: scale(60),
    width: '100%',
    borderColor: Colors.GRAY_2,
    borderBottomWidth: scale(2)
  },
  answerRow: {
    width: '100%',
    height: scale(80)
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center'
  },
  input: {
    ...Styles.MaterialInputOnWhite,
    errorColor: Colors.GRAY_2,
    baseColor: Colors.GRAY_2,
    textColor: Colors.GRAY_2,
    titleTextStyle: {
      color: Colors.GRAY_2
    },
    affixTextStyle: {
      color: Colors.GRAY_2
    },
    container: { ...Styles.MaterialInputOnWhite.container, width: '100%' }
  },
  inputError: {
    ...Styles.MaterialInputOnWhite,
    errorColor: Colors.ACCENT_RED,
    baseColor: Colors.ACCENT_RED,
    textColor: Colors.ACCENT_RED,
    titleTextStyle: {
      color: Colors.ACCENT_RED
    },
    affixTextStyle: {
      color: Colors.ACCENT_RED
    },
    container: { ...Styles.MaterialInputOnWhite.container, width: '100%' }
  },
  shim: {
    height: scale(20)
  },
  textIconButton: Styles.TextAndIconButtonAlignEdgesStyle,
  textIconButtonErrorError: {
    ...Styles.TextAndIconButtonAlignEdgesStyle,
    text: {
      ...Styles.TextAndIconButtonAlignEdgesStyle.text,
      color: Colors.ACCENT_RED
    },
    icon: {
      ...Styles.TextAndIconButtonAlignEdgesStyle.icon,
      color: Colors.ACCENT_RED
    }
  },
  submitButton: {
    upStyle: Styles.PrimaryWidthButtonUpStyle,
    upTextStyle: Styles.PrimaryButtonUpTextStyle,
    downTextStyle: Styles.PrimaryButtonUpTextStyle,
    downStyle: Styles.PrimaryWidthButtonDownStyle
  },
  disableButton: {
    upStyle: Styles.DefaultWidthButtonUpStyle,
    upTextStyle: Styles.DefaultButtonUpTextStyle,
    downTextStyle: Styles.DefaultButtonDownTextStyle,
    downStyle: Styles.DefaultWidthButtonDownStyle
  },
  questionsList: {
    width: '100%',
    height:
      Dimensions.get('window').height - (isIphoneX ? scale(125) : scale(110)),
    borderColor: Colors.GRAY_3,
    borderWidth: 1
  }
}

export const PublicChangeRecoveryScreen = connect<
  StateProps,
  DispatchProps,
  OwnProps
>(
  (state: RootState) => ({
    account: getAccount(state),
    isEnabled: state.passwordRecovery.userQuestions.length > 0,
    questionsList: state.passwordRecovery.questionsList,
    userQuestions: state.passwordRecovery.userQuestions
  }),
  (dispatch: Dispatch) => ({
    onBack() {
      dispatch(onComplete())
    },
    onDone() {
      dispatch(onComplete())
    }
  })
)(ChangeRecoveryScreenComponent)
