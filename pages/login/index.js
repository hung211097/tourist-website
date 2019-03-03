import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout } from 'components'
import { Link } from 'routes'
import { connect } from 'react-redux'
// import { isServer } from 'services/utils.service'
import { FaFacebookF } from "react-icons/fa";

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

class Login extends React.Component {
  displayName = 'Login Page'

  static propTypes = {
    dispatch: PropTypes.func,
    user: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      isSubmit: false,
      phone: '',
      password: '',
      remember: false
    }
  }

  componentDidMount() {

  }

  handleLoginFB(){

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

  }

  validate(){
    if(!this.state.phone){
      return false
    }

    if(!this.state.password){
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
                      <label htmlFor="phone">
                        Phone number
                        <span className="required"> *</span>
                      </label>
                      <input id="phone" type="text" name="phone" value={this.state.phone}
                        className={this.state.isSubmit && !this.state.phone ?
                        "woocommerce-Input woocommerce-Input--text input-text error" :
                        "woocommerce-Input woocommerce-Input--text input-text"}
                         onChange={this.handleChangePhone.bind(this)}/>
                       {this.state.isSubmit && !this.state.phone &&
                         <p className="error">Phone number is required!</p>
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
                    <div className="form-row">
                      <div className="wrapper">
                        <label className="woocommerce-form__label woocommerce-form__label-for-checkbox d-inline-block" htmlFor="rememberme">
                          <input className="woocommerce-form__input woocommerce-form__input-checkbox" name="rememberme" type="checkbox" id="rememberme"
                            checked={this.state.remember} onChange={this.handleRemember.bind(this)}/>
                          <span> Remember me</span>
                        </label>
                        <span className="woocommerce-LostPassword lost_password">
                          <a>Lost your password?</a>
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

export default connect(mapStateToProps)(Login)
