import * as React from 'react'
import { ActivityIndicator, View } from 'react-native'
import { cacheStyles } from 'react-native-patina'

import * as Colors from '../../constants/Colors'
import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'
import { EdgeText } from '../themed/EdgeText'
import { ThemedScene } from '../themed/ThemedScene'

interface Props {
  title: string
  message: string
}

const WaitScreenComponent = ({ title, message, theme }: Props & ThemeProps) => {
  const styles = getStyles(theme)

  return (
    <ThemedScene>
      <View style={styles.content}>
        <EdgeText style={styles.title}>{title}</EdgeText>
        <EdgeText style={[styles.message, styles.marginBottom]}>
          {message}
        </EdgeText>
        <ActivityIndicator color={Colors.ACCENT_MINT} size="large" />
      </View>
    </ThemedScene>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontFamily: theme.fontFaceBold,
    fontSize: theme.rem(1.1),
    marginBottom: theme.rem(1.25)
  },
  message: {
    fontFamily: theme.fontFaceBold,
    fontSize: theme.rem(0.75),
    textAlign: 'center'
  },
  marginBottom: {
    marginBottom: theme.rem(2.5)
  }
}))

export const WaitScreen = withTheme(WaitScreenComponent)
