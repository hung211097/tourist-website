import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, WizardStep } from 'components'
import { Router, Link } from 'routes'
import { connect } from 'react-redux'
import ApiService from '../../services/api.service'
import { wizardStep } from '../../constants'
import { FaBarcode, FaRegCalendarMinus, FaRegCalendarPlus, FaUserSecret, FaChild, FaRegCalendarAlt, FaChevronDown, FaCheck } from "react-icons/fa"
import { formatDate, distanceFromDays } from '../../services/time.service'
// import { getUserAuth } from 'services/auth.service'
import { getSessionStorage } from '../../services/session-storage.service'
import { KEY } from '../../constants/session-storage'
import { UnmountClosed } from 'react-collapse'
import { getCodeTour } from '../../services/utils.service'
import { useModal } from '../../actions'

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    useModal: (data) => {dispatch(useModal(data))}
  }
}

class CheckOutPayment extends React.Component {
  displayName = 'Checkout Payment Page'

  static propTypes = {
    user: PropTypes.object,
    tourInfo: PropTypes.object,
    useModal: PropTypes.func
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
      contactInfo: null,
      isShowMethod1: false,
      isShowMethod2: false,
      isShowMethod3: false,
      method: ''
    }
    this.method_1 = React.createRef()
    this.method_2 = React.createRef()
    this.method_3 = React.createRef()
  }

  componentDidMount() {
    if(!this.state.tourInfo){
      Router.pushRoute("home")
    }

    let passengerInfo = getSessionStorage(KEY.PASSENGER)
    if(!passengerInfo){
      Router.pushRoute("checkout-passengers", {tourId: this.state.tourInfo.id})
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

    {/*let user = this.props.user
    if(!user){
      user = getUserAuth()
    }
    if (user) {
        this.setState({
            name: user.fullname ? user.fullname : '',
            email: user.email ? user.email : '',
            phone: user.phone ?  user.phone : '',
        })
    }*/}
  }

  componentWillUnmount(){
    this.timeout && clearTimeout(this.timeout)
  }

  handleSubmit(e){
    e.preventDefault()
    this.setState({
      isSubmit: true
    })

    if(!this.validate()){
      return
    }

    this.props.useModal && this.props.useModal({type: "LOADING", isOpen: true, data: ''})

    this.apiService.bookTour({
      fullname: this.state.contactInfo.name,
      phone: this.state.contactInfo.phone,
      email: this.state.contactInfo.email,
      address: this.state.contactInfo.address,
      idTour_Turn: this.state.tourInfo.id,
      total_pay: this.getTotalPrice(),
      payment: this.state.method,
      passengers: this.state.passengers
    }).then((data) => {
      this.timeout = setTimeout(() => {
        this.props.useModal && this.props.useModal({type: "LOADING", isOpen: false, data: ''})
        Router.pushRoute("checkout-confirmation")
      }, 1000)
    }).catch(() => {
      this.timeout = setTimeout(() => {
        this.props.useModal && this.props.useModal({type: "LOADING", isOpen: false, data: ''})
        this.setState({
          error: "There is an error, please try book tour again!"
        })
      }, 1000)
    })
  }

  validate(){
    if(!this.state.method){
      return false
    }

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

  handleChooseMethod_1(){
    this.setState({
      isShowMethod1: true,
      isShowMethod2: false,
      isShowMethod3: false
    })
    this.method_1.current.click()
  }

  handleChooseMethod_2(){
    this.setState({
      isShowMethod1: false,
      isShowMethod2: true,
      isShowMethod3: false
    })
    this.method_2.current.click()
  }

  handleChooseMethod_3(){
    this.setState({
      isShowMethod1: false,
      isShowMethod2: false,
      isShowMethod3: true
    })
    this.method_3.current.click()
  }

  handleChangeMethod(e){
    this.setState({
      method: e.target.value
    })
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
              <div className="payment-info">
                <div className="row">
                  <div className="col-md-8 col-sm-12 col-12">
                    <div className="payment-wrap bookingForm">
                      <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="wrapper">
                          <div className="title">
                            <h3>PAYMENT METHOD</h3>
                          </div>
                          <p className="caption-text">Please choose one of below payment method:</p>
                          <div className="methods">
                            <div className="method">
                              <input style={{display: 'none'}} value="Incash"
                                type="radio" id="pament-method3" className="payment-method" name="method" ref={this.method_1}
                                onChange={this.handleChangeMethod.bind(this)} checked={this.state.method === 'Incash'}/>
                              <div className="method-content">
                                <label className={this.state.isShowMethod1 ? "title active" : "title"}
                                  onClick={this.handleChooseMethod_1.bind(this)}>
                                  <h4 style={{margin: '0 0 10px'}}>
                                    Pay in cash at Travel Tour Office
                                    <span><img alt="incash" src="/static/images/incash.png" className="incash"/></span>
                                  </h4>
                                  <div className="description">
                                    Please come to Travel Tour Office for payment and receive ticket.
                                  </div>
                                  {this.state.isShowMethod1 ?
                                    <i><FaCheck /></i>
                                    :
                                    <i><FaChevronDown /></i>
                                  }
                                </label>
                                <UnmountClosed isOpened={this.state.isShowMethod1} springConfig={{stiffness: 150, damping: 20}}>
                                  <div className="collapse-content">
                                    <h2>TRAVELTOUR OFFICE</h2>
                                    <div className="nd_options_section nd_options_height_10"/>
                                    <strong>Address:</strong> 162 Ba Tháng Hai, Phường 12, Quận 10, TP.HCM<br />
                                    <div className="nd_options_section nd_options_height_5"/>
                                    <strong>Phone number:</strong> <a href="tel:0963186896">0963186896</a><br />
                                    <div className="nd_options_section nd_options_height_5"/>
                                    <strong>Email:</strong>&nbsp;<a href="mailto:traveltour@gmail.com">traveltour@gmail.com</a><br />
                                  </div>
                                </UnmountClosed>
                              </div>
                            </div>
                            <div className="method">
                              <input style={{display: 'none'}} value="transfer"
                                type="radio" id="pament-method3" className="payment-method" name="method" ref={this.method_2}
                                onChange={this.handleChangeMethod.bind(this)} checked={this.state.method === 'transfer'}/>
                              <div className="method-content">
                                <label className={this.state.isShowMethod2 ? "title active" : "title"}
                                  onClick={this.handleChooseMethod_2.bind(this)}>
                                  <h4 style={{margin: '0 0 10px'}}>
                                    Pay by transfer money through banking
                                    <span><img alt="transfer" src="/static/svg/bank.svg" className="transfer"/></span>
                                  </h4>
                                  <div className="description">
                                    After you transfer money successfully, our staff will contact you by email or telephone
                                  </div>
                                  {this.state.isShowMethod2 ?
                                    <i><FaCheck /></i>
                                    :
                                    <i><FaChevronDown /></i>
                                  }
                                </label>
                                <UnmountClosed isOpened={this.state.isShowMethod2} springConfig={{stiffness: 150, damping: 20}}>
                                  <div className="collapse-content">
                                    <h2>TRAVELTOUR&apos;S BANKING ACCOUNT</h2>
                                    <div className="nd_options_section nd_options_height_10"/>
                                    <strong>Note:</strong><br/>
                                    <div className="nd_options_section nd_options_height_5"/>
                                    <p className="red">Please contact our staffs to confirm your booking before transferring</p>
                                    <p>When you transfer money, the message should be:</p>
                                    <strong>&quot;MT ToudCode, Fullname, Content&quot;</strong><br/>
                                    <p>For example: &quot;MT 00001, Williams, Booking tour on website&quot;</p>
                                    <br/>
                                    <p>Banking account of Travel Tour Company at Vietcombank Hồ Chí Minh City - VCB</p>
                                    <p>Account Number: <strong>13422518A41</strong></p>
                                    <br/>
                                    <p>Thank you very much!</p>
                                  </div>
                                </UnmountClosed>
                              </div>
                            </div>
                            {/*<div className="method">
                              <input style={{display: 'none'}} value="online"
                                type="radio" id="pament-method3" className="payment-method" name="method" ref={this.method_3}
                                onChange={this.handleChangeMethod.bind(this)} checked={this.state.method === 'online'}/>
                              <div className="method-content">
                                <label className={this.state.isShowMethod3 ? "title active" : "title"}
                                  onClick={this.handleChooseMethod_3.bind(this)}>
                                  <h4 style={{margin: '0 0 10px'}}>
                                    Pay in cash at Travel Tour Office
                                    <span><img alt="incash" src="/static/images/incash.png" className="incash"/></span>
                                  </h4>
                                  <div className="description">
                                    Please come to Travel Tour Office for payment and receive ticket.
                                  </div>
                                  {this.state.isShowMethod3 ?
                                    <i><FaCheck /></i>
                                    :
                                    <i><FaChevronDown /></i>
                                  }
                                </label>
                                <UnmountClosed isOpened={this.state.isShowMethod3} springConfig={{stiffness: 150, damping: 20}}>
                                  <div className="collapse-content">
                                    <h2>TRAVELTOUR OFFICE</h2>
                                    <div className="nd_options_section nd_options_height_10"/>
                                    <strong>Address:</strong> 162 Ba Tháng Hai, Phường 12, Quận 10, TP.HCM<br />
                                    <div className="nd_options_section nd_options_height_5"/>
                                    <strong>Phone number:</strong> <a href="tel:0963186896">0963186896</a><br />
                                    <div className="nd_options_section nd_options_height_5"/>
                                    <strong>Email:</strong>&nbsp;<a href="mailto:traveltour@gmail.com">traveltour@gmail.com</a><br />
                                  </div>
                                </UnmountClosed>
                              </div>
                            </div>*/}
                          </div>
                          {this.state.isSubmit && !this.state.method &&
                            <div className="error-announce">
                              <p className="error">Please choose a payment method!</p>
                            </div>
                          }
                          {this.state.error &&
                            <div className="error-announce">
                              <p className="error">{this.state.error}</p>
                            </div>
                          }
                          <div className="col-12 no-padding">
                            <div className="button-area">
                              <ul className="list-inline">
                                <li>
                                  <a onClick={this.handleBack.bind(this)} className="co-btn">Back</a>
                                </li>
                                <li className="pull-right">
                                  <a onClick={this.handleSubmit.bind(this)} className="co-btn">Book</a>
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
                                  <span>{getCodeTour(tourInfo.id)}</span>
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
                                      </strong> VND
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
