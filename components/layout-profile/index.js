import React from 'react'
import { Layout } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Router, Link } from 'routes'
import { logout, saveRedirectUrl } from 'actions'
import { connect } from 'react-redux'
import ApiService from 'services/api.service'
import { checkLogin } from 'services/auth.service'
import { removeItem } from '../../services/local-storage.service'
import { KEY } from '../../constants/local-storage'
import { withNamespaces } from "react-i18next"
import { metaData } from '../../constants/meta-data'
import StickyBox from 'react-sticky-box'

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {dispatch(logout())},
    saveRedirectUrl: (url) => {dispatch(saveRedirectUrl(url))},
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
        tabName: PropTypes.string,
        t: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.apiService = ApiService()
        this.state = {

        }
    }

    componentDidMount(){
      if (!checkLogin()) {
          return
      }
    }

    handleLogout(){
      this.props.logout && this.props.logout()
      removeItem(KEY.TOKEN)
      this.props.saveRedirectUrl && this.props.saveRedirectUrl(Router.asPath)
      this.apiService.logout(() => {})
      Router.pushRoute("login")
    }

    render() {
        const {t} = this.props
        return (
            <>
                <Layout page="profile" seo={{title: metaData.PROFILE.title, description: metaData.PROFILE.description}} {...this.props}>
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
                                    <h1>{t('profile.title')}</h1>
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
                                <StickyBox offsetTop={10}>
                                  <ul className="user-profile__navigation">
                                  <li className={this.props.tabName === "profile" ? "active" : ""}>
                                    <Link route="profile">
                                      <a>
                                        <i className="fas fa-user-alt" style={{fontSize: '16px', marginRight: '10px'}}></i>
                                        <span>{t('profile.menu_profile')}</span>
                                      </a>
                                    </Link>
                                  </li>
                                  <li className={this.props.tabName === "my-booking" ? "active" : ""}>
                                    <Link route="my-booking">
                                      <a>
                                        <i className="fas fa-shopping-cart" style={{fontSize: '16px', marginRight: '10px'}}></i>
                                        {t('profile.menu_booking')}
                                      </a>
                                    </Link>
                                  </li>
                                  <li className={this.props.tabName === "update-profile" ? "active" : ""}>
                                    <Link route="update-profile">
                                      <a>
                                        <i className="fas fa-cog" style={{fontSize: '16px', marginRight: '10px'}}></i>
                                        {t('profile.menu_update_profile')}
                                      </a>
                                    </Link>
                                  </li>
                                  {!!this.props.user && !!Object.keys(this.props.user).length && this.props.user.type === 'local' &&
                                    <li className={this.props.tabName === "change-password" ? "active" : ""}>
                                      <Link route="change-password">
                                        <a>
                                          <i className="fas fa-key" style={{fontSize: '16px', marginRight: '10px'}}></i>
                                          {t('profile.menu_change_password')}
                                        </a>
                                      </Link>
                                    </li>
                                  }
                                  <li>
                                    <a href="javascript:;" onClick={this.handleLogout.bind(this)}>
                                      <i className="fas fa-sign-out-alt" style={{fontSize: '16px', marginRight: '10px'}}></i>
                                      {t('profile.menu_logout')}
                                    </a>
                                  </li>
                                </ul>
                                </StickyBox>
                              </div>
                              <div className="col-md-8 col-lg-9">
                                {this.props.children}
                              </div>
                            </div>
                          </section>
                        </div>
                      </section>
                    </div>
                </Layout>
            </>
        )
    }
}

export default withNamespaces('translation')(connect(null, mapDispatchToProps)(LayoutProfile))
