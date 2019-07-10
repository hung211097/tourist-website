import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { PopupInfo } from 'components'
import * as Scroll from 'react-scroll'
import { Link } from 'routes'
import { withNamespaces  } from "react-i18next"
import validateEmail from '../../services/validates/email.js'

const scroll = Scroll.animateScroll

class Footer extends React.Component {
  displayName = 'Footer'

  static propTypes = {
    t: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      showPopup: false,
      isSubmit: false
    }
  }

  componentDidMount() {
  }

  handleChangeEmail(e){
    this.setState({
      email: e.target.value
    })
  }

  scrollToTop(){
    scroll.scrollToTop({
      duration: 500
    })
  }

  handleSubmit(e){
    e.preventDefault()
    this.setState({
      isSubmit: true
    })

    if(!this.state.email || !validateEmail(this.state.email)){
      return
    }

    this.setState({
      email: '',
      showPopup: true,
      isSubmit: false
    })
  }

  handleClose(){
    this.setState({
      showPopup: false
    })
  }

  render() {
    const {t} = this.props
    return (
      <footer className="footer" itemScope itemType="http://schema.org/WPFooter">
        <style jsx>{styles}</style>
        <div className="nd_options_section footer-content">
          <div className="nd_options_section nd_options_height_50" />
          {/*start nd_options_container*/}
          <div className="nd_options_container nd_options_clearfix">
              <div className="grid content wpb_widgetised_column">
                <div className="widget widget_text">
                  <div className="textwidget">
                    <div className="row">
                      <div className="col-sm-4">
                        <div className="inner">
                          <div className="wrapper">
                            <Link route="contact">
                              <a>
                                <h3>{t('footer.contact')}</h3>
                              </a>
                            </Link>
                            {/*<div style={{height: '5px'}} />
                            <p>24 {t('footer.hour')}</p>
                            <div className="dummy-height"/>*/}
                            <a href="tel:0963 186 896" className="contact-detail"><i className="fas fa-phone"></i>&nbsp;&nbsp;0963 186 896</a>
                            <a href="mailto:traveltour@gmail.com" className="contact-detail"><i className="fas fa-envelope"></i>&nbsp;&nbsp;traveltour@gmail.com</a>
                            <p style={{marginTop: '15px'}} className="contact-detail"><i className="fas fa-location-arrow"></i>&nbsp;&nbsp; 162 Ba Tháng Hai, Phường 12, Quận 10</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="inner">
                          <div className="wrapper">
                            <h3>{t('footer.connect')}</h3>
                            <div style={{height: '15px'}}/>
                            {/*<p>{t('footer.social')}</p>
                            <div className="dummy-height"/>*/}
                            <div className="social-media">
                              <a href="javascript:;"><i className="fab fa-facebook-f" style={{fontSize: '24px', color: 'white'}}></i></a>
                              <a href="javascript:;"><i className="fab fa-instagram" style={{fontSize: '24px', color: 'white'}}></i></a>
                              <a href="javascript:;"><i className="fab fa-youtube" style={{fontSize: '24px', color: 'white'}}></i></a>
                            </div>
                            <div className="subscribe-zone">
                              <form onSubmit={this.handleSubmit.bind(this)}>
                                <p>{t('footer.sub')}</p>
                                <div className="subscribe-wrapper">
                                  <span className="email-sub">
                                    <input type="email" name="email" value={this.state.email} onChange={this.handleChangeEmail.bind(this)} placeholder="Email"/>
                                  </span>
                                </div>
                                <div className="subscribe-btn">
                                  <button onClick={this.handleSubmit.bind(this)}>{t('footer.subscribe')}</button>
                                </div>
                                {this.state.isSubmit && this.state.email && !validateEmail(this.state.email) &&
                                  <p className="error">{t('register.email_format')}</p>
                                }
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="row addition-page">
                          <div className="col-sm-6">
                            <Link route="about-us">
                              <a><h3>{t('footer.about')}</h3></a>
                            </Link>
                            <Link route="faq">
                              <a><h3>{t('footer.faq')}</h3></a>
                            </Link>
                            <Link route="news">
                              <a><h3 className="margin-top-responsive">{t('footer.news')}</h3></a>
                            </Link>
                            <Link route="terms-condition">
                              <a><h3 className="term-condition">{t('footer.terms')}</h3></a>
                            </Link>
                          </div>
                          <div className="col-sm-6">
                            <Link route="tours" params={{id: 1, name: "trong-nuoc"}}>
                              <a><h3>{t('footer.domestic_tour')}</h3></a>
                            </Link>
                            <Link route="tours" params={{id: 2, name: "quoc-te"}}>
                              <a><h3>{t('footer.international_tour')}</h3></a>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/*end container*/}
          <div className="nd_options_section nd_options_height_10" />
          <a href="javascript:;" className="to-top" onClick={this.scrollToTop.bind(this)}>
            <i className="fas fa-arrow-circle-up" style={{color: 'white', fontSize: '28px'}}></i>
          </a>
        </div>
        <div className="nd_options_section copy-right">
          <div className="nd_options_container nd_options_clearfix copy-right-container">
            <div className="row copy-right-content">
              <div className="col-sm-6">
                <p>{t('footer.copyright')}</p>
              </div>
              <div className="col-sm-6"></div>
            </div>
          </div>
        </div>
        <PopupInfo show={this.state.showPopup} onClose={this.handleClose.bind(this)} customContent={{width: '90%', maxWidth: '430px'}}>
          <h1>{t('subscription.thank')}!</h1>
          <div className="nd_options_height_10" />
          <p>{t('subscription.content')}</p>
          <div className="nd_options_height_10" />
          <a className="co-btn" onClick={this.handleClose.bind(this)}>{t('register.OK')}</a>
        </PopupInfo>
      </footer>
    )
  }
}

export default withNamespaces('translation')(Footer)
