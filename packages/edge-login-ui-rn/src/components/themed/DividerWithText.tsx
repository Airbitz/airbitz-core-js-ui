import * as React from 'react'
import { Text, View } from 'react-native'
import { cacheStyles } from 'react-native-patina'

import s from '../../common/locales/strings'
import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'

interface Props {
  label?: string
}

/**
 * Renders a horizontal line with text in the middle.
 */
function DividerWithTextComponent(props: Props & ThemeProps) {
  const { label = s.strings.or, theme } = props
  const styles = getStyles(theme)

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{label}</Text>
      <View style={styles.line} />
    </View>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.rem(0.5)
  },
  line: {
    height: 1,
    borderColor: theme.secondaryText,
    borderBottomWidth: 1,
    flex: 1
  },
  text: {
    fontFamily: theme.fontFamily,
    fontSize: theme.rem(1),
    color: theme.secondaryText,
    marginHorizontal: theme.rem(0.5),
    paddingBottom: 4 // padding to center the text
  }
}))

export const DividerWithText = withTheme(DividerWithTextComponent)
