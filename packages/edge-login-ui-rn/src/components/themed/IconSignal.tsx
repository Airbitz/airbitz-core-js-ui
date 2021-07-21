import * as React from 'react'
import { View } from 'react-native'
import { cacheStyles } from 'react-native-patina'

import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'
import { Fade } from './Fade'

interface IconProps {
  size?: number
  color?: string
}

interface Props {
  enabledIcon: React.ComponentType<IconProps>
  disabledIcon: React.ComponentType<IconProps>
  enabled: boolean
}

const IconSignalComponent = ({
  enabledIcon: EnabledIcon,
  disabledIcon: DisabledIcon,
  enabled,
  theme
}: Props & ThemeProps) => {
  const styles = getStyles(theme)

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Fade visible={enabled}>
          <EnabledIcon size={theme.rem(1.1)} color={theme.positiveText} />
        </Fade>
      </View>
      <View style={styles.icon}>
        <Fade visible={!enabled}>
          <DisabledIcon size={theme.rem(1.1)} color={theme.warningText} />
        </Fade>
      </View>
    </View>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  container: {
    height: theme.rem(1.1),
    width: theme.rem(1.1)
  },
  icon: {
    position: 'absolute',
    height: theme.rem(1.1),
    width: theme.rem(1.1)
  }
}))

export const IconSignal = withTheme(IconSignalComponent)
