import { EdgeAccount } from 'edge-core-js'
import * as React from 'react'
import { Keyboard, Text, View } from 'react-native'

import { completeResecure } from '../../../actions/LoginCompleteActions'
import { onComplete } from '../../../actions/WorkflowActions'
import s from '../../../common/locales/strings'
import * as Constants from '../../../constants/index'
import * as Styles from '../../../styles/index'
import { Dispatch, RootState } from '../../../types/ReduxTypes'
import { scale } from '../../../util/scaling'
import { getAccount } from '../../../util/selectors'
import { FourDigitInput } from '../../abSpecific/FourDigitInputComponent'
import { Button } from '../../common/Button'
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
  pin: string
  pinError: string
}
interface DispatchProps {
  onDone: () => void
  onBack?: () => void
  onSkip?: () => void
}
type Props = OwnProps & StateProps & DispatchProps

interface State {
  isProcessing: boolean
  pin: string
  username: string
  focusOn: string
}

class ChangePinScreenComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      username: '',
      pin: '',
      isProcessing: false,
      focusOn: 'pin'
    }
  }

  renderHeader = () => {
    if (this.props.showHeader) {
      return <Header onBack={this.props.onBack} onSkip={this.props.onSkip} />
    }
    return null
  }

  handleSubmit = () => {
    const { account, pin, pinError, onDone } = this.props
    if (pin.length !== 4 || pinError) return

    Keyboard.dismiss()
    this.setState({ isProcessing: true })
    account
      .changePin({ pin })
      .then(onDone)
      .catch(error => {
        this.setState({ isProcessing: false })
        showError(error)
      })
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.screen}>
          {this.renderHeader()}
          <View style={styles.pageContainer}>
            <View style={styles.row1}>
              <Text style={styles.instructions}>{s.strings.pin_desc}</Text>
            </View>
            <View style={styles.row2}>
              <FourDigitInput />
            </View>
            <View style={styles.row3}>
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
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = {
  screen: { ...Styles.ScreenStyle },
  pageContainer: { flex: 1, width: '100%' },
  row1: {
    width: '100%',
    flex: -1,
    paddingTop: 24,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  row2: {
    width: '100%',
    paddingVertical: 12,
    flex: -1,
    alignItems: 'center'
  },
  row3: {
    width: '100%',
    paddingVertical: 12,
    flex: -1,
    alignItems: 'center'
  },
  instructions: {
    position: 'relative',
    width: '80%',
    fontSize: scale(Styles.CreateAccountFont.defaultFontSize),
    fontFamily: Constants.FONTS.fontFamilyRegular,
    color: Constants.GRAY_2,
    textAlign: 'center'
  },
  nextButton: {
    upStyle: Styles.PrimaryButtonUpScaledStyle,
    upTextStyle: Styles.PrimaryButtonUpTextScaledStyle,
    downTextStyle: Styles.PrimaryButtonUpTextScaledStyle,
    downStyle: Styles.PrimaryButtonDownScaledStyle
  }
} as const

export const PublicChangePinScreen = connect<
  StateProps,
  DispatchProps,
  OwnProps
>(
  (state: RootState) => ({
    account: getAccount(state),
    pin: state.create.pin,
    pinError: state.create.pinError
  }),
  (dispatch: Dispatch) => ({
    onDone() {
      Airship.show(bridge => (
        <ButtonsModal
          bridge={bridge}
          title={s.strings.pin_changed}
          message={s.strings.pin_successfully_changed}
          buttons={{ ok: { label: s.strings.ok } }}
        />
      ))
        .then(() => dispatch(onComplete()))
        .catch(showError)
    },
    onBack() {
      dispatch(onComplete())
    }
  })
)(ChangePinScreenComponent)

export const ResecurePinScreen = connect<StateProps, DispatchProps, OwnProps>(
  (state: RootState) => ({
    account: getAccount(state),
    pin: state.create.pin,
    pinError: state.create.pinError
  }),
  (dispatch: Dispatch) => ({
    onDone() {
      Airship.show(bridge => (
        <ButtonsModal
          bridge={bridge}
          title={s.strings.pswd_and_pin_changed}
          message={s.strings.change_pwd_body}
          buttons={{ ok: { label: s.strings.ok } }}
        />
      ))
        .then(() => dispatch(completeResecure()))
        .catch(showError)
    },
    onSkip() {
      dispatch(completeResecure())
    }
  })
)(ChangePinScreenComponent)
