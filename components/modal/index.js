import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { PopupInfo, PopupLoading } from 'components'
import { useModal, saveRedirectUrl } from '../../actions'
import { Link, Router } from 'routes'
import { modal } from '../../constants'
import { withNamespaces } from "react-i18next"

const mapStateToProps = (state) => {
    return {
        modal: state.modal,
        user: state.user
    }
}

class Modal extends React.Component {
    displayName = 'Modal Item'

    static propTypes = {
        modal: PropTypes.any,
        dispatch: PropTypes.func.isRequired,
        user: PropTypes.any,
        t: PropTypes.func
    }

    constructor(props) {
        super(props)
    }


    handleClosePopup(isRedirect = false) {
      const { dispatch } = this.props
      dispatch(useModal({type: '', isOpen: false, data: ''}))
      if(isRedirect === true){
        dispatch(saveRedirectUrl(Router.asPath))
      }
    }

    render() {
      const {t} = this.props
        if(!this.props.modal)
          return null;
        return (
          <>
            <style jsx="true">{styles}</style>
            {this.props.modal.type === modal.EXPIRED ?
              <PopupInfo show={this.props.modal.isOpen} onClose={this.handleClosePopup.bind(this, true)}
                customContent={{width: '90%', maxWidth: '430px'}}>
                <div className="content">
                  <h2>{t('wrong_auth.oops')}!</h2>
                  <h4>
                    {t('wrong_auth.content')}
                  </h4>
                  <h3>{t('wrong_auth.again')}</h3>
                  <Link route="login">
                    <a className="co-btn" onClick={this.handleClosePopup.bind(this)}>{t('wrong_auth.login')}</a>
                  </Link>
                </div>
              </PopupInfo>
              : this.props.modal.type === modal.LOADING ?
              <PopupLoading show={this.props.modal.isOpen} onClose={this.handleClosePopup.bind(this)} />
              : null
            }
          </>
        )
    }
}

export default withNamespaces('translation')(connect(mapStateToProps)(Modal))
