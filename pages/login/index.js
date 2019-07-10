import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout } from 'components'
import { Router, Link } from 'routes'
import { connect } from 'react-redux'
import { isServer } from 'services/utils.service'
import { authLogin } from 'actions'
import validateEmail from '../../services/validates/email.js'
import validatePhone from '../../services/validates/phone.js'
import ApiService from '../../services/api.service'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { setLocalStorage } from '../../services/local-storage.service'
import { withNamespaces } from "react-i18next"
import { KEY } from '../../constants/local-storage'
const FB_CLIENT_ID = process.env.FB_CLIENT_ID

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

class Login extends React.Component {
  displayName = 'Login Page'

  static propTypes = {
    authLogin: PropTypes.func,
    user: PropTypes.object,
    link_redirect: PropTypes.string,
    t: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      isSubmit: false,
      username: '',
      password: '',
      remember: false,
      error: '',
      loading: false,
    }
  }

  componentDidMount() {

  }

  static getDerivedStateFromProps(props) {
      if (props.user && !isServer()) {
          Router.pushRoute(props.link_redirect || 'home')
      }
      return null
  }

  handleLoginFB(e){
    e.preventDefault()
    const href = `/auth/facebook?next=${Router.asPath}`
    const as = href
    Router.push(href, as, { shallow: true })
  }

  handleChangeUsername(e){
    this.setState({
      username: e.target.value
    })
  }

  handleChangePassword(e){
    this.setState({
      password: e.target.value
    })
  }

  handleRemember(){
    this.setState({
      remember: !this.state.remember
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

    this.apiService.login({
      username: this.state.username,
      password: this.state.password
    }).then((data) => {
      setLocalStorage(KEY.TOKEN, data.token)
      this.props.authLogin && this.props.authLogin(data)
      Router.pushRoute(this.props.link_redirect || 'home')
    }).catch(e => {
      let error = 'There is an error, please try again!'
      if(e.result === "Username is not exists" || e.result === 'Password is not corect' || e.result === 'This email does not verify'){
        error = e.result
      }
      this.setState({
        error: error,
        loading: false
      })
    })

  }

  validate(){
    if(!this.state.username){
      return false
    }

    if(!this.state.password){
      return false
    }

    if(!validateEmail(this.state.username) && !validatePhone(this.state.username)){
      return false
    }

    return true
  }

  responseFacebook(response) {
      this.apiService.loginFb({
          userData: {
            id: response.id,
            name: response.name,
            email: response.email,
            phone: ''
          }
      }).then((data) => {
          setLocalStorage(KEY.TOKEN, data.token)
          this.props.authLogin && this.props.authLogin(data)
          Router.pushRoute(this.props.link_redirect || 'home')
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
                      <span>{t('login.title')}</span>
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
                      <label htmlFor="username">
                        {t('login.email_phone')}
                        <span className="required"> *</span>
                      </label>
                      <input id="username" type="text" name="username" value={this.state.username}
                        className={this.state.isSubmit && !this.state.username ?
                        "woocommerce-Input woocommerce-Input--text input-text error" :
                        "woocommerce-Input woocommerce-Input--text input-text"}
                         onChange={this.handleChangeUsername.bind(this)}/>
                       {this.state.isSubmit && !this.state.username &&
                         <p className="error">{t('login.email_phone_required')}</p>
                       }
                       {this.state.isSubmit && this.state.username && (!validateEmail(this.state.username) && !validatePhone(this.state.username)) &&
                         <p className="error">{t('login.format')}</p>
                       }
                    </div>
                    <div className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="password">
                        {t('login.password')}
                        <span className="required"> *</span>
                      </label>
                      <input id="password" type="password" name="password" value={this.state.password} maxLength="20"
                        className={this.state.isSubmit && !this.state.password ?
                          "woocommerce-Input woocommerce-Input--text input-text error" :
                          "woocommerce-Input woocommerce-Input--text input-text"}
                        onChange={this.handleChangePassword.bind(this)}/>
                      {this.state.isSubmit && !this.state.password &&
                        <p className="error">{t('login.password_required')}</p>
                      }
                    </div>
                    {this.state.error &&
                      <p className="error">{t('login.' + this.state.error)}</p>
                    }
                    <div className="form-row">
                      <div className="wrapper">
                        {/*<label className="woocommerce-form__label woocommerce-form__label-for-checkbox d-inline-block" htmlFor="rememberme">
                          <input className="woocommerce-form__input woocommerce-form__input-checkbox" name="rememberme" type="checkbox" id="rememberme"
                            checked={this.state.remember} onChange={this.handleRemember.bind(this)}/>
                          <span> Remember me</span>
                        </label>*/}
                        {this.state.loading &&
                          <div className="text-center mt-3 mb-3">
                            <img alt="loading" src="/static/svg/loading.svg" />
                          </div>
                        }
                        <span className="woocommerce-LostPassword lost_password">
                          <Link route="forget-password">
                            <a>{t('login.lost_password')}</a>
                          </Link>
                        </span>
                      </div>
                      <button type="submit" className="woocommerce-Button button" name="login" onClick={this.handleSubmit.bind(this)}>
                        {t('login.title')}
                      </button>
                    </div>
                    <p className="co-break">{t('login.or')}</p>
                    <FacebookLogin
                      appId={FB_CLIENT_ID}
                      autoLoad={false}
                      fields="id, name, email, gender, birthday, picture"
                      callback={this.responseFacebook.bind(this)}
                      render={renderProps => (
                        <button type="button" className="woocommerce-Button button fb" name="loginFB" onClick={renderProps.onClick}>
                          <span><i className="fab fa-facebook-f" style={{fontSize: '18px', marginRight: '10px'}}></i></span>
                          <span> {t('login.login_fb')}</span>
                        </button>
                      )}
                    />
                    <p className="link-page">
                      {t('login.no_account')}&nbsp;
                      <Link route="register"><a>{t('login.register_here')}</a></Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </Layout>
      </>
    )
  }
}

export default withNamespaces('translation')(connect(mapStateToProps, mapDispatchToProps)(Login))
