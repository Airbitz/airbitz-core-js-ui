import * as React from 'react'
import { Text, View } from 'react-native'

import s from '../../common/locales/strings'
import * as Constants from '../../constants/index'
import * as Styles from '../../styles/index'
import { Branding } from '../../types/Branding'
import { Dispatch, RootState } from '../../types/ReduxTypes'
import { logEvent } from '../../util/analytics'
import { scale } from '../../util/scaling'
import { LogoImageHeader } from '../abSpecific/LogoImageHeader'
import { BackgroundImage } from '../common/BackgroundImage'
import { Button } from '../common/Button'
import { HeaderParentButtons } from '../common/HeaderParentButtons'
import { connect } from '../services/ReduxStore'

interface OwnProps {
  branding: Branding
  landingScreenText?: string
}
interface DispatchProps {
  handleCreate: () => void
  handlePassword: () => void
}
type Props = OwnProps & DispatchProps

class LandingScreenComponent extends React.Component<Props> {
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
    return (
      <View style={styles.inner}>
        <HeaderParentButtons branding={this.props.branding} />
        <View style={styles.featureBox}>
          <LogoImageHeader branding={this.props.branding} />
          <View style={styles.featureBoxContent}>
            <View style={styles.featureBoxDescription}>
              <Text style={styles.tagText}>
                {this.props.landingScreenText || s.strings.landing_tagline}
              </Text>
            </View>
          </View>
          <View style={styles.featureBoxButtons}>
            <Button
              testID="createAccountButton"
              onPress={this.props.handleCreate}
              label={s.strings.landing_create_account_button}
              downStyle={styles.createButton.downStyle}
              downTextStyle={styles.createButton.downTextStyle}
              upStyle={styles.createButton.upStyle}
              upTextStyle={styles.createButton.upTextStyle}
            />
            <View style={styles.shim} />
            <Button
              testID="alreadyHaveAccountButton"
              onPress={this.props.handlePassword}
              label={s.strings.landing_already_have_account}
              downStyle={styles.loginButton.downStyle}
              downTextStyle={styles.loginButton.downTextStyle}
              upStyle={styles.loginButton.upStyle}
              upTextStyle={styles.loginButton.upTextStyle}
            />
          </View>
        </View>
      </View>
    )
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
  inner: {
    position: 'relative',
    flex: 1,
    width: '100%',
    height: '100%'
  },
  featureBox: {
    position: 'relative',
    top: scale(71),
    width: '100%',
    height: scale(286)
  },
  featureBoxContent: {
    // height: scale(186), 306- 125 - remaining space.
    width: '100%',
    flexDirection: 'column',
    height: scale(166),
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  featureBoxDescription: {
    // height: scale(186), 306- 125 - remaining space.
    width: '100%',
    justifyContent: 'flex-end'
  },
  featureBoxButtons: {
    // height: scale(186),
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  shim: {
    height: scale(28)
  },
  tagText: {
    width: '80%',
    marginLeft: '10%',
    marginRight: '10%',
    color: Constants.WHITE,
    backgroundColor: Constants.TRANSPARENT,
    fontFamily: Constants.FONTS.fontFamilyRegular,
    textAlign: 'center',
    fontSize: scale(14),
    lineHeight: scale(18)
  },
  createButton: {
    upStyle: Styles.TertiaryButtonUpStyle,
    upTextStyle: Styles.TertiaryButtonTextUpStyle,
    downTextStyle: Styles.TertiaryButtonTextDownStyle,
    downStyle: Styles.TertiaryButtonDownStyle
  },
  loginButton: {
    upStyle: Styles.TextOnlyButtonUpStyle,
    upTextStyle: {
      ...Styles.TextOnlyButtonTextUpStyle,
      fontSize: scale(14),
      color: Constants.WHITE
    },
    downTextStyle: {
      ...Styles.TextOnlyButtonTextDownStyle,
      fontSize: scale(14),
      color: Constants.WHITE
    },
    downStyle: Styles.TextOnlyButtonDownStyle
  }
}

export const LandingScreen = connect<{}, DispatchProps, OwnProps>(
  (state: RootState) => ({}),
  (dispatch: Dispatch): DispatchProps => ({
    handleCreate() {
      logEvent('Signup_Create_Account')
      dispatch({ type: 'START_CREATE_ACCOUNT' })
    },
    handlePassword() {
      dispatch({ type: 'START_PASSWORD_LOGIN' })
    }
  })
)(LandingScreenComponent)
