import { EdgeRecoveryQuestionChoice } from 'edge-core-js'

import { Action } from '../types/ReduxTypes'

export interface PasswordRecoveryState {
  readonly questionsList: EdgeRecoveryQuestionChoice[] // For changing settings
  readonly recoveryKey?: string // For login
  readonly userQuestions: string[] // For login & changing settings
}

const initialState: PasswordRecoveryState = {
  questionsList: [],
  userQuestions: []
}

export function passwordRecovery(
  state: PasswordRecoveryState = initialState,
  action: Action
): PasswordRecoveryState {
  switch (action.type) {
    case 'START_CHANGE_RECOVERY':
      return {
        ...state,
        questionsList: action.data.questionsList,
        userQuestions: action.data.userQuestions
      }
    case 'START_RECOVERY_LOGIN':
      return {
        ...state,
        recoveryKey: action.data.recoveryKey,
        userQuestions: action.data.userQuestions
      }
    default:
      return state
  }
}
