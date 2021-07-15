import * as React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import { cacheStyles } from 'react-native-patina'
import Animated, {
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import s from '../../common/locales/strings'
import { RootState } from '../../types/ReduxTypes'
import { fixSides, mapSides, sidesToMargin } from '../../util/sides'
import { connect } from '../services/ReduxStore'
import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'
import { EdgeText } from './EdgeText'

interface OwnProps {
  marginRem?: number[] | number
  onOpen?: () => void
}

interface StateProps {
  username: string
  password: string
  pin: string
}

type Props = OwnProps & StateProps & ThemeProps

const AccountInfoComponent = ({
  username,
  password,
  pin,
  marginRem,
  onOpen = () => {},
  theme
}: Props) => {
  const styles = getStyles(theme)
  const spacings = sidesToMargin(mapSides(fixSides(marginRem, 0.5), theme.rem))
  const [isExpanded, setIsExpanded] = React.useState(false)

  const animatedRef = useAnimatedRef<View>()
  const expanded = useSharedValue(false)
  const rotation = useSharedValue(0)
  const height = useSharedValue(0)
  const progress = useDerivedValue(() =>
    expanded.value ? withSpring(1) : withTiming(0)
  )

  const borderRadius = theme.rem(0.25)
  const headerStyle = useAnimatedStyle(() => ({
    borderBottomLeftRadius: progress.value === 0 ? borderRadius : 0,
    borderBottomRightRadius: progress.value === 0 ? borderRadius : 0,
    borderBottomWidth: progress.value === 0 ? theme.reallyThinLineWidth : 0
  }))
  const infoStyle = useAnimatedStyle(() => ({
    height: height.value * progress.value + 1,
    opacity: progress.value === 0 ? 0 : 1
  }))
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }]
    }
  })

  const renderInfoFields = () => (
    <>
      <EdgeText
        style={[styles.text, styles.textMarginBottom]}
        numberOfLines={0}
      >
        {s.strings.username}:&nbsp;{username}
      </EdgeText>
      <EdgeText
        style={[styles.text, styles.textMarginBottom]}
        numberOfLines={0}
      >
        {s.strings.password}:&nbsp;{password}
      </EdgeText>
      <EdgeText style={styles.text}>
        {s.strings.pin}:&nbsp;{pin}
      </EdgeText>
    </>
  )

  return (
    <View style={spacings}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (height.value === 0) {
            onOpen()

            runOnUI(() => {
              'worklet'
              height.value = measure(animatedRef).height
            })()
          }

          rotation.value = withTiming(expanded.value ? 0 : 180)
          expanded.value = !expanded.value
          setIsExpanded(!isExpanded)
        }}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <EdgeText style={styles.headerText}>
            {isExpanded
              ? s.strings.hide_account_info
              : s.strings.show_account_info}
          </EdgeText>
          <Animated.View style={[styles.headerIcon, iconStyle]}>
            <MaterialIcon
              name="keyboard-arrow-down"
              size={theme.rem(1.5)}
              color={theme.iconTappable}
            />
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.info, infoStyle]}>
        {renderInfoFields()}
      </Animated.View>
      <View style={[styles.info, styles.infoHiddenCopy]} ref={animatedRef}>
        {renderInfoFields()}
      </View>
    </View>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  header: {
    borderColor: theme.primaryText,
    borderTopLeftRadius: theme.rem(0.25),
    borderTopRightRadius: theme.rem(0.25),
    borderTopWidth: theme.reallyThinLineWidth,
    borderLeftWidth: theme.reallyThinLineWidth,
    borderRightWidth: theme.reallyThinLineWidth,
    paddingHorizontal: theme.rem(1),
    paddingVertical: theme.rem(0.6),
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerText: {
    flex: 1,
    fontFamily: theme.fontFaceBold,
    fontSize: theme.rem(0.9)
  },
  headerIcon: {
    alignSelf: 'flex-end'
  },
  info: {
    overflow: 'hidden',
    borderColor: theme.primaryText,
    borderBottomLeftRadius: theme.rem(0.25),
    borderBottomRightRadius: theme.rem(0.25),
    borderBottomWidth: theme.reallyThinLineWidth,
    borderLeftWidth: theme.reallyThinLineWidth,
    borderRightWidth: theme.reallyThinLineWidth,
    paddingHorizontal: theme.rem(1),
    paddingBottom: theme.rem(1)
  },
  text: {
    fontSize: theme.rem(0.8)
  },
  textMarginBottom: {
    marginBottom: theme.rem(0.5)
  },
  infoHiddenCopy: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1
  }
}))

export const AccountInfo = connect<StateProps, {}, OwnProps>(
  ({ create: { username, password, pin } }: RootState) => ({
    username: username || '',
    password: password || '',
    pin
  })
)(withTheme(AccountInfoComponent))
