export interface PeriodicTask {
  start: () => void
  stop: () => void

  // True once start is called, false after stop is called:
  readonly started: boolean
}

/**
 * Schedule a repeating task, with the specified gap between runs.
 */
export function makePeriodicTask(
  task: () => Promise<void> | undefined,
  msGap: number,
  opts: {
    onError?: (error: unknown) => void
  } = {}
): PeriodicTask {
  const { onError = (e: unknown) => {} } = opts

  // A started task will keep bouncing between running & waiting.
  // The `running` flag will be true in the running state,
  // and `timeout` will have a value in the waiting state.
  let running = false
  let timeout: ReturnType<typeof setTimeout> | undefined

  function run(): void {
    timeout = undefined
    if (!out.started) return
    running = true
    new Promise(resolve => resolve(task())).catch(onError).then(wait, wait)
  }

  function wait(): void {
    running = false
    if (!out.started) return
    timeout = setTimeout(run, msGap)
  }

  const out = {
    started: false,

    start(): void {
      out.started = true
      if (!running && timeout == null) run()
    },

    stop(): void {
      out.started = false
      if (timeout != null) {
        clearTimeout(timeout)
        timeout = undefined
      }
    }
  }
  return out
}
