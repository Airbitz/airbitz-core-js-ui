import * as React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

interface Props {
  data: string
  style: {
    container: any
    text: any
    textComtainer: any
    iconButton: {
      container: any
      icon: any
      iconSize: number
    }
  }
  onClick: (string) => void
  onDelete: (string) => void
}

export class UserListItem extends React.Component<Props> {
  handleDelete = () => {
    this.props.onDelete(this.props.data)
  }

  handlePress = () => {
    this.props.onClick(this.props.data)
  }

  render() {
    return (
      <TouchableOpacity onPress={this.handlePress}>
        {this.renderInside()}
      </TouchableOpacity>
    )
  }

  renderInside() {
    const { style } = this.props
    if (this.props.onDelete) {
      return (
        <View style={style.container}>
          <View style={style.textComtainer}>
            <Text style={style.text}>{this.props.data}</Text>
          </View>
          <TouchableOpacity
            style={style.iconButton.container}
            onPress={this.handleDelete}
          >
            <MaterialIcon
              style={style.iconButton.icon}
              name="close"
              size={style.iconButton.iconSize}
            />
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={style.container}>
        <Text style={style.text}>{this.props.data}</Text>
      </View>
    )
  }
}
