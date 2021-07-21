import * as React from 'react'
import { Text } from 'react-native'

import { scale } from '../../util/scaling'

interface Props {
  fontSize?: number
  style: any
  children: any
}

export default class FormattedText extends React.Component<Props> {
  render() {
    const fontSize = this.props.fontSize
      ? scale(this.props.fontSize)
      : scale(14)
    return (
      <Text
        {...this.props}
        style={[this.props.style, { fontSize }]}
        allowFontScaling={false}
      >
        {this.props.children}
      </Text>
    )
  }
}
