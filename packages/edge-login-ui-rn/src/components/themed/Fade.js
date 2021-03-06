// @flow

import * as React from 'react'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

import { useEffect, useState } from '../../util/hooks.js'

type Props = {
  children: React.Node,

  // True to make the contents visible:
  visible: boolean,

  // Animation duration, in ms:
  duration?: number,

  // True to simply make the contents transparent, rather than unmount them:
  hidden?: boolean
}

const FadeComponent = (props: Props) => {
  const { children, duration = 500, visible, hidden } = props

  // We always fade in on first mount:
  const opacity = useSharedValue(0)
  const style = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  // Animate the opacity & child lifecycle based on the visibility toggle:
  const [mounted, setMounted] = useState<boolean>(visible)
  useEffect(() => {
    if (visible) {
      setMounted(true)
      opacity.value = withTiming(1, { duration })
    } else {
      opacity.value = withTiming(0, { duration }, (isComplete: boolean) => {
        if (!isComplete) return
        runOnJS(setMounted)(false)
      })
    }
  }, [duration, opacity, visible])

  return (
    <Animated.View style={style}>
      {mounted || hidden ? children : null}
    </Animated.View>
  )
}

export const Fade = FadeComponent
