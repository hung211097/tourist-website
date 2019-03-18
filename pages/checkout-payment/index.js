import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, WizardStep } from 'components'
import { Router, Link } from 'routes'
import { connect } from 'react-redux'
import ApiService from '../../services/api.service'
import { wizardStep } from '../../constants'
import { FaBarcode, FaRegCalendarMinus, FaRegCalendarPlus, FaUserSecret, FaChild, FaRegCalendarAlt } from "react-icons/fa"
import { formatDate, distanceFromDays } from '../../services/time.service'
import { getUserAuth } from 'services/auth.service'
import { getSessionStorage, removeItem } from '../../services/session-storage.service'
import { KEY } from '../../constants/session-storage'

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = () => {
  return {
  }
}

class CheckOutPayment extends React.Component {
  displayName = 'Checkout Payment Page'

  static propTypes = {
    user: PropTypes.object,
    tourInfo: PropTypes.object
  }

  static async getInitialProps({ query }) {
      let apiService = ApiService()
      if(!query.tourId){
        return { tourInfo: null }
      }
      let tourInfo = await apiService.getToursTurnId(query.tourId)
      return { tourInfo: tourInfo.data };
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      isSubmit: false,
      error: '',
      tourInfo: this.props.tourInfo,
      num_adult: 0,
      num_child: 0,
      passengers: [],
      contactInfo: null
    }
  }

  componentDidMount() {
    if(!this.state.tourInfo){
      Router.pushRoute("home")
    }

    let passengerInfo = getSessionStorage(KEY.PASSENGER)
    if(!passengerInfo){
      Router.pushRoute("home")
    }
    else{
      passengerInfo = JSON.parse(passengerInfo)
      this.setState({
        num_adult: passengerInfo.num_adult,
        num_child: passengerInfo.num_child,
        contactInfo: passengerInfo.contactInfo,
        passengers: passengerInfo.passengers
      })
    }

    let user = this.props.user
    if(!user){
      user = getUserAuth()
    }
    if (user) {
        this.setState({
            name: user.fullname ? user.fullname : '',
            email: user.email ? user.email : '',
            phone: user.phone ?  user.phone : '',
        })
    }
  }

  handleSubmit(e){
    e.preventDefault()
    this.setState({
      isSubmit: true
    })

    if(!this.validate()){
      return
    }

  }

  validate(){


    return true
  }

  getTotalPrice(){
    const { tourInfo } = this.state
    const adultPrice = tourInfo.discount ? tourInfo.price * tourInfo.discount : tourInfo.price
    const childPrice = tourInfo.discount ? tourInfo.price * tourInfo.discount : tourInfo.price
    return this.state.num_adult * adultPrice + this.state.num_child * childPrice
  }

  handleBack(){
    Router.pushRoute("checkout-passengers", {tourId: this.state.tourInfo.id})
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
                <WizardStep step={wizardStep.PAYMENT} />
              </div>
              <div className="passenger-info">
                <div className="row">
                  <div className="col-md-8 col-sm-12 col-12">
                    <div className="payment-wrap bookingForm">
                      <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="wrapper">
                          <div className="title">
                            <h3>PAYMENT METHOD</h3>
                          </div>

                          <div className="col-12 no-padding">
                            <div className="button-area">
                              <ul className="list-inline">
                                <li>
                                  <a onClick={this.handleBack.bind(this)} className="co-btn">Back</a>
                                </li>
                                <li className="pull-right">
                                  <a onClick={this.handleSubmit.bind(this)} className="co-btn">Next</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12 col-12">
                    {tourInfo &&
                      <aside>
                        <div className="book-info">
                          <img alt="featured_img" src={tourInfo.tour.featured_img}/>
                            <div className="info-area">
                              <h3>
                                <Link route="detail-tour" params={{id: tourInfo.id}}>
                                  <a>{tourInfo.tour.name}</a>
                                </Link>
                              </h3>
                              <ul className="list-unstyled">
                                <li>
                                  <i className="fa fa-barcode" aria-hidden="true"><FaBarcode /></i>
                                  Code:&nbsp;
                                  <span>STN084-2019-00396</span>
                                </li>
                                <li>
                                  <i className="fa fa-calendar-minus-o" aria-hidden="true"><FaRegCalendarMinus /></i>
                                  Start date:&nbsp;
                                  <span>{formatDate(tourInfo.start_date)}</span>
                                </li>
                                <li>
                                  <i className="fa fa-calendar-plus-o" aria-hidden="true"><FaRegCalendarPlus /></i>
                                  End date:&nbsp;
                                  <span>{formatDate(tourInfo.end_date)}</span>
                                </li>
                                <li>
                                  <i className="fa fa-calendar" aria-hidden="true"><FaRegCalendarAlt /></i>
                                  Lasting:&nbsp;
                                  <span>{distanceFromDays(new Date(tourInfo.start_date), new Date(tourInfo.end_date))} days</span>
                                </li>
                                {!!this.state.adult &&
                                  <li id="liAdult" className="display-hidden" style={{display: 'list-item'}}>
                                    <i className="fa fa-user-secret" aria-hidden="true"><FaUserSecret /></i>
                                    Adult price:&nbsp;
                                    <span>
                                      <strong>
                                        {tourInfo.discount ? (tourInfo.price * tourInfo.discount).toLocaleString() :
                                        tourInfo.price.toLocaleString()}
                                      </strong> VND
                                    </span>
                                    <span id="adult"> X {this.state.adult}</span>
                                  </li>
                                }
                                {!!this.state.child &&
                                  <li id="liChild" className="display-hidden" style={{display: 'list-item'}}>
                                    <i className="fa fa-child" aria-hidden="true"><FaChild /></i>
                                    Children price:&nbsp;
                                    <span>
                                      <strong>
                                        {tourInfo.discount ? (tourInfo.price * tourInfo.discount).toLocaleString() :
                                        tourInfo.price.toLocaleString()}
                                      </strong> đ
                                    </span>
                                    <span id="child"> X {this.state.child}</span>
                                  </li>
                                }
                                {/*<li id="liExtraServices" className="display-hidden" style={{display: 'none'}}>
                                  <i className="fa fa-cart-plus" aria-hidden="true" />
                                  Dịch vụ cộng thêm:
                                  <span><strong id="priceExtraServices">0</strong> đ</span>
                                </li>*/}
                              </ul>
                              <div className="price-total">
                                <h2>Total price: <span>{this.getTotalPrice().toLocaleString()}</span> VND</h2>
                              </div>
                            </div>
                        </div>
                      </aside>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckOutPayment)
