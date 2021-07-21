import * as React from 'react'
import { Text, View } from 'react-native'

import { PASSWORD_REQ_CHECKED, PASSWORD_REQ_UNCHECKED } from '../../assets'
import s from '../../common/locales/strings'
import * as Constants from '../../constants/index'
import { PasswordStatusState } from '../../reducers/PasswordStatusReducer'
import { Dispatch, RootState } from '../../types/ReduxTypes'
import { scale } from '../../util/scaling'
import { Checkbox } from '../common/Checkbox'
import { connect } from '../services/ReduxStore'

interface OwnProps {}
interface StateProps {
  secondsToCrack?: string
  status: PasswordStatusState | null
}
type Props = OwnProps & StateProps

class PasswordStatusComponent extends React.Component<Props> {
  render() {
    if (this.props.status) {
      return (
        <View style={styles.container}>
          <View style={styles.boxes}>
            {this.renderStatusList(this.props.status)}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{this.props.secondsToCrack}</Text>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.containerWhite}>
        <Text style={styles.instructions}>{s.strings.password_desc}</Text>
      </View>
    )
  }

  handleChange = () => {
    // do nothing
  }

  renderStatusList(status: PasswordStatusState) {
    return status.list.map(Item => (
      <View style={styles.checkboxContainer} key={Item.title}>
        <Checkbox
          style={styles.checkboxes}
          label={Item.title}
          value={Item.value}
          onChange={this.handleChange}
          checkedImage={PASSWORD_REQ_CHECKED}
          uncheckedImage={PASSWORD_REQ_UNCHECKED}
          disabled
        />
      </View>
    ))
  }
}

const styles = {
  container: {
    height: scale(80 + 48),
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Constants.GRAY_4
  },
  containerWhite: {
    height: scale(80 + 48),
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Constants.WHITE
  },
  instructions: {
    fontSize: scale(17),
    textAlign: 'center',
    width: '80%',
    fontFamily: Constants.FONTS.fontFamilyRegular
  },
  boxes: {
    flexDirection: 'column',
    top: scale(5)
  },
  checkboxContainer: {
    height: scale(16),
    marginTop: scale(4)
  },
  textContainer: {
    position: 'relative',
    width: '100%',
    flexDirection: 'column',
    marginTop: scale(5),
    height: scale(48),
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  shim: {
    height: scale(5),
    width: scale(30)
  },
  checkboxes: {
    container: {
      position: 'relative',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row'
    },
    text: {
      fontSize: scale(13),
      color: Constants.GRAY_2,
      fontFamily: Constants.FONTS.fontFamilyRegular
    },
    checkbox: {
      padding: scale(2),
      marginRight: scale(5)
    },
    labelContainer: {}
  },
  text: {
    textAlign: 'center',
    fontFamily: Constants.FONTS.fontFamilyRegular,
    width: '90%',
    marginTop: scale(6),
    marginBottom: scale(6),
    fontSize: scale(12)
  }
} as const

export const PasswordStatus = connect<StateProps, {}, OwnProps>(
  (state: RootState) => ({
    status: state.passwordStatus,
    secondsToCrack: state.passwordStatus
      ? state.passwordStatus.secondsToCrack
      : ''
  }),
  (dispatch: Dispatch) => ({})
)(PasswordStatusComponent)
