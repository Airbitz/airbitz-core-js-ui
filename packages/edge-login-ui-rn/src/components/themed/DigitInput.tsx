import * as React from 'react'
import { TextInput, TouchableWithoutFeedback, View } from 'react-native'
import { cacheStyles } from 'react-native-patina'

import { validatePin } from '../../actions/CreateAccountActions'
import { Dispatch, RootState } from '../../types/ReduxTypes'
import { fixSides, mapSides, sidesToMargin } from '../../util/sides'
import { connect } from '../services/ReduxStore'
import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'
import { PinDots } from './PinDots'

export const MAX_PIN_LENGTH = 4

interface OwnProps {
  maxPinLength?: number
  marginRem?: number[] | number
}

interface StateProps {
  pin: string
}

interface DispatchProps {
  onChangeText: (pin: string) => void
}

type Props = OwnProps & StateProps & DispatchProps & ThemeProps

const DigitInputComponent = ({
  pin = '',
  maxPinLength = MAX_PIN_LENGTH,
  marginRem,
  theme,
  onChangeText
}: Props) => {
  const inputRef = React.useRef<TextInput | null>(null)
  const spacings = sidesToMargin(mapSides(fixSides(marginRem, 0.5), theme.rem))
  const styles = getStyles(theme)

  const handleRefocus = () => {
    if (inputRef.current !== null) inputRef.current.focus()
  }

  const handleUpdate = (pin: string) => {
    // Change pin only when input are numbers
    if (/^\d+$/.test(pin) || pin.length === 0) {
      onChangeText(pin)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handleRefocus}>
      <View style={[styles.container, spacings]}>
        <View style={styles.interactiveContainer}>
          <PinDots pinLength={pin.length} maxLength={maxPinLength} />
        </View>
        <TextInput
          ref={inputRef}
          style={styles.input}
          onChangeText={handleUpdate}
          maxLength={maxPinLength}
          keyboardType="number-pad"
          value={pin}
          autoFocus
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  container: {
    alignSelf: 'center'
  },
  interactiveContainer: {
    width: theme.rem(13)
  },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    opacity: 0
  }
}))

export const DigitInput = connect<StateProps, DispatchProps, OwnProps>(
  (state: RootState) => ({
    pin: state.create.pin
  }),
  (dispatch: Dispatch) => ({
    onChangeText(pin: string) {
      dispatch(validatePin(pin))
    }
  })
)(withTheme(DigitInputComponent))
