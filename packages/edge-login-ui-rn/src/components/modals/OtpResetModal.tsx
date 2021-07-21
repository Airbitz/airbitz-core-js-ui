import * as React from 'react'

import s from '../../common/locales/strings'
import { Airship, showError } from '../services/AirshipInstance'
import { ButtonsModal } from './ButtonsModal'

export function showResetModal(requestOtpReset: () => Promise<void>): void {
  Airship.show(bridge => (
    <ButtonsModal
      title={s.strings.disable_otp_header}
      message={s.strings.disable_otp_modal_body}
      buttons={{
        ok: {
          label: s.strings.disable_otp_button,
          onPress: async () => await requestOtpReset().then(() => true)
        }
      }}
      closeArrow
      bridge={bridge}
    />
  )).catch(showError)
}
