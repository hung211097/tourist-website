import React from 'react'
import { LayoutProfile } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroller'
import { FaBarcode, FaRegCalendarMinus, FaRegCalendarPlus, FaRegCalendarAlt, FaMoneyBill,
  FaPhone, FaUsers, FaArrowLeft, FaInfoCircle } from "react-icons/fa"
import { Router, Link } from 'routes'
import ApiService from 'services/api.service'
import ReactTable from 'react-table'
import { getCode, capitalize } from '../../services/utils.service'
import matchSorter from 'match-sorter'
import { formatDate, compareDate, distanceFromDays } from '../../services/time.service'
import { withNamespaces } from "react-i18next"
import { slugify } from '../../services/utils.service'
import Redirect from 'routes/redirect'

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
          let tourInfo = await apiService.getBookTourHistoryById(query.id, {isTour: true})
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
        page: 1,
        hasMore: true,
        passengers: [],
        bookTour: props.tourInfo,
        trackingTour: false
      }
    }

    loadMore(){
      const id = Router.query.id
      if(this.state.page > 0){
        this.apiService.getPassengersInBookTour(id, this.state.page, 5).then((res) => {
          this.setState({
            passengers: [...this.state.passengers, ...res.data],
            page: res.next_page,
            hasMore: res.next_page > 0
          })
        })
      }
    }

    componentDidMount(){
      this.loadMore()
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
        trackingTour: true
      })
    }

    render() {
      const {t} = this.props
      let tourInfo = null
      if(this.state.bookTour){
        tourInfo = this.state.bookTour.tour_turn
      }
        return (
            <LayoutProfile page="profile" tabName="my-booking" {...this.props}>
                <style jsx>{styles}</style>
                <div className="profile-detail">
                  {this.state.bookTour &&
                    <div className="title">
                      <div className="text-center title-contain">
                        <Link route="my-booking">
                          <a className="back"><FaArrowLeft style={{fontSize: '25px'}}/></a>
                        </Link>
                        <h1 className="my-profile__title">{t('detail_booked_tour.title')} <span>#{getCode(this.state.bookTour.id)}</span></h1>
                        <h3 className="booking-status">{t('detail_booked_tour.status')}: <span>{capitalize(t('detail_booked_tour.' + this.state.bookTour.status))}</span></h3>
                      </div>
                      <div className="content">
                        <div className="container">
                          <div className="finish">
                            {tourInfo &&
                              <div className="tour-info">
                                <div className="tracking-tour">
                                  <button type="button" className="co-btn green" onClick={this.handleTrackingTour.bind(this)}>
                                    <img alt="icon" src="/static/images/gps.png"/>
                                    &nbsp;&nbsp;{t('detail_booked_tour.tracking')}
                                  </button>
                                </div>
                                <div className="header-title has-top-border">{t('detail_booked_tour.tour_info')}
                                  <span className="icon"><FaInfoCircle style={{fontSize: '25px', position: 'relative', top: '-1px'}}/></span>
                                </div>
                                <div className="content-tour row">
                                  <div className="col-sm-4">
                                    <img alt="featured_img" src={tourInfo.tour.featured_img}/>
                                  </div>
                                  <div className="col-sm-8">
                                    <h3>
                                      <Link route="detail-tour" params={{id: tourInfo.id, name: slugify(tourInfo.tour.name)}}>
                                        <a>{tourInfo.tour.name}</a>
                                      </Link>
                                    </h3>
                                    <div className="row mt-4">
                                      <div className="col-sm-6">
                                        <p>
                                          <i className="fa fa-barcode" aria-hidden="true"><FaBarcode /></i>
                                          {t('detail_booked_tour.code')}:&nbsp;
                                          <span>{getCode(tourInfo.id)}</span>
                                        </p>
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
                                    <div className="item-row">
                                      <span className="item-label bold">{t('detail_booked_tour.total_price')}</span>
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
                              </div>
                            </div>
                            <div className="pax-info">
                              <div className="header-title has-top-border mb-4">{t('detail_booked_tour.passenger_info')}
                                <span className="icon"><FaUsers style={{fontSize: '24px', position: 'relative', top: '-2px'}}/></span>
                              </div>
                              <div className="table-responsive">
                                <InfiniteScroll
                                  pageStart={0}
                                  loadMore={this.loadMore.bind(this)}
                                  hasMore={this.state.page > 0}
                                  useWindow={false}
                                  threshold={400}
                                  initialLoad={false}>
                                  <ReactTable
                                    data={this.state.passengers}
                                    className="-striped -highlight"
                                    showPagination={false}
                                    filterable={true}
                                    columns={[
                                      {
                                        Header: t('detail_booked_tour.fullname'),
                                        accessor: 'fullname',
                                        id: 'fullname',
                                        filterAll: true,
                                        filterMethod: (filter, rows) =>
                                          matchSorter(rows, filter.value, { keys: ["fullname"] }),
                                      },
                                      {
                                        Header: t('detail_booked_tour.phone'),
                                        accessor: 'phone',
                                        id: 'phone',
                                        filterAll: true,
                                        filterMethod: (filter, rows) =>
                                          matchSorter(rows, filter.value, { keys: ["phone"] }),
                                      },
                                      {
                                        Header: t('detail_booked_tour.birthdate'),
                                        accessor: d => formatDate(d.birthdate),
                                        id: 'birthdate',
                                        filterAll: true,
                                        filterMethod: (filter, rows) =>
                                          matchSorter(rows, filter.value, { keys: ["birthdate"] }),
                                        sortMethod: (a, b) =>
                                          compareDate(a, b)
                                      },
                                      {
                                        Header: t('detail_booked_tour.gender'),
                                        accessor: d => t('detail_booked_tour.' + d.sex),
                                        id: 'gender',
                                        filterAll: true,
                                        filterMethod: (filter, rows) =>
                                          matchSorter(rows, filter.value.toLocaleString(), { keys: ["gender"] }),
                                      },
                                      {
                                        Header: t('detail_booked_tour.age'),
                                        accessor: d => t('detail_booked_tour.' + this.ages[d.type_passenger.name]),
                                        id: 'age',
                                        filterAll: true,
                                        filterMethod: (filter, rows) =>
                                          matchSorter(rows, filter.value, { keys: ["age"] }),
                                      },
                                      {
                                        Header: t('detail_booked_tour.passport'),
                                        id: 'passport',
                                        accessor: 'passport',
                                        filterAll: true,
                                        filterMethod: (filter, rows) =>
                                          matchSorter(rows, filter.value, { keys: ["passport"] }),
                                      }
                                    ]}
                                  />
                                </InfiniteScroll>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
            </LayoutProfile>
        )
    }
}

export default withNamespaces('translation')(connect(mapStateToProps)(DetailBookedTour))
