import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { PopupInfo, PopupLoading } from 'components'
import { useModal, saveRedirectUrl } from '../../actions'
import { Link, Router } from 'routes'
import { modal } from '../../constants'

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
        user: PropTypes.any
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
        if(!this.props.modal)
          return null;
        return (
          <>
            <style jsx="true">{styles}</style>
            {this.props.modal.type === modal.EXPIRED ?
              <PopupInfo show={this.props.modal.isOpen} onClose={this.handleClosePopup.bind(this, true)}
                customContent={{width: '90%', maxWidth: '430px'}}>
                <div className="content">
                  <h2>Oops!</h2>
                  <h4>
                    Your logging version is expired or something wrong happen with your account.
                  </h4>
                  <h3>Please login again!</h3>
                  <Link route="login">
                    <a className="co-btn" onClick={this.handleClosePopup.bind(this)}>LOGIN</a>
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

export default connect(mapStateToProps)(Modal)
