import * as React from 'react'
import {
  FlatList,
  Keyboard,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { sprintf } from 'sprintf-js'

import { loginWithPin, loginWithTouch } from '../../actions/LoginAction'
import { deleteUserFromDevice } from '../../actions/UserActions'
import * as Assets from '../../assets/index'
import s from '../../common/locales/strings'
import * as Constants from '../../constants/index'
import { LoginUserInfo } from '../../reducers/PreviousUsersReducer'
import * as Styles from '../../styles/index'
import { Branding } from '../../types/Branding'
import { Dispatch, RootState } from '../../types/ReduxTypes'
import { scale, scaleH } from '../../util/scaling'
import { FourDigit } from '../abSpecific/FourDigitComponent'
import { LogoImageHeader } from '../abSpecific/LogoImageHeader'
import { PinKeypad } from '../abSpecific/PinKeypad'
import { UserListItem } from '../abSpecific/UserListItem'
import { BackgroundImage } from '../common/BackgroundImage'
import { Button } from '../common/Button'
import { HeaderParentButtons } from '../common/HeaderParentButtons'
import { ImageButton } from '../common/ImageButton'
import { ButtonsModal } from '../modals/ButtonsModal'
import { Airship, showError } from '../services/AirshipInstance'
import { connect } from '../services/ReduxStore'

interface OwnProps {
  branding: Branding
}
interface StateProps {
  errorMessage: string
  isLoggingInWithPin: boolean
  isTouchIdDisabled: boolean
  loginSuccess: boolean
  pin: string
  touch: RootState['touch']
  userDetails: LoginUserInfo
  userList: LoginUserInfo[]
  username: string
  wait: number
}
interface DispatchProps {
  changeUser: (username: string) => void
  deleteUserFromDevice: (username: string) => Promise<void>
  gotoLoginPage: () => void
  loginWithTouch: (username: string) => void
  loginWithPin: (username: string, pin: string) => void
  onChangeText: (pin: string) => void
}
type Props = OwnProps & StateProps & DispatchProps

interface State {
  focusOn: 'pin' | 'List'
}

class PinLoginScreenComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      focusOn: 'pin'
    }
  }

  componentDidMount() {
    if (this.props.username && this.props.touch !== 'FaceID') {
      this.props.loginWithTouch(this.props.username)
    }
  }

  componentDidUpdate() {
    if (
      !this.props.userDetails.touchEnabled &&
      !this.props.userDetails.pinEnabled
    ) {
      this.exitPin()
    }
  }

  handleDelete = (username: string) => {
    const { deleteUserFromDevice } = this.props
    this.setState({ focusOn: 'pin' })

    Keyboard.dismiss()
    Airship.show(bridge => (
      <ButtonsModal
        bridge={bridge}
        title={s.strings.delete_account}
        message={sprintf(s.strings.delete_username_account, username)}
        buttons={{
          ok: { label: s.strings.delete },
          cancel: { label: s.strings.cancel, type: 'secondary' }
        }}
      />
    ))
      .then(async button => {
        if (button !== 'ok') return
        return await deleteUserFromDevice(username)
      })
      .catch(showError)
  }

  handleTouchId = () => {
    this.props.loginWithTouch(this.props.username)
  }

  handlePress = (value: string) => {
    const { loginWithPin, onChangeText, pin, username } = this.props
    const newPin = value === 'back' ? pin.slice(0, -1) : pin.concat(value)
    onChangeText(newPin)
    if (newPin.length === 4) loginWithPin(username, newPin)
  }

  render() {
    return (
      <View style={styles.container}>
        <BackgroundImage
          branding={this.props.branding}
          style={styles.backgroundImage}
          content={this.renderOverImage()}
        />
      </View>
    )
  }

  renderOverImage() {
    const { pin, wait } = this.props
    if (this.props.loginSuccess) {
      return null
    }
    return (
      <View style={styles.featureBoxContainer}>
        <HeaderParentButtons
          branding={{
            ...this.props.branding,
            parentButton: {
              text: s.strings.exit_pin,
              callback: this.exitPin.bind(this)
            }
          }}
        />
        <TouchableWithoutFeedback onPress={this.handleHideDrop}>
          <View style={styles.featureBox}>
            <LogoImageHeader branding={this.props.branding} />
            <View style={styles.featureBoxBody}>{this.renderBottomHalf()}</View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.spacer_full} />
        {this.props.userDetails.pinEnabled && (
          <PinKeypad
            disabled={wait > 0 || pin.length === 4}
            onPress={this.handlePress}
          />
        )}
      </View>
    )
  }

  renderBottomHalf() {
    const { errorMessage, isLoggingInWithPin, pin, wait } = this.props

    if (this.state.focusOn === 'pin') {
      return (
        <View style={styles.innerView}>
          <Button
            onPress={this.handleShowDrop}
            label={this.props.username}
            downStyle={styles.usernameButton.downStyle}
            downTextStyle={styles.usernameButton.downTextStyle}
            upStyle={styles.usernameButton.upStyle}
            upTextStyle={styles.usernameButton.upTextStyle}
          />
          {this.props.userDetails.pinEnabled && (
            <FourDigit
              error={
                wait > 0
                  ? `${errorMessage}: ${sprintf(
                      s.strings.account_locked_for,
                      wait
                    )}`
                  : errorMessage
              }
              pin={pin}
              spinner={wait > 0 || pin.length === 4 || isLoggingInWithPin}
            />
          )}
          {!this.props.userDetails.pinEnabled && <View style={styles.spacer} />}
          {this.renderTouchImage()}
          <Text style={styles.touchImageText}>
            {this.renderTouchImageText()}
          </Text>
        </View>
      )
    }
    return (
      <View style={styles.innerView}>
        <FlatList
          style={styles.listView}
          data={this.getDropdownItems()}
          renderItem={this.renderItems}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  exitPin() {
    this.props.gotoLoginPage()
  }

  getDropdownItems(): string[] {
    const { userList, touch } = this.props
    return userList
      .filter(user => user.pinEnabled || (touch && user.touchEnabled))
      .map(user => user.username)
  }

  renderItems = (item: { item: string }) => {
    return (
      <UserListItem
        data={item.item}
        style={styles.listItem}
        onClick={this.handleSelectUser}
        onDelete={this.handleDelete}
      />
    )
  }

  handleSelectUser = (username: string) => {
    this.props.loginWithTouch(username)
    this.props.changeUser(username)
    this.setState({
      focusOn: 'pin'
    })
  }

  handleShowDrop = () => {
    this.setState({
      focusOn: 'List'
    })
  }

  handleHideDrop = () => {
    this.setState({
      focusOn: 'pin'
    })
  }

  renderTouchImage = () => {
    const { touch, userDetails } = this.props
    const { touchEnabled } = userDetails
    if (touchEnabled && touch === 'FaceID') {
      return (
        <ImageButton
          style={{ container: {}, image: {} }}
          source={Assets.FACE_ID}
          onPress={this.handleTouchId}
          disabled={this.props.isTouchIdDisabled}
        />
      )
    }
    if (touchEnabled && touch === 'TouchID') {
      return (
        <ImageButton
          style={{ container: {}, image: {} }}
          source={Assets.TOUCH_ID}
          onPress={this.handleTouchId}
          disabled={this.props.isTouchIdDisabled}
        />
      )
    }
    if (!touchEnabled || !touch) {
      return null
    }
    return null
  }

  renderTouchImageText = () => {
    const { touch, userDetails } = this.props
    const { touchEnabled } = userDetails
    if (touchEnabled && touch === 'FaceID') {
      return s.strings.use_faceId
    }
    if (touchEnabled && touch === 'TouchID' && Platform.OS === 'ios') {
      return s.strings.use_touchId
    }
    if (touchEnabled && touch === 'TouchID' && Platform.OS !== 'ios') {
      return s.strings.use_fingerprint
    }
    return ''
  }
}

const styles = {
  container: Styles.ScreenStyle,
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    alignItems: 'center'
  },
  innerView: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  featureBoxContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  featureBox: {
    position: 'relative',
    top: scale(40),
    width: '100%',
    alignItems: 'center'
  },
  featureBoxBody: {
    height: scale(240),
    width: '100%'
  },
  thumbprintButton: {
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      flexDirection: 'column',
      alignItems: 'flex-end'
    },
    image: {
      position: 'relative',
      marginRight: '5%'
    }
  },
  listView: {
    height: scale(250),
    width: scaleH(160)
  },
  listItem: {
    container: {
      height: scale(40),
      width: '100%',
      backgroundColor: Constants.PRIMARY,
      flexDirection: 'row',
      alignItems: 'center'
    },
    textComtainer: {
      flex: 25,
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'space-around'
    },
    iconButton: {
      container: {
        flex: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '100%'
      },
      icon: {
        color: Constants.WHITE
      },
      iconSize: scale(Constants.FONTS.defaultFontSize)
    },
    text: {
      paddingLeft: scale(20),
      color: Constants.WHITE,
      backgroundColor: Constants.TRANSPARENT,
      fontFamily: Constants.FONTS.fontFamilyRegular,
      fontSize: scale(Constants.FONTS.defaultFontSize)
    }
  },
  dropInput: {
    container: {
      width: 200,
      height: scale(30),
      // backgroundColor: Constants.WHITE,
      marginBottom: scale(20)
    }
  },
  usernameButton: {
    upStyle: Styles.TextOnlyButtonUpStyle,
    upTextStyle: {
      ...Styles.TextOnlyButtonTextUpStyle,
      color: Constants.WHITE,
      fontSize: scale(24)
    },
    downTextStyle: {
      ...Styles.TextOnlyButtonTextDownStyle,
      color: Constants.WHITE,
      fontSize: scale(24)
    },
    downStyle: Styles.TextOnlyButtonDownStyle
  },
  exitButton: {
    upStyle: Styles.TextOnlyButtonUpStyle,
    upTextStyle: {
      ...Styles.TextOnlyButtonTextUpStyle,
      color: Constants.WHITE,
      fontSize: scale(16)
    },
    downTextStyle: {
      ...Styles.TextOnlyButtonTextDownStyle,
      color: Constants.WHITE,
      fontSize: scale(16)
    },
    downStyle: Styles.TextOnlyButtonDownStyle
  },
  spacer: {
    marginTop: scale(35)
  },
  spacer_full: {
    flex: 1,
    zIndex: -100
  },
  touchImageText: {
    marginTop: scale(8),
    color: Constants.ACCENT_MINT
  }
} as const

