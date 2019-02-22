import React from 'react'
import { Link } from 'routes'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import ApiService from 'services/api.service'
import { FaRegCreditCard, FaRegCheckSquare, FaSearch, FaTimesCircle } from "react-icons/fa"
import { MdLocationOn } from "react-icons/md";
import { saveLocation } from '../../actions'
import { setLocalStorage, getLocalStorage } from '../../services/local-storage.service'
import { KEY } from '../../constants/local-storage'

const mapStateToProps = () => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveLocation: (location, err) => {dispatch(saveLocation(location, err))}
  }
}

class Header extends React.Component {
  displayName = 'Header'

  static propTypes = {
    accessToken: PropTypes.string,
    page: PropTypes.string,
    saveLocation: PropTypes.func
  }

  constructor(props) {
    super(props)
    // this.apiService = ApiService()
    this.state = {
      showSidebar: false,
      showSearchBox: false,
    }
  }

  componentDidMount() {
    const objLocation = getLocalStorage(KEY.LOCATION)
    if(objLocation || objLocation === ''){
      return
    }
    else{
      this.requestGeolocation()
    }
  }

  componentWillUnmount(){
    // if (this.watchID != null) {
    //   navigator.geolocation.clearWatch(this.watchID);
    //   this.watchID = null;
    // }
  }

  requestGeolocation(){
    if (navigator.geolocation) {
      this.watchID = navigator.geolocation.watchPosition(this.showLocation.bind(this), this.showError.bind(this), {timeout: 100000});
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
    this.setState({
      showSidebar: !this.state.showSidebar
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
                  <li>
                      <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/">HOME</a>
                    </li>
                  <li>
                      <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/search-1/">PACKAGES</a>
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
                      <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/shop/">SHOP</a>
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
                      <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/about-us/">ABOUT US</a>
                    </li>
                  <li>
                      <a href="#">PAGES</a>
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
                      <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/our-news/">NEWS</a>
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
                      <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-1/">CONTACT</a>
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
                      <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/search-1/">BOOK NOW</a>
                    </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="nd_options_section header-part">
            <div className="nd_options_navigation_2_top_header container-fluid">
              {/*start nd_options_container*/}
              <div className="nd_options_container nd_options_clearfix">
                <div className="left-header">
                  <div className="nd_options_navigation_top_header_2">
                    <div className="  nd_options_display_table nd_options_float_left">
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <a href="#" className="nd_options_margin_right_10 nd_options_float_left">
                          <FaRegCreditCard style={{color: 'white', fontSize: '16px'}}/>
                        </a>
                      </div>
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <a className="nd_options_margin_right_20" href="#">Payment Options</a>
                      </div>
                    </div>
                    <div className="nd_options_display_table nd_options_float_left">
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <a href="#" className="nd_options_margin_right_10 nd_options_float_left">
                          <FaRegCheckSquare style={{color: 'white', fontSize: '16px'}}/>
                        </a>
                      </div>
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <a className="nd_options_margin_right_20" href="#">Terms Conditions</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="right-header">
                  <div className="nd_options_navigation_top_header_2">
                    <div className="account-zone">
                      <a href="#">
                        <img alt="avatar" src="/static/images/avatar.jpg" width={30} />
                      </a>
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <p className="nd_options_font_size_12 nd_options_text_align_left">
                          <a href="#">My Account</a>
                        </p>
                        <div className="nd_options_section nd_options_height_5" />
                        <h6 className="nd_options_font_size_10 nd_options_text_align_left nd_options_color_white nd_options_second_font">
                          <a className="nd_options_color_white" href="#">LOG IN</a>
                        </h6>
                      </div>
                    </div>
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
                              <a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/">HOME</a>
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
                                {/*<li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-1/">Contact 1</a>
                                  <ul className="sub-menu">
                                    <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-1/">Contact 1</a></li>
                                    <li><a href="http://www.nicdarkthemes.com/themes/travel/wp/demo/travel/contact-2/">Contact 2</a></li>
                                  </ul>
                                </li>*/}
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
        </header>
      </div>
      )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
