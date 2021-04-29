import { EdgeLoginMessages } from 'edge-core-js'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AirshipBridge, AirshipModal } from 'react-native-airship'
import { cacheStyles } from 'react-native-patina'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import s from '../../common/locales/strings'
import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'
import { ModalCloseArrow } from '../themed/ModalParts'

interface OwnProps {
  bridge: AirshipBridge<unknown>
  messages: EdgeLoginMessages
  selectUser: (username: string) => void
}
type Props = OwnProps & ThemeProps

class SecurityAlertsModalComponent extends React.Component<Props> {
  render() {
    const { bridge, theme } = this.props
    const styles = getStyles(theme)

    // Since we can't add native dependencies without a major version bump,
    // we rely on the GUI to sneak this one to us:
    // @ts-expect-error
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

    // We use AirshipModal directly so we can implement our custom appearance.
    return (
      <AirshipModal
        bridge={bridge}
        onCancel={() => bridge.resolve(undefined)}
        padding={theme.rem(0.5)}
        underlay={underlay}
        borderRadius={0}
      >
        <View style={styles.iconCircle}>
          <FontAwesome
            name="exclamation-triangle"
            size={theme.rem(2)}
            color={theme.primaryText}
          />
        </View>
        <Text style={styles.titleText}>{s.strings.alert_modal_title}</Text>
        {this.renderList()}
        <ModalCloseArrow onPress={() => bridge.resolve(undefined)} />
      </AirshipModal>
    )
  }

  renderList(): React.ReactNode {
    const { messages } = this.props
    const out: React.ReactNode[] = []

    let isFirst = true
    for (const username of Object.keys(messages)) {
      const { otpResetPending } = messages[username]
      if (otpResetPending) {
        out.push(this.renderRow(username, true, isFirst))
        isFirst = false
      }
    }
    for (const username of Object.keys(messages)) {
      const { pendingVouchers = [] } = messages[username]
      if (pendingVouchers.length > 0) {
        out.push(this.renderRow(username, false, isFirst))
        isFirst = false
      }
    }

    return out
  }

  renderRow(username: string, isReset: boolean, isFirst: boolean) {
    const { bridge, theme } = this.props
    const styles = getStyles(theme)

    return (
      <TouchableOpacity
        key={(isReset ? 'reset:' : 'voucher:') + username}
        style={isFirst ? styles.row : styles.rowBorder}
        onPress={() => {
          this.props.selectUser(username)
          bridge.resolve(undefined)
        }}
      >
        <FontAwesome
          color={
            isReset
              ? theme.securityAlertModalDangerIcon
              : theme.securityAlertModalWarningIcon
          }
          name="exclamation-triangle"
          size={theme.rem(1.5)}
          style={styles.rowIcon}
        />
        <Text style={styles.rowText}>
          <Text style={styles.bold}>
            {isReset
              ? s.strings.alert_modal_reset
              : s.strings.alert_modal_voucher}
            {username}
          </Text>
          {s.strings.alert_modal_action}
        </Text>
        <AntDesignIcon
          color={theme.securityAlertModalText}
          name="right"
          size={theme.rem(1)}
          style={styles.rowIcon}
        />
      </TouchableOpacity>
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
  titleText: {
    color: theme.securityAlertModalText,
    fontFamily: theme.fontFamily,
    fontSize: theme.rem(1.2),
    margin: theme.rem(0.5),
    textAlign: 'center'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  rowBorder: {
    alignItems: 'center',
    borderTopColor: theme.securityAlertModalRowBorder,
    borderTopWidth: theme.rem(0.0625),
    flexDirection: 'row',
    marginTop: theme.rem(0.5),
    paddingTop: theme.rem(0.5)
  },
  rowIcon: {
    margin: theme.rem(0.5)
  },
  rowText: {
    color: theme.securityAlertModalText,
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: theme.fontFamily,
    fontSize: theme.rem(1),
    margin: theme.rem(0.5)
  },
  bold: {
    fontWeight: 'bold'
  }
}))

export const SecurityAlertsModal = withTheme(SecurityAlertsModalComponent)
