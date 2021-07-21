import * as React from 'react'
import { Platform, TouchableWithoutFeedback, View } from 'react-native'
import { cacheStyles } from 'react-native-patina'
import IonIcon from 'react-native-vector-icons/Ionicons'

import { fixSides, mapSides, sidesToMargin } from '../../util/sides'
import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'

const isIos = Platform.OS === 'ios'

interface Props {
  onPress?: () => void
  marginRem?: number[] | number
  disabled?: boolean
}

const BackButtonComponent = ({
  theme,
  marginRem,
  onPress,
  disabled = false
}: Props & ThemeProps) => {
  const styles = getStyles(theme)
  const spacings = sidesToMargin(mapSides(fixSides(marginRem, 0.5), theme.rem))

  return (
    <View style={[spacings, styles.container]}>
      {!disabled && (
        <TouchableWithoutFeedback onPress={onPress}>
          {isIos ? (
            <IonIcon
              size={theme.rem(1.5)}
              name="chevron-back-outline"
              style={styles.backIconStyle}
            />
          ) : (
            <IonIcon
              size={theme.rem(1.25)}
              name="md-arrow-back"
              style={styles.backIconAndroid}
            />
          )}
        </TouchableWithoutFeedback>
      )}
    </View>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  container: {
    justifyContent: 'center',
    paddingHorizontal: theme.rem(1),
    height: 44 // This is a fixed height of the navigation header no matter what screen size. Default by router-flux
  },
  backIconStyle: {
    marginLeft: theme.rem(-0.25),
    paddingRight: theme.rem(0.75),
    color: theme.icon
  },
  backIconAndroid: {
    paddingRight: theme.rem(1),
    color: theme.icon
  }
}))

export const BackButton = withTheme(BackButtonComponent)
