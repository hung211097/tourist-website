import React from 'react'
import { Router, Link } from 'routes'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import ApiService from 'services/api.service'
import { ClickOutside } from 'components'
import { FaSearch, FaTimesCircle, FaSignOutAlt, FaSignInAlt, FaEnvelope, FaPhone } from "react-icons/fa"
import { MdLocationOn } from "react-icons/md"
import { saveLocation, logout, saveRedirectUrl, saveProfile } from '../../actions'
import { setLocalStorage, getLocalStorage, removeItem } from '../../services/local-storage.service'
import { KEY } from '../../constants/local-storage'

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveLocation: (location, err) => {dispatch(saveLocation(location, err))},
    saveRedirectUrl: (url) => {dispatch(saveRedirectUrl(url))},
    saveProfile: () => {dispatch(saveProfile())},
    logout: () => {dispatch(logout())}
  }
}

class Header extends React.Component {
  displayName = 'Header'

  static propTypes = {
    accessToken: PropTypes.string,
    page: PropTypes.string,
    saveLocation: PropTypes.func,
    saveRedirectUrl: PropTypes.func,
    saveProfile: PropTypes.func,
    user: PropTypes.object,
    logout: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      showSidebar: false,
      showSearchBox: false,
      isSticky: false
    }
  }

  componentDidMount() {
    this.loadProfile()
    window.addEventListener('scroll', this.handleOnScroll)
    const objLocation = getLocalStorage(KEY.LOCATION)
    if(objLocation || objLocation === ''){
      return
    }
    else{
      this.requestGeolocation()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user && !prevProps.user) {
      this.loadProfile()
    }
  }

  loadProfile() {
      if (!this.props.user) {
          return
      }
      this.props.saveProfile && this.props.saveProfile()
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.handleOnScroll)
    document.body.style.overflow =  'auto'
    // if (this.watchID != null) {
    //   navigator.geolocation.clearWatch(this.watchID);
    //   this.watchID = null;
    // }
  }

  handleLogout(){
    this.props.logout && this.props.logout()
    removeItem(KEY.TOKEN)
    this.props.saveRedirectUrl && this.props.saveRedirectUrl(Router.asPath)
    this.apiService.logout(() => {})
    Router.pushRoute("login")
  }

  handleOnScroll = () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop
    if(winScroll > 730){
      this.setState({
        isSticky: true
      })
    }
    else{
      this.setState({
        isSticky: false
      })
    }
  }

  requestGeolocation(){
    if (navigator.geolocation) {
      this.watchID = navigator.geolocation.getCurrentPosition(this.showLocation.bind(this), this.showError.bind(this), {timeout: 100000});
    } else {
      this.props.saveLocation && this.props.saveLocation(undefined, 'Geolocation is not supported by this browser.')
    }
  }

  showLocation(position) {
    const objLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude }
    this.props.saveLocation && this.props.saveLocation(objLocation, '')
    setLocalStorage(KEY.LOCATION, JSON.stringify(objLocation))
  }

  showError(error) {
    let strError = ''
    switch(error.code) {
      case error.PERMISSION_DENIED:
        strError = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        strError = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        strError = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        strError = "An unknown error occurred."
        break;
    }

    this.props.saveLocation && this.props.saveLocation(undefined, strError)
    setLocalStorage(KEY.LOCATION, '')
  }

  toggleSideBar(){
    if(!this.state.showSidebar){
      document.body.style.overflow =  'hidden'
    }
    else{
      document.body.style.overflow =  'auto'
    }
    this.setState({
      showSidebar: !this.state.showSidebar
    })
  }

  handleClickOutSide(){
    document.body.style.overflow =  'auto'
    this.setState({
      showSidebar: false
    })
  }

  onShowSearchBox(){
    this.setState({
      showSearchBox: true
    })
  }

  onHideSearchBox(){
    this.setState({
      showSearchBox: false
    })
  }

  render() {
    return (
      <div itemScope="itemScope" itemType="http://schema.org/WPHeader">
        <style jsx>{styles}</style>
        {/* header */}
        <header className="header">
          <ClickOutside onClickOutside={this.handleClickOutSide.bind(this)}>
            <div className={this.state.showSidebar ? "navigation_responsive" : "navigation_responsive hidden_sidebar"}>
              <img alt="close" className="nd_options_close_navigation_2_sidebar_content nd_options_cursor_pointer nd_options_right_20 nd_options_top_20 nd_options_position_absolute"
                src='/static/svg/icon-close-white.svg' width={25} onClick={this.toggleSideBar.bind(this)}/>
              <div className="nd_options_navigation_2_sidebar">
                <div className="menu-menu-1-container">
                  <ul className="menu">
                    <li>
                      <form className="search-box-responsive">
                        <div className="icon-search-container active">
                          <span className="fa-search"><FaSearch style={{color: 'white', fontSize: '18px'}}/></span>
                          <input type="text" className="search-input" data-ic-class="search-input" placeholder="Search tour" />
                        </div>
                      </form>
                    </li>
                    {!_.isEmpty(this.props.user) &&
                      <li>
                        <Link route="profile">
                          <a className="w-100 effect-hover">
                            <div className="account-zone-responsive">
                              <img alt="avatar" src={this.props.user.avatar ? (this.props.user.avatar) : "/static/images/avatar.jpg"} />
                              <p>{this.props.user.fullname}</p>
                            </div>
                          </a>
                        </Link>
                      </li>
                    }
                    <li>
                      <Link route="home">
                        <a className="effect-hover">HOME</a>
                      </Link>
                    </li>
                    <li>
                        <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/search-1/" className="effect-hover">PACKAGES</a>
                        <ul className="sub-menu">
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/search-1/">Search</a>
                          </li>
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/packages/london/">Single Package</a>
                          </li>
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/destinations/europe/">Destination</a>
                          </li>
                        </ul>
                      </li>
                    <li>
                        <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/shop/" className="effect-hover">SHOP</a>
                        <ul className="sub-menu">
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/shop/">Shop</a>
                          </li>
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/cart/">Cart</a>
                          </li>
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/checkout/">Checkout</a>
                          </li>
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/my-account/">My account</a>
                          </li>
                        </ul>
                      </li>
                    <li>
                        <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/about-us/" className="effect-hover">ABOUT US</a>
                      </li>
                    <li>
                        <a href="#" className="effect-hover">PAGES</a>
                        <ul className="sub-menu">
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/agency-destinations/">Best Destinations</a>
                          </li>
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/staff/">Staff</a>
                          </li>
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/services/">Services</a>
                          </li>
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/prices/">Prices</a>
                          </li>
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/faq/">Faq</a>
                          </li>
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-1/">Contact 1</a>
                            <ul className="sub-menu">
                              <li>
                                <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-1/">Contact 1</a>
                              </li>
                              <li>
                                <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-2/">Contact 2</a>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a target="_blank" rel="noopener noreferrer" href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/coming-soon/">Coming Soon</a>
                          </li>
                        </ul>
                      </li>
                    <li>
                        <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/our-news/" className="effect-hover">NEWS</a>
                        <ul className="sub-menu">
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/our-news/">Archive</a>
                          </li>
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/new-routes/">Single Post</a>
                            <ul className="sub-menu">
                              <li>
                                <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/new-routes/">Full Width</a>
                              </li>
                              <li>
                                <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/love-travel/">Right Sidebar</a>
                              </li>
                              <li>
                                <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/alternative-trips/">Left Sidebar</a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    <li>
                        <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-1/" className="effect-hover">CONTACT</a>
                        <ul className="sub-menu">
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-1/">Contact 1</a>
                          </li>
                          <li>
                            <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-2/">Contact 2</a>
                          </li>
                        </ul>
                      </li>
                    <li>
                        <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/search-1/" className="effect-hover">BOOK NOW</a>
                      </li>
                  </ul>
                </div>
              </div>
            </div>
          </ClickOutside>

          <div className="nd_options_section header-part">
            <div className="nd_options_navigation_2_top_header container-fluid">
              {/*start nd_options_container*/}
              <div className="nd_options_container nd_options_clearfix">
                <div className="left-header">
                  <div className="nd_options_navigation_top_header_2">
                    <div className="  nd_options_display_table nd_options_float_left">
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <a href="mailto:traveltour@gmail.com" className="nd_options_margin_right_10 nd_options_float_left">
                          <FaEnvelope style={{color: 'white', fontSize: '16px'}}/>
                        </a>
                      </div>
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <a className="nd_options_margin_right_20" href="mailto:traveltour@gmail.com">traveltour@gmail.com</a>
                      </div>
                    </div>
                    <div className="nd_options_display_table nd_options_float_left">
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <a href="tel:0963186896" className="nd_options_margin_right_10 nd_options_float_left">
                          <FaPhone style={{color: 'white', fontSize: '16px'}}/>
                        </a>
                      </div>
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <a className="nd_options_margin_right_20" href="tel:0963186896">Hotline: 0963186896</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="right-header">
                  <div className="nd_options_navigation_top_header_2">
                    {!_.isEmpty(this.props.user) &&
                      <a onClick={this.handleLogout.bind(this)} href="javascript:;">
                        <div className="nd_options_display_table_cell nd_options_vertical_align_middle float-right logout">
                          <p>Logout <FaSignOutAlt style={{fontSize: '16px', color: 'white', marginLeft: '5px'}}/></p>
                        </div>
                      </a>
                    }
                    <Link route={!_.isEmpty(this.props.user) ? "profile" : "login"}>
                      <a>
                        <div className="account-zone" style={!_.isEmpty(this.props.user) ? {lineHeight: '2.6', padding: '11px 15px'} : null}>
                          {_.isEmpty(this.props.user) ?
                            <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                              <h6 className="nd_options_font_size_10 nd_options_text_align_left nd_options_color_white nd_options_second_font">
                                <p className="nd_options_color_white">
                                  Log in
                                  <FaSignInAlt style={{fontSize: '16px', color: 'white', marginLeft: '6px', position: 'relative', top: '-1px'}}/>
                                </p>
                              </h6>
                            </div>
                            :
                            <div>
                              <img alt="avatar" src={this.props.user.avatar ? (this.props.user.avatar) : "/static/images/avatar.jpg"} width={30} />
                              <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                                <p className="fullname">{this.props.user.fullname}</p>
                              </div>
                            </div>
                          }
                        </div>
                      </a>
                    </Link>

                    <div className="add-review">
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <a className="nd_options_margin_left_10" href="#">Add Your Review</a>
                      </div>
                    </div>
                    <form className="search-box">
                      <div className={this.state.showSearchBox ? "icon-search-container active" : "icon-search-container"}>
                        <span className="fa-search" onClick={this.onShowSearchBox.bind(this)}><FaSearch style={{color: 'white', fontSize: '18px'}}/></span>
                        <input type="text" className="search-input" data-ic-class="search-input" placeholder="Search tour" />
                        <span className="fa-times-circle" onClick={this.onHideSearchBox.bind(this)}><FaTimesCircle /></span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/*end container*/}
            </div>
          </div>
          {/*Navigation bar*/}
          <div className="nd_options_section nd_options_position_relative navigation-part">
            <div className="nd_options_section navigation">
              {/*start nd_options_container*/}
              <div className="nd_options_container nd_options_clearfix nd_options_position_relative">
                <div className="nav-content nd_options_dnone_responsive">
                  <div style={{height: '10px'}} className="nd_options_section" />
                    {/*LOGO*/}
                    <Link route="home">
                      <a>
                        <img alt="logo" className="nd_options_position_absolute nd_options_left_15 logo" src="/static/images/logo.png"/>
                      </a>
                    </Link>
                    <div className="nd_options_navigation_2 nd_options_navigation_type nd_options_text_align_right nd_options_float_right nd_options_dnone_responsive">
                    <div className="nd_options_display_table">
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <div className="menu-menu-1-container">
                          <ul id="menu-menu-2" className="menu">
                            <li className={this.props.page === 'home' ? 'active' : ''}>
                              <Link route="home">
                                <a>HOME</a>
                              </Link>
                            </li>
                            <li>
                              <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/search-1/">PACKAGES</a>
                              <ul className="sub-menu">
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/search-1/">Search</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/packages/london/">Single Package</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/destinations/europe/">Destination</a></li>
                              </ul>
                            </li>
                            <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/shop/">SHOP</a>
                              <ul className="sub-menu">
                                <li ><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/shop/">Shop</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/cart/">Cart</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/checkout/">Checkout</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/my-account/">My account</a></li>
                              </ul>
                            </li>
                            <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/about-us/">ABOUT US</a></li>
                            <li><a href="#">PAGES</a>
                              <ul className="sub-menu">
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/agency-destinations/">Best Destinations</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/staff/">Staff</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/services/">Services</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/prices/">Prices</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/faq/">Faq</a></li>
                              </ul>
                            </li>
                            <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-1/">CONTACT</a>
                              <ul className="sub-menu">
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-1/">Contact 1</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-2/">Contact 2</a></li>
                              </ul>
                            </li>
                            <li className="nd_options_book_now_btn">
                              <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/search-1/">BOOK NOW</a>
                            </li>
                          </ul>
                          <div className="access-location">
                            <a href='javascript:;' onClick={this.requestGeolocation.bind(this)} title="Access your location">
                              <MdLocationOn style={{color: '#EA4335', fontSize: '28px'}}/>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{height: '10px'}} className="nd_options_section" />
                </div>
                {/*RESPONSIVE*/}
                <div className="nd_options_section text-center d-none nd_options_display_block_responsive">
                  <div className="nd_options_section nd_options_height_20" />
                  <a className="d-inline-block" href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel">
                    <img alt="logo" className="nd_options_float_left" src="/static/images/logo.png" />
                  </a>
                  <div className="nd_options_section nd_options_height_10" />
                  <div className="nd_options_section">
                    <a className="nd_options_open_navigation_2_sidebar_content nd_options_open_navigation_2_sidebar_content"
                      href="javascript:;"
                      onClick={this.toggleSideBar.bind(this)}>
                      <img alt="icon-menu" className="icon-menu" src="/static/svg/icon-menu.svg" />
                    </a>
                  </div>
                  <div className="nd_options_section nd_options_height_20" />
                </div>
                {/*RESPONSIVE*/}
              </div>
              {/*end container*/}
            </div>
          </div>
          {/*STICKY NAVIGATION*/}
          <div className={this.state.isSticky ? "nd_options_section navigation sticky_nav sticky_move_down"  : "nd_options_section navigation sticky_nav sticky_move_up"}>
            <div className="nd_options_container nd_options_position_relative">
              <div className="nav-content nd_options_dnone_responsive">
                  <div style={{height: '10px'}} className="nd_options_section" />
                    {/*LOGO*/}
                    <Link route="home">
                      <a>
                        <img alt="logo" className="nd_options_position_absolute nd_options_left_15 logo" src="/static/images/logo.png"/>
                      </a>
                    </Link>
                    <div className="nd_options_navigation_2 nd_options_navigation_type nd_options_text_align_right nd_options_float_right nd_options_dnone_responsive">
                    <div className="nd_options_display_table">
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <div className="menu-menu-1-container">
                          <ul id="menu-menu-2" className="menu">
                            <li className={this.props.page === 'home' ? 'active' : ''}>
                              <Link route="home">
                                <a>HOME</a>
                              </Link>
                            </li>
                            <li>
                              <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/search-1/">PACKAGES</a>
                              <ul className="sub-menu">
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/search-1/">Search</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/packages/london/">Single Package</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/destinations/europe/">Destination</a></li>
                              </ul>
                            </li>
                            <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/shop/">SHOP</a>
                              <ul className="sub-menu">
                                <li ><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/shop/">Shop</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/cart/">Cart</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/checkout/">Checkout</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/my-account/">My account</a></li>
                              </ul>
                            </li>
                            <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/about-us/">ABOUT US</a></li>
                            <li><a href="#">PAGES</a>
                              <ul className="sub-menu">
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/agency-destinations/">Best Destinations</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/staff/">Staff</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/services/">Services</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/prices/">Prices</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/faq/">Faq</a></li>
                              </ul>
                            </li>
                            <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-1/">CONTACT</a>
                              <ul className="sub-menu">
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-1/">Contact 1</a></li>
                                <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-2/">Contact 2</a></li>
                              </ul>
                            </li>
                            <li className="nd_options_book_now_btn">
                              <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/search-1/">BOOK NOW</a>
                            </li>
                          </ul>
                          <div className="access-location">
                            <a href='javascript:;' onClick={this.requestGeolocation.bind(this)} title="Access your location">
                              <MdLocationOn style={{color: '#EA4335', fontSize: '28px'}}/>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{height: '10px'}} className="nd_options_section" />
                </div>
              {/*RESPONSIVE*/}
              <div className="nd_options_section text-center d-none nd_options_display_block_responsive">
                <div className="nd_options_section nd_options_height_20" />
                <a className="d-inline-block" href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel">
                  <img alt="logo" className="nd_options_float_left" src="/static/images/logo.png" />
                </a>
                <div className="nd_options_section nd_options_height_10" />
                <div className="nd_options_section">
                  <a className="nd_options_open_navigation_2_sidebar_content nd_options_open_navigation_2_sidebar_content"
                    href="javascript:;"
                    onClick={this.toggleSideBar.bind(this)}>
                    <img alt="icon-menu" className="icon-menu" src="/static/svg/icon-menu.svg" />
                  </a>
                </div>
                <div className="nd_options_section nd_options_height_20" />
              </div>
              {/*RESPONSIVE*/}
            </div>
          </div>
          {/*STICKY NAVIGATION*/}
        </header>
      </div>
      )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
