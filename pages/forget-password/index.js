import React from 'react'
import styles from './index.scss'
import { Layout } from 'components'
import validateEmail from '../../services/validates/email.js'
// import ApiService from '../../services/api.service'

class ForgetPassword extends React.Component {
  displayName = 'Forget Password'

  constructor(props) {
    super(props)
    // this.apiService = ApiService()
    this.state = {
      isSubmit: false,
      email: '',
      isSend: false,
      error: ''
    }
  }

  componentDidMount() {

  }

  handleChangeEmail(e){
    this.setState({
      email: e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault()
    this.setState({
      isSubmit: true,
    })

    if(!this.validate()){
      return
    }

  }

  validate(){
    if(!this.state.email){
      return false
    }

    if(!validateEmail(this.state.email)){
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
                      <span>FORGET PASSWORD</span>
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
                      <label htmlFor="email">
                        Email
                        <span className="required"> *</span>
                      </label>
                      <input id="email" type="text" name="email" value={this.state.email}
                        className={this.state.isSubmit && !this.state.email ?
                        "woocommerce-Input woocommerce-Input--text input-text error" :
                        "woocommerce-Input woocommerce-Input--text input-text"}
                         onChange={this.handleChangeEmail.bind(this)}/>
                       {this.state.isSubmit && !this.state.email &&
                         <p className="error">Email is required!</p>
                       }
                       {this.state.isSubmit && this.state.email && (!validateEmail(this.state.email)) &&
                         <p className="error">Email must be in right format!</p>
                       }
                    </div>
                    {this.state.isSend &&
                      <div className="inform">
                        <p className="caption">
                          Your request is accepted and we will send you a new password, please check your incoming email!
                        </p>
                        <p className="caption">
                          If you don&apos;t receive anything, please <a className="active">resend this request</a>
                        </p>
                      </div>
                    }
                    {this.state.error &&
                      <p className="error">{this.state.error}</p>
                    }
                    {!this.state.isSend &&
                      <div className="form-row">
                        <button type="submit" className="woocommerce-Button button" name="login" onClick={this.handleSubmit.bind(this)}>
                          SEND REQUEST
                        </button>
                      </div>
                    }
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

export default ForgetPassword
