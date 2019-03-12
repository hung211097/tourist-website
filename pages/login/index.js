import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout } from 'components'
import { Router, Link } from 'routes'
import { connect } from 'react-redux'
import { isServer } from 'services/utils.service'
import { FaFacebookF } from "react-icons/fa";
import { authLogin } from 'actions'
import validateEmail from '../../services/validates/email.js'
import validatePhone from '../../services/validates/phone.js'
import ApiService from '../../services/api.service'
import { setLocalStorage } from '../../services/local-storage.service'
import { KEY } from '../../constants/local-storage'

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
    link_redirect: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      isSubmit: false,
      username: '',
      password: '',
      remember: false,
      error: ''
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

    this.apiService.login({
      username: this.state.username,
      password: this.state.password
    }).then((data) => {
      setLocalStorage(KEY.TOKEN, data.token)
      this.props.authLogin && this.props.authLogin(data)
      Router.pushRoute(this.props.link_redirect || 'home')
    }).catch(e => {
      let error = 'There is an error, please try again!'
      if(e.status == 404){
        error = 'Email or phone number does not exists'
      }
      else if(e.status == 402){
        error = 'Password is not correct'
      }
      this.setState({
        error: error
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

  render() {
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
                      <span>LOGIN</span>
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
                        Email or Phone number
                        <span className="required"> *</span>
                      </label>
                      <input id="username" type="text" name="username" value={this.state.username}
                        className={this.state.isSubmit && !this.state.username ?
                        "woocommerce-Input woocommerce-Input--text input-text error" :
                        "woocommerce-Input woocommerce-Input--text input-text"}
                         onChange={this.handleChangeUsername.bind(this)}/>
                       {this.state.isSubmit && !this.state.username &&
                         <p className="error">Email or Phone number is required!</p>
                       }
                       {this.state.isSubmit && this.state.username && (!validateEmail(this.state.username) && !validatePhone(this.state.username)) &&
                         <p className="error">Email or Phone number must be in right format!</p>
                       }
                    </div>
                    <div className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="password">
                        Password
                        <span className="required"> *</span>
                      </label>
                      <input id="password" type="password" name="password" value={this.state.password}
                        className={this.state.isSubmit && !this.state.password ?
                          "woocommerce-Input woocommerce-Input--text input-text error" :
                          "woocommerce-Input woocommerce-Input--text input-text"}
                        onChange={this.handleChangePassword.bind(this)}/>
                      {this.state.isSubmit && !this.state.password &&
                        <p className="error">Password is required!</p>
                      }
                    </div>
                    {this.state.error &&
                      <p className="error">{this.state.error}</p>
                    }
                    <div className="form-row">
                      <div className="wrapper">
                        {/*<label className="woocommerce-form__label woocommerce-form__label-for-checkbox d-inline-block" htmlFor="rememberme">
                          <input className="woocommerce-form__input woocommerce-form__input-checkbox" name="rememberme" type="checkbox" id="rememberme"
                            checked={this.state.remember} onChange={this.handleRemember.bind(this)}/>
                          <span> Remember me</span>
                        </label>*/}
                        <span className="woocommerce-LostPassword lost_password">
                          <Link route="forget-password">
                            <a>Lost your password?</a>
                          </Link>
                        </span>
                      </div>
                      <button type="submit" className="woocommerce-Button button" name="login" onClick={this.handleSubmit.bind(this)}>
                        Login
                      </button>
                    </div>
                    <p className="co-break">OR</p>
                    <button type="button" className="woocommerce-Button button fb" name="loginFB" onClick={this.handleLoginFB.bind(this)}>
                      <span><FaFacebookF style={{fontSize: '18px', position: 'relative', top: '-2px'}}/></span>
                      <span> Login with Facebook</span>
                    </button>
                    <p className="link-page">You don&apos;t have an account?&nbsp;
                      <Link route="register"><a>Register here</a></Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login)
