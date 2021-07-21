import * as React from 'react'
import { TouchableOpacity } from 'react-native'
import { cacheStyles } from 'react-native-patina'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { Theme, useTheme } from '../services/ThemeContext'

export function ModalCloseArrow(props: { onPress?: () => void }) {
  const theme = useTheme()
  const styles = getStyles(theme)

  return (
    <TouchableOpacity onPress={props.onPress} style={styles.closeArrow}>
      <AntDesignIcon
        name="down"
        size={theme.rem(1.25)}
        color={theme.secondaryText}
      />
    </TouchableOpacity>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  closeArrow: {
    alignItems: 'center',
    paddingTop: theme.rem(1)
  }
}))
