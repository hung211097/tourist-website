import React from 'react'
import { Layout, MyMap, TopPromotionItem } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Router } from 'routes'
import { connect } from 'react-redux'
import { isServer } from 'services/utils.service'
import { saveRedirectUrl } from 'actions'

const mapStateToProps = state => {
  return {
    user: state.user,
    location: state.location,
    errorPermission: state.error
  }
}

class Home extends React.Component {
  displayName = 'Home Page'

  static propTypes = {
    dispatch: PropTypes.func,
    user: PropTypes.object,
    location: PropTypes.any,
    errorPermission: PropTypes.string
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch(saveRedirectUrl(''))
  }

  saveCurrentUrl(){
    const { dispatch } = this.props

    let { user } = this.props
    if (!user && !isServer()) {
        dispatch(saveRedirectUrl(Router.asPath))
        Router.pushRoute('login')
    }
  }

  render() {
    return (
      <>
        <Layout page="home" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <MyMap isMarkerShown isSearchBox userLocation={this.props.location ? JSON.parse(this.props.location) : null}/>
            <div className="contain nd_options_container nd_options_clearfix">
              <div className="page-content">
                <div className="row top-promotion">
                  <div className="col-sm-12 top-promotion-title">
                    <div className="top-promotion-inner">
                      <div className="wrapper text-center">
                        <h1>TOP PROMOTIONS</h1>
                        <div className="nd_options_height_20" />
                        <h3>BEST TRAVEL PACKAGES AVAILABLE</h3>
                        <div className="nd_options_height_20" />
                        <div className="nd_options_section nd_options_line_height_0 text-center">
                          <span className="underline-title"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row top-promotion-item">
                  {[1,2,3,4,5,6].map((item, key) => {
                      return(
                        <div className="col-sm-4 no-padding" key={key}>
                          <TopPromotionItem />
                        </div>
                      )
                    })
                  }
                </div>
                <div className="row text-center show-more-area">
                  <a className="show-more">ALL PACKAGES</a>
                </div>
              </div>
            </div>
            <div className="row parallax-area">
              <div className="col-sm-4 parallax-item">
                <div className="inner">
                  <div className="wrapper">
                    <div className="nd_options_height_20" />
                    <h1>75</h1>
                    <div className="nd_options_height_20" />
                    <div className="nd_options_section text-center">
                      <a className="yellow-bg">DESTINATIONS</a>
                    </div>
                    <div className="nd_options_height_20" />
                  </div>
                </div>
              </div>
              <div className="col-sm-4 parallax-item">
                <div className="inner">
                  <div className="wrapper">
                    <div className="nd_options_height_20" />
                    <h1>149</h1>
                    <div className="nd_options_height_20" />
                    <div className="nd_options_section text-center">
                      <a className="green-bg">TOURS PACK</a>
                    </div>
                    <div className="nd_options_height_20" />
                  </div>
                </div>
              </div>
              <div className="col-sm-4 parallax-item">
                <div className="inner">
                  <div className="wrapper">
                    <div className="nd_options_height_20" />
                    <h1>24</h1>
                    <div className="nd_options_height_20" />
                    <div className="nd_options_section text-center">
                      <a className="red-bg">HOUR SUPPORT</a>
                    </div>
                    <div className="nd_options_height_20" />
                  </div>
                </div>
              </div>
              <div className="vc_parallax-inner skrollable skrollable-before"></div>
            </div>
            <div className="contain nd_options_container nd_options_clearfix">
              <div className="page-content">
                <div className="row our-destination">
                  <div className="col-sm-12 our-destination-title">
                    <div className="our-destination-inner">
                      <div className="wrapper text-center">
                        <h1>OUR DESTINATIONS</h1>
                        <div className="nd_options_height_20" />
                        <h3>CHOOSE YOUR NEXT DESTINATION</h3>
                        <div className="nd_options_height_20" />
                        <div className="nd_options_section nd_options_line_height_0 text-center">
                          <span className="underline-title"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row our-destination-item">
                  <div className="col-sm-3 no-padding destination-item">
                    <div className="destination-item-contain">
                      <div className="content">
                        <div className="title-item">
                          <a>OCEANIA</a>
                        </div>
                        <img alt="feature_img" src="/static/images/oceania.jpg" />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-3 no-padding destination-item">
                    <div className="destination-item-contain">
                      <div className="content">
                        <div className="title-item">
                          <a>AFRICA</a>
                        </div>
                        <img alt="feature_img" src="/static/images/africa.jpg" />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-3 no-padding destination-item">
                    <div className="destination-item-contain">
                      <div className="content">
                        <div className="title-item">
                          <a>AMERICA</a>
                        </div>
                        <img alt="feature_img" src="/static/images/america.jpg" />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-3 no-padding destination-item">
                    <div className="destination-item-contain">
                      <div className="content">
                        <div className="title-item">
                          <a>ASIA</a>
                        </div>
                        <img alt="feature_img" src="/static/images/asia.jpg" />
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

export default connect(mapStateToProps)(Home)
