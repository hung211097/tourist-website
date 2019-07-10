import React from 'react'
import { Router, Link } from 'routes'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ApiService from 'services/api.service'
import { ClickOutside } from 'components'
import { saveLocation, logout, saveRedirectUrl, saveProfile, useModal } from '../../actions'
import { setLocalStorage, getLocalStorage, removeItem } from '../../services/local-storage.service'
import { KEY } from '../../constants/local-storage'
import { lng, getDosmesticTour, getInternationalTour } from '../../constants'
import { withNamespaces } from "react-i18next"
import { modal } from '../../constants'

const mapStateToProps = (state) => {
  return {
    user: state.user,
    recommendLocation: state.recommendLocation
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveLocation: (location, err) => {dispatch(saveLocation(location, err))},
    saveRedirectUrl: (url) => {dispatch(saveRedirectUrl(url))},
    saveProfile: () => {dispatch(saveProfile())},
    logout: () => {dispatch(logout())},
    useModal: (data) => {dispatch(useModal(data))}
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
    logout: PropTypes.func,
    i18n: PropTypes.object,
    t: PropTypes.func,
    recommendLocation: PropTypes.array,
    useModal: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.domesticTour  = getDosmesticTour()
    this.internationalTour = getInternationalTour()
    this.state = {
      showSidebar: false,
      showSearchBox: false,
      isSticky: false,
      keyword: '',
      showChangeLng: false,
      showChangeLngMobile: false,
      showMenuLv2: false,
      menuLv2: null,
      menuTitleLv2: null,
      language: [
        {
          label: "en",
          isChoose: false,
          flag: "/static/images/uk.png"
        },
        {
          label: "vi",
          isChoose: false,
          flag: "/static/images/vi.png"
        }
      ]
    }
  }

  componentDidMount() {
    this.loadProfile()
    let temp = this.state.language
    const lang = getLocalStorage(KEY.LANGUAGE)
    if(lang){
      temp.forEach((item) => {
        if(item.label === lang){
          item.isChoose = true
        }
      })
      this.props.i18n.changeLanguage(lang)
    }
    else{
      let findItem = temp.find((item) => {
        return item.label === lng.VI
      })
      findItem.isChoose = true
    }
    this.setState({
      language: temp
    })
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
      this.watchID = navigator.geolocation.getCurrentPosition(this.showLocation.bind(this), this.showError.bind(this), {timeout: 5000, enableHighAccuracy: true});
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
      showSearchBox: false,
      keyword: ''
    })
  }

  handleChangeKeyword(e){
    this.setState({
      keyword: e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault()
    Router.pushRoute('search-result', {keyword: this.state.keyword})
    this.setState({
      keyword: '',
    })
  }

  toggleChangeLng(){
    this.setState({
      showChangeLng: !this.state.showChangeLng
    })
  }

  toggleChangeLngMobile(){
    this.setState({
      showChangeLngMobile: !this.state.showChangeLngMobile
    })
  }

  offShowChangeLng(){
    this.setState({
      showChangeLng: false
    })
  }

  chosenLng(){
    let temp = this.state.language.find((item) => {
      return item.isChoose === true
    })
    return temp
  }

  changeLng(choose){
    let temp = this.state.language
    temp.forEach((item) => {
      if(item.label === choose.label){
        item.isChoose = true
        setLocalStorage(KEY.LANGUAGE, item.label)
        this.props.i18n.changeLanguage(choose.label)
      }
      else{
        item.isChoose = false
      }
    })
    this.setState({
      language: temp
    })
  }

  handleShowRecommendation(){
    this.props.useModal && this.props.useModal({type: modal.RECOMMEND, isOpen: true, data: ''})
  }

  handleShowMenuLv2(menu, route){
    this.setState({
      menuLv2: menu,
      menuTitleLv2: route,
      showMenuLv2: true
    })
  }

  handleBackLv1(){
    this.setState({
      showMenuLv2: false,
    })
  }

  render() {
    const { t } = this.props
    return (
      <div itemScope="itemScope" itemType="http://schema.org/WPHeader">
        <style jsx>{styles}</style>
        {/* header */}
        <header className="header">
          <ClickOutside onClickOutside={this.handleClickOutSide.bind(this)}>
            <div className={this.state.showSidebar ? "navigation_responsive" : "navigation_responsive hidden_sidebar"}>
              <div className="suitcase-container">
                <div className="suitcase-relative">
                  {this.props.recommendLocation &&
                    <div className="count-location">
                      <span>{this.props.recommendLocation.length}</span>
                    </div>
                  }
                  <a onClick={this.handleShowRecommendation.bind(this)} title="Recommendation">
                    <img alt="icon" src="/static/images/luggage.png"/>
                  </a>
                </div>
              </div>
              <img alt="close" className="nd_options_close_navigation_2_sidebar_content nd_options_cursor_pointer nd_options_right_20 nd_options_top_20 nd_options_position_absolute"
                src='/static/svg/icon-close-white.svg' width={25} onClick={this.toggleSideBar.bind(this)}/>
              <div className="nd_options_navigation_2_sidebar">
                <div className="menu-menu-1-container">
                  <ul className="menu">
                    <li style={this.props.user && !!Object.keys(this.props.user).length ? {paddingBottom: '30px'} : null}>
                      <form className="search-box-responsive" onSubmit={this.handleSubmit.bind(this)}>
                        <div className="icon-search-container active">
                          <span><i className="fas fa-search" style={{color: 'white', fontSize: '18px'}}></i></span>
                          <input type="text" className="search-input"
                            value={this.state.keyword} onChange={this.handleChangeKeyword.bind(this)}
                            placeholder={t('header.search_tour')} />
                        </div>
                      </form>
                    </li>
                    {!!this.props.user && !!Object.keys(this.props.user).length &&
                      <li>
                        <Link route="profile">
                          <a className="w-100 effect-hover">
                            <div className="account-zone-responsive">
                              <img alt="avatar" src={this.props.user && this.props.user.avatar ? (this.props.user.avatar) : "/static/images/avatar.jpg"} />
                              <p>{this.props.user ? this.props.user.fullname : ''}</p>
                            </div>
                          </a>
                        </Link>
                      </li>
                    }
                    <li className={this.props.page === 'home' ? 'active' : ''}>
                      <Link route="home">
                        <a className="effect-hover">{t('header.home')}</a>
                      </Link>
                    </li>
                    <li className={this.props.page === 'domestic_tour' ? 'active has-child' : 'has-child'}>
                      <a className="effect-hover" onClick={this.handleShowMenuLv2.bind(this, this.domesticTour,
                          {name: 'domestic_tour', params: {id: 1, name: "trong-nuoc"}})}>{t('header.domestic_tour')}</a>
                      <span className="arr"
                        onClick={this.handleShowMenuLv2.bind(this, this.domesticTour, {name: 'domestic_tour', params: {id: 1, name: "trong-nuoc"}})}>
                        <i className="fas fa-chevron-right"></i>
                      </span>
                    </li>
                    <li className={this.props.page === 'international_tour has-child' ? 'active' : 'has-child'}>
                      <a className="effect-hover" onClick={this.handleShowMenuLv2.bind(this, this.internationalTour,
                          {name: 'international_tour', params: {id: 2, name: "quoc-te"}})}>{t('header.international_tour')}</a>
                      <span className="arr"
                        onClick={this.handleShowMenuLv2.bind(this, this.internationalTour, {name: 'international_tour', params: {id: 2, name: "quoc-te"}})}>
                        <i className="fas fa-chevron-right"></i>
                      </span>
                    </li>
                    <li className={this.props.page === 'news' ? 'active' : ''}>
                      <Link route="news">
                        <a className="effect-hover">{t('header.news')}</a>
                      </Link>
                    </li>
                    <li className="no-padding">
                      <div className="apart" />
                    </li>
                    {!!this.props.user && !!Object.keys(this.props.user).length ?
                      <li>
                        <a onClick={this.handleLogout.bind(this)} href="javascript:;" className="effect-hover">
                          {t('header.logout')} <i className="fas fa-sign-out-alt" style={{fontSize: '18px', color: 'white', marginLeft: '8px'}}></i>
                        </a>
                      </li>
                      :
                      <li>
                        <Link route="login">
                          <a className="effect-hover">
                            {t('header.login')}
                            <i className="fas fa-sign-in-alt" style={{fontSize: '18px', color: 'white', marginLeft: '8px'}}></i>
                          </a>
                        </Link>
                      </li>
                    }
                    <li className="contact-sidebar-zone">
                      <div className="contact-sidebar">
                        <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                          <a href="mailto:traveltour@gmail.com" className="nd_options_margin_right_10 nd_options_float_left">
                            <i className="fas fa-envelope" style={{color: 'white', fontSize: '16px'}}></i>
                          </a>
                        </div>
                        <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                          <a className="nd_options_margin_right_20" href="mailto:traveltour@gmail.com">traveltour@gmail.com</a>
                        </div>
                      </div>
                      <div className="contact-sidebar">
                        <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                          <a href="tel:0963186896" className="nd_options_margin_right_10 nd_options_float_left">
                            <i className="fas fa-phone" style={{color: 'white', fontSize: '16px'}}></i>
                          </a>
                        </div>
                        <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                          <a className="nd_options_margin_right_20" href="tel:0963186896">{t('header.hotline')}: 0963186896</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className={this.state.showMenuLv2 ? "navigation_responsive lv2" : "navigation_responsive lv2 hidden_sidebar"}>
              <ul className="menu-lv2">
                <li>
                  <a className="mm-item back-lv1 inactive" onClick={this.handleBackLv1.bind(this)}>
                    <span><i className="fas fa-chevron-left"></i></span>&nbsp;
                    <p> &nbsp;{t('header.back')}</p>
                  </a>
                </li>
                {this.state.menuTitleLv2 &&
                  <li>
                    <Link route="tours" params={this.state.menuTitleLv2.params}>
                      <a className="mm-item active">{t(`header.${this.state.menuTitleLv2.name}`)}</a>
                    </Link>
                  </li>
                }
                {this.state.menuLv2 && this.state.menuLv2.map((item, key) => {
                    return(
                      <li key={key}>
                        <a className="mm-item">{t('header.' + item.name)}</a>
                        <ul className="sub-menu list-unstyled">
                          {item.locations.map((item_2, key_2) => {
                              return(
                                <li key={key_2}>
                                  <Link route="tours-tags" params={{id: item_2.id, name: item_2.slug, mark: this.state.menuTitleLv2.name === 'domestic_tour' ? 'p' : 'c'}}>
                                    <a className="mm-item effect-hover">
                                      {item_2.name}
                                    </a>
                                  </Link>
                                </li>
                              )
                            })
                          }
                        </ul>
                      </li>
                    )
                  })
                }
              </ul>
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
                          <i className="fas fa-envelope" style={{color: 'white', fontSize: '16px', position: 'relative', top: '2px'}}></i>
                        </a>
                      </div>
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <a className="nd_options_margin_right_20" href="mailto:traveltour@gmail.com">traveltour@gmail.com</a>
                      </div>
                    </div>
                    <div className="nd_options_display_table nd_options_float_left">
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <a href="tel:0963186896" className="nd_options_margin_right_10 nd_options_float_left">
                          <i className="fas fa-phone" style={{color: 'white', fontSize: '16px', position: 'relative', top: '1px'}}></i>
                        </a>
                      </div>
                      <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                        <a className="nd_options_margin_right_20" href="tel:0963186896">{t('header.hotline')}: 0963186896</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="right-header">
                  <div className="nd_options_navigation_top_header_2">
                    {!!this.props.user && !!Object.keys(this.props.user).length &&
                      <a onClick={this.handleLogout.bind(this)} href="javascript:;">
                        <div className="nd_options_display_table_cell nd_options_vertical_align_middle float-right logout">
                          <p>{t('header.logout')} <i className="fas fa-sign-out-alt" style={{fontSize: '16px', color: 'white', marginLeft: '5px', position: 'relative', top: '3px'}}></i></p>
                        </div>
                      </a>
                    }
                    {!this.props.user &&
                      <Link route="login">
                        <a>
                          <div className="account-zone">
                            <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                              <h6 className="nd_options_font_size_10 nd_options_text_align_left nd_options_color_white nd_options_second_font">
                                <p className="nd_options_color_white">
                                  {t('header.login')}
                                  <i className="fas fa-sign-in-alt" style={{fontSize: '16px', color: 'white', marginLeft: '6px', position: 'relative', top: '2px'}}></i>
                                </p>
                              </h6>
                            </div>
                          </div>
                        </a>
                      </Link>
                    }
                    <ClickOutside onClickOutside={this.offShowChangeLng.bind(this)}>
                      <div className="multi-lng" onClick={this.toggleChangeLng.bind(this)}>
                        {this.chosenLng() &&
                          <button aria-expanded="false" aria-haspopup="true" className="btn dropdown-toggle" type="button">
                            <img alt={this.chosenLng().label} src={this.chosenLng().flag}/>&nbsp;&nbsp;
                            <span>{this.chosenLng().label}</span>&nbsp;
                          </button>
                        }
                        <div className={this.state.showChangeLng ? "dropdown-menu show" : "dropdown-menu"}>
                          {this.state.language.map((item, key) => {
                              if(!item.isChoose){
                                return(
                                  <div className="wrapper-dropdown-item" key={key} onClick={this.changeLng.bind(this, item)}>
                                    <a className="dropdown-item">
                                      <img src={item.flag} alt={item.label}/>&nbsp;
                                      <span>{item.label}</span>
                                    </a>
                                  </div>
                                )
                              }
                              return null
                            })
                          }
                        </div>
                      </div>
                    </ClickOutside>
                    {!!this.props.user && !!Object.keys(this.props.user).length &&
                      <Link route="profile">
                        <a>
                          <div className="account-zone" style={{lineHeight: '2.6', padding: '11px 15px'}}>
                            <div>
                              <img alt="avatar" src={this.props.user && this.props.user.avatar ? (this.props.user.avatar) : "/static/images/avatar.jpg"} />
                              <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                                <p className="fullname">{this.props.user ? this.props.user.fullname : ''}</p>
                              </div>
                            </div>
                          </div>
                        </a>
                      </Link>
                    }
                    {/*<Link route={!!!this.props.user && !!Object.keys(this.props.user).length ? "profile" : "login"}>
                      <a>
                        <div className="account-zone" style={!!!this.props.user && !!Object.keys(this.props.user).length ? {lineHeight: '2.6', padding: '11px 15px'} : null}>
                          {!!this.props.user && !!Object.keys(this.props.user).length ?
                            <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                              <h6 className="nd_options_font_size_10 nd_options_text_align_left nd_options_color_white nd_options_second_font">
                                <p className="nd_options_color_white">
                                  {t('header.login')}
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
                    </Link>*/}
                    <form className="search-box" onSubmit={this.handleSubmit.bind(this)}>
                      <div className={"icon-search-container active"}>
                        <span onClick={this.onShowSearchBox.bind(this)}><i className="fas fa-search" style={{color: 'white', fontSize: '18px'}}></i></span>
                        <input type="text" className="search-input"
                          value={this.state.keyword} onChange={this.handleChangeKeyword.bind(this)}
                          placeholder={t('header.search_tour')}/>
                        <span className="fas fa-times-circle" onClick={this.onHideSearchBox.bind(this)}></span>
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
                  {/*<div style={{height: '10px'}} className="nd_options_section" />*/}
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
                                <a>{t('header.home')}</a>
                              </Link>
                            </li>
                            <li className={this.props.page === 'domestic_tour' ? 'active mega-menu' : 'mega-menu'}>
                              <Link route="tours" params={{id: 1, name: "trong-nuoc"}}>
                                <a>{t('header.domestic_tour')}</a>
                              </Link>
                              <ul className="row dropdown-menu">
                                {this.domesticTour.map((item, key) => {
                                    return(
                                      <li className="col-sm-4 col-12" key={key}>
                                        <ul className="list-unstyled">
                                          <li>{t('header.' + item.name)}</li>
                                          {item.locations.map((item_2, key_2) => {
                                              return(
                                                <li key={key_2}>
                                                  <Link route="tours-tags" params={{id: item_2.id, name: item_2.slug, mark: 'p'}}>
                                                    <a>
                                                      {item_2.name}
                                                    </a>
                                                  </Link>
                                                </li>
                                              )
                                            })
                                          }
                                        </ul>
                                      </li>
                                    )
                                  })
                                }
                              </ul>
                            </li>
                            <li className={this.props.page === 'international_tour' ? 'active mega-menu' : 'mega-menu'}>
                              <Link route="tours" params={{id: 2, name: "quoc-te"}}>
                                <a>{t('header.international_tour')}</a>
                              </Link>
                              <ul className="row dropdown-menu">
                                {this.internationalTour.map((item, key) => {
                                    return(
                                      <li className="col-sm-4 col-12" key={key}>
                                        <ul className="list-unstyled">
                                          <li>{t('header.' + item.name)}</li>
                                          {item.locations.map((item_2, key_2) => {
                                              return(
                                                <li key={key_2}>
                                                  <Link route="tours-tags" params={{id: item_2.id, name: item_2.slug, mark: 'c'}}>
                                                    <a>
                                                      {t('header.' + item_2.name)}
                                                    </a>
                                                  </Link>
                                                </li>
                                              )
                                            })
                                          }
                                        </ul>
                                      </li>
                                    )
                                  })
                                }
                              </ul>
                            </li>
                            <li className={this.props.page === 'news' ? 'active' : ''}>
                              <Link route="news">
                                <a>{t('header.news')}</a>
                              </Link>
                            </li>
                            <li className="nd_options_recommend">
                              {this.props.recommendLocation &&
                                <div className="count-location">
                                  <span>{this.props.recommendLocation.length}</span>
                                </div>
                              }
                              <div className="recommend-container">
                                <a onClick={this.handleShowRecommendation.bind(this)} title="Recommendation">
                                  <img alt="icon" src="/static/images/luggage.png"/>
                                </a>
                              </div>
                            </li>
                          </ul>
                          <div className="access-location">
                            <a href='javascript:;' onClick={this.requestGeolocation.bind(this)} title="Access your location">
                              <i className="fas fa-map-marker-alt"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*<div style={{height: '10px'}} className="nd_options_section" />*/}
                </div>
                {/*RESPONSIVE*/}
                <div className="nd_options_section text-center d-none nd_options_display_block_responsive">
                  <div className="nd_options_section nd_options_height_20" />
                  <div className="nd_options_section row row-center">
                    <div className="col-2 no-padding text-left mobile-logo-container">
                      <a className="nd_options_open_navigation_2_sidebar_content nd_options_open_navigation_2_sidebar_content mobile-logo"
                        href="javascript:;"
                        onClick={this.toggleSideBar.bind(this)}>
                        <img alt="icon-menu" className="icon-menu" src="/static/svg/icon-menu.svg" />
                      </a>
                    </div>
                    <div className="col-8 text-center">
                      <Link route="home">
                        <a className="d-inline-block toggle-menu">
                          <img alt="logo" className="nd_options_float_left logo-sticky" src="/static/images/logo.png" />
                        </a>
                      </Link>
                    </div>
                    <div className="col-2 no-padding multi-mobile">
                      <div className="multi-lng-mobile" onClick={this.toggleChangeLngMobile.bind(this)}>
                        {this.chosenLng() &&
                          <button aria-expanded="false" aria-haspopup="true" className="btn dropdown-toggle" type="button">
                            <img alt={this.chosenLng().label} src={this.chosenLng().flag}/>&nbsp;&nbsp;
                            <span className="d-none d-lg-inline">{this.chosenLng().label}</span>&nbsp;
                          </button>
                        }
                        <div className={this.state.showChangeLngMobile ? "dropdown-menu show" : "dropdown-menu"}>
                          {this.state.language.map((item, key) => {
                              if(!item.isChoose){
                                return(
                                  <div className="wrapper-dropdown-item" key={key} onClick={this.changeLng.bind(this, item)}>
                                    <a className="dropdown-item">
                                      <img src={item.flag} alt={item.label}/>&nbsp;
                                      <span>{item.label}</span>
                                    </a>
                                  </div>
                                )
                              }
                              return null
                            })
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="nd_options_section nd_options_height_20" />
                </div>
                {/*RESPONSIVE*/}
              </div>
              {/*end container*/}
            </div>
          </div>
          {/*STICKY NAVIGATION*/}
          {/*<div className={this.state.isSticky ? "nd_options_section navigation sticky_nav sticky_move_down"  : "nd_options_section navigation sticky_nav sticky_move_up"}>*/}
            {/*<div className="nd_options_container nd_options_position_relative">*/}
              {/*<div className="nav-content nd_options_dnone_responsive">*/}
                  {/*<div style={{height: '10px'}} className="nd_options_section" />*/}
                  {/*<Link route="home">
                    <a>
                      <img alt="logo" className="nd_options_position_absolute nd_options_left_15 logo" src="/static/images/logo.png"/>
                    </a>
                  </Link>*/}
                  {/*<div className="nd_options_navigation_2 nd_options_navigation_type nd_options_text_align_right nd_options_float_right nd_options_dnone_responsive">
                    <div className="nd_options_display_table">
                        <div className="nd_options_display_table_cell nd_options_vertical_align_middle">
                          <div className="menu-menu-1-container">
                            <ul id="menu-menu-2" className="menu">
                              <li className={this.props.page === 'home' ? 'active' : ''}>
                                <Link route="home">
                                  <a>{t('header.home')}</a>
                                </Link>
                              </li>
                              <li className={this.props.page === 'domestic_tour' ? 'active mega-menu' : 'mega-menu'}>
                                <Link route="tours" params={{id: 1, name: "trong-nuoc"}}>
                                  <a>{t('header.domestic_tour')}</a>
                                </Link>
                                <ul className="row dropdown-menu">
                                  {this.domesticTour.map((item, key) => {
                                      return(
                                        <li className="col-sm-4 col-12" key={key}>
                                          <ul className="list-unstyled">
                                            <li>{t('header.' + item.name)}</li>
                                            {item.locations.map((item_2, key_2) => {
                                                return(
                                                  <li key={key_2}>
                                                    <Link route="tours" params={{id: item_2.id, name: item_2.slug, mark: 'p'}}>
                                                      <a>
                                                        {item_2.name}
                                                      </a>
                                                    </Link>
                                                  </li>
                                                )
                                              })
                                            }
                                          </ul>
                                        </li>
                                      )
                                    })
                                  }
                                </ul>
                              </li>
                              <li className={this.props.page === 'international_tour' ? 'active mega-menu' : 'mega-menu'}>
                                <Link route="tours" params={{id: 2, name: "quoc-te"}}>
                                  <a>{t('header.international_tour')}</a>
                                </Link>
                                <ul className="row dropdown-menu">
                                  {this.internationalTour.map((item, key) => {
                                      return(
                                        <li className="col-sm-4 col-12" key={key}>
                                          <ul className="list-unstyled">
                                            <li>{t('header.' + item.name)}</li>
                                            {item.locations.map((item_2, key_2) => {
                                                return(
                                                  <li key={key_2}>
                                                    <Link route="tours" params={{id: item_2.id, name: item_2.slug, mark: 'c'}}>
                                                      <a>
                                                        {t('header.' + item_2.name)}
                                                      </a>
                                                    </Link>
                                                  </li>
                                                )
                                              })
                                            }
                                          </ul>
                                        </li>
                                      )
                                    })
                                  }
                                </ul>
                              </li>
                              <li className={this.props.page === 'news' ? 'active' : ''}>
                                <Link route="news">
                                  <a>{t('header.news')}</a>
                                </Link>
                              </li>
                              <li className="nd_options_recommend">
                                {this.props.recommendLocation &&
                                  <div className="count-location">
                                    <span>{this.props.recommendLocation.length}</span>
                                  </div>
                                }
                                <div className="recommend-container">
                                  <a onClick={this.handleShowRecommendation.bind(this)} title="Recommendation">
                                    <img alt="icon" src="/static/images/luggage.png"/>
                                  </a>
                                </div>
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
                  </div>*/}
              {/*</div>*/}
              {/*RESPONSIVE*/}
              {/*<div className="nd_options_section text-center d-none nd_options_display_block_responsive">
                <div className="nd_options_section nd_options_height_20" />
                <div className="nd_options_section row row-center">
                  <div className="col-2 no-padding text-left">
                    <a className="nd_options_open_navigation_2_sidebar_content nd_options_open_navigation_2_sidebar_content"
                      href="javascript:;"
                      onClick={this.toggleSideBar.bind(this)}>
                      <img alt="icon-menu" className="icon-menu" src="/static/svg/icon-menu.svg" />
                    </a>
                  </div>
                  <div className="col-8 text-center">
                    <Link route="home">
                      <a className="d-inline-block">
                        <img alt="logo" className="nd_options_float_left logo-sticky" src="/static/images/logo.png" />
                      </a>
                    </Link>
                  </div>
                  <div className="col-2 no-padding text-left">
                    <div className="multi-lng-mobile" onClick={this.toggleChangeLngMobile.bind(this)}>
                      {this.chosenLng() &&
                        <button aria-expanded="false" aria-haspopup="true" className="btn dropdown-toggle" type="button">
                          <img alt={this.chosenLng().label} src={this.chosenLng().flag}/>&nbsp;&nbsp;
                          <span className="d-none d-lg-inline">{this.chosenLng().label}</span>&nbsp;
                        </button>
                      }
                      <div className={this.state.showChangeLngMobile ? "dropdown-menu show" : "dropdown-menu"}>
                        {this.state.language.map((item, key) => {
                            if(!item.isChoose){
                              return(
                                <div className="wrapper-dropdown-item" key={key} onClick={this.changeLng.bind(this, item)}>
                                  <a className="dropdown-item">
                                    <img src={item.flag} alt={item.label}/>&nbsp;
                                    <span>{item.label}</span>
                                  </a>
                                </div>
                              )
                            }
                            return null
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="nd_options_section nd_options_height_20" />
              </div>*/}
              {/*RESPONSIVE*/}
            {/*</div>*/}
          {/*</div>*/}
          {/*STICKY NAVIGATION*/}
        </header>
      </div>
      )
    }
}

export default withNamespaces('translation')(connect(mapStateToProps, mapDispatchToProps)(Header))
