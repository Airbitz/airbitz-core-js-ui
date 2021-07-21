import * as React from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import s from '../../common/locales/strings'
import * as Constants from '../../constants/index'
import { isIphoneX } from '../../util/isIphoneX'
import { scale } from '../../util/scaling'

type Key = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'back'

interface Props {
  disabled?: boolean
  onPress: (key: Key) => void
}

export class PinKeypad extends React.PureComponent<Props> {
  render() {
    const { disabled, onPress } = this.props

    return (
      <View style={styles.keypadContainer}>
        <View style={styles.keypadInner}>
          <View style={styles.keypadRow}>
            <TouchableWithoutFeedback
              style={styles.keypadColumn}
              onPress={() => onPress('1')}
              disabled={disabled}
            >
              <View style={styles.keypadColumn}>
                <Text style={styles.keypadKeys}>{s.strings.keypad_one}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.keypadColumn}
              onPress={() => onPress('2')}
              disabled={disabled}
            >
              <View style={styles.keypadColumn}>
                <Text style={styles.keypadKeys}>{s.strings.keypad_two}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.keypadColumn}
              onPress={() => onPress('3')}
              disabled={disabled}
            >
              <View style={styles.keypadColumn}>
                <Text style={styles.keypadKeys}>{s.strings.keypad_three}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.keypadRow}>
            <TouchableWithoutFeedback
              style={styles.keypadColumn}
              onPress={() => onPress('4')}
              disabled={disabled}
            >
              <View style={styles.keypadColumn}>
                <Text style={styles.keypadKeys}>{s.strings.keypad_four}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.keypadColumn}
              onPress={() => onPress('5')}
              disabled={disabled}
            >
              <View style={styles.keypadColumn}>
                <Text style={styles.keypadKeys}>{s.strings.keypad_five}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.keypadColumn}
              onPress={() => onPress('6')}
              disabled={disabled}
            >
              <View style={styles.keypadColumn}>
                <Text style={styles.keypadKeys}>{s.strings.keypad_six}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.keypadRow}>
            <TouchableWithoutFeedback
              style={styles.keypadColumn}
              onPress={() => onPress('7')}
              disabled={disabled}
            >
              <View style={styles.keypadColumn}>
                <Text style={styles.keypadKeys}>{s.strings.keypad_seven}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.keypadColumn}
              onPress={() => onPress('8')}
              disabled={disabled}
            >
              <View style={styles.keypadColumn}>
                <Text style={styles.keypadKeys}>{s.strings.keypad_eight}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.keypadColumn}
              onPress={() => onPress('9')}
              disabled={disabled}
            >
              <View style={styles.keypadColumn}>
                <Text style={styles.keypadKeys}>{s.strings.keypad_nine}</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.keypadRow}>
            <View style={styles.keypadColumnBlank} />
            <TouchableWithoutFeedback
              style={styles.keypadColumn}
              onPress={() => onPress('0')}
              disabled={disabled}
            >
              <View style={styles.keypadColumn}>
                <Text style={styles.keypadKeys}>{s.strings.keypad_zero}</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => onPress('back')}
              disabled={disabled}
            >
              <View style={styles.keypadColumnBack}>
                <MaterialIcon name="backspace" style={styles.keypadKeysBack} />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    )
  }
}

const styles = {
  keypadContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  keypadInner: {
    flex: 1,
    maxWidth: 500,
    height: scale(180),
    maxHeight: 300,
    marginBottom: isIphoneX ? scale(28) : 0
  },
  keypadRow: {
    flex: 1,
    flexDirection: 'row'
  },
  keypadColumn: {
    flex: 1,
    borderColor: Constants.ACCENT_MINT,
    borderWidth: 1,
    margin: scale(2),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  keypadColumnBack: {
    flex: 1,
    margin: scale(2),
    justifyContent: 'center',
    alignItems: 'center'
  },
  keypadColumnBlank: {
    flex: 1,
    margin: scale(2)
  },
  keypadKeys: {
    textAlign: 'center',
    fontSize: scale(14),
    color: Constants.ACCENT_MINT
  },
  keypadKeysBack: {
    textAlign: 'center',
    fontSize: scale(30),
    color: Constants.ACCENT_MINT
  }
} as const
