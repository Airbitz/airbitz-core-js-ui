import { Action } from '../types/ReduxTypes'

export interface LoginUserInfo {
  username: string
  pinEnabled: boolean
  touchEnabled: boolean
}

export interface PreviousUsersState {
  readonly loaded: boolean
  readonly startupUser?: LoginUserInfo
  readonly userList: LoginUserInfo[]
  readonly usernameOnlyList: string[]
}

const initialState: PreviousUsersState = {
  userList: [],
  usernameOnlyList: [],
  loaded: false
}

export function previousUsers(
  state: PreviousUsersState = initialState,
  action: Action
): PreviousUsersState {
  return action.type === 'SET_PREVIOUS_USERS' ? action.data : state
}
