import * as React from 'react'
import { AirshipBridge } from 'react-native-airship'

import { showError } from '../services/AirshipInstance'
import { ModalCloseArrow } from '../themed/ModalParts'
import { PromiseButton, PromiseButtonType } from '../themed/PromiseButton'
import { PrimaryButton, SecondaryButton } from '../themed/ThemedButtons'
import { ThemedModal } from '../themed/ThemedModal'
import { MessageText, TitleText } from '../themed/ThemedText'

export interface ButtonInfo {
  label: string
  type?: PromiseButtonType

  // The modal will show a spinner as long as this promise is pending.
  // Returning true will dismiss the modal,
  // but returning false will leave the modal up.
  // Although multiple buttons can be spinning at once,
  // a spinning button cannot be clicked again until the promise resolves.
  onPress?: () => Promise<boolean>
}

export function ButtonsModal<
  Buttons extends { [key: string]: ButtonInfo }
>(props: {
  children?: React.ReactNode
  bridge: AirshipBridge<keyof Buttons | undefined>
  buttons: Buttons
  closeArrow?: boolean
  message?: string
  title?: string
}) {
  const {
    bridge,
    buttons,
    children,
    closeArrow = false,
    message,
    title
  } = props
  const handleCancel = () => bridge.resolve(undefined)

  return (
    <ThemedModal bridge={bridge} onCancel={handleCancel} paddingRem={1}>
      {title != null ? <TitleText>{title}</TitleText> : null}
      {message != null ? <MessageText>{message}</MessageText> : null}
      {children}
      {Object.keys(buttons).map(key => {
        const { type = 'primary', label, onPress } = buttons[key]

        if (onPress != null) {
          return (
            <PromiseButton
              key={key}
              type={buttons[key].type}
              label={buttons[key].label}
              onPress={onPress}
              onReject={showError}
              onResolve={result => {
                if (result) bridge.resolve(key)
              }}
            />
          )
        }

        switch (type) {
          case 'primary':
            return (
              <PrimaryButton
                key={key}
                label={label}
                onPress={() => bridge.resolve(key)}
                marginRem={0.5}
              />
            )
          case 'secondary':
            return (
              <SecondaryButton
                key={key}
                label={label}
                onPress={() => bridge.resolve(key)}
                marginRem={0.5}
              />
            )
          default:
            return null
        }
      })}
      {closeArrow ? <ModalCloseArrow onPress={handleCancel} /> : null}
    </ThemedModal>
  )
}
