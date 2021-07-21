import * as React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface Props {
  testID?: string
  icon: React.ReactNode
  style: {
    container: any
    centeredContent: any
    inner: any
    textContainer: any
    iconContainer: any
    text: any
  }
  onPress: () => void
  title: string
  numberOfLines?: number
}

interface State {
  pressed: boolean
}

export class TextAndIconButton extends React.Component<Props, State> {
  numberOfLines: number
  constructor(props: Props) {
    super(props)
    this.numberOfLines = this.props.numberOfLines || 1
  }

  render() {
    const {
      container,
      centeredContent,
      inner,
      textContainer,
      iconContainer,
      text
    } = this.props.style
    return (
      <TouchableOpacity
        testID={this.props.testID}
        style={container}
        onPress={this.props.onPress}
      >
        <View style={centeredContent}>
          <View style={inner}>
            <View style={textContainer}>
              <Text
                style={text}
                ellipsizeMode="middle"
                numberOfLines={this.numberOfLines}
              >
                {this.props.title + ' '}
              </Text>
            </View>
            <View style={iconContainer}>{this.props.icon}</View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
