import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, WizardStep, PassengerInfo } from 'components'
import { Router, Link } from 'routes'
import { connect } from 'react-redux'
import validateEmail from '../../services/validates/email.js'
import validatePhone from '../../services/validates/phone.js'
import ApiService from '../../services/api.service'
import { wizardStep } from '../../constants'
import { FaBarcode, FaRegCalendarMinus, FaRegCalendarPlus, FaUserSecret, FaChild, FaRegCalendarAlt } from "react-icons/fa"
import { formatDate, distanceFromDays } from '../../services/time.service'
import { getUserAuth } from 'services/auth.service'
import { setSessionStorage, removeItem } from '../../services/session-storage.service'
import { KEY } from '../../constants/session-storage'
import { getCode, moveToElementId } from '../../services/utils.service'

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

class CheckOutPassengers extends React.Component {
  displayName = 'Checkout Passengers Page'

  static propTypes = {
    user: PropTypes.object,
    tourInfo: PropTypes.object
  }

  static async getInitialProps({ query }) {
      let apiService = ApiService()
      if(!query.tour_id){
        return { tourInfo: null }
      }
      let tourInfo = await apiService.getToursTurnId(query.tour_id)
      return { tourInfo: tourInfo.data };
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      isSubmit: false,
      name: '',
      email: '',
      phone: '',
      address: '',
      tourInfo: this.props.tourInfo,
      adult: 1,
      child: 0,
      passengers: [],
      loading: false
    }
  }

  componentDidMount() {
    if(!this.state.tourInfo){
      Router.pushRoute("home")
    }
    removeItem(KEY.PASSENGER)

    let user = this.props.user
    if(!user){
      user = getUserAuth()
    }
    if (user) {
        this.setState({
            name: user.fullname ? user.fullname : '',
            email: user.email ? user.email : '',
            phone: user.phone ?  user.phone : '',
            address: user.address ?  user.address : ''
        })
    }
  }

  componentWillUnmount(){
    this.timeout && clearTimeout(this.timeout)
  }

  handleChangeName(e){
    this.setState({
      name: e.target.value
    })
  }

  handleChangePhone(e){
    this.setState({
      phone: e.target.value
    })
  }
  handleChangeEmail(e){
    this.setState({
      email: e.target.value
    })
  }

  handleChangeAddress(e){
    this.setState({
      address: e.target.value
    })
  }

  handleChangeAdult(e){
    this.setState({
      adult: +e.target.value
    })
  }

  handleChangeChild(e){
    this.setState({
      child: +e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault()
    this.setState({
      isSubmit: true
    })

    if(!this.validate()){
      return
    }

    this.setState({
      loading: true
    })
    const tourInfo = JSON.stringify({
      contactInfo: {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        address: this.state.address
      },
      num_adult: this.state.adult,
      num_child: this.state.child,
      passengers: this.state.passengers
    })

    setSessionStorage(KEY.PASSENGER, tourInfo)
    this.timeout = setTimeout(() => {
      this.setState({
        loading: false
      })
      clearTimeout(this.timeout)
      Router.pushRoute("checkout-payment", {tour_id: this.state.tourInfo.id})
    }, 1000)
  }

  validate(){
    if(!this.state.adult){
      return false
    }

    if(!this.state.name){
      moveToElementId('fullname')
      return false
    }

    if(!this.state.address){
      moveToElementId('address')
      return false
    }

    if(!this.state.phone || !validatePhone(this.state.phone)){
      moveToElementId('phone')
      return false
    }

    if(!this.state.email || !validateEmail(this.state.email)){
      moveToElementId('email')
      return false
    }

    if(!this.state.passengers.length){
      moveToElementId('passenger-0')
      return false
    }

    for(let i = 0; i < this.state.adult + this.state.child; i++){
      if(!this.state.passengers[i]){
        moveToElementId('passenger-' + i)
        return false
      }
      if(!this.state.passengers[i].fullname || !this.state.passengers[i].sex || !this.state.passengers[i].birthdate){
        moveToElementId('passenger-' + i)
        return false
      }
      if(this.state.passengers[i].phone && !validatePhone(this.state.passengers[i].phone)){
        moveToElementId('passenger-' + i)
        return false
      }
    }

    return true
  }

  getTotalPrice(){
    const adultPrice = this.getPriceByAge("adults")
    const childPrice = this.getPriceByAge("children")
    return this.state.adult * adultPrice + this.state.child * childPrice
  }

  handleChangePassenger(obj, index){
    let temp = this.state.passengers
    temp[index] = obj
    this.setState({
      passengers: temp
    })
  }

  findAgePassenger(age){
    let res = null
    if(this.state.tourInfo){
      res = this.state.tourInfo.price_passengers.find((item) => {
        return item.type === age
      })
    }

    return res
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
                <WizardStep step={wizardStep.PASSENGER} />
              </div>
              <div className="passenger-info">
                <div className="row">
                  <div className="col-md-8 col-sm-12 col-12">
                    <div className="payment-wrap bookingForm">
                      <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="wrapper">
                          <div className="title">
                            <h3>NUMBER OF PASSENGERS</h3>
                          </div>
                          {this.findAgePassenger('adults') &&
                            <div className="row adult-zone">
                              <div className="col-md-5 col-sm-5 col-12">
                                <div className="form-group">
                                  <label htmlFor="adult">Adult (*)</label>
                                  <input type="number" name="adult" className={this.state.isSubmit && !+this.state.adult ? "error" : ""}
                                    id="adult" value={this.state.adult} min={1} pattern="^\d+$"
                                    onChange={this.handleChangeAdult.bind(this)}/>
                                  {this.state.isSubmit && !this.state.adult &&
                                    <p className="error">This field is required minimum 1</p>
                                  }
                                </div>
                              </div>
                              <div className="col-md-7 col-sm-7 col-12">
                              </div>
                              <div className="nd_options_height_10"/>
                            </div>
                          }
                          {this.findAgePassenger('children') &&
                            <div className="row child-zone">
                              <div className="col-md-5 col-sm-5 col-12">
                                <div className="form-group">
                                  <label>Children </label>
                                  <input type="number" name="child" value={this.state.child} min={0} pattern="^\d+$"
                                    onChange={this.handleChangeChild.bind(this)}/>
                                  <span className="error" />
                                </div>
                              </div>
                              <div className="col-md-7 col-sm-7 col-12">
                                <p className="caption-text">For children under 12 years old</p>
                              </div>
                              <div className="nd_options_height_10"/>
                            </div>
                          }
                          <div className="nd_options_height_30"/>
                          <div className="title">
                            <h3>CONTACT INFORMATION</h3>
                          </div>
                          <div className="row contact-zone">
                            <div className="form-group col-sm-6 col-12" id="fullname">
                              <div className="form-group">
                                <label htmlFor="name">Fullname (*)</label>
                                <input type="text" name="name" id="name" value={this.state.name}
                                  onChange={this.handleChangeName.bind(this)} required="required" data-validation="required"
                                  className={this.state.isSubmit && !this.state.name ? "error" : ""} />
                                  {this.state.isSubmit && !this.state.name &&
                                    <p className="error">This field is required!</p>
                                  }
                              </div>
                            </div>
                            <div className="form-group col-sm-6 col-12" id="phone">
                              <div className="form-group">
                                <label htmlFor="phone">Phone number (*)</label>
                                <input type="text" name="phone" id="phone" value={this.state.phone}
                                  onChange={this.handleChangePhone.bind(this)}
                                  required="required" maxLength={15} data-validation="required custom length"
                                  data-validation-length="max15"
                                  className={(this.state.isSubmit && !this.state.phone) || (this.state.isSubmit && this.state.phone && !validatePhone(this.state.phone)) ? "error" : "" }/>
                                {this.state.isSubmit && !this.state.phone &&
                                  <p className="error">This field is required!</p>
                                }
                                {this.state.isSubmit && this.state.phone && !validatePhone(this.state.phone) &&
                                  <p className="error">Phone number must be in 10 digits!</p>
                                }
                              </div>
                            </div>
                          </div>
                          <div className="row contact-zone">
                            <div className="form-group col-sm-6 col-xs-12" id="email">
                              <div className="form-group has-success">
                                <label htmlFor="email">Email (*)</label>
                                <input type="email" id="email" name="email" data-validation="required email"
                                  value={this.state.email}
                                  onChange={this.handleChangeEmail.bind(this)}
                                  className={(this.state.isSubmit && !this.state.email) || (this.state.isSubmit && this.state.email && !validateEmail(this.state.email)) ? "error" : "" }/>
                                {this.state.isSubmit && !this.state.email &&
                                  <p className="error">This field is required!</p>
                                }
                                {this.state.isSubmit && this.state.email && !validateEmail(this.state.email) &&
                                  <p className="error">Email must be right in format!</p>
                                }
                              </div>
                            </div>
                            <div className="form-group col-sm-6 col-xs-12" id="address">
                              <div className="form-group has-success">
                                <label htmlFor="address">Address (*)</label>
                                <input type="text" id="address" name="address" data-validation="required"
                                  value={this.state.address}
                                  onChange={this.handleChangeAddress.bind(this)}
                                  className={this.state.isSubmit && !this.state.address ? "error" : ""}/>
                                {this.state.isSubmit && !this.state.address &&
                                  <p className="error">This field is required!</p>
                                }
                              </div>
                            </div>
                          </div>
                          <div className="row passenger">
                            {[...Array(this.state.adult)].map((item, key) => {
                                return(
                                  <PassengerInfo index={key} age={"adults"} isSubmit={this.state.isSubmit} key={key}
                                    onChangePassenger={this.handleChangePassenger.bind(this)}/>
                                )
                              })
                            }
                            {[...Array(this.state.child)].map((item, key) => {
                                return(
                                  <PassengerInfo index={this.state.adult + key} age={"children"}
                                    isSubmit={this.state.isSubmit} key={this.state.adult + key}
                                    onChangePassenger={this.handleChangePassenger.bind(this)}/>
                                )
                              })
                            }
                          </div>
                          <div className="col-12 no-padding">
                            <div className="button-area">
                              <ul className="list-inline">
                                <li className="pull-right">
                                  <a onClick={this.handleSubmit.bind(this)} className="co-btn">Next</a>
                                </li>
                              </ul>
                              {this.state.loading &&
                                <img src="/static/svg/loading.svg"/>
                              }
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
                              <span className="sale">SALE!</span>
                            }
                          </div>
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
                                <span>{getCode(tourInfo.id)}</span>
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
                              {!!this.state.adult && !!this.getPriceByAge('adults') &&
                                <li id="liAdult" className="display-hidden" style={{display: 'list-item'}}>
                                  <i className="fa fa-user-secret" aria-hidden="true"><FaUserSecret /></i>
                                  Adult price:&nbsp;
                                  <span>
                                    <strong>
                                      {this.getPriceByAge('adults').toLocaleString()}
                                    </strong> VND
                                  </span>
                                  <span id="adult"> X {this.state.adult}</span>
                                </li>
                              }
                              {!!this.state.child && this.getPriceByAge('children') &&
                                <li id="liChild" className="display-hidden" style={{display: 'list-item'}}>
                                  <i className="fa fa-child" aria-hidden="true"><FaChild /></i>
                                  Children price:&nbsp;
                                  <span>
                                    <strong>
                                      {this.getPriceByAge('children').toLocaleString()}
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

export default connect(mapStateToProps)(CheckOutPassengers)
