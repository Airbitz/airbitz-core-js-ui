import * as Constants from '../constants/index'
import { scale } from '../util/scaling'

// Login Screen
const LOGIN_LABEL_WIDTH = '70%'
const LOGIN_LABEL_HEIGHT = 60

export const MaterialInputOnWhite = {
  container: {
    position: 'relative',
    width: LOGIN_LABEL_WIDTH,
    height: LOGIN_LABEL_HEIGHT
  },
  baseColor: Constants.PRIMARY,
  tintColor: Constants.SECONDARY,
  errorColor: Constants.ACCENT_RED,
  textColor: Constants.BLACK,
  affixTextStyle: {
    color: Constants.ACCENT_RED,
    fontFamily: Constants.FONTS.fontFamilyRegular
  },
  titleTextStyle: {
    color: Constants.PRIMARY,
    fontFamily: Constants.FONTS.fontFamilyRegular
  }
}

export const MaterialInputOnWhiteScaled = {
  container: {
    position: 'relative',
    width: LOGIN_LABEL_WIDTH,
    height: scale(LOGIN_LABEL_HEIGHT),
    marginTop: scale(15)
  },
  baseColor: Constants.PRIMARY,
  tintColor: Constants.SECONDARY,
  errorColor: Constants.ACCENT_RED,
  textColor: Constants.BLACK,
  affixTextStyle: {
    color: Constants.ACCENT_RED,
    fontFamily: Constants.FONTS.fontFamilyRegular
  },
  titleTextStyle: {
    color: Constants.PRIMARY,
    fontFamily: Constants.FONTS.fontFamilyRegular
  }
}
