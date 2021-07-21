import * as React from 'react'
import { ScrollView, View } from 'react-native'
import { cacheStyles } from 'react-native-patina'

import s from '../../../common/locales/strings'
import { useScrollToEnd } from '../../../hooks/useScrollToEnd'
import { Dispatch, RootState } from '../../../types/ReduxTypes'
import { logEvent } from '../../../util/analytics'
import { connect } from '../../services/ReduxStore'
import { Theme, ThemeProps, withTheme } from '../../services/ThemeContext'
import { BackButton } from '../../themed/BackButton'
import { DigitInput, MAX_PIN_LENGTH } from '../../themed/DigitInput'
import { EdgeText } from '../../themed/EdgeText'
import { Fade } from '../../themed/Fade'
import { SimpleSceneHeader } from '../../themed/SimpleSceneHeader'
import { SecondaryButton } from '../../themed/ThemedButtons'
import { ThemedScene } from '../../themed/ThemedScene'

interface OwnProps {}

interface StateProps {
  pin: string
  pinErrorMessage: string | null
}

interface DispatchProps {
  onDone: () => void
  onBack: () => void
}

type Props = OwnProps & StateProps & DispatchProps & ThemeProps

const NewAccountPinScreenComponent = ({
  pinErrorMessage,
  pin,
  onBack,
  onDone,
  theme
}: Props) => {
  const styles = getStyles(theme)

  const showNext = pin.length === MAX_PIN_LENGTH && !pinErrorMessage
  const scrollViewRef = useScrollToEnd(showNext)

  const handleNext = () => {
    // validation.
    // is there no error message,
    if (pin.length !== MAX_PIN_LENGTH || pinErrorMessage) {
      logEvent(`Signup_PIN_Invalid`)
      return
    }

    onDone()
  }

  return (
    <ThemedScene paddingRem={[0.5, 0, 0.5, 0.5]}>
      <BackButton onPress={onBack} marginRem={[0, 0, 1, -0.5]} />
      <SimpleSceneHeader>{s.strings.create_your_account}</SimpleSceneHeader>
      <ScrollView ref={scrollViewRef} style={styles.content}>
        <EdgeText
          style={styles.subtitle}
        >{`${s.strings.step_three}: ${s.strings.set_four_digit_pin}`}</EdgeText>
        <EdgeText style={styles.description} numberOfLines={2}>
          {s.strings.pin_desc}
        </EdgeText>
        <DigitInput />
        <View style={styles.actions}>
          <Fade visible={showNext}>
            <SecondaryButton
              label={s.strings.next_label}
              onPress={handleNext}
            />
          </Fade>
        </View>
      </ScrollView>
    </ThemedScene>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  content: {
    flex: 1,
    marginLeft: theme.rem(0.5),
    marginRight: theme.rem(1)
  },
  subtitle: {
    fontFamily: theme.fontFaceBold,
    color: theme.secondaryText,
    fontSize: theme.rem(1),
    marginBottom: theme.rem(2.25)
  },
  description: {
    fontFamily: theme.fontFaceDefault,
    fontSize: theme.rem(0.875),
    marginBottom: theme.rem(3.25)
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.rem(5),
    minHeight: theme.rem(3 + 15) // 15 is a hack to avoid the keyboard
  }
}))

export const NewAccountPinScreen = connect<StateProps, DispatchProps, OwnProps>(
  (state: RootState) => ({
    pin: state.create.pin,
    pinErrorMessage: state.create.pinErrorMessage
  }),
  (dispatch: Dispatch) => ({
    onDone() {
      dispatch({ type: 'WORKFLOW_NEXT' })
    },
    onBack() {
      dispatch({ type: 'WORKFLOW_BACK' })
    }
  })
)(withTheme(NewAccountPinScreenComponent))
