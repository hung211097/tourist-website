import React from 'react'
import styles from './index.scss'
import { Layout, PopupInfo} from 'components'
import {UnmountClosed} from 'react-collapse'
import validateEmail from '../../services/validates/email.js'
import ApiService from 'services/api.service'
import { FaCheck } from "react-icons/fa"
import PropTypes from 'prop-types'
import { withNamespaces } from "react-i18next"
import { validateStringWithoutNumber } from '../../services/validates'

class FAQ extends React.Component {
  displayName = 'FAQ'

  static propTypes = {
      t: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.questions = [
      {
        content: "question_1",
        isShow: false,
        answer: `answer_1`
      },
      {
        content: "question_2",
        isShow: false,
        answer: `answer_2`
      },
      {
        content: "question_3",
        isShow: false,
        answer: `answer_3`
      },
      {
        content: "question_4",
        isShow: false,
        answer: `answer_4`
      },
      {
        content: "question_5",
        isShow: false,
        answer: `answer_5`
      },
      {
        content: "question_6",
        isShow: false,
        answer: `answer_6`
      },
      {
        content: "question_7",
        isShow: false,
        answer: `answer_7`
      },
      {
        content: "question_8",
        isShow: false,
        answer: `answer_9`
      },
      {
        content: "question_9",
        isShow: false,
        answer: `answer_9`
      },
      {
        content: "question_10",
        isShow: false,
        answer: `answer_10`
      }
    ]
    this.apiService = ApiService()
    this.state = {
      questions: this.questions,
      name: '',
      email: '',
      message: '',
      showPopup: false,
      isSubmit: false
    }
  }

  handleToggle(index){
    let arr = this.state.questions
    let temp = arr.find((item, key) => {return index === key})
    if(temp.isShow){
      temp.isShow = false
    }
    else{
      temp.isShow = true
    }
    this.setState({
      questions: arr
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

  handleClose(){
    this.setState({
      showPopup: false
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

  render() {
    const {t} = this.props
    return (
      <>
        <Layout page="faq" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>{t('faq.title')}</span>
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
                <div className="row faq">
                  <div className="col-sm-8">
                    <div className="inner">
                      <div className="wrapper">
                        <div className="row">
                          <div className="col-12">
                            <strong>{t('faq.sub_part')}</strong>
                            <p>{t('faq.sub_part_title_1')}</p>
                            <p>
                              {t('faq.sub_part_1')}
                            </p>
                            <br/>
                            <p>{t('faq.sub_part_title_2')}</p>
                            <p>
                              {t('faq.sub_part_2')}
                            </p>
                            <br/>
                          </div>
                        </div>
                        <div className="nd_options_height_40"/>
                        <h3>{t('faq.question')}</h3>
                        <div className="nd_options_height_20"/>
                        <div className="nd_options_section nd_options_line_height_0 underline-zone">
                          <span className="underline"></span>
                        </div>
                        <div className="nd_options_height_30"/>
                        {this.state.questions.map((item, key) => {
                            return(
                              <div className="nd_options_section nd_options_toogles_faq" key={key}>
                                <div className="question">
                                  <p>
                                    {!item.isShow ?
                                      <span className="toggleBtn" onClick={this.handleToggle.bind(this, key)}>
                                        <img alt="toggle" src="/static/images/icon-add-white.png"/>
                                      </span>
                                      :
                                      <span className="toggleBtn" onClick={this.handleToggle.bind(this, key)}>
                                        <img alt="toggle" src="/static/images/icon-less-white.png"/>
                                      </span>
                                    }
                                    {t('faq.' + item.content)}
                                  </p>
                                </div>
                                <UnmountClosed isOpened={item.isShow} springConfig={{stiffness: 150, damping: 20}}>
                                  <div className="collapse-content">
                                    <p>
                                      {t('faq.' + item.answer)}
                                    </p>
                                  </div>
                                </UnmountClosed>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="inner-msg">
                      <div className="wrapper-msg">
                        <div className="row">
                          <div className="col-12 no-padding">
                            <div className="custom">
                              <div className="wrapper-title">
                                <h2>{t('faq.get_in_touch')}</h2>
                                <div className="nd_options_height_20"/>
                                <div className="underline-zone">
                                  <span className="underline"></span>
                                </div>
                                <div className="nd_options_height_20"/>
                                <div className="form-msg">
                                  <form onSubmit={this.handleSubmit.bind(this)}>
                                    <div className="input-field">
                                      <span>
                                        <input type="text" name="name" placeholder={t('faq.name')} value={this.state.name}
                                          onChange={this.handleChangeName.bind(this)}/>
                                      </span>
                                      {this.state.isSubmit && !this.state.name &&
                                        <p className="error">{t('faq.fullname_required')}</p>
                                      }
                                      {this.state.isSubmit && this.state.name && !validateStringWithoutNumber(this.state.name) &&
                                        <p className="error">{t('faq.fullname_format')}</p>
                                      }
                                    </div>
                                    <div className="input-field">
                                      <span>
                                        <input type="text" name="email" placeholder="Email" value={this.state.email}
                                          onChange={this.handleChangeEmail.bind(this)}/>
                                      </span>
                                      {this.state.isSubmit && !this.state.email &&
                                        <p className="error">{t('faq.email_required')}</p>
                                      }
                                      {this.state.isSubmit && this.state.email && !validateEmail(this.state.email) &&
                                        <p className="error">{t('faq.email_format')}</p>
                                      }
                                    </div>
                                    <div className="input-field">
                                      <span>
                                        <textarea type="text" name="message" placeholder={t('faq.message')} value={this.state.message}
                                          onChange={this.handleChangeMessage.bind(this)}/>
                                      </span>
                                      {this.state.isSubmit && !this.state.message &&
                                        <p className="error">{t('faq.message_required')}</p>
                                      }
                                    </div>
                                    <div className="confirm-field">
                                      <button type="submit" onClick={this.handleSubmit.bind(this)}>{t('faq.send')}</button>
                                      {this.state.error &&
                                        <p className="error">{t('faq.' + this.state.error)}</p>
                                      }
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row best-package">
                          <div className="col-sm-12 no-padding">
                            <div className="custom">
                              <div className="wrapper-custom">
                                <h5>{t('faq.package')}</h5>
                                <div className="nd_options_section nd_options_height_10"/>
                                <h2>{t('faq.best')}</h2>
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
            <h1>{t('faq.success')}!</h1>
            <div className="nd_options_height_10" />
            <p>{t('faq.success_content_1')}</p>
            <p>{t('faq.success_content_2')}</p>
            <button className="co-btn mt-5" onClick={this.handleClose.bind(this)}>{t('faq.OK')}</button>
          </PopupInfo>
        </Layout>
      </>
    )
  }
}

export default withNamespaces('translation')(FAQ)
