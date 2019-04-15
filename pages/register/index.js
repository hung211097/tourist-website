import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, PopupInfo } from 'components'
import { Link, Router } from 'routes'
import { connect } from 'react-redux'
import { FaFacebookF, FaCheck } from "react-icons/fa"
import validateEmail from '../../services/validates/email.js'
import validatePhone from '../../services/validates/phone.js'
import { validateStringWithoutNumber } from '../../services/validates'
import ApiService from '../../services/api.service'
import { authLogin } from 'actions'
import { checkAfterLogin } from '../../services/auth.service'
import { withNamespaces } from "react-i18next"
import ReCAPTCHA from "react-google-recaptcha"
const site_key = process.env.KEY_GOOGLE_RECAPTCHA

const mapStateToProps = state => {
  return {
    user: state.user,
    link_redirect: state.link_redirect,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    authLogin: (data) => {dispatch(authLogin(data))}
  }
}

class Register extends React.Component {
  displayName = 'Register Page'

  static propTypes = {
    authLogin: PropTypes.func,
    user: PropTypes.object,
    link_redirect: PropTypes.string,
    t: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.captcha = React.createRef()
    this.state = {
      isSubmit: false,
      phone: '',
      password: '',
      fullname: '',
      confirmPassword: '',
      email: '',
      showPopup: false,
      error: '',
      loading: false,
      isCaptcha: false
    }
  }

  componentDidMount() {
    checkAfterLogin(this.props.link_redirect)
  }

  componentWillUnmount(){
    this.timeout && clearTimeout(this.timeout)
  }

  handleLoginFB(e){
    e.preventDefault()
    const href = `/auth/facebook?next=${Router.asPath}`
    const as = href
    Router.push(href, as, { shallow: true })
  }

  handleChangePhone(e){
    this.setState({
      phone: e.target.value
    })
  }

  handleChangePassword(e){
    this.setState({
      password: e.target.value
    })
  }

  handleChangeFullname(e){
    this.setState({
      fullname: e.target.value
    })
  }

  handleChangeConfirmPassword(e){
    this.setState({
      confirmPassword: e.target.value
    })
  }

