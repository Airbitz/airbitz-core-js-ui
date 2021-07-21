import * as React from 'react'
import { View } from 'react-native'
import { cacheStyles } from 'react-native-patina'

import { fixSides, mapSides, sidesToMargin } from '../../util/sides'
import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'

interface Props {
  marginRem?: number[] | number
}

/**
 * Renders a horizontal dividing line.
 */
const DividerComponent = ({ marginRem, theme }: Props & ThemeProps) => {
  const styles = getStyles(theme)
  const spacings = sidesToMargin(
    mapSides(fixSides(marginRem || [1, 0], 0), theme.rem)
  )

  return <View style={[styles.divider, spacings]} />
}

const getStyles = cacheStyles((theme: Theme) => ({
  divider: {
    alignSelf: 'stretch',
    borderBottomWidth: theme.thinLineWidth,
    borderBottomColor: theme.lineDivider
  }
}))

export const Divider = withTheme(DividerComponent)
