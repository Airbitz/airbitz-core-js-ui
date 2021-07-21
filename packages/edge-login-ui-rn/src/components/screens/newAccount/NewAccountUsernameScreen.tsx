import * as React from 'react'
import { View } from 'react-native'
import { cacheStyles } from 'react-native-patina'
import { sprintf } from 'sprintf-js'

import {
  checkUsernameForAvailabilty,
  validateUsername
} from '../../../actions/CreateAccountActions'
import s from '../../../common/locales/strings'
import { Branding } from '../../../types/Branding'
import { Dispatch, RootState } from '../../../types/ReduxTypes'
import { connect } from '../../services/ReduxStore'
import { Theme, ThemeProps, withTheme } from '../../services/ThemeContext'
import { BackButton } from '../../themed/BackButton'
import { EdgeText } from '../../themed/EdgeText'
import { EdgeTextFieldOutlined } from '../../themed/EdgeTextFieldOutlined'
import { FormError } from '../../themed/FormError'
import { PromiseButton } from '../../themed/PromiseButton'
import { SimpleSceneHeader } from '../../themed/SimpleSceneHeader'
import { ThemedScene } from '../../themed/ThemedScene'

interface OwnProps {
  branding: Branding
}
interface StateProps {
  username: string
  usernameErrorMessage: string | null
}
interface DispatchProps {
  checkUsernameForAvailabilty: (string) => Promise<void>
  validateUsername: (username: string) => void
  onBack: () => void
}
type Props = OwnProps & StateProps & DispatchProps & ThemeProps

const NewAccountUsernameScreenComponent = ({
  theme,
  onBack,
  branding,
  username,
  usernameErrorMessage,
  checkUsernameForAvailabilty,
  validateUsername
}: Props) => {
  const styles = getStyles(theme)

  const handleNext = async () => {
    if (usernameErrorMessage || !username) {
      return
    }
    await checkUsernameForAvailabilty(username)
  }

  return (
    <ThemedScene paddingRem={[0.5, 0, 0.5, 0.5]}>
      <BackButton onPress={onBack} marginRem={[0, 0, 1, -0.5]} />
      <SimpleSceneHeader>{s.strings.create_your_account}</SimpleSceneHeader>
      <View style={styles.content}>
        <EdgeText
          style={styles.subtitle}
        >{`${s.strings.step_one}: ${s.strings.choose_title_username}`}</EdgeText>
        <EdgeText style={styles.description} numberOfLines={2}>
          {sprintf(
            s.strings.username_desc,
            branding.appName || s.strings.app_name_default
          )}
        </EdgeText>
        <EdgeTextFieldOutlined
          autoCorrect={false}
          autoFocus
          label={s.strings.username}
          onChangeText={validateUsername}
          onSubmitEditing={handleNext}
          placeholder={s.strings.choose_username_input_placeholder}
          returnKeyType="go"
          value={username}
          isClearable
          showSearchIcon={false}
          marginRem={[0, 0.75]}
        />
        <FormError
          marginRem={[1, 0.75]}
          invisible={usernameErrorMessage == null}
        >
          {usernameErrorMessage}
        </FormError>
        <View style={styles.actions}>
          <PromiseButton
            label={s.strings.next_label}
            onPress={handleNext}
            type="secondary"
          />
        </View>
      </View>
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
    marginTop: theme.rem(0)
  }
}))

export const NewAccountUsernameScreen = connect<
  StateProps,
  DispatchProps,
  OwnProps
>(
  (state: RootState) => ({
    username: state.create.username || '',
    usernameErrorMessage: state.create.usernameErrorMessage
  }),
  (dispatch: Dispatch) => ({
    onBack() {
      dispatch({ type: 'WORKFLOW_BACK' })
    },
    async checkUsernameForAvailabilty(data: string) {
      return await dispatch(checkUsernameForAvailabilty(data))
    },
    validateUsername(username: string): void {
      dispatch(validateUsername(username))
    }
  })
)(withTheme(NewAccountUsernameScreenComponent))