export const PinLoginScreen = connect<StateProps, DispatchProps, OwnProps>(
  (state: RootState) => ({
    errorMessage: state.login.errorMessage || '',
    isLoggingInWithPin: state.login.isLoggingInWithPin,
    isTouchIdDisabled:
      state.login.loginSuccess ||
      !!state.login.wait ||
      state.login.isLoggingInWithPin ||
      (state.login.pin ? state.login.pin.length : 0) === 4,
    loginSuccess: state.login.loginSuccess,
    pin: state.login.pin || '',
    touch: state.touch,
    userDetails: state.previousUsers.userList.find(
      user => user.username === state.login.username
    ) ?? {
      username: state.login.username,
      pinEnabled: false,
      touchEnabled: false
    },
    userList: state.previousUsers.userList,
    username: state.login.username,
    wait: state.login.wait
  }),
  (dispatch: Dispatch) => ({
    changeUser: (data: string) => {
      dispatch({ type: 'AUTH_UPDATE_USERNAME', data: data })
    },
    async deleteUserFromDevice(username) {
      return await dispatch(deleteUserFromDevice(username))
    },
    gotoLoginPage: () => {
      dispatch({ type: 'START_PASSWORD_LOGIN' })
    },
    loginWithTouch(username) {
      dispatch(loginWithTouch(username)).catch(showError)
    },
    loginWithPin(username, pin) {
      dispatch(loginWithPin(username, pin))
    },
    onChangeText(pin: string) {
      dispatch({ type: 'AUTH_UPDATE_PIN', data: pin })
    }
  })
)(PinLoginScreenComponent)
