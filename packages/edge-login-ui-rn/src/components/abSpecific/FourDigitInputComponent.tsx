import * as React from 'react'
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native'

import { validatePin } from '../../actions/CreateAccountActions'
import * as Colors from '../../constants/Colors'
import { Dispatch, RootState } from '../../types/ReduxTypes'
import { scale } from '../../util/scaling'
import { connect } from '../services/ReduxStore'

const MAX_PIN_LENGTH = 4

interface OwnProps {
  testID?: string
}
interface StateProps {
  error: string
  pin: string
  wait: number
}
interface DispatchProps {
  onChangeText: (pin: string) => void
}
type Props = OwnProps & StateProps & DispatchProps

class FourDigitInputComponent extends React.Component<Props> {
  inputRef: TextInput | null

  loadedInput = (ref: TextInput | null) => {
    this.inputRef = ref
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.handleRefocus}>
        <View style={styles.container}>
          <View style={styles.interactiveContainer}>
            {this.renderDotContainer()}
          </View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText} numberOfLines={2}>
              {this.props.error}
            </Text>
          </View>
          {this.renderTextInput()}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderTextInput = () => {
    if (this.props.wait < 1) {
      return (
        <TextInput
          testID={this.props.testID}
          ref={this.loadedInput}
          style={styles.input}
          onChangeText={this.handleUpdate}
          maxLength={MAX_PIN_LENGTH}
          keyboardType="number-pad"
          value={this.props.pin}
          autoFocus
        />
      )
    }
    return null
  }

  handleRefocus = () => {
    if (this.inputRef != null) this.inputRef.focus()
  }

  renderDotContainer() {
    const pinLength = this.props.pin ? this.props.pin.length : 0
    if (this.props.wait > 0) {
      return <ActivityIndicator color={Colors.ACCENT_MINT} size="large" />
    }
    return (
      <View style={styles.dotContainer}>
        <View style={[styles.circle, pinLength > 0 && styles.circleSected]} />
        <View style={[styles.circle, pinLength > 1 && styles.circleSected]} />
        <View style={[styles.circle, pinLength > 2 && styles.circleSected]} />
        <View style={[styles.circle, pinLength > 3 && styles.circleSected]} />
      </View>
    )
  }

  handleUpdate = (pin: string) => {
    // Change pin only when input are numbers
    if (/^\d+$/.test(pin) || pin.length === 0) {
      this.props.onChangeText(pin)
    }
  }
}

const styles = {
  // for new account PIN
  container: {
    paddingTop: scale(36),
    width: scale(200),
    height: scale(120)
  },
  interactiveContainer: {
    height: scale(40),
    width: '100%',
    alignItems: 'center'
  },
  errorContainer: {
    width: '100%',
    height: scale(40),
    alignItems: 'center',
    justifyContent: 'center'
  },
  dotContainer: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  errorText: {
    width: '100%',
    textAlign: 'center',
    color: Colors.ACCENT_RED,
    fontSize: scale(14),
    paddingTop: scale(15)
  },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    opacity: 0
  },
  circle: {
    borderWidth: scale(2),
    borderColor: Colors.PRIMARY,
    borderRadius: scale(15),
    height: scale(30),
    width: scale(30)
  },
  circleSected: {
    backgroundColor: Colors.SECONDARY,
    borderWidth: scale(2),
    borderColor: Colors.PRIMARY,
    borderRadius: scale(15),
    height: scale(30),
    width: scale(30)
  }
}

export const FourDigitInput = connect<StateProps, DispatchProps, OwnProps>(
  (state: RootState) => ({
    error: state.create.pinErrorMessage || '',
    pin: state.create.pin,
    username: state.login.username,
    wait: 0
  }),
  (dispatch: Dispatch) => ({
    onChangeText(pin: string) {
      dispatch(validatePin(pin))
    }
  })
)(FourDigitInputComponent)
