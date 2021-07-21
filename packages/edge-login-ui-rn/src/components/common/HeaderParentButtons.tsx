import * as React from 'react'
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native'

import * as Assets from '../../assets/'
import s from '../../common/locales/strings'
import { Branding } from '../../types/Branding'
import { scale } from '../../util/scaling'

interface Props {
  branding: Branding
}

export class HeaderParentButtons extends React.Component<Props> {
  handlePress = () => {
    const { parentButton } = this.props.branding
    if (parentButton != null) parentButton.callback()
  }

  render() {
    const { parentButton, appId } = this.props.branding
    const openEdgeSite = () => Linking.openURL(s.strings.edge_site)
    return (
      <View style={styles.container}>
        {parentButton && parentButton.text && (
          <TouchableOpacity onPress={this.handlePress}>
            <View style={styles.leftButtonContainer}>
              <Text style={parentButton.style || styles.leftButtonText}>
                {parentButton.text}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.spacer} />
        {appId && (
          <TouchableOpacity onPress={openEdgeSite}>
            <View style={styles.rightButtonContainer}>
              <Text style={styles.rightButtonText}>powered by</Text>
              <Image
                source={Assets.LOGO_SMALL}
                resizeMode="contain"
                style={styles.image}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }
}

const styles = {
  container: {
    top: scale(30),
    marginLeft: scale(15),
    marginRight: scale(15),
    flexDirection: 'row'
  },
  leftButtonContainer: {
    justifyContent: 'center',
    alignContents: 'center',
    height: scale(32)
  },
  leftButtonText: {
    color: '#FFF',
    fontSize: 16
  },
  rightButtonContainer: {
    justifyContent: 'flex-end',
    alignContents: 'flex-end',
    height: scale(32)
  },
  rightButtonText: {
    color: '#FFF',
    fontSize: 10,
    textAlign: 'right'
  },
  spacer: {
    flex: 1
  },
  image: {
    width: scale(74),
    height: scale(20)
  }
} as const