  handleChangeEmail(e){
    this.setState({
      email: e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault()
    this.setState({
      isSubmit: true
    })

    if(!this.validate()){
      return
    }

    this.setState({
      loading: true
    })

    this.apiService.register({
      fullname: this.state.fullname,
      password: this.state.password,
      email: this.state.email,
      phone: this.state.phone
    }).then(() => {
      // setLocalStorage(KEY.TOKEN, data.token)
      // this.props.authLogin && this.props.authLogin(data)
      this.setState({
        showPopup: true,
        fullname: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        isSubmit: false,
        loading: false,
        isCaptcha: false
      }, () => {
        this.captcha.current.reset()
        this.timeout = setTimeout(() => {
          this.setState({
            showPopup: false
          })
        }, 5000)
      })
    }).catch(e => {
      // let error = 'There is an error, please try again!'
      this.setState({
        error: e.result,
        loading: false
      })
    })
  }

  validate(){
    if(!this.state.phone || !validatePhone(this.state.phone)){
      return false
    }

    if(!this.state.password){
      return false
    }

    if(!this.state.confirmPassword){
      return false
    }

    if(this.state.password !== this.state.confirmPassword){
      return false
    }

    if(!this.state.email || !validateEmail(this.state.email)){
      return false
    }

    if(!this.state.fullname || !validateStringWithoutNumber(this.state.fullname)){
      return false
    }

    if(!this.state.isCaptcha){
      return false
    }

    return true
  }

  handleClose(){
    this.setState({
      showPopup: false
    })
  }

  onChangeCaptcha = (value) => {
    this.apiService.verifyCaptcha({captcha: value}).then((res) => {
      if(res.success){
        this.setState({
          isCaptcha: true
        })
      }
      else{
        this.setState({
          isCaptcha: false
        })
      }
    }).catch(() => {
      this.setState({
        isCaptcha: false
      })
    })
  }

  onExpired = () => {
    this.setState({
      isCaptcha: false
    })
  }

  render() {
    const {t} = this.props
    return (
      <>
        <Layout page="login" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>{t('register.title')}</span>
                      <div className="nd_options_section">
                        <span className="underline"></span>
                      </div>
                    </h1>
                  </div>
                  <div className="nd_options_section nd_options_height_110"/>
                </div>
              </div>
            </div>
            <div className="nd_options_container nd_options_clearfix content">
              <div className="box-content">
                <div className="woocommerce">
                  <form className="woocommerce-form woocommerce-form-login login" onSubmit={this.handleSubmit.bind(this)}>
                    <div className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="fullname">
                        {t('register.fullname')}
                        <span className="required"> *</span>
                      </label>
                      <input id="fullname" type="text" name="fullname" value={this.state.fullname}
                        className={(this.state.isSubmit && !this.state.fullname) ||
                          (this.state.isSubmit && this.state.fullname && !validateStringWithoutNumber(this.state.fullname)) ?
                        "woocommerce-Input woocommerce-Input--text input-text error" :
                        "woocommerce-Input woocommerce-Input--text input-text"}
                         onChange={this.handleChangeFullname.bind(this)}/>
                       {this.state.isSubmit && !this.state.fullname &&
                         <p className="error">{t('register.fullname_required')}</p>
                       }
                       {this.state.isSubmit && this.state.fullname && !validateStringWithoutNumber(this.state.fullname) &&
                         <p className="error">{t('register.fullname_format')}</p>
                       }
                    </div>
                    <div className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="password">
                        {t('register.password')}
                        <span className="required"> *</span>
                      </label>
                      <input id="password" type="password" name="password" value={this.state.password} maxLength="20"
                        className={this.state.isSubmit && !this.state.password ?
                          "woocommerce-Input woocommerce-Input--text input-text error" :
                          "woocommerce-Input woocommerce-Input--text input-text"}
                        onChange={this.handleChangePassword.bind(this)}/>
                      {this.state.isSubmit && !this.state.password &&
                        <p className="error">{t('register.password_required')}</p>
                      }
                    </div>
                    <div className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="confirmPassword">
                        {t('register.confirm')}
                        <span className="required"> *</span>
                      </label>
                      <input id="confirmPassword" type="password" name="confirmPassword" value={this.state.confirmPassword} maxLength="20"
                        className={this.state.isSubmit && (!this.state.confirmPassword || this.state.password !== this.state.confirmPassword) ?
                        "woocommerce-Input woocommerce-Input--text input-text error" :
                        "woocommerce-Input woocommerce-Input--text input-text"}
                         onChange={this.handleChangeConfirmPassword.bind(this)}/>
                       {this.state.isSubmit && !this.state.confirmPassword &&
                         <p className="error">{t('register.confirm_required')}</p>
                       }
                       {this.state.isSubmit && this.state.confirmPassword && this.state.password !== this.state.confirmPassword &&
                         <p className="error">{t('register.not_match')}</p>
                       }
                    </div>
                    <div className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="phone">
                        {t('register.phone')}
                        <span className="required"> *</span>
                      </label>
                      <input id="phone" type="text" name="phone" value={this.state.phone}
                        className={this.state.isSubmit && (!this.state.phone || this.state.phone && !validatePhone(this.state.phone)) ?
                        "woocommerce-Input woocommerce-Input--text input-text error" :
                        "woocommerce-Input woocommerce-Input--text input-text"}
                         onChange={this.handleChangePhone.bind(this)}/>
                       {this.state.isSubmit && !this.state.phone &&
                         <p className="error">{t('register.phone_required')}</p>
                       }
                       {this.state.isSubmit && this.state.phone && !validatePhone(this.state.phone) &&
                         <p className="error">{t('register.phone_format')}</p>
                       }
                    </div>
                    <div className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="email">
                        {t('register.email')}
                        <span className="required"> *</span>
                      </label>
                      <input id="email" type="text" name="email" value={this.state.email}
                        className={this.state.isSubmit && (!this.state.email || !validateEmail(this.state.email)) ?
                        "woocommerce-Input woocommerce-Input--text input-text error" :
                        "woocommerce-Input woocommerce-Input--text input-text"}
                         onChange={this.handleChangeEmail.bind(this)}/>
                       {this.state.isSubmit && !this.state.email &&
                         <p className="error">{t('register.email_required')}</p>
                       }
                       {this.state.isSubmit && this.state.email && !validateEmail(this.state.email) &&
                         <p className="error">{t('register.email_format')}</p>
                       }
                    </div>
                    <div className="captcha">
                      <ReCAPTCHA
                        sitekey={site_key}
                        onChange={this.onChangeCaptcha}
                        onExpired={this.onExpired}
                        ref={this.captcha}
                        />
                      {this.state.isSubmit && !this.state.isCaptcha &&
                        <p className="error">{t('register.captcha')}</p>
                      }
                    </div>
                    {this.state.error &&
                      <p className="error">{t('register.' + this.state.error)}</p>
                    }
                    {this.state.loading &&
                      <div className="text-center mt-3 mb-3">
                        <img alt="loading" src="/static/svg/loading.svg" />
                      </div>
                    }
                    <div className="form-row">
                      <button type="submit" className="woocommerce-Button button" name="login" onClick={this.handleSubmit.bind(this)}>
                        {t('register.title')}
                      </button>
                    </div>
                    <p className="co-break">{t('register.or')}</p>
                    <button type="button" className="woocommerce-Button button fb" name="loginFB" onClick={this.handleLoginFB.bind(this)}>
                      <span><FaFacebookF style={{fontSize: '18px', position: 'relative', top: '-2px'}}/></span>
                      <span> {t('register.login_fb')}</span>
                    </button>
                    <p className="link-page">{t('register.have_account')}&nbsp;
                      <Link route="login"><a>{t('register.login_here')}</a></Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </section>
          <PopupInfo show={this.state.showPopup} onClose={this.handleClose.bind(this)}>
            <FaCheck size={100} style={{color: 'rgb(67, 74, 84)'}}/>
            <h1>{t('register.congratulations')}!</h1>
            <div className="nd_options_height_10" />
            <p>{t('register.successfully')}</p>
            <p>{t('register.check_email')}</p>
            <div className="nd_options_height_10" />
            <a className="co-btn" onClick={this.handleClose.bind(this)}>{t('register.OK')}</a>
          </PopupInfo>
        </Layout>
      </>
    )
  }
}

export default withNamespaces('translation')(connect(mapStateToProps, mapDispatchToProps)(Register))
