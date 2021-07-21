import * as React from 'react'
import { Text } from 'react-native'
import { cacheStyles } from 'react-native-patina'

import { Theme, useTheme } from '../services/ThemeContext'

interface NativeProps {
  allowFontScaling?: boolean
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip'
  lineBreakMode?: 'head' | 'middle' | 'tail' | 'clip'
  numberOfLines?: number
  onLayout?: (event: any) => void
  onTextLayout?: (event: any) => void
  onPress?: (event: any) => void
  onLongPress?: (event: any) => void
  style?: any
  testID?: string
  nativeID?: string
  maxFontSizeMultiplier?: number | null
}

/**
 * A lightweight wrapper around the React Native Text component,
 * which simply sets up some default styles.
 */
export function ThemedText(props: NativeProps) {
  const { style, ...rest } = props
  const theme = useTheme()
  const styles = getStyles(theme)
  return <Text style={[styles.themedText, style]} {...rest} />
}

/**
 * A scene or modal title.
 */
export function TitleText(props: { children: React.ReactNode }) {
  const theme = useTheme()
  const styles = getStyles(theme)
  return <Text style={styles.titleText}>{props.children}</Text>
}

/**
 * A paragraph of body text within a modal or scene.
 */
export function MessageText(props: { children: React.ReactNode }) {
  const theme = useTheme()
  const styles = getStyles(theme)
  return <Text style={styles.messageText}>{props.children}</Text>
}

/**
 * Use this component just like its HTML equivalent,
 * to wrap text that is of greater importance (bolder).
 */
export function Strong(props: { children: React.ReactNode }) {
  return <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
}

/**
 * Wraps text that communicates danger, like unusually high fees.
 */
export function Warning(props: { children: React.ReactNode }) {
  const theme = useTheme()
  const styles = getStyles(theme)
  return <Text style={styles.warning}>{props.children}</Text>
}

/**
 * Wraps text that communicates a problem, like insufficent funds.
 */
export function Error(props: { children: React.ReactNode }) {
  const theme = useTheme()
  const styles = getStyles(theme)
  return <Text style={styles.error}>{props.children}</Text>
}

const getStyles = cacheStyles((theme: Theme) => {
  const themedText = {
    color: theme.primaryText,
    fontFamily: theme.fontFamily,
    fontSize: theme.rem(1)
  }

  return {
    themedText,
    titleText: {
      ...themedText,
      fontSize: theme.rem(1.25),
      margin: theme.rem(0.5),
      textAlign: 'center'
    },
    messageText: {
      ...themedText,
      margin: theme.rem(0.5),
      textAlign: 'left'
    },
    warning: {
      color: theme.warningText
    },
    error: {
      color: theme.dangerText
    }
  }
})
