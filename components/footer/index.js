import React from 'react'
import styles from './index.scss'
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa"
import { FaArrowCircleUp } from "react-icons/fa"
import * as Scroll from 'react-scroll'
const scroll = Scroll.animateScroll

class Footer extends React.Component {
  displayName = 'Footer'

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
                            <h3>Phone Support</h3>
                            <div style={{height: '10px'}} />
                            <p>24 HOURS A DAY</p>
                            <div className="dummy-height"/>
                            <p className="phone-number">+ 01 345 647 745</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <div className="inner">
                          <div className="wrapper">
                            <h3>Connect With Us</h3>
                            <div style={{height: '10px'}}/>
                            <p>SOCIAL MEDIA CHANNELS</p>
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
                            <a href="javascript:;"><h3>About Us</h3></a>
                            <a href="javascript:;"><h3>FAQ</h3></a>
                          </div>
                          <div className="col-sm-6">
                            <a href="javascript:;"><h3>Contact</h3></a>
                            <a href="javascript:;"><h3>Term Conditions</h3></a>
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
      </footer>
    )
  }
}

export default Footer
