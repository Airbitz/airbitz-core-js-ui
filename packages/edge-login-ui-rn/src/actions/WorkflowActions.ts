import { Airship } from '../components/services/AirshipInstance'
import { Dispatch, GetState, Imports } from '../types/ReduxTypes'

export const onComplete = () => (
  dispatch: Dispatch,
  getState: GetState,
  imports: Imports
) => {
  Airship.clear()
  imports.onComplete()
}
