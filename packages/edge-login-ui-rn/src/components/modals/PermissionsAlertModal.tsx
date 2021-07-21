import * as React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { AirshipBridge, AirshipModal } from 'react-native-airship'
import { cacheStyles } from 'react-native-patina'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import s from '../../common/locales/strings'
import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'
import { ModalCloseArrow } from '../themed/ModalParts'
import { AlertModalButton } from '../themed/ThemedButtons'

interface OwnProps {
  bridge: AirshipBridge<'enable' | 'cancel' | typeof undefined>
}

type Props = OwnProps & ThemeProps

class PermissionsAlertModalComponent extends React.PureComponent<Props> {
  render() {
    const { bridge, theme } = this.props
    const styles = getStyles(theme)

    // Since we can't add native dependencies without a major version bump,
    // we rely on the GUI to sneak this one to us:
    const { ReactNativeBlurView } = global
    const underlay =
      typeof ReactNativeBlurView === 'function' ? (
        <ReactNativeBlurView
          blurType={theme.modalBlurType}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        'rgba(0, 0, 0, 0.75)'
      )

    const message =
      Platform.OS === 'ios'
        ? s.strings.notifications_permissions_ios
        : s.strings.notifications_permissions_android
    return (
      <AirshipModal
        bridge={bridge}
        onCancel={() => bridge.resolve(undefined)}
        padding={theme.rem(0.5)}
        borderRadius={theme.rem(1)}
        underlay={underlay}
      >
        <View style={styles.iconCircle}>
          <FontAwesome
            name="exclamation-triangle"
            size={theme.rem(2)}
            color={theme.primaryText}
          />
        </View>
        <Text style={styles.rowText}>{message}</Text>
        <AlertModalButton
          type="primary"
          label={s.strings.enable}
          onPress={() => bridge.resolve('enable')}
          marginRem={0.5}
        />
        <AlertModalButton
          type="secondary"
          label={s.strings.cancel}
          onPress={() => bridge.resolve('cancel')}
          marginRem={0.5}
        />
        <ModalCloseArrow onPress={() => bridge.resolve(undefined)} />
      </AirshipModal>
    )
  }
}

const iconRem = 3.5

const getStyles = cacheStyles((theme: Theme) => ({
  iconCircle: {
    // Layout:
    alignSelf: 'center',
    marginTop: -theme.rem(0.5 + iconRem / 2),
    marginBottom: theme.rem(0.5),
    height: theme.rem(iconRem),
    width: theme.rem(iconRem),

    // Visuals:
    backgroundColor: theme.securityAlertModalHeaderCircle,
    borderRadius: theme.rem(iconRem / 2),

    // Children:
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  rowText: {
    color: theme.securityAlertModalText,
    fontFamily: theme.fontFamily,
    fontSize: theme.rem(1),
    margin: theme.rem(0.5)
  }
}))

export const PermissionsAlertModal = withTheme(PermissionsAlertModalComponent)
