import * as React from 'react'
import { Platform, View } from 'react-native'
import { AirshipBridge } from 'react-native-airship'

import s from '../../common/locales/strings'
import { ThemedTextField } from '../../components/themed/ThemedTextField'
import { showError } from '../services/AirshipInstance'
import { ModalCloseArrow } from '../themed/ModalParts'
import { PrimaryButton } from '../themed/ThemedButtons'
import { ThemedModal } from '../themed/ThemedModal'
import { MessageText, TitleText } from '../themed/ThemedText'

interface Props {
  // Resolves to the entered string, or void if cancelled.
  bridge: AirshipBridge<string | undefined>

  // The modal will show a spinner as long as this promise is pending.
  // Returning true will dismiss the modal, but returning false or a string
  // will leave the modal up. The string will be shown as an error message.
  onSubmit?: (text: string) => Promise<boolean | string>

  // Text to show in the modal:
  title?: string
  message?: string
  inputLabel: string
  submitLabel?: string

  // Text input options:
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoCorrect?: boolean
  keyboardType?:
    | 'default'
    | 'number-pad'
    | 'decimal-pad'
    | 'numeric'
    | 'email-address'
    | 'phone-pad'
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send'
  secureTextEntry?: boolean
}

interface State {
  errorMessage?: string
  text: string
  spinning: boolean
}

export class TextInputModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { spinning: false, text: '' }
  }

  handleCancel = () => {
    const { bridge } = this.props
    if (!this.state.spinning) bridge.resolve(undefined)
  }

  handleChangeText = (text: string) => {
    this.setState({ errorMessage: undefined, text })
  }

  handleSubmit = () => {
    const { bridge, onSubmit } = this.props

    if (onSubmit == null) return bridge.resolve(this.state.text)
    this.setState({ spinning: true })
    onSubmit(this.state.text).then(
      result => {
        if (result === true) {
          bridge.resolve(this.state.text)
        } else if (result === false) {
          this.setState({ spinning: false })
        } else {
          this.setState({ errorMessage: result, spinning: false })
        }
      },
      error => {
        this.setState({ spinning: false })
        showError(error)
      }
    )
  }

  render() {
    const {
      bridge,
      inputLabel,
      message,
      submitLabel = s.strings.submit,
      title,
      autoCapitalize,
      autoCorrect,
      keyboardType,
      returnKeyType,
      secureTextEntry
    } = this.props
    const { errorMessage, text, spinning } = this.state

    return (
      <ThemedModal bridge={bridge} onCancel={this.handleCancel}>
        {title != null ? <TitleText>{title}</TitleText> : null}
        {message != null ? <MessageText>{message}</MessageText> : null}
        <ThemedTextField
          // Text input props:
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          label={inputLabel}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry}
          // Our props:
          autoFocus
          error={errorMessage}
          onChangeText={this.handleChangeText}
          onSubmitEditing={this.handleSubmit}
          value={text}
        />
        {
          // Hack around the Android keyboard glitch:
          Platform.OS === 'android' ? <View style={{ flex: 1 }} /> : null
        }
        {spinning ? (
          <PrimaryButton marginRem={0.5} spinner />
        ) : (
          <PrimaryButton
            label={submitLabel}
            marginRem={0.5}
            onPress={this.handleSubmit}
          />
        )}
        <ModalCloseArrow onPress={this.handleCancel} />
      </ThemedModal>
    )
  }
}
