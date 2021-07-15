import * as React from 'react'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

interface Props {
  children: React.ReactNode

  // True to make the contents visible:
  visible: boolean

  // Animation duration, in ms:
  duration?: number

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
  const [mounted, setMounted] = React.useState<boolean>(visible)
  React.useEffect(() => {
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
