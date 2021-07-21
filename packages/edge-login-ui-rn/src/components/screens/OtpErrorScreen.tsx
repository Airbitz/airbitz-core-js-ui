import { OtpError } from 'edge-core-js'
import * as React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { sprintf } from 'sprintf-js'

import { login } from '../../actions/LoginAction'
import { hasReadyVoucher, requestOtpReset } from '../../actions/LoginOtpActions'
import s from '../../common/locales/strings'
import { Dispatch, RootState } from '../../types/ReduxTypes'
import { LoginAttempt } from '../../util/loginAttempt'
import { makePeriodicTask } from '../../util/periodicTask'
import { showResetModal } from '../modals/OtpResetModal'
import { showQrCodeModal } from '../modals/QrCodeModal'
import { TextInputModal } from '../modals/TextInputModal'
import { Airship, showError, showToast } from '../services/AirshipInstance'
import { connect } from '../services/ReduxStore'
import { DividerWithText } from '../themed/DividerWithText'
import { IconHeaderRow } from '../themed/IconHeaderRow'
import { LinkRow } from '../themed/LinkRow'
import { ThemedScene } from '../themed/ThemedScene'
import { MessageText, Warning } from '../themed/ThemedText'

interface OwnProps {}
interface StateProps {
  otpError: OtpError
  otpAttempt: LoginAttempt
  otpResetDate?: Date
}
interface DispatchProps {
  onBack: () => void
  handleQrModal: () => void
  hasReadyVoucher: (otpError: OtpError) => Promise<boolean>
  login: (otpAttempt: LoginAttempt, otpKey?: string) => Promise<void>
  requestOtpReset: () => Promise<void>
  saveOtpError: (otpAttempt: LoginAttempt, otpError: OtpError) => void
}
type Props = OwnProps & StateProps & DispatchProps

class OtpErrorScreenComponent extends React.Component<Props> {
  checkVoucher = makePeriodicTask(async () => {
    const {
      hasReadyVoucher,
      login,
      otpAttempt,
      otpError,
      saveOtpError
    } = this.props

    try {
      const result = await hasReadyVoucher(otpError)
      if (result) {
        showToast(s.strings.otp_screen_retrying)
        await login(otpAttempt)
      }
    } catch (error) {
      if (error != null && error.name === 'OtpError') {
        saveOtpError(otpAttempt, error)
      } else {
        showError(error)
      }
    }
  }, 5000)

  componentDidMount() {
    this.checkVoucher.start()
  }

  componentWillUnmount() {
    this.checkVoucher.stop()
  }

  handleBackupModal = () => {
    const { login, otpAttempt, saveOtpError } = this.props

    const handleSubmit = async (otpKey: string): Promise<boolean | string> => {
      try {
        this.checkVoucher.stop()
        await login(otpAttempt, otpKey)
        return true
      } catch (error) {
        // Restart the background checking if the login failed:
        this.checkVoucher.start()

        // Translate known errors:
        if (error != null && error.name === 'OtpError') {
          saveOtpError(otpAttempt, error)
          return s.strings.backup_key_incorrect
        }
        if (error != null && error.message === 'Unexpected end of data') {
          return s.strings.backup_key_incorrect
        }
        showError(error)
        return false
      }
    }

    Airship.show(bridge => (
      <TextInputModal
        bridge={bridge}
        onSubmit={handleSubmit}
        title={s.strings.otp_backup_code_modal_title}
        message={s.strings.otp_instructions}
        inputLabel={s.strings.backup_key_label}
        submitLabel={s.strings.submit}
        autoCapitalize="characters"
        returnKeyType="done"
      />
    ))
  }

  render() {
    const { handleQrModal, otpError, otpResetDate } = this.props
    const isIp = otpError.reason === 'ip'

    // Find the automatic login date:
    let date = otpResetDate
    if (otpError.voucherActivates != null) date = otpError.voucherActivates

    return (
      <ThemedScene
        showHeader
        onBack={this.props.onBack}
        subTitle=""
        title={isIp ? s.strings.otp_header_ip : s.strings.otp_header}
      >
        <IconHeaderRow
          renderIcon={theme => (
            <Warning>
              <FontAwesome name="exclamation-triangle" size={theme.rem(2.5)} />
            </Warning>
          )}
        >
          <MessageText>
            <Warning>
              {isIp
                ? s.strings.otp_screen_header_ip
                : s.strings.otp_screen_header_2fa}
            </Warning>
          </MessageText>
        </IconHeaderRow>
        <DividerWithText label={s.strings.to_fix} />
        <MessageText>{s.strings.otp_screen_approve}</MessageText>
        <DividerWithText />
        <LinkRow label={s.strings.otp_screen_qr} onPress={handleQrModal} />
        {isIp ? null : (
          <>
            <DividerWithText />
            <LinkRow
              label={s.strings.otp_backup_code_modal_title}
              onPress={this.handleBackupModal}
            />
          </>
        )}
        {date == null ? null : (
          <>
            <DividerWithText />
            <MessageText>
              {sprintf(s.strings.otp_screen_wait, date.toLocaleString())}
            </MessageText>
          </>
        )}
        {otpError.resetToken == null || date != null ? null : (
          <>
            <DividerWithText />
            <LinkRow
              label={s.strings.disable_otp_button_two}
              onPress={() => showResetModal(this.props.requestOtpReset)}
            />
          </>
        )}
      </ThemedScene>
    )
  }
}

export const OtpErrorScreen = connect<StateProps, DispatchProps, OwnProps>(
  (state: RootState) => {
    const { otpAttempt, otpError, otpResetDate } = state.login
    if (otpAttempt == null || otpError == null) {
      throw new Error('Missing OtpError for OTP error screen')
    }
    return { otpAttempt, otpError, otpResetDate }
  },
  (dispatch: Dispatch) => ({
    onBack() {
      dispatch({ type: 'START_PASSWORD_LOGIN' })
    },
    handleQrModal() {
      dispatch(showQrCodeModal())
    },
    async hasReadyVoucher(error: OtpError) {
      return await dispatch(hasReadyVoucher(error))
    },
    async login(attempt: LoginAttempt, otpKey?: string): Promise<void> {
      return await dispatch(login(attempt, otpKey))
    },
    async requestOtpReset() {
      return await dispatch(requestOtpReset())
    },
    saveOtpError(attempt, error) {
      dispatch({ type: 'OTP_ERROR', data: { attempt, error } })
    }
  })
)(OtpErrorScreenComponent)
