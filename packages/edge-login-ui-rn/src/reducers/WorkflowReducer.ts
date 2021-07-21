import { WorkflowName, workflows } from '../constants/workflows'
import { Action } from '../types/ReduxTypes'

export interface WorkflowState {
  readonly currentKey: WorkflowName
  readonly currentSceneIndex: number
}

const initialState: WorkflowState = {
  currentKey: 'loadingWF',
  currentSceneIndex: 0
}

export function workflow(
  state: WorkflowState = initialState,
  action: Action
): WorkflowState {
  switch (action.type) {
    // Generic workflow actions:
    case 'WORKFLOW_BACK': {
      let { currentSceneIndex } = state
      if (currentSceneIndex > 0) {
        --currentSceneIndex
      }
      return { ...state, currentSceneIndex }
    }
    case 'WORKFLOW_NEXT': {
      let { currentSceneIndex } = state
      if (currentSceneIndex + 1 < workflows[state.currentKey].length) {
        ++currentSceneIndex
      }
      return { ...state, currentSceneIndex }
    }

    // Actions for launching screens:
    case 'OTP_ERROR':
      return { ...state, currentKey: 'otpWF', currentSceneIndex: 0 }
    case 'START_CHANGE_PASSWORD':
      return { ...state, currentKey: 'changePasswordWF', currentSceneIndex: 0 }
    case 'START_CHANGE_PIN':
      return { ...state, currentKey: 'changePinWF', currentSceneIndex: 0 }
    case 'START_CHANGE_RECOVERY':
      return { ...state, currentKey: 'changeRecoveryWF', currentSceneIndex: 0 }
    case 'START_CREATE_ACCOUNT':
      return { ...state, currentKey: 'createWF', currentSceneIndex: 0 }
    case 'START_LANDING':
      return { ...state, currentKey: 'landingWF', currentSceneIndex: 0 }
    case 'START_OTP_REPAIR':
      return { ...state, currentKey: 'otpRepairWF', currentSceneIndex: 0 }
    case 'START_PASSWORD_LOGIN':
      return { ...state, currentKey: 'passwordWF', currentSceneIndex: 0 }
    case 'START_PIN_LOGIN':
      return { ...state, currentKey: 'pinWF', currentSceneIndex: 0 }
    case 'START_RECOVERY_LOGIN':
      return { ...state, currentKey: 'recoveryLoginWF', currentSceneIndex: 0 }
    case 'START_RESECURE':
      return { ...state, currentKey: 'resecureWF', currentSceneIndex: 0 }
    case 'START_SECURITY_ALERT':
      return { ...state, currentKey: 'securityAlertWF', currentSceneIndex: 0 }

    case 'RESET_APP':
      return initialState
    default:
      return state
  }
}
