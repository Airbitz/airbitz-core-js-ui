import * as React from 'react'

import { MaterialInput } from './MaterialInput'

interface Props {
  testID?: string
  style: {
    container: any
    baseColor: string
    tintColor: string
    textColor: string
    errorColor: string
    titleTextStyle: any
  }
  label: string
  value: string
  autoCorrect?: boolean
  autoFocus?: boolean
  forceFocus?: boolean
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  secureTextEntry?: boolean
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send'
  error?: string
  onFocus?: () => void
  onBlur?: () => void
  onChangeText: (text: string) => void
  onSubmitEditing?: () => void
}

export class FormField extends React.Component<Props> {
  static defaultProps = {
    value: '',
    returnKeyType: 'done'
  }

  render() {
    const {
      container,
      baseColor,
      tintColor,
      textColor,
      errorColor,
      titleTextStyle
    } = this.props.style
    return (
      <MaterialInput
        testID={this.props.testID}
        label={this.props.label}
        value={this.props.value}
        onChangeText={this.props.onChangeText}
        error={this.props.error}
        containerStyle={container}
        secureTextEntry={this.props.secureTextEntry}
        returnKeyType={this.props.returnKeyType}
        baseColor={baseColor}
        tintColor={tintColor}
        textColor={textColor}
        errorColor={errorColor}
        titleTextStyle={titleTextStyle}
        autoFocus={this.props.autoFocus}
        forceFocus={this.props.forceFocus}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
        autoCapitalize={this.props.autoCapitalize}
        autoCorrect={this.props.autoCorrect}
        onSubmitEditing={this.handleSubmitEditing}
      />
    )
  }

  handleSubmitEditing = (): void => {
    if (this.props.onSubmitEditing) {
      this.props.onSubmitEditing()
    }
  }
}
