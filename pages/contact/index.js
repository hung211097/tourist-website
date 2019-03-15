import React from 'react'
import styles from './index.scss'
import { Layout, MapContact, PopupInfo } from 'components'
import validateEmail from '../../services/validates/email.js'
import { companyPosition } from '../../constants/map-option'
import ApiService from 'services/api.service'
import { FaCheck } from "react-icons/fa"

class Contact extends React.Component {
  displayName = 'Contact'

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
    if(!this.state.name){
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
    return (
      <>
        <Layout page="contact" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>CONTACT</span>
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
                        <h3>DROP US A LINE</h3>
                        <div className="nd_options_section nd_options_height_20"/>
                        <div className="nd_options_section nd_options_line_height_0 underline-zone">
                          <span className="underline"></span>
                        </div>
                        <div className="nd_options_section nd_options_height_20"/>
                        <div className="wpb_text_column wpb_content_element">
                          <div className="wpb_wrapper">
                            <p>
                              Hãy liên hệ với chúng tôi để được tư vấn, giải đáp thắc mắc và đạt được những gì bạn mong đợi về một kì nghỉ mơ ước.
                            </p>
                            <h3>LIÊN HỆ TRỰC TIẾP</h3>
                            <p>Nếu bạn có vấn đề cần được giải đáp hãy liên hệ trực tiếp với chúng tôi, vui lòng xem thông tin bên dưới:</p>
                            <h3>LIÊN HỆ QUA HỆ THỐNG WEBSITE</h3>
                            <ul>
                              <li>Chúng tôi luôn đón nhận mọi sự góp ý, những vấn đề của quý khách cần được giải đáp.</li>
                              <li>
                                Vui lòng sử dụng diễn đàn để đặt câu hỏi khi quý khách có vấn đề không giải quyết được.
                                Đội ngũ nhân viên của chúng tôi sẽ giải đáp vấn đề của quý khách một cách nhanh chóng.
                              </li>
                              <li>Để thực hiện việc liên hệ các bạn vui lòng điền vào theo form bên dưới.</li>
                            </ul>
                          </div>
                        </div>
                        <div className="nd_options_section nd_options_height_20"/>
                          <div className="form-msg">
                            <form onSubmit={this.handleSubmit.bind(this)}>
                              <div className="input-field">
                                <p>Name: </p>
                                <span>
                                  <input type="text" name="name" placeholder="Name" value={this.state.name}
                                    onChange={this.handleChangeName.bind(this)}/>
                                </span>
                                {this.state.isSubmit && !this.state.name &&
                                  <p className="error">This field is required</p>
                                }
                              </div>
                              <div className="input-field">
                                <p>Email: </p>
                                <span>
                                  <input type="text" name="email" placeholder="Email" value={this.state.email}
                                    onChange={this.handleChangeEmail.bind(this)}/>
                                </span>
                                {this.state.isSubmit && !this.state.email &&
                                  <p className="error">This field is required</p>
                                }
                                {this.state.isSubmit && this.state.email && !validateEmail(this.state.email) &&
                                  <p className="error">Email must be right in format</p>
                                }
                              </div>
                              <div className="input-field">
                                <p>Message: </p>
                                <span>
                                  <textarea type="text" name="message" placeholder="Message" value={this.state.message}
                                    onChange={this.handleChangeMessage.bind(this)}/>
                                </span>
                                {this.state.isSubmit && !this.state.message &&
                                  <p className="error">This field is required</p>
                                }
                              </div>
                              <div className="confirm-field">
                                <button type="submit" onClick={this.handleSubmit.bind(this)}>SEND NOW</button>
                                {this.state.error &&
                                  <p className="error">{this.state.error}</p>
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
                            <p>Address: 162 Ba Tháng Hai, Phường 12, Quận 10</p>
                            <br/>
                            <p>City: Hồ Chí Minh - Việt Nam</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 no-padding">
                        <div className="inner">
                          <div className="wrapper">
                            <div className="nd_options_section  nd_options_display_table w-100">
                              <div className="table-cell-left">
                                <p>Phone: </p>
                              </div>
                              <div className="table-cell-right">
                                <p>0963186896</p>
                              </div>
                            </div>
                            <div style={{backgroundColor: '#f1f1f1', height: '1px'}}/>
                            <div className="nd_options_section  nd_options_display_table w-100">
                              <div className="table-cell-left">
                                <p>Opening: </p>
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
                                <p>Closing: </p>
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
            <h1>Successfully!</h1>
            <div className="nd_options_height_10" />
            <p>Your message is sent to us.</p>
            <p>Please check your email in a few day.</p>
            <button className="co-btn mt-5" onClick={this.handleClose.bind(this)}>OK</button>
          </PopupInfo>
        </Layout>
      </>
    )
  }
}

export default Contact
