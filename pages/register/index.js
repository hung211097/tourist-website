import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, PopupInfo } from 'components'
import { Link, Router } from 'routes'
import { connect } from 'react-redux'
import { FaFacebookF, FaCheck } from "react-icons/fa"
import validateEmail from '../../services/validates/email.js'
import validatePhone from '../../services/validates/phone.js'
import ApiService from '../../services/api.service'
import { authLogin } from 'actions'
import { checkAfterLogin } from '../../services/auth.service'

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
    link_redirect: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      isSubmit: false,
      phone: '',
      password: '',
      fullname: '',
      confirmPassword: '',
      email: '',
      showPopup: false,
      error: '',
      loading: false
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
        loading: false
      }, () => {
        this.timeout = setTimeout(() => {
          this.setState({
            showPopup: false
          })
        }, 5000)
      })
    }).catch(e => {
      // let error = 'There is an error, please try again!'
      this.setState({
        error: e.result
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

    if(!this.state.email || !validateEmail(this.state.email)){
      return false
    }

    if(!this.state.fullname){
      return false
    }

    return true
  }

  handleClose(){
    this.setState({
      showPopup: false
    })
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
                      <span>REGISTER</span>
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
                        Fullname
                        <span className="required"> *</span>
                      </label>
                      <input id="fullname" type="text" name="fullname" value={this.state.fullname}
                        className={this.state.isSubmit && !this.state.fullname ?
                        "woocommerce-Input woocommerce-Input--text input-text error" :
                        "woocommerce-Input woocommerce-Input--text input-text"}
                         onChange={this.handleChangeFullname.bind(this)}/>
                       {this.state.isSubmit && !this.state.fullname &&
                         <p className="error">Fullname is required!</p>
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
                    <div className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="confirmPassword">
                        Confirm Password
                        <span className="required"> *</span>
                      </label>
                      <input id="confirmPassword" type="password" name="confirmPassword" value={this.state.confirmPassword}
                        className={this.state.isSubmit && (!this.state.confirmPassword || this.state.password !== this.state.confirmPassword) ?
                        "woocommerce-Input woocommerce-Input--text input-text error" :
                        "woocommerce-Input woocommerce-Input--text input-text"}
                         onChange={this.handleChangeConfirmPassword.bind(this)}/>
                       {this.state.isSubmit && !this.state.confirmPassword &&
                         <p className="error">Confirm password is required!</p>
                       }
                       {this.state.isSubmit && this.state.confirmPassword && this.state.password !== this.state.confirmPassword &&
                         <p className="error">Password and Confirm password must be match!</p>
                       }
                    </div>
                    <div className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="phone">
                        Phone number
                        <span className="required"> *</span>
                      </label>
                      <input id="phone" type="text" name="phone" value={this.state.phone}
                        className={this.state.isSubmit && (!this.state.phone || this.state.phone && !validatePhone(this.state.phone)) ?
                        "woocommerce-Input woocommerce-Input--text input-text error" :
                        "woocommerce-Input woocommerce-Input--text input-text"}
                         onChange={this.handleChangePhone.bind(this)}/>
                       {this.state.isSubmit && !this.state.phone &&
                         <p className="error">Phone number is required!</p>
                       }
                       {this.state.isSubmit && this.state.phone && !validatePhone(this.state.phone) &&
                         <p className="error">Phone number must be 10 digits!</p>
                       }
                    </div>
                    <div className="woocommerce-form-row woocommerce-form-row--wide form-row form-row-wide">
                      <label htmlFor="email">
                        Email
                        <span className="required"> *</span>
                      </label>
                      <input id="email" type="text" name="email" value={this.state.email}
                        className={this.state.isSubmit && (!this.state.email || !validateEmail(this.state.email)) ?
                        "woocommerce-Input woocommerce-Input--text input-text error" :
                        "woocommerce-Input woocommerce-Input--text input-text"}
                         onChange={this.handleChangeEmail.bind(this)}/>
                       {this.state.isSubmit && !this.state.email &&
                         <p className="error">Email number is required!</p>
                       }
                       {this.state.isSubmit && this.state.email && !validateEmail(this.state.email) &&
                         <p className="error">Email must be in right format!</p>
                       }
                    </div>
                    {this.state.error &&
                      <p className="error">{this.state.error}</p>
                    }
                    {this.state.loading &&
                      <div className="text-center mt-3 mb-3">
                        <img alt="loading" src="/static/svg/loading.svg" />
                      </div>
                    }
                    <div className="form-row">
                      <button type="submit" className="woocommerce-Button button" name="login" onClick={this.handleSubmit.bind(this)}>
                        Register
                      </button>
                    </div>
                    <p className="co-break">OR</p>
                    <button type="button" className="woocommerce-Button button fb" name="loginFB" onClick={this.handleLoginFB.bind(this)}>
                      <span><FaFacebookF style={{fontSize: '18px', position: 'relative', top: '-2px'}}/></span>
                      <span> Login with Facebook</span>
                    </button>
                    <p className="link-page">You have an account?&nbsp;
                      <Link route="login"><a>Login here</a></Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </section>
          <PopupInfo show={this.state.showPopup} onClose={this.handleClose.bind(this)}>
            <FaCheck size={100} style={{color: 'rgb(67, 74, 84)'}}/>
            <h1>Congratulations!</h1>
            <div className="nd_options_height_10" />
            <p>You register an account successfully!</p>
            <p>Please check your email to verify the account!</p>
            <div className="nd_options_height_10" />
            <a className="co-btn" onClick={this.handleClose.bind(this)}>OK</a>
          </PopupInfo>
        </Layout>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
