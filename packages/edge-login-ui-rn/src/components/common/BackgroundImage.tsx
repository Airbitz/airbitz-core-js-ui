import * as React from 'react'
import {
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { Branding } from '../../types/Branding'
import { useTheme } from '../services/ThemeContext'

interface Props {
  branding: Branding
  style: any
  content: any
  enableTouch?: boolean
  onPress?: () => void
}

export const BackgroundImage = ({
  branding,
  style,
  content,
  enableTouch = true,
  onPress = () => Keyboard.dismiss()
}: Props) => {
  const src = branding.backgroundImage
  const theme = useTheme()

  const imageBackground = () => {
    return (
      <ImageBackground source={src} style={style}>
        {content}
      </ImageBackground>
    )
  }

  const gradientBackground = () => {
    return (
      <LinearGradient
        style={style}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={[theme.backgroundGradientLeft, theme.backgroundGradientRight]}
      >
        {content}
      </LinearGradient>
    )
  }

  const componentBackground = src ? imageBackground() : gradientBackground()

  if (enableTouch) {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        {componentBackground}
      </TouchableWithoutFeedback>
    )
  }

  return componentBackground
}
