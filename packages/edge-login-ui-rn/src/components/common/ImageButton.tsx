// = @flow
import * as React from 'react'
import { Image, TouchableWithoutFeedback, View } from 'react-native'

interface Props {
  style: { container: any; image: any }
  source: any
  onPress: () => void
  disabled?: boolean
}
export class ImageButton extends React.Component<Props> {
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
        disabled={this.props.disabled}
      >
        <View style={this.props.style.container}>
          <Image source={this.props.source} style={this.props.style.image} />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
