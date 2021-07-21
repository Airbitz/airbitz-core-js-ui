import * as React from 'react'
import { TextStyle, TouchableWithoutFeedback, View } from 'react-native'
import { cacheStyles } from 'react-native-patina'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

import { fixSides, mapSides, sidesToMargin } from '../../util/sides'
import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'
import { EdgeText } from './EdgeText'

interface Props {
  textStyle: TextStyle
  children: React.ReactNode
  value: boolean
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip'
  numberOfLines?: number
  disabled?: boolean
  marginRem?: number[] | number
  onChange: (value: boolean) => void
}

const CheckboxComponent = ({
  textStyle,
  disabled,
  children,
  value,
  onChange,
  marginRem,
  ellipsizeMode,
  numberOfLines,
  theme
}: Props & ThemeProps) => {
  const styles = getStyles(theme)
  const spacings = sidesToMargin(mapSides(fixSides(marginRem, 0.5), theme.rem))

  return (
    <TouchableWithoutFeedback
      onPress={() => onChange(!value)}
      disabled={disabled}
    >
      <View style={[styles.container, spacings]}>
        {value ? (
          <SimpleLineIcons
            style={styles.checkbox}
            name="check"
            size={theme.rem(1.1)}
            color={theme.iconTappable}
          />
        ) : (
          <View style={[styles.checkbox, styles.unselected]} />
        )}
        <EdgeText
          style={[styles.label, textStyle]}
          ellipsizeMode={ellipsizeMode}
          numberOfLines={numberOfLines}
        >
          {children}
        </EdgeText>
      </View>
    </TouchableWithoutFeedback>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.rem(0.5)
  },
  checkbox: {
    marginRight: theme.rem(1)
  },
  unselected: {
    borderWidth: 1,
    borderRadius: theme.rem(0.55),
    borderColor: theme.icon,
    width: theme.rem(1.1),
    height: theme.rem(1.1)
  },
  label: {
    flex: 1
  }
}))

export const Checkbox = withTheme(CheckboxComponent)
