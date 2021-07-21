import * as React from 'react'

import { PrimaryButton, SecondaryButton } from './ThemedButtons'

export type PromiseButtonType = 'primary' | 'secondary'

interface Props<T> {
  type?: PromiseButtonType
  label: string

  // The button will show a spinner as long as this is pending.
  // It will not be possible to press the button again while this is the case.
  onPress: () => Promise<T>
  onResolve?: (result: T) => void
  onReject?: (error: unknown) => void
}
interface State {
  spinning: boolean
}

export class PromiseButton<T> extends React.Component<Props<T>, State> {
  constructor(props: Props<T>) {
    super(props)
    this.state = { spinning: false }
  }

  handlePress = () => {
    const { onPress, onResolve, onReject } = this.props

    this.setState({ spinning: true })
    onPress().then(
      result => {
        this.setState({ spinning: false })
        if (onResolve != null) onResolve(result)
      },
      error => {
        this.setState({ spinning: false })
        if (onReject != null) onReject(error)
      }
    )
  }

  render() {
    const { label, type = 'primary' } = this.props
    const { spinning } = this.state

    switch (type) {
      case 'primary':
        return spinning ? (
          <PrimaryButton marginRem={0.5} spinner />
        ) : (
          <PrimaryButton
            label={label}
            onPress={this.handlePress}
            marginRem={0.5}
          />
        )
      case 'secondary':
        return spinning ? (
          <SecondaryButton marginRem={0.5} spinner />
        ) : (
          <SecondaryButton
            label={label}
            onPress={this.handlePress}
            marginRem={0.5}
          />
        )
      default:
        return null
    }
  }
}
