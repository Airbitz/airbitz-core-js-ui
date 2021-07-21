import s from '../common/locales/strings'

export interface Scene {
  title: string
  subTitle: string
}

export interface Workflows {
  changePasswordWF: Scene[]
  changePinWF: Scene[]
  changeRecoveryWF: Scene[]
  createWF: Scene[]
  landingWF: Scene[]
  loadingWF: Scene[]
  otpWF: Scene[]
  otpRepairWF: Scene[]
  passwordWF: Scene[]
  pinWF: Scene[]
  recoveryLoginWF: Scene[]
  resecureWF: Scene[]
  securityAlertWF: Scene[]
}

export type WorkflowName = keyof Workflows

export const workflows: Workflows = {
  // ----------------------------------------------------------------
  // Settings screens
  // ----------------------------------------------------------------
  changePasswordWF: [
    {
      // PublicChangePasswordScreen
      title: s.strings.change_password,
      subTitle: ''
    }
  ],
  changePinWF: [
    {
      // PublicChangePinScreen
      title: s.strings.change_pin,
      subTitle: ''
    }
  ],
  changeRecoveryWF: [
    {
      // PublicChangeRecoveryScreen
      title: s.strings.recovery,
      subTitle: ''
    }
    // This next scene uses `FullScreenModal` instead of workflow:
    // {
    //   // ChangeRecoveryConfirmScreen
    //   title: s.strings.confirm_recovery_questions,
    //   subTitle: ''
    // }
  ],

  // ----------------------------------------------------------------
  // Creation screens
  // ----------------------------------------------------------------
  createWF: [
    {
      // NewAccountWelcomeScreen
      title: '',
      subTitle: ''
    },
    {
      // NewAccountUsernameScreen
      title: '',
      subTitle: ''
    },
    {
      // NewAccountPasswordScreen
      title: '',
      subTitle: ''
    },
    {
      // NewAccountPinScreen
      title: '',
      subTitle: ''
    },
    {
      // NewAccountWaitScreen
      title: '',
      subTitle: ''
    },
    {
      // NewAccountReviewScreen
      title: '',
      subTitle: ''
    },
    {
      // TermsAndConditionsScreen
      title: '',
      subTitle: ''
    }
  ],

  // ----------------------------------------------------------------
  // Miscellaneous
  // ----------------------------------------------------------------
  landingWF: [
    {
      // LandingScreen (no header)
      title: '',
      subTitle: ''
    }
  ],
  loadingWF: [
    {
      // LoadingScreen (no header)
      title: '',
      subTitle: ''
    }
  ],
  otpWF: [
    {
      // OtpErrorScreen
      title: s.strings.otp_header,
      subTitle: ''
    }
  ],
  otpRepairWF: [
    {
      // OtpRepairScreen
      title: s.strings.otp_header,
      subTitle: ''
    }
  ],

  // ----------------------------------------------------------------
  // Login methods
  // ----------------------------------------------------------------
  passwordWF: [
    {
      // PasswordLoginScreen
      title: s.strings.change_password,
      subTitle: ''
    }
  ],
  pinWF: [
    {
      // PinLoginScreen
      title: s.strings.change_pin,
      subTitle: ''
    }
  ],
  recoveryLoginWF: [
    {
      // RecoveryLoginScreen
      title: s.strings.recovery_questions_header,
      subTitle: ''
    }
  ],

  // ----------------------------------------------------------------
  // Security checkup
  // ----------------------------------------------------------------
  resecureWF: [
    {
      // ResecurePasswordScreen
      title: s.strings.change_password,
      subTitle: ''
    },
    {
      // ResecurePinScreen
      title: s.strings.change_pin,
      subTitle: ''
    }
  ],
  securityAlertWF: [
    {
      // SecurityAlertsScreen
      title: s.strings.alert_screen_title,
      subTitle: ''
    }
  ]
}
