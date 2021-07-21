import { ScrollView } from 'react-native'

import { useEffect, useRef } from '../util/hooks'

/**
 * This hook will return a ref, which you can attach to a scroll view.
 * When the `ready` parameter becomes true,
 * we will scroll that view to the bottom.
 */
export function useScrollToEnd(ready: boolean) {
  const ref = useRef<ScrollView | null>(null)
  useEffect(() => {
    if (ready && ref.current != null) ref.current.scrollToEnd()
  }, [ready])
  return ref
}
