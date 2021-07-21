export function logEvent(event: string) {
  const { firebase } = global
  if (firebase != null) firebase.analytics().logEvent(event)
}
