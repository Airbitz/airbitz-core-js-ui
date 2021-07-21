import * as React from 'react'
import { Alert, Linking, ScrollView, View } from 'react-native'
import { cacheStyles } from 'react-native-patina'
import { sprintf } from 'sprintf-js'

import {
  createUser,
  CreateUserData
} from '../../../actions/CreateAccountActions'
import s from '../../../common/locales/strings'
import { useScrollToEnd } from '../../../hooks/useScrollToEnd'
import { Branding } from '../../../types/Branding'
import { Dispatch, RootState } from '../../../types/ReduxTypes'
import { logEvent } from '../../../util/analytics'
import { connect } from '../../services/ReduxStore'
import { Theme, ThemeProps, withTheme } from '../../services/ThemeContext'
import { BackButton } from '../../themed/BackButton'
import { Checkbox } from '../../themed/Checkbox'
import { EdgeText } from '../../themed/EdgeText'
import { Fade } from '../../themed/Fade'
import { SimpleSceneHeader } from '../../themed/SimpleSceneHeader'
import { SecondaryButton } from '../../themed/ThemedButtons'
import { ThemedScene } from '../../themed/ThemedScene'

interface OwnProps {
  branding: Branding
}

interface StateProps {
  createErrorMessage: string | null
  password: string
  pin: string
  username: string
}

interface DispatchProps {
  agreeToConditionAndCreateUser: (data: CreateUserData) => void
  clearCreateErrorMessagecircleFilled: () => void
  onBack: () => void
}

type Props = OwnProps & StateProps & DispatchProps & ThemeProps

const TermsAndConditionsScreenComponent = ({
  branding,
  agreeToConditionAndCreateUser,
  createErrorMessage,
  clearCreateErrorMessagecircleFilled,
  onBack,
  password,
  pin,
  username,
  theme
}: Props) => {
  const styles = getStyles(theme)
  const [termValues, setTermValues] = React.useState<boolean[]>([
    false,
    false,
    false,
    false
  ])
  const showNext = !termValues.includes(false)
  const scrollViewRef = useScrollToEnd(showNext)

  if (createErrorMessage) {
    Alert.alert(
      s.strings.create_account_error_title,
      s.strings.create_account_error_message + '\n' + createErrorMessage,
      [{ text: s.strings.ok }]
    )
    clearCreateErrorMessagecircleFilled()
  }

  const { appName = s.strings.app_name_default } = branding
  const terms: string[] = [
    sprintf(s.strings.terms_one, appName),
    s.strings.terms_two,
    sprintf(s.strings.terms_three, appName),
    sprintf(s.strings.terms_four, appName)
  ]

  const handleStatusChange = (index: number, value: boolean) => {
    const newTermValues = [...termValues]
    newTermValues[index] = value
    setTermValues(newTermValues)
  }

  const handleNextPress = () => {
    logEvent(`Signup_Terms_Agree_and_Create_User`)
    agreeToConditionAndCreateUser({
      username,
      password,
      pin
    })
  }

  return (
    <ThemedScene paddingRem={[0.5, 0, 0.5, 0.5]}>
      <BackButton onPress={onBack} marginRem={[0, 0, 1, -0.5]} />
      <SimpleSceneHeader>{s.strings.account_confirmation}</SimpleSceneHeader>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.content}>
        <EdgeText
          style={styles.subtitle}
        >{`${s.strings.review}: ${s.strings.read_understod_2}`}</EdgeText>
        <View style={styles.terms}>
          {terms.map((term, index) => (
            <Checkbox
              key={index}
              textStyle={styles.term}
              value={termValues[index]}
              onChange={(value: boolean) => handleStatusChange(index, value)}
              marginRem={[0, 0, 1.33, 0]}
            >
              {term}
            </Checkbox>
          ))}
        </View>
        <EdgeText
          style={styles.agreeText}
          numberOfLines={2}
          onPress={() => Linking.openURL('https://edge.app/terms-of-service/')}
        >
          {s.strings.read_understod_1}
          <EdgeText style={styles.agreeTextLink}>
            {s.strings.read_understod_2}
          </EdgeText>
        </EdgeText>
        <View style={styles.actions}>
          <Fade visible={showNext}>
            <SecondaryButton
              label={s.strings.next_label}
              onPress={handleNextPress}
              paddingRem={0.7}
            />
          </Fade>
        </View>
      </ScrollView>
    </ThemedScene>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  content: {
    marginLeft: theme.rem(0.5),
    marginRight: theme.rem(1)
  },
  subtitle: {
    fontFamily: theme.fontFaceBold,
    color: theme.secondaryText,
    fontSize: theme.rem(1),
    marginBottom: theme.rem(2)
  },
  terms: {},
  term: {
    fontSize: theme.rem(0.875)
  },
  agreeText: {
    width: '60%',
    alignSelf: 'center',
    marginTop: theme.rem(1),
    marginHorizontal: theme.rem(2),
    fontSize: theme.rem(0.875)
  },
  agreeTextLink: {
    fontSize: theme.rem(0.875),
    color: theme.linkText
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.rem(2.75),
    minHeight: theme.rem(3)
  }
}))

export const TermsAndConditionsScreen = connect<
  StateProps,
  DispatchProps,
  OwnProps
>(
  (state: RootState) => ({
    createErrorMessage: state.create.createErrorMessage,
    password: state.create.password || '',
    pin: state.create.pin,
    username: state.create.username || ''
  }),
  (dispatch: Dispatch) => ({
    agreeToConditionAndCreateUser(data: CreateUserData) {
      dispatch(createUser(data))
    },
    clearCreateErrorMessagecircleFilled() {
      dispatch({ type: 'CLEAR_CREATE_ERROR_MESSAGE' })
    },
    onBack() {
      dispatch({ type: 'WORKFLOW_BACK' })
    }
  })
)(withTheme(TermsAndConditionsScreenComponent))
