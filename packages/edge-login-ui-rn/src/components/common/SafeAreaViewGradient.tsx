import * as React from 'react'
import { SafeAreaView } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import * as Colors from '../../constants/Colors'

interface Props {
  style?: any
  children: any
}

const SafeAreaViewComponent = ({ style, children }: Props) => {
  return (
    <SafeAreaView style={[style, { flex: 1 }]}>
      {children}
      <LinearGradient
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: 50,
          zIndex: -1000
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={Colors.GRADIENT}
      />
    </SafeAreaView>
  )
}

export default SafeAreaViewComponent
