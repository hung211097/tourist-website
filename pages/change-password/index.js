import React from 'react'
import { LayoutProfile, AutoHide } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import ApiService from 'services/api.service'
import { moveToElementId } from '../../services/utils.service'
import { connect } from 'react-redux'
import { Router } from 'routes'
import { withNamespaces } from "react-i18next"

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

class ChangePassword extends React.Component {
    displayName = 'Change Password'
    static propTypes = {
        account: PropTypes.object,
        store: PropTypes.any,
        user: PropTypes.object,
        t: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.apiService = ApiService()
        this.state = {
            password: '',
            confirmPassword: '',
            newPassword: '',
            action: false,
            actionError: false,
            isSubmit: false,
            error: ''
        }
    }

    componentDidMount() {
      if(this.props.user && this.props.user.type !== 'local'){
        Router.pushRoute('home')
      }
    }

    handleChangePassword(event) {
        this.setState({
            password: event.target.value
        })
    }

    handleChangeConfirmPassword(event) {
        this.setState({
            confirmPassword: event.target.value
        })
    }

    handleChangeNewPassword(event) {
        this.setState({
            newPassword: event.target.value
        })
    }

    submitProfile() {
        this.setState({
            isSubmit: true
        })
        const validList = ['password', 'confirm', 'match', 'new']
        for (var i = validList.length - 1; i >= 0; i--) {
            if (!this.onValidated(validList[i], true)) {
                return moveToElementId(validList[i])
            }
        }
        let form = new FormData()
        form.append('old_password', this.state.password)
        form.append('new_password', this.state.newPassword)

        this.apiService.updatePassword({
          old_password: this.state.password,
          new_password: this.state.newPassword
        }).then(() => {
            this.setState({
                action: true,
                password: '',
                confirmPassword: '',
                newPassword: '',
                isSubmit: false
            })
        }).catch(e => {
          let error = 'There is a problem, please try again!'
          if(e.status === 400){
            error = 'Password is not correct!'
          }
          this.setState({
            error: error,
            actionError: true
          })
        })
        this.setState({ action: false, actionError: false })
    }

    onValidated = (name, force = false) => {
        if (!this.state.isSubmit && !force) {
            return true
        }

        if (name == 'password') {
            return !!this.state.password
        }

        if(name == 'confirm'){
            return !!this.state.confirmPassword
        }

        if (name == 'match') {
            return !(this.state.newPassword && this.state.confirmPassword && (this.state.confirmPassword !== this.state.newPassword))
        }

        if (name == 'new') {
            return !!this.state.newPassword
        }

        return false
    }

    render() {
        const {t} = this.props
        return (
            <LayoutProfile page="profile" tabName="change-password" {...this.props}>
                <style jsx>{styles}</style>
                <div className="profile-detail">
                  <div className="title">
                    <div className="text-center title-contain">
                      <h1 className="my-profile__title">{t('change_password.title')}</h1>
                    </div>
                    <div className="content">
                      <div className="profile-info row">
                        <div className="col-sm-6 offset-sm-3">
                          <div className="co-field">
                              <p>
                                  <strong>{t('change_password.password')}</strong>
                              </p>
                              <input
                                  type="password"
                                  className="co-text low"
                                  maxLength="20"
                                  value={this.state.password}
                                  onChange={this.handleChangePassword.bind(this)}
                              />
                            {!this.onValidated('password') && (
                                  <div className="notify-box">
                                      <p className="error">{t('change_password.password_required')}</p>
                                  </div>
                              )}
                          </div>
                          <div className="co-field">
                              <p>
                                  <strong>{t('change_password.new_pass')}</strong>
                              </p>
                              <input
                                  type="password"
                                  className="co-text low"
                                  maxLength="20"
                                  value={this.state.newPassword}
                                  onChange={this.handleChangeNewPassword.bind(this)}
                              />
                            {!this.onValidated('new') && (
                                  <div className="notify-box">
                                      <p className="error">{t('change_password.new_pass_required')}</p>
                                  </div>
                              )}
                          </div>
                          <div className="co-field">
                              <p>
                                  <strong>{t('change_password.confirm')}</strong>
                              </p>
                              <input
                                  type="password"
                                  className="co-text low"
                                  placeholder=""
                                  maxLength="20"
                                  value={this.state.confirmPassword}
                                  onChange={this.handleChangeConfirmPassword.bind(this)}
                              />
                            {!this.onValidated('confirm') && (
                              <div className="notify-box">
                                  <p className="error">{t('change_password.confirm_required')}</p>
                              </div>
                            )}
                            {!this.onValidated('match') && (
                              <div className="notify-box">
                                <p className="error">{t('change_password.not_match')}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="row w-100 text-center alert-zone">
                          {this.state.action == true && (
                            <AutoHide duration={10000}>
                              <div className="alert alert-custom" role="alert">
                                {t('change_password.success')}
                              </div>
                            </AutoHide>
                          )}
                          {this.state.actionError == true && this.state.error &&(
                            <AutoHide duration={10000}>
                              <div className="alert alert-danger" role="alert">
                                {t('change_password.' + this.state.error)}
                              </div>
                            </AutoHide>
                          )}
                        </div>
                        <div className="confirm-zone row">
                          <div className="text-center comfirm-order-control">
                              <a className="co-btn" onClick={this.submitProfile.bind(this)}>
                                {t('change_password.change')}
                              </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </LayoutProfile>
        )
    }
}

export default withNamespaces('translation')(connect(mapStateToProps)(ChangePassword))
