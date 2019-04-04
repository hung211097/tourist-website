import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa"
import { FaArrowCircleUp } from "react-icons/fa"
import * as Scroll from 'react-scroll'
import { Link } from 'routes'
import { withNamespaces  } from "react-i18next"
const scroll = Scroll.animateScroll

class Footer extends React.Component {
  displayName = 'Footer'

  static propTypes = {
    t: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  scrollToTop(){
    scroll.scrollToTop({
      duration: 500
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
                            <h3>{t('footer.phone_support')}</h3>
                            <div style={{height: '10px'}} />
                            <p>24 {t('footer.hour')}</p>
                            <div className="dummy-height"/>
                            <p className="phone-number">+ 0963 186 896</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="inner">
                          <div className="wrapper">
                            <h3>{t('footer.connect')}</h3>
                            <div style={{height: '10px'}}/>
                            <p>{t('footer.social')}</p>
                            <div className="dummy-height"/>
                            <div className="social-media">
                              <a href="javascript:;"><FaFacebookF style={{fontSize: '24px', color: 'white'}}/></a>
                              <a href="javascript:;"><FaInstagram style={{fontSize: '24px', color: 'white'}}/></a>
                              <a href="javascript:;"><FaYoutube style={{fontSize: '24px', color: 'white'}}/></a>
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
                          </div>
                          <div className="col-sm-6">
                            <Link route="contact">
                              <a><h3 className="margin-top-responsive">{t('footer.contact')}</h3></a>
                            </Link>
                            <Link route="terms-condition">
                              <a><h3 className="term-condition">{t('footer.terms')}</h3></a>
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
            <FaArrowCircleUp style={{color: 'white', fontSize: '28px'}}/>
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
      </footer>
    )
  }
}

export default withNamespaces('translation')(Footer)
