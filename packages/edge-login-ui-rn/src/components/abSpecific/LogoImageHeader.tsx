import * as React from 'react'
import { Image, TouchableWithoutFeedback, View } from 'react-native'

import * as Assets from '../../assets/'
import { Branding } from '../../types/Branding'
import { scale } from '../../util/scaling'

interface Props {
  branding: Branding
}

interface State {
  taps: number
}

export class LogoImageHeader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      taps: 0
    }
  }

  handlePress = () => {
    const callback = this.props.branding.primaryLogoCallback
    if (callback != null) {
      const taps = this.state.taps + 1
      this.setState({ taps })
      if (taps > 4) {
        callback()
        this.setState({ taps: 0 })
      }
      if (taps === 1) {
        setTimeout(() => this.setState({ taps: 0 }), 2000)
      }
    }
  }

  render() {
    const src = this.props.branding.primaryLogo || Assets.LOGO_BIG
    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <View style={styles.container}>
          <Image source={src} style={styles.image} resizeMode="contain" />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    paddingBottom: scale(24),
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  image: {
    position: 'relative',
    height: scale(44),
    overflow: 'visible',
    resizeMode: 'contain'
  }
} as const
