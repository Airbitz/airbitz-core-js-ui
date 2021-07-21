import * as React from 'react'
import { TextField } from 'react-native-material-textfield'

import { scale } from '../../util/scaling'

interface Props {
  testID?: string
  label: string
  value: string
  error?: string
  containerStyle: Object
  baseColor: string
  tintColor: string
  textColor: string
  errorColor: string
  titleTextStyle: Object
  secureTextEntry?: boolean
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoCorrect?: boolean
  autoFocus?: boolean
  // eslint-disable-next-line react/no-unused-prop-types
  forceFocus?: boolean
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send'
  onFocus?: () => void
  onBlur?: () => void
  onChangeText: (text: string) => void
  onSubmitEditing: () => void
}
interface State {
  inputText: string
  autoFocus: boolean
}
export class MaterialInput extends React.Component<Props, State> {
  textInput: TextField

  constructor(props: Props) {
    super(props)
    this.state = {
      inputText: '',
      autoFocus: this.props.autoFocus ?? false
    }
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.textInput.focus()
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.value !== this.state.inputText) {
      this.setState({
        inputText: nextProps.value,
        autoFocus: nextProps.autoFocus
      })
    }
    if (nextProps.autoFocus && !this.props.autoFocus) {
      this.textInput.focus()
    }
    if (nextProps.forceFocus) {
      this.textInput.focus()
    }
  }

  render() {
    const value = this.props.value ? this.props.value : ''
    const error = this.props.error ? this.props.error : ''
    const {
      containerStyle,
      baseColor,
      tintColor,
      textColor,
      errorColor,
      titleTextStyle,
      secureTextEntry,
      returnKeyType
    } = this.props
    const autoCorrectConfigured =
      typeof this.props.autoCorrect === 'undefined'
        ? true
        : this.props.autoCorrect
    return (
      <TextField
        testID={this.props.testID}
        ref={this.addRef}
        label={this.props.label}
        value={value}
        onChangeText={this.handleChange}
        error={error}
        containerStyle={containerStyle}
        baseColor={baseColor}
        tintColor={tintColor}
        textColor={textColor}
        errorColor={errorColor}
        titleTextStyle={titleTextStyle}
        secureTextEntry={secureTextEntry}
        autoCapitalize={this.props.autoCapitalize}
        returnKeyType={returnKeyType}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        autoCorrect={autoCorrectConfigured}
        onSubmitEditing={this.handleSubmitEditing}
        fontSize={scale(15)}
        titleFontSize={scale(12)}
        labelFontSize={scale(12)}
      />
    )
  }

  addRef = (arg: TextField | null) => {
    if (arg) {
      this.textInput = arg
    }
  }

  handleChange = (text: string) => {
    this.setState({
      inputText: text
    })
    this.props.onChangeText(text)
  }

  handleSubmitEditing = (): void => {
    if (this.props.onSubmitEditing) {
      this.props.onSubmitEditing()
    }
  }

  handleFocus = () => {
    if (this.props.onFocus) {
      this.props.onFocus()
    }
  }

  handleBlur = () => {
    if (this.props.onBlur) {
      this.props.onBlur()
    }
  }
}
