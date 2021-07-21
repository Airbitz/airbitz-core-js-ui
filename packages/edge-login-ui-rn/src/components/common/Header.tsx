import * as React from 'react'
import { Platform, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import s from '../../common/locales/strings'
import T from '../../components/common/FormattedText'
import { connect } from '../../components/services/ReduxStore'
import * as Colors from '../../constants/Colors'
import * as Constants from '../../constants/index'
import { workflows } from '../../constants/workflows'
import * as Styles from '../../styles/index'
import { Dispatch, RootState } from '../../types/ReduxTypes'
import { scale } from '../../util/scaling'
import { Button } from '../common/Button'
import { HeaderBackButton } from '../common/HeaderBackButton'

interface OwnProps {
  onBack?: () => void
  onSkip?: () => void
}
interface StateProps {
  subTitle: string
  title: string
}
type Props = OwnProps & StateProps

/**
 * The raw Header for a scene.
 * This is exported because ChangeRecoveryConfirmScreen isn't a real screen,
 * and pulls this in specially.
 */
export class HeaderComponent extends React.Component<Props> {
  render() {
    return (
      <LinearGradient
        style={[styles.container, { paddingTop: 0 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={Colors.GRADIENT}
      >
        <View style={styles.left}>{this.renderBack()}</View>
        {this.renderText()}
        <View style={styles.right}>{this.renderSkip()}</View>
      </LinearGradient>
    )
  }

  renderBack() {
    if (this.props.onBack == null) return null

    return (
      <HeaderBackButton
        onPress={this.props.onBack}
        styles={styles.headerBackButtonStyle}
        label={s.strings.back}
      />
    )
  }

  renderText() {
    return (
      <View style={styles.center}>
        {this.props.subTitle !== '' && (
          <T style={styles.subHeadText}>{this.props.subTitle}</T>
        )}
        <T style={styles.headlineText}>{this.props.title}</T>
      </View>
    )
  }

  renderSkip() {
    if (this.props.onSkip == null) return null

    return (
      <Button
        onPress={this.props.onSkip}
        downStyle={styles.textButton.downStyle}
        downTextStyle={styles.textButton.downTextStyle}
        upStyle={styles.textButton.upStyle}
        upTextStyle={styles.textButton.upTextStyle}
        label={s.strings.skip}
      />
    )
  }
}

const styles = {
  container: {
    position: 'relative',
    height: scale(Platform.OS === 'ios' ? 42 : 54),
    width: '100%',
    backgroundColor: Constants.TRANSPARENT,
    flexDirection: 'row',
    paddingTop: scale(6)
  },
  headerBackButtonStyle: {
    backButton: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    backIconStyle: {
      position: 'relative',
      top: scale(1),
      paddingLeft: scale(10),
      paddingRight: scale(2),
      color: Constants.WHITE,
      fontSize: scale(22)
    },
    sideText: {
      color: Constants.WHITE,
      fontSize: scale(14)
    },
    icon: {
      color: Constants.WHITE
    },
    default: {
      backgroundColor: Constants.TRANSPARENT,
      color: Constants.WHITE
    }
  },
  left: {
    flex: 1,
    justifyContent: 'center'
  },
  center: {
    flex: 3,
    justifyContent: 'center'
  },
  right: {
    flex: 1,
    justifyContent: 'center'
  },
  headlineText: {
    fontSize: scale(17),
    width: '100%',
    textAlign: 'center',
    color: Constants.WHITE
  },
  subHeadText: {
    fontSize: scale(11),
    width: '100%',
    textAlign: 'center',
    color: Constants.ACCENT_MINT
  },
  textButton: {
    upStyle: { ...Styles.TextOnlyButtonUpScaledStyle, width: '100%' },
    upTextStyle: {
      ...Styles.TextOnlyButtonTextUpScaledStyle,
      width: '100%',
      color: Constants.WHITE,
      fontSize: scale(Constants.FONTS.defaultButtonTextSize)
    },
    downTextStyle: {
      ...Styles.TextOnlyButtonTextDownScaledStyle,
      width: '100%',
      color: Constants.SECONDARY,
      fontSize: scale(Constants.FONTS.defaultButtonTextSize)
    },
    downStyle: {
      ...Styles.TextOnlyButtonDownScaledStyle,
      width: '100%',
      height: scale(50)
    }
  }
} as const

export const Header = connect<StateProps, {}, OwnProps>(
  (state: RootState) => {
    const { currentKey, currentSceneIndex } = state.workflow
    const currentScene = workflows[currentKey][currentSceneIndex]
    return {
      subTitle: currentScene.subTitle,
      title: currentScene.title
    }
  },
  (dispatch: Dispatch) => ({})
)(HeaderComponent)
