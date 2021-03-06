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
import { addInfoPassengers } from '../../actions'
import { formatDate, distanceFromDays } from '../../services/time.service'
import { getUserAuth } from 'services/auth.service'
import { moveToElementId, slugify } from '../../services/utils.service'
import { withNamespaces } from "react-i18next"
import { validateStringWithoutNumber } from '../../services/validates'
import { metaData } from '../../constants/meta-data'
import Redirect from 'routes/redirect'

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addInfoPassengers: (data) => {dispatch(addInfoPassengers(data))}
  }
}

class CheckOutPassengers extends React.Component {
  displayName = 'Checkout Passengers Page'

  static propTypes = {
    user: PropTypes.object,
    tourInfo: PropTypes.object,
    t: PropTypes.func,
    addInfoPassengers: PropTypes.func
  }

  static async getInitialProps({ res, query }) {
      let apiService = ApiService()
      if(!query.tour_id){
        Redirect(res, '404')
      }
      try{
        let tourInfo = await apiService.getToursTurnByCode(query.tour_id)
        if(tourInfo.data.num_max_people - tourInfo.data.num_current_people === 0 || !tourInfo.data.isAllowBooking){
          Redirect(res, '/')
        }
        return { tourInfo: tourInfo.data };
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
      name: '',
      email: '',
      phone: '',
      address: '',
      sex: '',
      birthdate: '',
      passport: '',
      tourInfo: this.props.tourInfo,
      adult: 1,
      child: 0,
      passengers: [],
      loading: false,
      isTraveler: 'true',
    }
  }

