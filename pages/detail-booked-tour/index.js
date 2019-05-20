import React from 'react'
import { LayoutProfile, MyMap, PopupInfo } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import _ from 'lodash'
import { FaRegCalendarMinus, FaRegCalendarPlus, FaRegCalendarAlt, FaMoneyBill,
  FaPhone, FaUsers, FaArrowLeft, FaInfoCircle } from "react-icons/fa"
import { Router, Link } from 'routes'
import ApiService from 'services/api.service'
// import ReactTable from 'react-table'
// import InfiniteScroll from 'react-infinite-scroller'
import { capitalize } from '../../services/utils.service'
import { formatDate, distanceFromDays, isSameDate, addDay } from '../../services/time.service'
import { withNamespaces } from "react-i18next"
import { slugify } from '../../services/utils.service'
import Redirect from 'routes/redirect'
import ReactNotifications from 'react-browser-notifications'

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

class DetailBookedTour extends React.Component {
    displayName = 'Detail Booked Tour'
    static propTypes = {
        dispatch: PropTypes.func,
        user: PropTypes.object,
        t: PropTypes.func,
        tourInfo: PropTypes.object
    }

    static async getInitialProps({ res, query }) {
        let apiService = ApiService()
        if(!query.id){
          Redirect(res, '404')
        }
        try{
          let tourInfo = await apiService.getBookTourHistoryByCode(query.id, {isTour: true})
          if(!tourInfo.data){
            Redirect(res, '404')
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
      this.ages = {
        'adults': 'Adult',
        'children': 'Children'
      }
      this.state = {
        passengers: [],
        bookTour: props.tourInfo,
        trackingTour: false,
        position: null,
        currentLocation: null,
        showPopup: false,
        title: '',
        body: '',
        passLocation: []
      }
      this.time = {
        "10.7683": "2019-05-24T08:05:00.000",
        "10.7794": "2019-05-24T09:11:00.000",
        "10.770042": "2019-05-24T10:05:00.000",
        "10.7535": "2019-05-24T10:20:00.000",
        "10.7779": "2019-05-24T13:10:00.000",
        "10.7798": "2019-05-24T14:15:00.000",
        "10.7799": "2019-05-24T15:12:00.000",
        "10.7682": "2019-05-24T17:09:00.000"
      } //Test data
      this.handleClick = this.handleClick.bind(this);
    }

    loadMore(){
      const id = this.state.bookTour.id
      this.apiService.getPassengersInBookTour(id).then((res) => {
        this.setState({
          passengers: res.data,
        })
      })
    }

    componentDidMount(){
      this.loadMore()
    }

    componentWillUnmount(){
      this.clearWatch()
    }

    clearWatch(){
      if (this.watchID != null) {
        navigator.geolocation.clearWatch(this.watchID);
        this.watchID = null;
      }
    }

    requestGeolocation(){
      if (navigator.geolocation) {
        this.watchID = navigator.geolocation.watchPosition(this.showLocation.bind(this), this.showError.bind(this), {maximumAge:Infinity, timeout:60000, enableHighAccuracy: false});
      } else {
        this.setState({
          trackingTour: false
        })
        this.clearWatch()
      }
    }

    showLocation(position) {
      const objLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude }
      this.setState({
        trackingTour: true,
        position: objLocation
      })
      this.apiService.getCurrentRoute({id: this.state.bookTour.tour_turn.id, lat: objLocation.latitude, lng: objLocation.longitude,
        cur_time: this.time[objLocation.latitude]}).then((res) => { //Thay this.time bằng new Date()
          if(res.data && !this.checkExistPassLocation(res.data)){
            this.setState({
              currentLocation: res.data,
              showPopup: true,
              title: this.props.t('detail_booked_tour.reach_location'),
              body: `${this.props.t('detail_booked_tour.just_come_lower')} ${res.data.location.name}`
            }, () => {
              this.showNotifications()
            })
          }
        }).catch(() => {
          this.setState({
            currentLocation: null
          })
        })
    }

    checkExistPassLocation(location){
      let temp = this.state.passLocation.find((item) => {
        return item.id === location.id
      })
      if(!temp){
        this.setState({
          passLocation: [...this.state.passLocation, location]
        })
      }

      return temp ? true : false
    }

    showError() {
      this.setState({
        trackingTour: false
      })
    }

    checkTrackingButton(){
      let start_date = new Date(this.state.bookTour.tour_turn.start_date)
      let end_date = new Date(this.state.bookTour.tour_turn.end_date)
      let now = new Date()
      if((isSameDate(now, start_date) || now > start_date) && (isSameDate(now, end_date) || now < end_date) && this.state.bookTour.status === 'paid'){
        return true
      }
      return false
    }

    findAgePassenger(age){
      let res = null
      if(this.state.bookTour){
        res = this.state.bookTour.type_passenger_detail.find((item) => {
          return item.type === age
        })
      }

      return res
    }

    getPriceByAge(age){
      let price = 0
      let res = null
      if(this.state.bookTour){
        res = this.state.bookTour.type_passenger_detail.find((item) => {
          return item.type === age
        })
      }

      if(res){
        price = res.price
      }
      return price
    }

    getNumberByAge(age){
      let number = 0
      let res = null
      if(this.state.bookTour){
        res = this.state.bookTour.type_passenger_detail.find((item) => {
          return item.type === age
        })
      }

      if(res){
        number = res.num_passenger
      }
      return number
    }

    handleTrackingTour(){
      this.setState({
        passLocation: []
      })
      this.requestGeolocation()
    }

    handleBack(){
      if(!this.state.trackingTour){
        Router.pushRoute('my-booking')
      }
      else{
        this.setState({
          trackingTour: false,
          passLocation: [],
          title: '',
          body: ''
        })
        this.clearWatch()
      }
    }

    handleClose(){
      this.setState({
        showPopup: false
      })
    }

    handleClick(event){
      window.focus()
      this.n.close(event.target.tag)
    }

    showNotifications() {
      // If the Notifications API is supported by the browser
      // then show the notification
      if(this.n.supported()){
        this.n.show()
      }
    }

    render() {
      const {t} = this.props
      let tourInfo = null
      let cancel_info = null
      if(this.state.bookTour){
        tourInfo = this.state.bookTour.tour_turn
        cancel_info = this.state.bookTour.cancel_bookings[0]
      }
      let dt = null
      if(cancel_info){
        dt = new Date(cancel_info.confirm_time)
      }
        return (
            <LayoutProfile page="profile" tabName="my-booking" {...this.props}>
                <style jsx>{styles}</style>
                <div className="profile-detail">
                  {this.state.bookTour &&
                    <div className="title">
                      <div className="text-center title-contain">
                        <a className="back" onClick={this.handleBack.bind(this)}><FaArrowLeft style={{fontSize: '25px'}}/></a>
                        <h1 className="my-profile__title">{t('detail_booked_tour.title')} <span>#{this.state.bookTour.code}</span></h1>
                        <h3 className="booking-status">{t('detail_booked_tour.status')}: <span>{capitalize(t('detail_booked_tour.' + this.state.bookTour.status))}</span></h3>
                      </div>
                      <div className="content">
                        <div className="container">
                          {!this.state.trackingTour ?
                            <div className="finish">
                              {cancel_info &&
                                <div className="notification-info">
                                  {cancel_info.confirm_time && !!cancel_info.money_refunded &&
                                    cancel_info.refund_period && this.state.bookTour.status === 'confirm_cancel' &&
                                    <div>
                                      {cancel_info.request_offline_person &&
                                        <div>
                                          <p>{t('detail_booked_tour.people_cancel')} <strong>{cancel_info.request_offline_person.name}</strong></p>
                                          <p>{t('detail_booked_tour.passport')}: <strong>{cancel_info.request_offline_person.passport}</strong></p>
                                        </div>
                                      }
                                      <p>{t('detail_booked_tour.confirm_cancel_content')} &nbsp;
                                        <strong>{formatDate(new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000), "dd/MM/yyyy HH:mm")}</strong>
                                      </p>
                                      <p>{t('detail_booked_tour.refund_money')} <strong>{cancel_info.money_refunded.toLocaleString()} VND</strong></p>
                                      <br/>
                                      <p>{t('detail_booked_tour.refund_note')} <strong>{formatDate(addDay(cancel_info.confirm_time, 3))}</strong></p>
                                      <p>{t('detail_booked_tour.refund_period')} <strong>{formatDate(cancel_info.refund_period)}</strong></p>
                                    </div>
                                  }
                                  {cancel_info.refunded_time && !!cancel_info.money_refunded && this.state.bookTour.status === 'refunded' &&
                                    <div>
                                      {cancel_info.refund_message &&
                                        <div>
                                          <p>{t(`detail_booked_tour.${cancel_info.refund_message.helper ? 'people_refund_help' : 'people_refund'}`)}&nbsp;
                                            <strong>{cancel_info.refund_message.name}</strong>
                                          </p>
                                          <p>{t('detail_booked_tour.passport')}: <strong>{cancel_info.refund_message.passport}</strong></p>
                                        </div>
                                      }
                                      <p>{t('detail_booked_tour.refund_time')} <strong>{formatDate(cancel_info.refunded_time, "dd/MM/yyyy HH:mm")}</strong></p>
                                      <p>{t('detail_booked_tour.refund_money')} <strong>{cancel_info.money_refunded.toLocaleString()} VND</strong></p>
                                    </div>
                                  }
                                </div>
                              }
                              {tourInfo &&
                                <div className="tour-info">
                                  {this.checkTrackingButton() &&
                                    <div className="tracking-tour">
                                      <button type="button" className="co-btn green" onClick={this.handleTrackingTour.bind(this)}>
                                        <img alt="icon" src="/static/images/gps.png"/>
                                        &nbsp;&nbsp;{t('detail_booked_tour.tracking')}
                                      </button>
                                    </div>
                                  }
                                  <div className="header-title has-top-border">{t('detail_booked_tour.tour_info')}
                                    <span className="icon"><FaInfoCircle style={{fontSize: '25px', position: 'relative', top: '-1px'}}/></span>
                                  </div>
                                  <div className="content-tour row">
                                    <div className="col-sm-4">
                                      <Link route="detail-tour" params={{id: tourInfo.code, name: slugify(tourInfo.tour.name)}}>
                                        <a>
                                          <img alt="featured_img" src={tourInfo.tour.featured_img}/>
                                        </a>
                                      </Link>
                                    </div>
                                    <div className="col-sm-8">
                                      <h3>
                                        <Link route="detail-tour" params={{id: tourInfo.code, name: slugify(tourInfo.tour.name)}}>
                                          <a>{tourInfo.tour.name}</a>
                                        </Link>
                                      </h3>
                                      <div className="row mt-4">
                                        <div className="col-sm-6">
                                          <p>
                                            <i className="fa fa-calendar-minus-o" aria-hidden="true"><FaRegCalendarMinus /></i>
                                            {t('detail_booked_tour.start_date')}:&nbsp;
                                            <span>{formatDate(tourInfo.start_date)}</span>
                                          </p>
                                          <p>
                                            <i className="fa fa-calendar-plus-o" aria-hidden="true"><FaRegCalendarPlus /></i>
                                            {t('detail_booked_tour.end_date')}:&nbsp;
                                            <span>{formatDate(tourInfo.end_date)}</span>
                                          </p>
                                          <p>
                                            <i className="fa fa-calendar" aria-hidden="true"><FaRegCalendarAlt /></i>
                                            {t('detail_booked_tour.lasting')}:&nbsp;
                                            <span>{distanceFromDays(new Date(tourInfo.start_date), new Date(tourInfo.end_date)) + 1} {t('detail_booked_tour.days')}</span>
                                          </p>
                                        </div>
                                        <div className="col-sm-6"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              }
                              <div className="checkout-info">
                                <div className="header-title has-top-border">{t('detail_booked_tour.checkout_info')}
                                  <span className="icon"><FaMoneyBill style={{fontSize: '25px', position: 'relative', top: '-1px'}}/></span>
                                </div>
                                <p className="mt-3 checkout-p">{t('detail_booked_tour.method')}&nbsp; <strong>{t('detail_booked_tour.' + this.state.bookTour.payment_method.name)}</strong></p>
                                {this.state.bookTour.message_pay && this.state.bookTour.status !== 'booked' && this.state.bookTour !== 'cancelled' &&
                                  <div>
                                    <p className="checkout-p">{t(`detail_booked_tour.${this.state.bookTour.message_pay.helper ? 'people_pay_help' : 'people_pay'}`)}&nbsp;&nbsp;
                                      <strong>{this.state.bookTour.message_pay.name}</strong>
                                    </p>
                                    <p className="mb-3 checkout-p">{t('detail_booked_tour.passport')}:&nbsp;&nbsp;
                                      <strong>{this.state.bookTour.message_pay.passport}</strong>
                                    </p>
                                  </div>
                                }
                                <div className="row no-padding">
                                  <div className="col-md-6 col-sm-6 col-12">
                                    <div className="checkout-contact">
                                      {this.findAgePassenger('adults') &&
                                        <div className="item-row">
                                          <span className="item-label">{t('detail_booked_tour.adult_price')}</span>
                                          <span className="value">{this.getPriceByAge('adults').toLocaleString()} VND</span>
                                        </div>
                                      }
                                      {this.findAgePassenger('children') &&
                                        <div className="item-row">
                                          <span className="item-label">{t('detail_booked_tour.children_price')}</span>
                                          <span className="value">{this.getPriceByAge('children').toLocaleString()} VND</span>
                                        </div>
                                      }
                                      <br/>
                                      <div className="item-row" style={{fontSize: '18px'}}>
                                        <span className="item-label bold" style={{fontSize: '18px', fontWeight: 'bold'}}>
                                          {t('detail_booked_tour.total_price')}
                                        </span>
                                        <span className="value">{this.state.bookTour.total_pay.toLocaleString()} VND</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-sm-6 col-12">
                                    <div className="checkout-contact">
                                      {this.findAgePassenger('adults') &&
                                        <div className="item-row">
                                          <span className="item-label">{t('detail_booked_tour.num_adult')}</span>
                                          <span className="value">{this.getNumberByAge('adults')}</span>
                                        </div>
                                      }
                                      {this.findAgePassenger('children') &&
                                        <div className="item-row">
                                          <span className="item-label">{t('detail_booked_tour.num_children')}</span>
                                          <span className="value">{this.getNumberByAge('children')}</span>
                                        </div>
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="contact-info">
                                <div className="header-title has-top-border">{t('detail_booked_tour.contact_info')}
                                  <span className="icon"><FaPhone style={{fontSize: '18px', position: 'relative', top: '-2px'}}/></span>
                                </div>
                                <div className="booking-contact">
                                  <div className="item-row">
                                    <span className="item-label">{t('detail_booked_tour.fullname')}: </span>
                                    <span className="value responsive">{this.state.bookTour.book_tour_contact_info.fullname}</span>
                                  </div>
                                  <div className="item-row">
                                    <span className="item-label">{t('detail_booked_tour.phone')}: </span>
                                    <span className="value responsive">{this.state.bookTour.book_tour_contact_info.phone}</span>
                                  </div>
                                  <div className="item-row">
                                    <span className="item-label bold">Email: </span>
                                    <span className="value responsive">{this.state.bookTour.book_tour_contact_info.email}</span>
                                  </div>
                                  <div className="item-row">
                                    <span className="item-label bold">{t('detail_booked_tour.address')}: </span>
                                    <span className="value responsive">{this.state.bookTour.book_tour_contact_info.address}</span>
                                  </div>
                                  <div className="item-row">
                                    <span className="item-label bold">{t('detail_booked_tour.passport')}: </span>
                                    <span className="value responsive">{this.state.bookTour.book_tour_contact_info.passport}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="pax-info">
                                <div className="header-title has-top-border mb-4">{t('detail_booked_tour.passenger_info')}
                                  <span className="icon"><FaUsers style={{fontSize: '24px', position: 'relative', top: '-2px'}}/></span>
                                </div>
                                <div className="table-responsive">
                                  <table className="table table-hover table-striped table-responsive-lg table-bordered">
                                    <thead>
                                      <tr>
                                        <th scope="col">{t('detail_booked_tour.fullname')}</th>
                                        <th scope="col">{t('detail_booked_tour.phone')}</th>
                                        <th scope="col">{t('detail_booked_tour.birthdate')}</th>
                                        <th scope="col">{t('detail_booked_tour.gender')}</th>
                                        <th scope="col">{t('detail_booked_tour.age')}</th>
                                        <th scope="col">{t('detail_booked_tour.passport')}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {!!this.state.passengers.length && this.state.passengers.map((item, key) => {
                                          return(
                                            <tr key={key}>
                                              <td>{item.fullname}</td>
                                              <td>{item.phone}</td>
                                              <td>{formatDate(item.birthdate)}</td>
                                              <td>{t('detail_booked_tour.' + item.sex)}</td>
                                              <td>{t('detail_booked_tour.' + this.ages[item.type_passenger.name])}</td>
                                              <td>{item.passport}</td>
                                            </tr>
                                          )
                                        })
                                      }
                                    </tbody>
                                  </table>
                                    {/*<ReactTable
                                      data={this.state.passengers}
                                      className="-striped -highlight"
                                      showPagination={false}
                                      columns={[
                                        {
                                          Header: t('detail_booked_tour.fullname'),
                                          accessor: 'fullname',
                                          id: 'fullname',
                                          className: 'text-center',
                                        },
                                        {
                                          Header: t('detail_booked_tour.phone'),
                                          accessor: 'phone',
                                          id: 'phone',
                                          className: 'text-center',
                                        },
                                        {
                                          Header: t('detail_booked_tour.birthdate'),
                                          accessor: d => formatDate(d.birthdate),
                                          id: 'birthdate',
                                          className: 'text-center',
                                          sortMethod: (a, b) =>
                                            compareDate(a, b)
                                        },
                                        {
                                          Header: t('detail_booked_tour.gender'),
                                          accessor: d => t('detail_booked_tour.' + d.sex),
                                          id: 'gender',
                                          className: 'text-center'
                                        },
                                        {
                                          Header: t('detail_booked_tour.age'),
                                          accessor: d => t('detail_booked_tour.' + this.ages[d.type_passenger.name]),
                                          id: 'age',
                                          className: 'text-center'
                                        },
                                        {
                                          Header: t('detail_booked_tour.passport'),
                                          id: 'passport',
                                          accessor: 'passport',
                                          className: 'text-center'
                                        }
                                      ]}
                                    />*/}
                                </div>
                              </div>
                            </div>
                            :
                            <div className="finish">
                              <MyMap
                                  isMarkerShown={true}
                                  isSearchBox={true}
                                  isSetTour
                                  trackingPosition={this.state.position}
                                  currentLocation={this.state.currentLocation}
                                  idTourSet={tourInfo.tour.id}
                                  styleDetailBookedFilter
                                  customStyles={{height: '500px'}}/>
                            </div>
                          }
                        </div>
                      </div>
                    </div>
                  }
                </div>
                {this.state.showPopup &&
                  <PopupInfo show={true} onClose={this.handleClose.bind(this)} timeOut={5000}
                    customContent={{maxWidth: '500px', width: '90%'}}>
                      {this.state.currentLocation &&
                        <div className="content-popup">
                          <h1>
                            <img alt="icon" src="/static/images/flag.png" />&nbsp;&nbsp;
                            {t('detail_booked_tour.just_come')}!&nbsp;&nbsp;
                            <img alt="icon" src="/static/images/flag-reverse.png" />
                          </h1>
                          <div className="nd_options_height_10" />
                          <img alt="featured_img" className="featured_img"
                            src={this.state.currentLocation.location.featured_img ? this.state.currentLocation.location.featured_img : '/static/images/no_image.jpg'}/>
                          <p><strong>{this.state.currentLocation.location.name}</strong></p>
                          <p>{this.state.currentLocation.location.address}</p>
                          <div className="nd_options_height_10" />
                          <a className="co-btn w-30" onClick={this.handleClose.bind(this)}>{t('register.OK')}</a>
                        </div>
                      }
                  </PopupInfo>
                }
                <ReactNotifications
                  onRef={ref => (this.n = ref)}
                  title={this.state.title}
                  body={this.state.body}
                  icon='/static/images/logo_mobile.png'
                  tag={new Date()}
                  timeout="5000"
                  onClick={event => this.handleClick(event)}
                />
            </LayoutProfile>
        )
    }
}

export default withNamespaces('translation')(connect(mapStateToProps)(DetailBookedTour))
