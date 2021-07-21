import * as React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { fixSides, mapSides, sidesToPadding } from '../../util/sides'
import { HeaderComponent } from '../common/Header'
import { useTheme } from '../services/ThemeContext'

interface Props {
  children?: React.ReactNode

  // Header:
  showHeader?: boolean
  onBack?: () => void
  onSkip?: () => void
  subTitle?: string
  title?: string

  // Padding:
  paddingRem?: number | number[]
}

const UPPER_LEFT = { x: 0, y: 0 }
const UPPER_RIGHT = { x: 1, y: 0 }

export function ThemedScene(props: Props) {
  const {
    children,
    onBack,
    onSkip,
    paddingRem,
    showHeader,
    subTitle = '',
    title = ''
  } = props
  const theme = useTheme()

  const containerStyle = {
    flex: 1,
    ...sidesToPadding(mapSides(fixSides(paddingRem, 0.5), theme.rem))
  }
  return (
    <>
      <LinearGradient
        style={StyleSheet.absoluteFill}
        start={UPPER_LEFT}
        end={UPPER_RIGHT}
        colors={[theme.backgroundGradientLeft, theme.backgroundGradientRight]}
      />
      <SafeAreaView style={{ flex: 1 }}>
        {showHeader ? (
          <HeaderComponent
            onBack={onBack}
            onSkip={onSkip}
            subTitle={subTitle}
            title={title}
          />
        ) : null}
        <View style={containerStyle}>{children}</View>
      </SafeAreaView>
    </>
  )
}