  componentDidMount() {
    this.props.addInfoPassengers && this.props.addInfoPassengers(null)
    let user = this.props.user
    if(!user){
      user = getUserAuth()
    }
    if (user) {
        this.setState({
            name: user.fullname ? user.fullname : '',
            email: user.email ? user.email : '',
            phone: user.phone ?  user.phone : '',
            address: user.address ?  user.address : '',
            sex: user.sex ? user.sex : '',
            birthdate: user.birthdate ? user.birthdate : '',
            passport: user.passport ? user.passport : ''
        }, () => {
          this.fillInTraveler()
        })
    }
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

  handleChangePassport(e){
    this.setState({
      passport: e.target.value
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

    this.props.addInfoPassengers && this.props.addInfoPassengers({
      contactInfo: {
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        address: this.state.address,
        passport: this.state.passport
      },
      num_adult: this.state.adult,
      num_child: this.state.child,
      passengers: this.state.passengers
    })
    Router.pushRoute("checkout-payment", {tour_id: this.state.tourInfo.code})
  }

  validate(){
    if(!this.state.adult){
      return false
    }

    if(!this.state.name || !validateStringWithoutNumber(this.state.name)){
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

    if(!this.state.passport){
      moveToElementId('passport')
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

  handleChangeTraveler(e){
    this.setState({
      isTraveler: e.target.value,
    }, () => {
      this.fillInTraveler()
    })

  }

  fillInTraveler(){
    let temp = this.state.passengers
    if(this.state.isTraveler === 'true'){
      temp[0] = {
        birthdate: this.state.birthdate,
        fullname: this.state.name,
        phone: this.state.phone,
        sex: this.state.sex,
        passport: this.state.passport,
        type: 'adults'
      }
    }else{
      temp[0] = {
        birthdate: '',
        fullname: '',
        phone: '',
        sex: '',
        passport: '',
        type: 'adults'
      }
    }
    this.setState({
      passengers: temp
    })
  }

  render() {
    const { tourInfo } = this.state
    const { t } = this.props
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
                <WizardStep step={wizardStep.PASSENGER} t={t}/>
              </div>
              <div className="passenger-info">
                <div className="row">
                  <div className="col-md-8 col-sm-12 col-12">
                    <div className="payment-wrap bookingForm">
                      <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="wrapper">
                          <p className="mb-4" style={{fontStyle: 'italic', color: 'red'}}>(*) Thông tin bắt buộc</p>
                          <div className="title">
                            <h3>{t('checkout_passenger.num_passenger')}</h3>
                          </div>
                          {this.findAgePassenger('adults') &&
                            <div className="row adult-zone">
                              <div className="col-md-5 col-sm-5 col-12">
                                <div className="form-group">
                                  <label htmlFor="adult">{t('checkout_passenger.Adult')} (*)</label>
                                  <input type="number" name="adult" className={this.state.isSubmit && !+this.state.adult ? "custom-input error" : "custom-input"}
                                    id="adult" value={this.state.adult} min={1} pattern="^\d+$"
                                    onChange={this.handleChangeAdult.bind(this)}/>
                                  {this.state.isSubmit && !this.state.adult &&
                                    <p className="error">{t('checkout_passenger.minimum')}</p>
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
                                  <label>{t('checkout_passenger.Children')} (<span className="caption-text">{t('checkout_passenger.note_children')}</span>)</label>
                                  <input type="number" name="child" value={this.state.child} min={0} pattern="^\d+$" className="custom-input"
                                    onChange={this.handleChangeChild.bind(this)}/>
                                  <span className="error" />
                                </div>
                              </div>
                              <div className="col-md-7 col-sm-7 col-12">
                              </div>
                              <div className="nd_options_height_10"/>
                            </div>
                          }
                          <div className="nd_options_height_30"/>
                          <div className="title">
                            <h3>{t('checkout_passenger.contact_info')}</h3>
                          </div>
                          <div className="row contact-zone">
                            <div className="form-group col-sm-6 col-12" id="fullname">
                              <div className="form-group">
                                <label htmlFor="name">{t('checkout_passenger.fullname')} (*)</label>
                                <input type="text" name="name" id="name" value={this.state.name}
                                  onChange={this.handleChangeName.bind(this)} required="required" data-validation="required"
                                  className={this.state.isSubmit && !this.state.name ? "error custom-input" : "custom-input"} />
                                  {this.state.isSubmit && !this.state.name &&
                                    <p className="error">{t('checkout_passenger.fullname_required')}</p>
                                  }
                                  {this.state.isSubmit && this.state.name && !validateStringWithoutNumber(this.state.name) &&
                                    <p className="error">{t('checkout_passenger.fullname_format')}</p>
                                  }
                              </div>
                            </div>
                            <div className="form-group col-sm-6 col-12" id="phone">
                              <div className="form-group">
                                <label htmlFor="phone">{t('checkout_passenger.phone')} (*)</label>
                                <input type="text" name="phone" id="phone" value={this.state.phone}
                                  onChange={this.handleChangePhone.bind(this)}
                                  required="required" maxLength={15} data-validation="required custom length"
                                  data-validation-length="max15"
                                  className={(this.state.isSubmit && !this.state.phone) || (this.state.isSubmit && this.state.phone && !validatePhone(this.state.phone))
                                    ? "error custom-input" : "custom-input" }/>
                                {this.state.isSubmit && !this.state.phone &&
                                  <p className="error">{t('checkout_passenger.phone_required')}</p>
                                }
                                {this.state.isSubmit && this.state.phone && !validatePhone(this.state.phone) &&
                                  <p className="error">{t('checkout_passenger.phone_format')}</p>
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
                                  className={(this.state.isSubmit && !this.state.email) || (this.state.isSubmit && this.state.email && !validateEmail(this.state.email))
                                    ? "error custom-input" : "custom-input" }/>
                                {this.state.isSubmit && !this.state.email &&
                                  <p className="error">{t('checkout_passenger.email_required')}</p>
                                }
                                {this.state.isSubmit && this.state.email && !validateEmail(this.state.email) &&
                                  <p className="error">{t('checkout_passenger.email_format')}</p>
                                }
                              </div>
                            </div>
                            <div className="form-group col-sm-6 col-xs-12" id="address">
                              <div className="form-group has-success">
                                <label htmlFor="address">{t('checkout_passenger.address')} (*)</label>
                                <input type="text" id="address" name="address" data-validation="required"
                                  value={this.state.address}
                                  onChange={this.handleChangeAddress.bind(this)}
                                  className={this.state.isSubmit && !this.state.address ? "error custom-input" : "custom-input"}/>
                                {this.state.isSubmit && !this.state.address &&
                                  <p className="error">{t('checkout_passenger.address_required')}</p>
                                }
                              </div>
                            </div>
                          </div>
                          <div className="row contact-zone">
                            <div className="form-group col-sm-6 col-xs-12" id="passport">
                              <div className="form-group has-success">
                                <label htmlFor="passport">{t('checkout_passenger.passport')} (*)</label>
                                <input type="passport" id="passport" name="passport"
                                  value={this.state.passport}
                                  onChange={this.handleChangePassport.bind(this)}
                                  className={this.state.isSubmit && !this.state.passport ? "error custom-input" : "custom-input"}/>
                                {this.state.isSubmit && !this.state.passport &&
                                  <p className="error">{t('checkout_passenger.passport_required')}</p>
                                }
                              </div>
                            </div>
                            <div className="form-group col-sm-6 col-xs-12"></div>
                          </div>
                          <div className="nd_options_height_10"/>
                          {!!this.props.user && !!Object.keys(this.props.user).length &&
                            <div className="question">
                              <div className="title">
                                <h3>{t('checkout_passenger.question')}</h3>
                              </div>
                              <div className="nd_options_height_10"/>
                              <div className="input-group">
                                <label>
                                  <input type="radio" checked={this.state.isTraveler === 'true'} value={true}
                                    onChange={this.handleChangeTraveler.bind(this)} name="traveler"/>
                                  <span>{t('checkout_passenger.traveler')}</span>
                                </label>
                              </div>
                              <div className="nd_options_height_20"/>
                              <div className="input-group">
                                <label>
                                  <input type="radio" checked={this.state.isTraveler === 'false'} value={false}
                                    onChange={this.handleChangeTraveler.bind(this)} name="traveler"/>
                                  <span>{t('checkout_passenger.help_book')}</span>
                                </label>
                              </div>
                              <p className="note_radio">{t('checkout_passenger.note_radio')}</p>
                            </div>
                          }
                          <div className="passenger">
                            {this.state.isTraveler === 'true' &&
                              <PassengerInfo index={0} age={"adults"} isSubmit={this.state.isSubmit}
                                onChangePassenger={this.handleChangePassenger.bind(this)} t={t}
                                traveler={this.state.isTraveler === 'true' ? {
                                  name: this.state.name,
                                  phone: this.state.phone,
                                  sex: this.state.sex,
                                  birthdate: this.state.birthdate,
                                  passport: this.state.passport
                                }: null}/>
                            }
                            {this.state.isTraveler === 'false' &&
                              <PassengerInfo index={0} age={"adults"} isSubmit={this.state.isSubmit}
                                onChangePassenger={this.handleChangePassenger.bind(this)} t={t}/>
                            }
                            {[...Array(this.state.adult - 1)].map((item, key) => {
                                return(
                                  <PassengerInfo index={key + 1} age={"adults"} isSubmit={this.state.isSubmit} key={key}
                                    onChangePassenger={this.handleChangePassenger.bind(this)} t={t}/>
                                )
                              })
                            }
                            {[...Array(this.state.child)].map((item, key) => {
                                return(
                                  <PassengerInfo index={this.state.adult + key} age={"children"}
                                    isSubmit={this.state.isSubmit} key={this.state.adult + key}
                                    onChangePassenger={this.handleChangePassenger.bind(this)} t={t}/>
                                )
                              })
                            }
                          </div>
                          <div className="col-12 no-padding">
                            <div className="button-area">
                              <ul className="list-inline">
                                <li className="pull-right">
                                  <a onClick={this.handleSubmit.bind(this)} className="co-btn">{t('checkout_passenger.next')}</a>
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
                              <span className="sale">{t('checkout_passenger.sale')}!</span>
                            }
                          </div>
                          <div className="info-area">
                            <h3>
                              <Link route="detail-tour" params={{id: tourInfo.code, name: slugify(tourInfo.tour.name)}}>
                                <a>{tourInfo.tour.name}</a>
                              </Link>
                            </h3>
                            <ul className="list-unstyled">
                              <li>
                                <i className="fas fa-barcode"></i>
                                {t('checkout_passenger.code')}:&nbsp;
                                <span>{tourInfo.code}</span>
                              </li>
                              <li>
                                <i className="far fa-calendar-minus"></i>
                                {t('checkout_passenger.start_date')}:&nbsp;
                                <span>{formatDate(tourInfo.start_date)}</span>
                              </li>
                              <li>
                                <i className="far fa-calendar-plus"></i>
                                {t('checkout_passenger.end_date')}:&nbsp;
                                <span>{formatDate(tourInfo.end_date)}</span>
                              </li>
                              <li>
                                <i className="far fa-calendar-alt"></i>
                                {t('checkout_passenger.lasting')}:&nbsp;
                                <span>{distanceFromDays(new Date(tourInfo.start_date), new Date(tourInfo.end_date)) + 1} {t('checkout_passenger.days')}</span>
                              </li>
                              {!!this.state.adult && !!this.getPriceByAge('adults') &&
                                <li id="liAdult" className="display-hidden" style={{display: 'list-item'}}>
                                  <i className="fas fa-user-secret"></i>
                                  {t('checkout_passenger.adult_price')}:&nbsp;
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
                                  <i className="fas fa-child" aria-hidden="true"></i>
                                  {t('checkout_passenger.children_price')}:&nbsp;
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

export default withNamespaces('translation')(connect(mapStateToProps, mapDispatchToProps)(CheckOutPassengers))
