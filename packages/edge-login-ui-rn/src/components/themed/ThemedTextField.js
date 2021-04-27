// @flow

import * as React from 'react'
import { type TextFieldProps, TextField } from 'react-native-material-textfield'

import { fixSides, mapSides, sidesToMargin } from '../../util/sides.js'
import { type ThemeProps, withTheme } from '../services/ThemeContext.js'

interface Props extends TextFieldProps, ThemeProps {
  marginRem?: number | number[];
}

class ThemedTextFieldComponent extends React.PureComponent<Props> {
  render() {
    const { theme, marginRem, ...rest } = this.props

    return (
      <TextField
        containerStyle={sidesToMargin(
          mapSides(fixSides(marginRem, 0.5), theme.rem)
        )}
        fontSize={theme.rem(1)}
        labelFontSize={theme.rem(0.75)}
        baseColor={theme.primaryText}
        errorColor={theme.dangerText}
        textColor={theme.primaryText}
        tintColor={theme.primaryText}
        {...rest}
      />
    )
  }
}

export const ThemedTextField = withTheme(ThemedTextFieldComponent)
