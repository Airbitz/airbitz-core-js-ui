import * as React from 'react'
import { Text, View } from 'react-native'
import { cacheStyles } from 'react-native-patina'

import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'

interface Props {
  children?: React.ReactNode
  renderIcon: (theme: Theme) => React.ReactNode
}

/**
 * A container for holding an icon & header text.
 */
function IconHeaderRowComponent(props: Props & ThemeProps) {
  const { children, renderIcon, theme } = props
  const styles = getStyles(theme)

  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{renderIcon(theme)}</Text>
      <View style={styles.text}>{children}</View>
    </View>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    color: theme.primaryText,
    fontSize: theme.rem(2),
    margin: theme.rem(0.5)
  },
  text: {
    flex: 1
  }
}))

export const IconHeaderRow = withTheme(IconHeaderRowComponent)
