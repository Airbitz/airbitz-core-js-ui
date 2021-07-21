import { EdgeAccount, OtpError } from 'edge-core-js'
import * as React from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { sprintf } from 'sprintf-js'

import { onComplete } from '../../../actions/WorkflowActions'
import s from '../../../common/locales/strings'
import { Dispatch, RootState } from '../../../types/ReduxTypes'
import { showResetModal } from '../../modals/OtpResetModal'
import { showQrCodeModal } from '../../modals/QrCodeModal'
import { TextInputModal } from '../../modals/TextInputModal'
import { Airship, showError } from '../../services/AirshipInstance'
import { connect } from '../../services/ReduxStore'
import { DividerWithText } from '../../themed/DividerWithText'
import { IconHeaderRow } from '../../themed/IconHeaderRow'
import { LinkRow } from '../../themed/LinkRow'
import { ThemedScene } from '../../themed/ThemedScene'
import { MessageText, Warning } from '../../themed/ThemedText'

interface OwnProps {}
interface StateProps {
  account: EdgeAccount
  otpError: OtpError
  otpResetDate?: Date
}
interface DispatchProps {
  onBack: () => void
  handleQrModal: () => void
  requestOtpReset: () => Promise<void>
  saveOtpError: (account: EdgeAccount, otpError: OtpError) => void
}
type Props = OwnProps & StateProps & DispatchProps

class OtpRepairScreenComponent extends React.Component<Props> {
  handleBackupModal = () => {
    const { account, onBack, saveOtpError } = this.props

    const handleSubmit = async (otpKey: string): Promise<boolean | string> => {
      try {
        if (account.repairOtp == null) {
          throw new Error('Wrong edge-core-js version')
        }
        await account.repairOtp(otpKey)
        onBack()
        return true
      } catch (error) {
        // Translate known errors:
        if (error != null && error.name === 'OtpError') {
          saveOtpError(account, error)
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
        title={s.strings.otp_header_repair}
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
                ? s.strings.otp_repair_header_ip
                : s.strings.otp_repair_header_2fa}
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

export const OtpRepairScreen = connect<StateProps, DispatchProps, OwnProps>(
  (state: RootState) => {
    const { account } = state
    const { otpError, otpResetDate } = state.login
    if (account == null || otpError == null) {
      throw new Error('Missing OtpError for OTP repair screen')
    }
    return { account, otpError, otpResetDate }
  },
  (dispatch: Dispatch) => ({
    onBack() {
      dispatch(onComplete())
    },
    handleQrModal() {
      dispatch(showQrCodeModal())
    },
    async requestOtpReset() {
      return await dispatch(this.requestOtpReset())
    },
    saveOtpError(account, error) {
      dispatch({ type: 'START_OTP_REPAIR', data: { account, error } })
    }
  })
)(OtpRepairScreenComponent)
