import React from 'react'
import styles from './index.scss'
import { Layout, MapContact, PopupInfo } from 'components'
import validateEmail from '../../services/validates/email.js'
import { companyPosition } from '../../constants/map-option'
import ApiService from 'services/api.service'
import { FaCheck } from "react-icons/fa"
import PropTypes from 'prop-types'
import { withNamespaces } from "react-i18next"
import { validateStringWithoutNumber } from '../../services/validates'
import { metaData } from '../../constants/meta-data'

class Contact extends React.Component {
  displayName = 'Contact'

  static propTypes = {
      t: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      name: '',
      email: '',
      message: '',
      isSubmit: false,
      error: '',
      showPopup: false
    }
  }

  handleSubmit(e){
    e.preventDefault()
    this.setState({
      isSubmit: true
    })

    if(!this.validate()){
      return
    }

    this.apiService.sendRequest({name: this.state.name, email: this.state.email, message: this.state.message}).then(() => {
      this.setState({
        name: '',
        email: '',
        message: '',
        showPopup: true,
        isSubmit: false
      })
    }).catch(e => {
      if(e.status !== 200){
        this.setState({
          error: 'There is an error, please try again!'
        })
      }
    })
  }

  handleChangeName(e){
    this.setState({
      name: e.target.value
    })
  }

  handleChangeEmail(e){
    this.setState({
      email: e.target.value
    })
  }

  handleChangeMessage(e){
    this.setState({
      message: e.target.value
    })
  }

  validate(){
    if(!this.state.name || !validateStringWithoutNumber(this.state.name)){
      return false
    }

    if(!this.state.email || !validateEmail(this.state.email)){
      return false
    }

    if(!this.state.message){
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
    const {t} = this.props
    return (
      <>
        <Layout page="contact" seo={{title: metaData.CONTACT.title, description: metaData.CONTACT.description}} {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>{t('contact.title')}</span>
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
              <div className="content">
                <div className="row contact">
                  <div className="col-lg-6">
                    <div className="inner">
                      <div className="wrapper">
                        <h3>{t('contact.drop')}</h3>
                        <div className="nd_options_section nd_options_height_20"/>
                        <div className="nd_options_section nd_options_line_height_0 underline-zone">
                          <span className="underline"></span>
                        </div>
                        <div className="nd_options_section nd_options_height_20"/>
                        <div className="wpb_text_column wpb_content_element">
                          <div className="wpb_wrapper">
                            <p>
                              {t('contact.drop_content')}
                            </p>
                            <h3>{t('contact.direct')}</h3>
                            <p>{t('contact.direct_content')}</p>
                            <h3>{t('contact.website')}</h3>
                            <ul>
                              <li>{t('contact.website_1')}</li>
                              <li>
                                {t('contact.website_2')}
                              </li>
                              <li>{t('contact.website_3')}</li>
                            </ul>
                          </div>
                        </div>
                        <div className="nd_options_section nd_options_height_20"/>
                          <div className="form-msg">
                            <form onSubmit={this.handleSubmit.bind(this)}>
                              <div className="input-field">
                                <p>{t('contact.name')}: </p>
                                <span>
                                  <input type="text" name="name" value={this.state.name}
                                    onChange={this.handleChangeName.bind(this)}/>
                                </span>
                                {this.state.isSubmit && !this.state.name &&
                                  <p className="error">{t('contact.fullname_required')}</p>
                                }
                                {this.state.isSubmit && this.state.name && !validateStringWithoutNumber(this.state.name) &&
                                  <p className="error">{t('contact.fullname_format')}</p>
                                }
                              </div>
                              <div className="input-field">
                                <p>Email: </p>
                                <span>
                                  <input type="text" name="email" value={this.state.email}
                                    onChange={this.handleChangeEmail.bind(this)}/>
                                </span>
                                {this.state.isSubmit && !this.state.email &&
                                  <p className="error">{t('contact.email_required')}</p>
                                }
                                {this.state.isSubmit && this.state.email && !validateEmail(this.state.email) &&
                                  <p className="error">{t('contact.email_format')}</p>
                                }
                              </div>
                              <div className="input-field">
                                <p>{t('contact.message')}: </p>
                                <span>
                                  <textarea type="text" name="message" value={this.state.message}
                                    onChange={this.handleChangeMessage.bind(this)}/>
                                </span>
                                {this.state.isSubmit && !this.state.message &&
                                  <p className="error">{t('contact.message_required')}</p>
                                }
                              </div>
                              <div className="confirm-field">
                                <button type="submit" onClick={this.handleSubmit.bind(this)}>{t('contact.send')}</button>
                                {this.state.error &&
                                  <p className="error">{t('contact.' + this.state.error)}</p>
                                }
                              </div>
                            </form>
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="inner">
                      <div className="wrapper">
                        <MapContact location={companyPosition} />
                      </div>
                    </div>
                    <div className="nd_options_height_30"/>
                    <div className="row">
                      <div className="col-12 no-padding">
                        <div className="inner" style={{paddingLeft: '30px'}}>
                          <div className="wrapper">
                            <p>{t('contact.address')}: 162 Ba Tháng Hai, Phường 12, Quận 10</p>
                            <br/>
                            <p>{t('contact.city')}: Hồ Chí Minh - Việt Nam</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 no-padding">
                        <div className="inner">
                          <div className="wrapper">
                            <div className="nd_options_section  nd_options_display_table w-100">
                              <div className="table-cell-left">
                                <p>{t('contact.phone')}: </p>
                              </div>
                              <div className="table-cell-right">
                                <p>0963186896</p>
                              </div>
                            </div>
                            <div style={{backgroundColor: '#f1f1f1', height: '1px'}}/>
                            <div className="nd_options_section  nd_options_display_table w-100">
                              <div className="table-cell-left">
                                <p>{t('contact.opening')}: </p>
                              </div>
                              <div className="table-cell-right">
                                <p>9:00 AM</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 no-padding">
                        <div className="inner">
                          <div className="wrapper">
                            <div className="nd_options_section  nd_options_display_table w-100">
                              <div className="table-cell-left">
                                <p>Email: </p>
                              </div>
                              <div className="table-cell-right">
                                <p>traveltour@gmail.com</p>
                              </div>
                            </div>
                            <div style={{backgroundColor: '#f1f1f1', height: '1px'}}/>
                            <div className="nd_options_section  nd_options_display_table w-100">
                              <div className="table-cell-left">
                                <p>{t('contact.closing')}: </p>
                              </div>
                              <div className="table-cell-right">
                                <p>18:00 PM</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <PopupInfo show={this.state.showPopup} onClose={this.handleClose.bind(this)}>
            <FaCheck size={100} style={{color: 'rgb(67, 74, 84)'}}/>
            <h1>{t('contact.success')}</h1>
            <div className="nd_options_height_10" />
            <p>{t('contact.success_content_1')}</p>
            <p>{t('contact.success_content_2')}</p>
            <button className="co-btn mt-5" onClick={this.handleClose.bind(this)}>{t('contact.OK')}</button>
          </PopupInfo>
        </Layout>
      </>
    )
  }
}

export default withNamespaces('translation')(Contact)
