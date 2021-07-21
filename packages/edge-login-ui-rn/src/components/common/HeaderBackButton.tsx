import * as React from 'react'
import { Platform, Text, TouchableOpacity } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'

const isIos = Platform.OS === 'ios'

interface Props {
  testID?: string
  styles: { backButton: any; backIconStyle: any; sideText: any }
  label: string
  onPress: () => void
}
export class HeaderBackButton extends React.Component<Props> {
  render() {
    const withArrow = true
    const styles = this.props.styles
    return (
      <TouchableOpacity style={styles.backButton} onPress={this.props.onPress}>
        {withArrow && (
          <Entypo name="chevron-left" style={styles.backIconStyle} />
        )}
        {withArrow && !isIos ? null : (
          <Text testID={this.props.testID} style={styles.sideText}>
            {this.props.label}
          </Text>
        )}
      </TouchableOpacity>
    )
  }
}
