import * as React from 'react'
import { ActivityIndicator, Text, View } from 'react-native'

import * as Colors from '../../constants/Colors'
import { scale } from '../../util/scaling'

interface Props {
  error: string | null
  pin: string
  spinner: boolean
}

export class FourDigit extends React.PureComponent<Props> {
  render() {
    const { error, spinner } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.interactiveContainer}>
          {spinner ? (
            <ActivityIndicator color={Colors.ACCENT_MINT} size="large" />
          ) : (
            this.renderDotContainer()
          )}
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText} numberOfLines={2}>
            {error}
          </Text>
        </View>
      </View>
    )
  }

  renderDotContainer() {
    const { pin } = this.props
    return (
      <View style={styles.dotContainer}>
        <View style={[styles.circle, pin.length > 0 && styles.circleSected]} />
        <View style={[styles.circle, pin.length > 1 && styles.circleSected]} />
        <View style={[styles.circle, pin.length > 2 && styles.circleSected]} />
        <View style={[styles.circle, pin.length > 3 && styles.circleSected]} />
      </View>
    )
  }
}

const styles = {
  // used for logging *back in* with PIN
  container: {
    paddingTop: 12,
    width: '100%',
    height: scale(86)
  },
  errorContainer: {
    height: scale(40),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  errorText: {
    color: Colors.ACCENT_RED,
    backgroundColor: Colors.TRANSPARENT,
    textAlign: 'center',
    fontSize: scale(12)
  },
  interactiveContainer: {
    height: scale(40),
    width: '100%',
    alignItems: 'center'
  },
  dotContainer: {
    height: '100%',
    width: scale(190),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  circle: {
    borderWidth: 2,
    borderColor: Colors.WHITE,
    borderRadius: scale(15),
    height: scale(30),
    width: scale(30)
  },
  circleSected: {
    backgroundColor: Colors.ACCENT_MINT,
    borderWidth: scale(2),
    borderColor: Colors.WHITE,
    borderRadius: scale(15),
    height: scale(30),
    width: scale(30)
  }
} as const
