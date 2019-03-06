import React from 'react'
import { Layout } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Router, Link } from 'routes'
import { logout } from 'actions'
import { connect } from 'react-redux'
import ApiService from 'services/api.service'
import { FaUserAlt, FaCog, FaShoppingCart, FaKey } from "react-icons/fa"
import { IoIosUndo } from "react-icons/io"

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {dispatch(logout())}
  }
}

class LayoutProfile extends React.Component {
    displayName = 'LayoutProfile'
    static propTypes = {
        logout: PropTypes.func,
        saveRedirectUrl: PropTypes.func,
        user: PropTypes.object,
        page: PropTypes.string,
        children: PropTypes.any.isRequired,
        tabName: PropTypes.string
    }

    constructor(props) {
        super(props)
        this.apiService = ApiService()
        this.state = {

        }
    }

    handleLogout(){
      this.props.logout && this.props.logout()
      this.apiService.logout(() => {})
      Router.pushRoute("login")
    }

    render() {
        return (
            <>
                <Layout page="profile" {...this.props}>
                    <style jsx="jsx">{styles}</style>
                    <div className="main-wrapper">
                      <section className="pageTitle">
                        <div className="overlay" />
                        <div className="container">
                          <div className="row">
                            <div className="col-12">
                              <div className="titleTable">
                                <div className="titleTableInner">
                                  <div className="pageTitleInfo">
                                    <h1>My Profile</h1>
                                    <div className="under-border" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                      <section className="profile">
                        <div className="nd_options_container">
                          <section className="user-profile">
                            <div className="row">
                              <div className="col-md-4 col-lg-3">
                                <ul className="user-profile__navigation">
                                  <li className={this.props.tabName === "profile" ? "active" : ""}>
                                    <Link route="profile">
                                      <a>
                                        <FaUserAlt style={{fontSize: '16px', marginRight: '10px'}}/>
                                        <span>Profile</span>
                                      </a>
                                    </Link>
                                  </li>
                                  <li className={this.props.tabName === "my-booking" ? "active" : ""}>
                                    <Link route="my-booking">
                                      <a>
                                        <FaShoppingCart style={{fontSize: '16px', marginRight: '10px'}}/>
                                        My booking
                                      </a>
                                    </Link>
                                  </li>
                                  <li className={this.props.tabName === "update-profile" ? "active" : ""}>
                                    <Link route="update-profile">
                                      <a>
                                        <FaCog style={{fontSize: '16px', marginRight: '10px'}}/>
                                        Update profile
                                      </a>
                                    </Link>
                                  </li>
                                  <li className={this.props.tabName === "change-password" ? "active" : ""}>
                                    <Link route="change-password">
                                      <a>
                                        <FaKey style={{fontSize: '16px', marginRight: '10px'}}/>
                                        Change password
                                      </a>
                                    </Link>
                                  </li>
                                  <li>
                                    <a href="javascript:;" onClick={this.handleLogout.bind(this)}>
                                      <IoIosUndo style={{fontSize: '16px', marginRight: '10px'}}/>
                                      Sign out
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div className="col-md-8 col-lg-9">
                                {this.props.children}
                              </div>
                            </div>
                          </section>
                        </div>
                      </section>
                    </div>
                    {/*<nav className="profile-menu-mobile d-md-none">
                        <ul>
                            <li className={this.props.tabName === "profile" ? "active" : ""}>
                                <Link route="profile">
                                    <a>Thông tin tài khoản</a>
                                </Link>
                            </li>
                            <li className={this.props.tabName === "notification" ? "active" : ""}>
                                <Link route="profile-notification">
                                    <a>Thông báo</a>
                                </Link>
                            </li>
                            <li className={this.props.tabName === "point" ? "active" : ""}>
                                <Link route="profile-point">
                                    <a>Lịch sử điểm</a>
                                </Link>
                            </li>
                            <li className={this.props.tabName === "reviews" ? "active" : ""}>
                                <Link route="profile-reviews">
                                    <a>Lịch sử review</a>
                                </Link>
                            </li>
                            <li className={this.props.tabName === "orders" ? "active" : ""}>
                                <Link route="profile-orders">
                                    <a>Lịch sử đổi quà</a>
                                </Link>
                            </li>
                            {this.props.user &&
                              <li onClick={this.handleLogout.bind(this)}>
                                  <a href="#">Đăng xuất</a>
                              </li>
                            }
                        </ul>
                    </nav>*/}

                    {/* section */}
                    {/*<section className="profile-cover">
                        <div className="profile-bar">
                            <div className="container">
                                <div className="profile-bar-inner">
                                    <div className="profile-avatar">
                                        <img alt={user.display_name} src={user.avatar ? user.avatar : '/static/images/avatar.jpg'} />
                                    </div>
                                    <h3>
                                      {user.display_name}
                                      {user.verified &&
                                        <em className="authen-tick"></em>
                                      }
                                    </h3>
                                    <div className="profile-meta">
                                        <span><em>{user.number_of_reviews}</em> Review</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>*/}

                    {/*<section className="middle">
                        <div className="container">
                            <div className="profile-col">
                                <div className="profile-follow d-none">
                                    <div className="profile-follow-item">
                                        <strong>70</strong>
                                        <p>Reviews</p>
                                    </div>
                                    <div className="profile-follow-item">
                                        <strong>153</strong>
                                        <p>Followers</p>
                                    </div>
                                    <div className="profile-follow-item">
                                        <strong>527</strong>
                                        <p>Thumbs up</p>
                                    </div>
                                </div>
                                <div className="clearfix" />
                                <div className="profile-colleft">
                                    <div className="skintype">
                                        <p>Loại da</p>
                                        <h3>{user.skin_type || 'Chưa xác định'}</h3>
                                        <div className="line" />
                                        <strong>{user.point_balance}</strong>
                                        <p>Điểm</p>
                                    </div>
                                    <div className="profile-menu d-none d-md-block">
                                        <div className={this.props.tabName === "profile" ? "pm-item active" : "pm-item"}>
                                            <Link route="profile">
                                                <a>Thông tin tài khoản</a>
                                            </Link>
                                        </div>
                                        <div className={this.props.tabName === "notification" && this.state.moreType ? "pm-item active has-child dropdown-arrow"
                                           : this.props.tabName === "notification" && !this.state.moreType ? "pm-item active has-child"
                                           : this.props.tabName !== "notification" && this.state.moreType ? "pm-item has-child dropdown-arrow"
                                           : "pm-item has-child"}>
                                            <Link route="profile-notification">
                                                <a onClick={this.handleSeenNotification.bind(this)}>Thông báo</a>
                                            </Link>
                                            <div className="more-type">
                                              <span>{this.state.numNotification}</span>
                                            </div>
                                            <div className={this.state.moreType ? "pm-child d-block" : "pm-child"}>
                                              <a href="#">Pretty tips <em>3</em></a>
                                              <a href="#">Community <em>8</em></a>
                                            </div>
                                        </div>
                                        <div className={this.props.tabName === "point" ? "pm-item active" : "pm-item"}>
                                            <Link route="profile-point">
                                                <a>Lịch sử điểm</a>
                                            </Link>
                                        </div>
                                        <div className={this.props.tabName === "reviews" ? "pm-item active" : "pm-item"}>
                                            <Link route="profile-reviews">
                                                <a>Lịch sử review</a>
                                            </Link>
                                        </div>
                                        <div className={this.props.tabName === "orders" ? "pm-item active" : "pm-item"}>
                                            <Link route="profile-orders">
                                                <a>Lịch sử đổi quà</a>
                                            </Link>
                                        </div>
                                        <div className="pm-item" onClick={this.handleLogout.bind(this)}>
                                            <a href="#">Đăng xuất</a>
                                        </div>
                                    </div>
                                </div>
                                {this.props.children}
                                <div className="clearfix" />
                            </div>
                        </div>
                    </section>*/}
                </Layout>
            </>
        )
    }
}

export default connect(null, mapDispatchToProps)(LayoutProfile)
