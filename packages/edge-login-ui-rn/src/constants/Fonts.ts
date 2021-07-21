export let FONTS = {
  defaultButtonTextSize: 16,
  defaultFontSize: 12,
  fontFamilyRegular: 'System',
  fontFamilyBlack: 'System'
}

export function updateFontStyles(fontFamily: string = 'System') {
  FONTS = {
    ...FONTS,
    fontFamilyRegular: fontFamily
  }
}
