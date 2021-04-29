export function logEvent(event: string) {
  // @ts-expect-error
  const { firebase } = global
  if (firebase != null) firebase.analytics().logEvent(event)
}
