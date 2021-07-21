import * as React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { cacheStyles } from 'react-native-patina'
import { sprintf } from 'sprintf-js'

import { LOGO_BIG, WELCOME_LOCK, WELCOME_SHIELD_KEY } from '../../../assets'
import s from '../../../common/locales/strings'
import * as Constants from '../../../constants/index'
import { Branding } from '../../../types/Branding'
import { Dispatch, RootState } from '../../../types/ReduxTypes'
import { logEvent } from '../../../util/analytics'
import { connect } from '../../services/ReduxStore'
import { Theme, ThemeProps, withTheme } from '../../services/ThemeContext'
import { Divider } from '../../themed/Divider'
import { EdgeText } from '../../themed/EdgeText'
import { SimpleSceneHeader } from '../../themed/SimpleSceneHeader'
import { SecondaryButton } from '../../themed/ThemedButtons'
import { ThemedScene } from '../../themed/ThemedScene'

interface OwnProps {
  branding: Branding
}
interface DispatchProps {
  onExit: () => void
  onDone: () => void
}
type Props = OwnProps & DispatchProps & ThemeProps

const NewAccountWelcomeScreenComponent = ({
  theme,
  branding,
  onExit,
  onDone
}: Props) => {
  const styles = getStyles(theme)
  const appName = branding.appName || s.strings.app_name_default

  return (
    <ThemedScene paddingRem={[0.5, 0, 0.5, 0.5]}>
      <TouchableOpacity style={styles.exitButton} onPress={onExit}>
        <EdgeText style={styles.exitText}>{s.strings.exit}</EdgeText>
      </TouchableOpacity>
      <SimpleSceneHeader>{s.strings.get_started}</SimpleSceneHeader>
      <View style={styles.content}>
        <Image source={LOGO_BIG} style={styles.logo} resizeMode="contain" />
        <EdgeText style={styles.welcome}>
          {sprintf(s.strings.welcome, appName)}
        </EdgeText>
        <View style={styles.advantage}>
          <Image
            source={WELCOME_LOCK}
            style={styles.advantageImage}
            resizeMode="contain"
          />
          <View style={styles.advantageTextContainer}>
            <EdgeText style={styles.advantageTitle}>
              {sprintf(s.strings.welcome_advantage_one_title, appName)}
            </EdgeText>
            <EdgeText style={styles.advantageDescription} numberOfLines={2}>
              {s.strings.welcome_advantage_one_description}
            </EdgeText>
          </View>
        </View>
        <Divider marginRem={[1.5, 0, 1.5, 0.5]} />
        <View style={styles.advantage}>
          <Image
            source={WELCOME_SHIELD_KEY}
            style={styles.advantageImage}
            resizeMode="contain"
          />
          <View style={styles.advantageTextContainer}>
            <EdgeText style={styles.advantageTitle}>
              {s.strings.welcome_advantage_two_title}
            </EdgeText>
            <EdgeText style={styles.advantageDescription} numberOfLines={1}>
              {sprintf(s.strings.welcome_advantage_two_description, appName)}
            </EdgeText>
            <EdgeText style={styles.advantageDescription} numberOfLines={2}>
              {sprintf(s.strings.welcome_advantage_three_description, appName)}
            </EdgeText>
          </View>
        </View>
        <View style={styles.actions}>
          <SecondaryButton label={s.strings.get_started} onPress={onDone} />
        </View>
      </View>
    </ThemedScene>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  content: {
    flex: 1,
    alignItems: 'center'
  },
  logo: {
    height: theme.rem(2.25),
    marginTop: theme.rem(0.75),
    marginBottom: theme.rem(1)
  },
  exitButton: {
    marginLeft: theme.rem(0.5),
    marginBottom: theme.rem(1)
  },
  exitText: {
    color: theme.primaryButton,
    fontSize: theme.rem(0.75)
  },
  welcome: {
    fontFamily: theme.fontFaceBold,
    color: theme.secondaryText,
    fontSize: theme.rem(1),
    marginBottom: theme.rem(2.375)
  },
  advantage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.rem(0.5),
    marginRight: theme.rem(1)
  },
  advantageImage: {
    height: theme.rem(2),
    width: theme.rem(2),
    marginRight: theme.rem(1)
  },
  advantageTextContainer: {
    flex: 1
  },
  advantageTitle: {
    fontFamily: theme.fontFaceBold,
    color: Constants.GRAY_4,
    fontSize: theme.rem(1),
    marginBottom: theme.rem(0.5)
  },
  advantageDescription: {
    fontFamily: theme.fontFaceDefault,
    fontSize: theme.rem(0.75)
  },
  actions: {
    marginTop: theme.rem(4.5)
  }
}))

export const NewAccountWelcomeScreen = connect<{}, DispatchProps, OwnProps>(
  (state: RootState) => ({}),
  (dispatch: Dispatch) => ({
    onExit() {
      dispatch({ type: 'START_LANDING' })
    },
    onDone() {
      logEvent(`Signup_Welcome_Next`)
      dispatch({ type: 'WORKFLOW_NEXT' })
    }
  })
)(withTheme(NewAccountWelcomeScreenComponent))
