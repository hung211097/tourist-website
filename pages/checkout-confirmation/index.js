import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, WizardStep } from 'components'
import { Link } from 'routes'
import { connect } from 'react-redux'
import ApiService from '../../services/api.service'
import { wizardStep } from '../../constants'
import { FaBarcode, FaRegCalendarMinus, FaRegCalendarPlus, FaUserSecret, FaChild, FaRegCalendarAlt, FaPlaneDeparture, FaMoneyBill } from "react-icons/fa"
import { formatDate, distanceFromDays } from '../../services/time.service'
import { getUserAuth } from 'services/auth.service'
import { getSessionStorage, removeItem } from '../../services/session-storage.service'
import { KEY } from '../../constants/session-storage'
import { getCodeTour } from '../../services/utils.service'
import InfiniteScroll from 'react-infinite-scroller'

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

class CheckOutConfirmation extends React.Component {
  displayName = 'Checkout Confirmation Page'

  static propTypes = {
    user: PropTypes.object,
    tourInfo: PropTypes.object
  }

  static async getInitialProps({ query }) {
      let apiService = ApiService()
      // if(!query.tourId){
      //   return { tourInfo: null }
      // }
      let tourInfo = await apiService.getToursTurnId(2)
      return { tourInfo: tourInfo.data };
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      tourInfo: this.props.tourInfo,
      num_adult: 0,
      num_child: 0,
      passengers: [],
      contactInfo: null,
      method: '',
      page: 1,
      hasMore: false
    }
  }

  loadMore(){

  }

  componentDidMount() {
    // if(!this.state.tourInfo){
    //   Router.pushRoute("home")
    // }

    // let passengerInfo = getSessionStorage(KEY.PASSENGER)
    // if(!passengerInfo){
    //   Router.pushRoute("home")
    // }
    // else{
    //   passengerInfo = JSON.parse(passengerInfo)
    //   this.setState({
    //     num_adult: passengerInfo.num_adult,
    //     num_child: passengerInfo.num_child,
    //     contactInfo: passengerInfo.contactInfo,
    //     passengers: passengerInfo.passengers
    //   })
    // }

    // let user = this.props.user
    // if(!user){
    //   user = getUserAuth()
    // }
    // if (user) {
    //     this.setState({
    //         name: user.fullname ? user.fullname : '',
    //         email: user.email ? user.email : '',
    //         phone: user.phone ?  user.phone : '',
    //     })
    // }
  }

  // getTotalPrice(){
  //   const { tourInfo } = this.state
  //   const adultPrice = tourInfo.discount ? tourInfo.price * tourInfo.discount : tourInfo.price
  //   const childPrice = tourInfo.discount ? tourInfo.price * tourInfo.discount : tourInfo.price
  //   return this.state.num_adult * adultPrice + this.state.num_child * childPrice
  // }

  handleClick(){

  }

  render() {
    const { tourInfo } = this.state
    return (
      <>
        <Layout page="checkout" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>CHECKOUT</span>
                      <div className="nd_options_section">
                        <span className="underline"></span>
                      </div>
                    </h1>
                  </div>
                  <div className="nd_options_section nd_options_height_110"/>
                </div>
              </div>
            </div>
            <div className="nd_options_container nd_options_clearfix content">
              <div className="wizard-step-zone">
                <WizardStep step={wizardStep.CONFIRMATION} />
              </div>
              <div className="confirmation-info">
                <div className="row">
                  <div className="col-12 col-sm-10 offset-sm-1 no-padding-res">
                    <div className="book-form">
                      <div className="text-center">
                        <h1>BOOKING CONFIRMATION</h1>
                        <span className="undericon"><FaPlaneDeparture /></span>
                      </div>
                      <div className="tour-info">
                        <div className="title ">
                          <h3>TOUR INFORMATION</h3>
                          <div className="underline-zone">
                            <span className="underline"></span>
                          </div>
                        </div>
                        <div className="content-tour row">
                          <div className="col-sm-4">
                            <img alt="featured_img" src={tourInfo.tour.featured_img}/>
                          </div>
                          <div className="col-sm-8">
                            <h3>
                              <Link route="detail-tour" params={{id: tourInfo.id}}>
                                <a>{tourInfo.tour.name}</a>
                              </Link>
                            </h3>
                            <div className="row mt-4">
                              <div className="col-sm-6">
                                <p>
                                  <i className="fa fa-barcode" aria-hidden="true"><FaBarcode /></i>
                                  Booking Code:&nbsp;
                                  <span>12345</span>
                                </p>
                                <p>
                                  <i className="fa fa-barcode" aria-hidden="true"><FaBarcode /></i>
                                  Tour Code:&nbsp;
                                  <span>{getCodeTour(tourInfo.id)}</span>
                                </p>
                                <p id="liAdult" className="display-hidden">
                                  <i className="fa fa-user-secret" aria-hidden="true"><FaUserSecret /></i>
                                  Adult price:&nbsp;
                                  <span>
                                    {/*<strong>
                                      {tourInfo.discount ? (tourInfo.price * tourInfo.discount).toLocaleString() :
                                      tourInfo.price.toLocaleString()}
                                    </strong> VND*/}
                                    100,000 VND
                                  </span>
                                  <span id="adult"> X 1</span>
                                </p>
                                <p id="liChild" className="display-hidden">
                                  <i className="fa fa-child" aria-hidden="true"><FaChild /></i>
                                  Children price:&nbsp;
                                  <span>
                                    {/*<strong>
                                      {tourInfo.discount ? (tourInfo.price * tourInfo.discount).toLocaleString() :
                                      tourInfo.price.toLocaleString()}
                                  </strong> VND*/}
                                  100,000 VND
                                  </span>
                                  <span id="child"> X 0</span>
                                </p>
                                <p className="total">
                                  <i className="fa fa-child" aria-hidden="true"><FaMoneyBill /></i>
                                  Total price:&nbsp;
                                  <span>100,000 VND</span>
                                </p>
                              </div>
                              <div className="col-sm-6">
                                <p>
                                  <i className="fa fa-calendar-minus-o" aria-hidden="true"><FaRegCalendarMinus /></i>
                                  Start date:&nbsp;
                                  <span>{formatDate(tourInfo.start_date)}</span>
                                </p>
                                <p>
                                  <i className="fa fa-calendar-plus-o" aria-hidden="true"><FaRegCalendarPlus /></i>
                                  End date:&nbsp;
                                  <span>{formatDate(tourInfo.end_date)}</span>
                                </p>
                                <p>
                                  <i className="fa fa-calendar" aria-hidden="true"><FaRegCalendarAlt /></i>
                                  Lasting:&nbsp;
                                  <span>{distanceFromDays(new Date(tourInfo.start_date), new Date(tourInfo.end_date))} days</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="apart" />
                      <div className="contact-info">
                        <div className="title">
                          <h3>CONTACT INFORMATION</h3>
                          <div className="underline-zone">
                            <span className="underline"></span>
                          </div>
                        </div>
                        <div className="content-contact row">
                          <div className="col-12">
                            <div className="contact">
                              <p>Fullname: <span>Nguyễn Hưng</span></p>
                              <p>Phone number: <span> 0963186896</span></p>
                              <p>Email: <span>langtudatinhzzz@gmail.com</span></p>
                              <p>Address: <span>Hồ Chí Minh City</span></p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="apart" />
                      <div className="passenger-info">
                        <div className="title">
                          <h3>PASSENGER INFORMATION</h3>
                          <div className="underline-zone">
                            <span className="underline"></span>
                          </div>
                        </div>
                        <div className="content-contact row">
                          <div className="col-12">
                            <div className="table-responsive">
                              <InfiniteScroll
                                pageStart={0}
                                loadMore={this.loadMore.bind(this)}
                                hasMore={this.state.hasMore}
                                useWindow={false}
                                threshold={10}>
                                <table className="table passenger-table">
                                  <thead>
                                    <tr>
                                      <th>Fullname</th>
                                      <th>Phone number</th>
                                      <th>Birthdate</th>
                                      <th>Gender</th>
                                      <th>Age</th>
                                      <th>Identity card / Passport</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[1,2,3,4,5,6].map((item, key) => {
                                        return(
                                          <tr key={key}>
                                            <td>Tạ Nguyễn Hưng</td>
                                            <td>1234567890</td>
                                            <td>08/03/2019</td>
                                            <td>Nam</td>
                                            <td>Adult</td>
                                            <td>3523354654</td>
                                          </tr>
                                        )
                                      })
                                    }
                                  </tbody>
                                </table>
                              </InfiniteScroll>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="confirm-zone">
                        <Link route="home">
                          <a className="co-btn w-auto">
                            BACK TO HOMEPAGE
                          </a>
                        </Link>
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

export default connect(mapStateToProps)(CheckOutConfirmation)
