import React from 'react'
import { Layout, MyMap, TopPromotionItem } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Router, Link } from 'routes'
import { connect } from 'react-redux'
import { saveRedirectUrl } from 'actions'
import ApiService from 'services/api.service'

const mapStateToProps = state => {
  return {
    user: state.user,
    location: state.location,
    errorPermission: state.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveRedirectUrl: (url) => {dispatch(saveRedirectUrl(url))}
  }
}

class Home extends React.Component {
  displayName = 'Home Page'

  static propTypes = {
    saveRedirectUrl: PropTypes.func,
    user: PropTypes.object,
    location: PropTypes.any,
    errorPermission: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.destinations = [
      {
        route: '',
        title: 'OCEANIA',
        featured_img: '/static/images/oceania.jpg'
      },
      {
        route: '',
        title: 'AFRICA',
        featured_img: '/static/images/africa.jpg'
      },
      {
        route: '',
        title: 'AMERICA',
        featured_img: '/static/images/america.jpg'
      },
      {
        route: '',
        title: 'ASIA',
        featured_img: '/static/images/asia.jpg'
      }
    ]
    this.apiService = ApiService()
    this.state = {
      num_tours: '',
      num_locations: '',
      topTours: []
    }
  }

  componentDidMount() {
    this.props.saveRedirectUrl && this.props.saveRedirectUrl(Router.asPath)
    this.apiService.getStatisticNumber().then((data) => {
      this.setState({
        num_tours: data.num_of_tours,
        num_locations: data.num_of_locations
      })
    })
    this.apiService.getTours(1, 6).then((res) => {
      this.setState({
        topTours: res.data
      })
    })
  }

  render() {
    return (
      <>
        <Layout page="home" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <MyMap
                isMarkerShown={true}
                isSearchBox={true}
                userLocation={this.props.location ? this.props.location : null}/>
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
                  {!!this.state.topTours.length && this.state.topTours.map((item, key) => {
                      return(
                        <div className="col-sm-4 no-padding" key={key}>
                          <TopPromotionItem item={item} index={key}/>
                        </div>
                      )
                    })
                  }
                </div>
                <div className="row text-center show-more-area">
                  <Link route="tours">
                    <a className="show-more">ALL TOURS</a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="row parallax-area">
              <div className="col-sm-4 parallax-item">
                <div className="inner">
                  <div className="wrapper">
                    <div className="nd_options_height_20" />
                    <h1>{this.state.num_locations}</h1>
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
                    <h1>{this.state.num_tours}</h1>
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
                  {this.destinations.map((item, key) => {
                      return(
                        <div className="col-sm-3 no-padding destination-item" key={key}>
                          <div className="destination-item-contain">
                            <div className="content">
                              <div className="title-item">
                                <a>{item.title}</a>
                              </div>
                              <img alt="featured_img" src={item.featured_img} />
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </section>
        </Layout>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
