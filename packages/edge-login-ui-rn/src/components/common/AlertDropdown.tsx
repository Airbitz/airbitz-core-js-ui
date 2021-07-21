import * as React from 'react'
import { Text, View } from 'react-native'
import { AirshipBridge, AirshipDropdown } from 'react-native-airship'
import { cacheStyles } from 'react-native-patina'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import EntypoIcon from 'react-native-vector-icons/Entypo'

import s from '../../common/locales/strings'
import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'

interface Props {
  bridge: AirshipBridge<void>
  message: string

  // True for orange warning, false for red alert:
  warning?: boolean
}

function AlertDropdownComponent(props: Props & ThemeProps) {
  const { bridge, message, theme, warning } = props
  const styles = getStyles(theme)

  return (
    <AirshipDropdown
      bridge={bridge}
      backgroundColor={warning ? theme.dropdownWarning : theme.dropdownError}
    >
      <View style={styles.container}>
        <EntypoIcon name="warning" size={theme.rem(1.25)} style={styles.icon} />
        <Text style={styles.text}>
          <Text style={styles.boldText}>
            {warning
              ? s.strings.alert_dropdown_warning
              : s.strings.alert_dropdown_alert}{' '}
          </Text>
          {message}
        </Text>
        <AntDesignIcon
          name="closecircle"
          size={theme.rem(1)}
          style={styles.icon}
        />
      </View>
    </AirshipDropdown>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  container: {
    padding: theme.rem(0.5),

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  icon: {
    color: theme.dropdownText,
    textAlign: 'center',
    minWidth: theme.rem(1.5)
  },

  text: {
    fontSize: theme.rem(0.75),
    color: theme.dropdownText,
    marginHorizontal: theme.rem(0.5)
  },
  boldText: {
    fontWeight: theme.fontWeightBold
  }
}))

export const AlertDropdown = withTheme(AlertDropdownComponent)
