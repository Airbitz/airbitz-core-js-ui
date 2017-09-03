import React, { Component } from 'react'
import { connect } from 'react-redux'
import styles from './Header.webStyle.scss'
import { sprintf } from 'sprintf-js'
import t from 'lib/web/LocaleStrings'

class Header extends Component {
  _renderheader = (pathname) => {
    const name = window.parent.abcui.vendorName || window.abcui.vendorName
    switch (pathname) {
      case '/changepin':
        return 'Change your 4-digit PIN'
      case '/changepassword':
        return 'Change your password'
      case '/passwordrecovery':
        return 'Password Recovery Setup'
      default:
        return sprintf(t('fragment_setup_header_left'), name)
    }
  }
  render () {
    return (
      <div className={styles.container}>
        <p className={styles.text}>
          {this._renderheader(this.props.location.pathname)}
        </p>
      </div>
    )
  }
}

export default connect()(Header)
