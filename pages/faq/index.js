import React from 'react'
import styles from './index.scss'
import { Layout } from 'components'
import {UnmountClosed} from 'react-collapse'
import validateEmail from '../../services/validates/email.js'

class FAQ extends React.Component {
  displayName = 'FAQ'

  constructor(props) {
    super(props)
    this.questions = [
      {
        content: "How to pay an online travel reservation ?",
        isShow: false,
        answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Donec rhoncus dolor at libero ultricies ullamcorper vel ut dui.
        Maecenas sollicitudin risus non faucibus blandit. Nulla facilisi.
        Maecenas nec purus sed sapien maximus pellentesque.`
      },
      {
        content: "How to became a VIP customer in our agency ?",
        isShow: false,
        answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Donec rhoncus dolor at libero ultricies ullamcorper vel ut dui.
        Maecenas sollicitudin risus non faucibus blandit. Nulla facilisi.
        Maecenas nec purus sed sapien maximus pellentesque.`
      },
      {
        content: "Which currency do we accept in our branches ?",
        isShow: false,
        answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Donec rhoncus dolor at libero ultricies ullamcorper vel ut dui.
        Maecenas sollicitudin risus non faucibus blandit. Nulla facilisi.
        Maecenas nec purus sed sapien maximus pellentesque.`
      },
      {
        content: "Is it possible to ensure with an insurance the trip ?",
        isShow: false,
        answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Donec rhoncus dolor at libero ultricies ullamcorper vel ut dui.
        Maecenas sollicitudin risus non faucibus blandit. Nulla facilisi.
        Maecenas nec purus sed sapien maximus pellentesque.`
      },
    ]
    this.state = {
      questions: this.questions,
      name: '',
      email: '',
      message: '',
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
  }

  render() {
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
                      <span>FAQ</span>
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
                            <strong>ABCDE</strong>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                              Corrupti fuga delectus sit, nihil earum temporibus ipsa nam hic aliquam, magni,
                              voluptatem autem porro dignissimos illo nulla molestias quam deserunt odio?
                            </p>
                            <br/>
                            <strong>ABCDE</strong>
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                              Corrupti fuga delectus sit, nihil earum temporibus ipsa nam hic aliquam, magni,
                              voluptatem autem porro dignissimos illo nulla molestias quam deserunt odio?
                            </p>
                          </div>
                        </div>
                        <div className="nd_options_height_40"/>
                        <h3>MOST FREQUENT QUESTION - CUSTOMER</h3>
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
                                    {item.content}
                                  </p>
                                </div>
                                <UnmountClosed isOpened={item.isShow} springConfig={{stiffness: 150, damping: 20}}>
                                  <div className="collapse-content">
                                    <p>
                                      {item.answer}
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
                                <h2>Get In Touch</h2>
                                <div className="nd_options_height_20"/>
                                <div className="underline-zone">
                                  <span className="underline"></span>
                                </div>
                                <div className="nd_options_height_20"/>
                                <div className="form-msg">
                                  <form onSubmit={this.handleSubmit.bind(this)}>
                                    <div className="input-field">
                                      <span>
                                        <input type="text" name="name" placeholder="Name" value={this.state.name}
                                          onChange={this.handleChangeName.bind(this)}/>
                                      </span>
                                      {this.state.isSubmit && !this.state.name &&
                                        <p className="error">This field is required</p>
                                      }
                                    </div>
                                    <div className="input-field">
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
                                <h5>PACKAGES</h5>
                                <div className="nd_options_section nd_options_height_10"/>
                                <h2>Best Promotions</h2>
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
        </Layout>
      </>
    )
  }
}

export default FAQ
