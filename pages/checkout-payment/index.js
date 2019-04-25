import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, WizardStep } from 'components'
import { Router, Link } from 'routes'
import { connect } from 'react-redux'
import ApiService from '../../services/api.service'
import { wizardStep } from '../../constants'
import { FaBarcode, FaRegCalendarMinus, FaRegCalendarPlus, FaUserSecret, FaChild, FaRegCalendarAlt, FaChevronDown, FaCheck, FaPaypal } from "react-icons/fa"
import { formatDate, distanceFromDays } from '../../services/time.service'
import { getCode, slugify, isServer, convertCurrencyToUSD } from '../../services/utils.service'
import { useModal } from '../../actions'
import { modal } from '../../constants'
import { withNamespaces } from "react-i18next"
import { metaData } from '../../constants/meta-data'
import Redirect from 'routes/redirect'
import PaypalExpressBtn from 'react-paypal-express-checkout'
const client_id_paypal = process.env.CLIENT_ID_PAYPAL

const mapStateToProps = state => {
  return {
    user: state.user,
    passengerInfo: state.passengerInfo
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
    query: PropTypes.object,
    user: PropTypes.object,
    tourInfo: PropTypes.object,
    useModal: PropTypes.func,
    t: PropTypes.func,
    passengerInfo: PropTypes.object
  }

  static async getInitialProps({ res, query }) {
      let apiService = ApiService()
      if(!query.tour_id){
        Redirect(res, '404')
      }
      try{
        let tourInfo = await apiService.getToursTurnId(query.tour_id)
        return { tourInfo: tourInfo.data, query };
      }
      catch(e){
        Redirect(res, '404')
      }
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
      method: '',
      block: false,
      isPay: false
    }
    this.method_1 = React.createRef()
    this.method_2 = React.createRef()
    this.method_3 = React.createRef()
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.apiService.getRateCurrency().then((res) => {
      this.setState({
        rateCurrency: res.quotes.USDVND
      })
    })
    const { passengerInfo } = this.props
    if(passengerInfo){
      this.setState({
        num_adult: passengerInfo.num_adult,
        num_child: passengerInfo.num_child,
        contactInfo: passengerInfo.contactInfo,
        passengers: passengerInfo.passengers
      })
    }
    else{
      Router.pushRoute('checkout-passengers', {tour_id: this.props.query.tour_id})
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

  // UNSAFE_componentWillReceiveProps(props){
  //   const { passengerInfo } = props
  //   if(passengerInfo){
  //     this.setState({
  //       num_adult: passengerInfo.num_adult,
  //       num_child: passengerInfo.num_child,
  //       contactInfo: passengerInfo.contactInfo,
  //       passengers: passengerInfo.passengers
  //     })
  //   }
  // }

  handleSubmit(e){
    e.preventDefault()
    this.submitData()
  }

  submitData(){
    this.setState({
      isSubmit: true
    })

    if(!this.props.passengerInfo){
      return
    }

    if(!this.validate()){
      return
    }

    if(this.state.block){
      return
    }

    this.props.useModal && this.props.useModal({type: modal.LOADING, isOpen: true, data: ''})
    this.setState({
      block: true
    })
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
      this.props.useModal && this.props.useModal({type: modal.LOADING, isOpen: false, data: ''})
      Router.pushRoute("checkout-complete", {book_completed: data.book_tour.code})
    }).catch((e) => {
      let error = "There is an error, please try book tour again!"
      this.props.useModal && this.props.useModal({type: modal.LOADING, isOpen: false, data: ''})
      if(e.result === 'This tour is full'){
        error = 'This tour is full slot'
      }
      this.setState({
        error: error
      })
    })
  }

  validate(){
    if(!this.state.method){
      return false
    }

    if(this.state.method === 'online' && !this.state.isPay){
      return false
    }

    return true
  }

  getTotalPrice(){
    const adultPrice = this.getPriceByAge("adults")
    const childPrice = this.getPriceByAge("children")
    return this.state.num_adult * adultPrice + this.state.num_child * childPrice
  }

  getPriceByAge(age){
    let price = 0
    let res = null
    if(this.state.tourInfo){
      res = this.state.tourInfo.price_passengers.find((item) => {
        return item.type === age
      })
    }

    if(res){
      price = res.price
    }

    return price
  }

  handleBack(){
    Router.pushRoute("checkout-passengers", {tour_id: this.state.tourInfo.id})
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

  onSuccess(){
    // Congratulation, it came here means everything's fine!
    // console.log("The payment was succeeded!", payment);
    // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
    this.setState({
      isPay: true
    }, () => {
      this.submitData()
    })
  }

  onCancel(){
    // User pressed "cancel" or close Paypal's popup!
    // console.log('The payment was cancelled!', data);
    // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    this.setState({
      isPay: false
    })
  }

  onError(){
    // The main Paypal's script cannot be loaded or somethings block the loading of that script!
    // console.log("Error!", err);
    // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
    // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    this.setState({
      isPay: false
    })
  }

  render() {
    const { tourInfo } = this.state
    const {t} = this.props
    return (
      <>
        <Layout page="checkout" seo={{title: metaData.CHECKOUT.title, description: metaData.CHECKOUT.description}} {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>{t('checkout')}</span>
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
                <WizardStep step={wizardStep.PAYMENT} t={t}/>
              </div>
              <div className="payment-info">
                <div className="row">
                  <div className="col-md-8 col-sm-12 col-12">
                    <div className="payment-wrap bookingForm">
                      <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="wrapper">
                          <div className="title">
                            <h3>{t('checkout_payment.title')}</h3>
                          </div>
                          <p className="caption-text">{t('checkout_payment.sub_title')}</p>
                          <div className="methods">
                            <div className="method">
                              <input style={{display: 'none'}} value="incash"
                                type="radio" id="pament-method3" className="payment-method" name="method" ref={this.method_1}
                                onChange={this.handleChangeMethod.bind(this)} checked={this.state.method === 'incash'}/>
                              <div className="method-content">
                                <label className={this.state.isShowMethod1 ? "title active" : "title"}
                                  onClick={this.handleChooseMethod_1.bind(this)}>
                                  <h4 style={{margin: '0 0 10px'}}>
                                    {t('checkout_payment.incash')}
                                    <span><img alt="incash" src="/static/images/incash.png" className="incash"/></span>
                                  </h4>
                                  <div className="description">
                                    {t('checkout_payment.sub_incash')}
                                  </div>
                                  {this.state.isShowMethod1 ?
                                    <i><FaCheck /></i>
                                    :
                                    <i><FaChevronDown /></i>
                                  }
                                </label>
                                <div className={this.state.isShowMethod1 ? "collapse-container show" : "collapse-container"}>
                                  <div className="collapse-content">
                                    <h2>{t('checkout_payment.office')}</h2>
                                    <div className="nd_options_section nd_options_height_10"/>
                                    <strong>{t('checkout_payment.address')}:</strong> 162 Ba Tháng Hai, Phường 12, Quận 10, TP.HCM<br />
                                    <div className="nd_options_section nd_options_height_5"/>
                                    <strong>{t('checkout_payment.phone')}:</strong> <a href="tel:0963186896">0963186896</a><br />
                                    <div className="nd_options_section nd_options_height_5"/>
                                    <strong>Email:</strong>&nbsp;<a href="mailto:traveltour@gmail.com">traveltour@gmail.com</a><br />
                                    <br/>
                                    <p className="bold">{t('checkout_payment.note_pay')}</p>
                                  </div>
                                </div>
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
                                    {t('checkout_payment.transfer')}
                                    <span><img alt="transfer" src="/static/svg/bank.svg" className="transfer"/></span>
                                  </h4>
                                  <div className="description">
                                    {t('checkout_payment.sub_transfer')}
                                  </div>
                                  {this.state.isShowMethod2 ?
                                    <i><FaCheck /></i>
                                    :
                                    <i><FaChevronDown /></i>
                                  }
                                </label>
                                <div className={this.state.isShowMethod2 ? "collapse-container show" : "collapse-container"}>
                                  <div className="collapse-content">
                                    <h2>{t('checkout_payment.account')}</h2>
                                    <div className="nd_options_section nd_options_height_10"/>
                                    <strong>{t('checkout_payment.note')}:</strong><br/>
                                    <div className="nd_options_section nd_options_height_5"/>
                                    <p className="red">{t('checkout_payment.note_content')}</p>
                                    <p>{t('checkout_payment.formula')}</p>
                                    <strong>{t('checkout_payment.formula_content')}</strong><br/>
                                    <p>{t('checkout_payment.ex')}</p>
                                    <br/>
                                    <p>{t('checkout_payment.bank')}</p>
                                    <p>{t('checkout_payment.account_number')}: <strong>13422518A41</strong></p>
                                    <br/>
                                    <p className="bold">{t('checkout_payment.note_pay')}</p>
                                    <br/>
                                    <p>{t('checkout_payment.thank')}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="method">
                              <input style={{display: 'none'}} value="online"
                                type="radio" id="pament-method3" className="payment-method" name="method" ref={this.method_3}
                                onChange={this.handleChangeMethod.bind(this)} checked={this.state.method === 'online'}/>
                              <div className="method-content">
                                <label className={this.state.isShowMethod3 ? "title active" : "title"}
                                  onClick={this.handleChooseMethod_3.bind(this)}>
                                  <h4 style={{margin: '0 0 10px'}}>
                                    {t('checkout_payment.online')}
                                    <span><FaPaypal style={{fontSize: '20px', marginLeft: '5px'}}/></span>
                                  </h4>
                                  <div className="description">
                                    {t('checkout_payment.sub_online')}
                                  </div>
                                  {this.state.isShowMethod3 ?
                                    <i><FaCheck /></i>
                                    :
                                    <i><FaChevronDown /></i>
                                  }
                                </label>
                                <div className={this.state.isShowMethod3 ? "collapse-container show" : "collapse-container"}>
                                  <div className="collapse-content text-center">
                                    {!isServer() &&
                                      <PaypalExpressBtn client={{sandbox: client_id_paypal}}
                                        currency={'USD'} total={convertCurrencyToUSD(this.getTotalPrice(), this.state.rateCurrency)}
                                        onError={this.onError.bind(this)} onSuccess={this.onSuccess.bind(this)}
                                        onCancel={this.onCancel.bind(this)} shipping={1} />
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {this.state.isSubmit && !this.state.method &&
                            <div className="error-announce mt-3">
                              <p className="error">{t('checkout_payment.choose_method')}</p>
                            </div>
                          }
                          {this.state.error &&
                            <div className="error-announce mt-3">
                              <p className="error">{t('checkout_payment.' + this.state.error)}</p>
                            </div>
                          }
                          {this.state.method === 'online' && !this.state.isPay && this.state.isSubmit &&
                            <p className="error mt-3">{t('checkout_payment.pay_fail')}</p>
                          }
                          <div className="col-12 no-padding">
                            <div className="button-area">
                              <ul className="list-inline">
                                <li>
                                  <a onClick={this.handleBack.bind(this)} className="co-btn">{t('checkout_payment.back')}</a>
                                </li>
                                <li className="pull-right">
                                  <a onClick={this.handleSubmit.bind(this)}
                                    className={this.state.method && this.state.method !== 'online' ? "co-btn" : "co-btn disabled"}>
                                    {t('checkout_payment.book')}
                                  </a>
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
                          <div className="img-zone">
                            <img alt="featured_img" src={tourInfo.tour.featured_img}/>
                            {!!tourInfo.discount &&
                              <span className="sale">{t('checkout_passenger.sale')}!</span>
                            }
                          </div>
                          <div className="info-area">
                            <h3>
                              <Link route="detail-tour" params={{id: tourInfo.id, name: slugify(tourInfo.tour.name)}}>
                                <a>{tourInfo.tour.name}</a>
                              </Link>
                            </h3>
                            <ul className="list-unstyled">
                              <li>
                                <i className="fa fa-barcode" aria-hidden="true"><FaBarcode /></i>
                                {t('checkout_passenger.code')}:&nbsp;
                                <span>{getCode(tourInfo.id)}</span>
                              </li>
                              <li>
                                <i className="fa fa-calendar-minus-o" aria-hidden="true"><FaRegCalendarMinus /></i>
                                {t('checkout_passenger.start_date')}:&nbsp;
                                <span>{formatDate(tourInfo.start_date)}</span>
                              </li>
                              <li>
                                <i className="fa fa-calendar-plus-o" aria-hidden="true"><FaRegCalendarPlus /></i>
                                {t('checkout_passenger.end_date')}:&nbsp;
                                <span>{formatDate(tourInfo.end_date)}</span>
                              </li>
                              <li>
                                <i className="fa fa-calendar" aria-hidden="true"><FaRegCalendarAlt /></i>
                                {t('checkout_passenger.lasting')}:&nbsp;
                                <span>{distanceFromDays(new Date(tourInfo.start_date), new Date(tourInfo.end_date)) + 1} {t('checkout_passenger.days')}</span>
                              </li>
                              {!!this.state.num_adult && !!this.getPriceByAge('adults') &&
                                <li id="liAdult" className="display-hidden" style={{display: 'list-item'}}>
                                  <i className="fa fa-user-secret" aria-hidden="true"><FaUserSecret /></i>
                                  {t('checkout_passenger.adult_price')}:&nbsp;
                                  <span>
                                    <strong>
                                      {this.getPriceByAge('adults').toLocaleString()}
                                    </strong> VND
                                  </span>
                                  <span id="adult"> X {this.state.num_adult}</span>
                                </li>
                              }
                              {!!this.state.num_child && this.getPriceByAge('children') &&
                                <li id="liChild" className="display-hidden" style={{display: 'list-item'}}>
                                  <i className="fa fa-child" aria-hidden="true"><FaChild /></i>
                                  {t('checkout_passenger.children_price')}:&nbsp;
                                  <span>
                                    <strong>
                                      {this.getPriceByAge('children').toLocaleString()}
                                    </strong> VND
                                  </span>
                                  <span id="child"> X {this.state.num_child}</span>
                                </li>
                              }
                              {/*<li id="liExtraServices" className="display-hidden" style={{display: 'none'}}>
                                <i className="fa fa-cart-plus" aria-hidden="true" />
                                Dịch vụ cộng thêm:
                                <span><strong id="priceExtraServices">0</strong> đ</span>
                              </li>*/}
                            </ul>
                            <div className="price-total">
                              <h2>{t('checkout_passenger.total_price')}: <span>{this.getTotalPrice().toLocaleString()}</span> VND</h2>
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

export default withNamespaces('translation')(connect(mapStateToProps, mapDispatchToProps)(CheckOutPayment))
