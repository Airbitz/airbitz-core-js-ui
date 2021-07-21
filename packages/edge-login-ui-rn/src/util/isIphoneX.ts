import { Dimensions, Platform } from 'react-native'

const phones: Array<{ width: number; height: number }> = [
  // X:
  { width: 375, height: 812 },
  // XS Max:
  { width: 414, height: 896 },
  // 12:
  { width: 390, height: 844 },
  // 12 Max:
  { width: 428, height: 926 },
  // 12 Mini:
  { width: 360, height: 780 }
]

export let isIphoneX = false

if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
  const { height, width } = Dimensions.get('window')
  for (const phone of phones) {
    if (
      (phone.width === width && phone.height === height) ||
      (phone.height === width && phone.width === height)
    ) {
      isIphoneX = true
      break
    }
  }
}
