import * as React from 'react'
import { View } from 'react-native'
import { cacheStyles } from 'react-native-patina'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'

import s from '../../common/locales/strings'
import { PasswordStatusState } from '../../reducers/PasswordStatusReducer'
import { RootState } from '../../types/ReduxTypes'
import { fixSides, mapSides, sidesToMargin } from '../../util/sides'
import { connect } from '../services/ReduxStore'
import { Theme, ThemeProps, withTheme } from '../services/ThemeContext'
import { EdgeText } from './EdgeText'
import { IconSignal } from './IconSignal'

interface OwnProps {
  marginRem?: number[] | number
}

interface StateProps {
  status: PasswordStatusState | null
}

type Props = OwnProps & StateProps & ThemeProps

const EnabledIcon = props => <FontAwesome {...props} name="check-circle" />
const DisabledIcon = props => <SimpleLineIcons {...props} name="info" />

const PasswordStatusComponent = ({ status, marginRem, theme }: Props) => {
  const styles = getStyles(theme)
  const spacings = sidesToMargin(mapSides(fixSides(marginRem, 0.5), theme.rem))

  if (status === null) return null

  const { list, passed } = status

  return (
    <View
      style={[styles.container, passed && styles.passedContainer, spacings]}
    >
      <View style={styles.top}>
        <IconSignal
          enabled={passed}
          enabledIcon={EnabledIcon}
          disabledIcon={DisabledIcon}
        />
        <EdgeText style={[styles.message, passed && styles.passed]}>
          {s.strings.password_requirements}
        </EdgeText>
      </View>
      {list.map(({ title, value }) => (
        <EdgeText
          key={title}
          style={[styles.case, value && styles.passed]}
        >{`\u2022 ${title}`}</EdgeText>
      ))}
    </View>
  )
}

const getStyles = cacheStyles((theme: Theme) => ({
  container: {
    borderWidth: 0.25,
    borderRadius: theme.rem(0.25),
    borderColor: theme.warningText,
    padding: theme.rem(1),
    justifyContent: 'flex-start'
  },
  containerPassed: {
    borderColor: theme.positiveText
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.rem(0.5)
  },
  message: {
    flexShrink: 1,
    color: theme.warningText,
    fontFamily: theme.fontFaceBold,
    fontSize: theme.rem(0.75),
    marginLeft: theme.rem(0.75)
  },
  case: {
    flexShrink: 1,
    color: theme.warningText,
    fontFamily: theme.fontFaceDefault,
    fontSize: theme.rem(0.75),
    marginBottom: theme.rem(0.15)
  },
  passed: {
    color: theme.positiveText
  },
  passedContainer: {
    borderColor: theme.positiveText
  }
}))

export const PasswordStatus = connect<StateProps, {}, OwnProps>(
  (state: RootState) => ({
    status: state.passwordStatus
  }),
  () => ({})
)(withTheme(PasswordStatusComponent))
