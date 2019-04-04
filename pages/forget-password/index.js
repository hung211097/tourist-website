import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout } from 'components'
import validateEmail from '../../services/validates/email.js'
import ApiService from '../../services/api.service'
import { withNamespaces } from "react-i18next"

class ForgetPassword extends React.Component {
  displayName = 'Forget Password'

  static propTypes = {
    t: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      isSubmit: false,
      email: '',
      isSend: false,
      error: '',
      loading: false
    }
  }

  componentDidMount() {

  }

  handleChangeEmail(e){
    this.setState({
      email: e.target.value,
      error: ''
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

    this.setState({
      loading: true
    })

    this.apiService.forgetPassword({
      email: this.state.email
    }).then(() => {
      this.setState({
        isSend: true,
        loading: false,
        isSubmit: false
      })
    }).catch(e => {
      let error = "There is an error, please try again!"
      if(e.result === 'Email is not exists'){
        error = 'Email does not exist'
      }
      this.setState({
        error: error,
        loading: false
      })
    })
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
                      <span>{t('forget_password.title')}</span>
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
                         <p className="error">{t('forget_password.email_required')}</p>
                       }
                       {this.state.isSubmit && this.state.email && (!validateEmail(this.state.email)) &&
                         <p className="error">{t('forget_password.email_format')}</p>
                       }
                       {this.state.loading &&
                         <div className="text-center d-block w-100 mt-4">
                           <img alt="loading" src="/static/svg/loading.svg"/>
                         </div>
                       }
                    </div>
                    {this.state.isSend &&
                      <div className="inform">
                        <p className="caption">
                          {t('forget_password.success')}
                        </p>
                        <p className="caption">
                          {t('forget_password.note')} <a className="active" onClick={this.handleSubmit.bind(this)}>
                          {t('forget_password.resend')}</a>
                        </p>
                      </div>
                    }
                    {this.state.error &&
                      <p className="error">{t('forget_password.' + this.state.error)}</p>
                    }
                    {!this.state.isSend &&
                      <div className="form-row">
                        <button type="submit" className="woocommerce-Button button" name="login" onClick={this.handleSubmit.bind(this)}>
                          {t('forget_password.send')}
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

export default withNamespaces('translation')(ForgetPassword)
