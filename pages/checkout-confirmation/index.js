import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, WizardStep } from 'components'
import { Router, Link } from 'routes'
import { connect } from 'react-redux'
import ApiService from '../../services/api.service'
import { wizardStep } from '../../constants'
import { FaBarcode, FaRegCalendarMinus, FaRegCalendarPlus, FaUserSecret, FaChild, FaRegCalendarAlt, FaPlaneDeparture, FaMoneyBill } from "react-icons/fa"
import { formatDate, distanceFromDays, compareDate } from '../../services/time.service'
// import { getUserAuth } from 'services/auth.service'
// import { getSessionStorage, removeItem } from '../../services/session-storage.service'
// import { KEY } from '../../constants/session-storage'
import { getCode } from '../../services/utils.service'
import ReactTable from 'react-table'
import matchSorter from 'match-sorter'
import InfiniteScroll from 'react-infinite-scroller'
import { removeItem } from '../../services/session-storage.service'
import { KEY } from '../../constants/session-storage'

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}

class CheckOutConfirmation extends React.Component {
  displayName = 'Checkout Confirmation Page'

  static propTypes = {
    user: PropTypes.object,
    bookInfo: PropTypes.object
  }

  static async getInitialProps({ query }) {
      let apiService = ApiService()
      let res = {
        bookInfo: null
      }
      if(!query.book_completed){
        res.bookInfo = null
      }

      try{
        let bookInfo = await apiService.getBookTourHistoryByCode(query.book_completed, {isTour: true})
        res.bookInfo = bookInfo.data
      }
      catch(e){
        return res
      }
      return res
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.ages = {
      "adults": "Adult",
      "children": "Children"
    }
    this.state = {
      bookInfo: this.props.bookInfo ? this.props.bookInfo : null,
      tourInfo: this.props.bookInfo ? this.props.bookInfo.tour_turn : null,
      passengers: [],
      page: 1,
      hasMore: true
    }
  }

  loadMore(){
    if(this.state.bookInfo){
      this.apiService.getPassengersInBookTour(this.state.bookInfo.id, this.state.page).then((res) => {
        this.setState({
          passengers: [...this.state.passengers, ...res.data],
          page: res.next_page,
          hasMore: res.next_page > 0
        })
      })
    }
  }

  componentDidMount() {
    if(!this.state.bookInfo){
      Router.pushRoute("home")
    }

    removeItem(KEY.PASSENGER)
    this.loadMore()

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

  render() {
    const { tourInfo } = this.state
    const { bookInfo } = this.state
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
              {tourInfo && bookInfo &&
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
                                    <span>{getCode(bookInfo.id)}</span>
                                  </p>
                                  <p>
                                    <i className="fa fa-barcode" aria-hidden="true"><FaBarcode /></i>
                                    Tour Code:&nbsp;
                                    <span>{getCode(tourInfo.id)}</span>
                                  </p>
                                  {!!bookInfo.type_passenger_detail.length && bookInfo.type_passenger_detail.map((item, key) => {
                                      return(
                                        <p key={key}>
                                          <i aria-hidden="true">
                                            {item.type === 'adults' ?
                                              <FaUserSecret />
                                              : item.type === 'children' ?
                                              <FaChild /> : null
                                            }
                                          </i>
                                          {this.ages[item.type]} price:&nbsp;
                                          <span>
                                            {item.price.toLocaleString()} VND
                                          </span>
                                          <span> X {item.num_passenger}</span>
                                        </p>
                                      )
                                    })
                                  }
                                  <p className="total">
                                    <i className="fa fa-child" aria-hidden="true"><FaMoneyBill /></i>
                                    Total price:&nbsp;
                                    <span>{bookInfo.total_pay.toLocaleString()} VND</span>
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
                                <p>Fullname: <span>{bookInfo.book_tour_contact_info.fullname}</span></p>
                                <p>Phone number: <span> {bookInfo.book_tour_contact_info.phone}</span></p>
                                <p>Email: <span>{bookInfo.book_tour_contact_info.email}</span></p>
                                <p>Address: <span>{bookInfo.book_tour_contact_info.address}</span></p>
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
                              <div className="table-responsive mt-5">
                                <InfiniteScroll
                                  pageStart={0}
                                  loadMore={this.loadMore.bind(this)}
                                  hasMore={this.state.hasMore}
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
                                        Header: 'Fullname',
                                        accessor: 'fullname',
                                        id: 'fullname',
                                        filterAll: true,
                                        filterMethod: (filter, rows) =>
                                          matchSorter(rows, filter.value, { keys: ["fullname"] }),
                                      },
                                      {
                                        Header: '	Phone number',
                                        accessor: 'phone',
                                        id: 'phone',
                                        filterAll: true,
                                        filterMethod: (filter, rows) =>
                                          matchSorter(rows, filter.value, { keys: ["phone"] }),
                                      },
                                      {
                                        Header: 'Birthdate',
                                        accessor: d => formatDate(d.birthdate),
                                        id: 'birthdate',
                                        filterAll: true,
                                        filterMethod: (filter, rows) =>
                                          matchSorter(rows, filter.value, { keys: ["birthdate"] }),
                                        sortMethod: (a, b) =>
                                          compareDate(a, b)
                                      },
                                      {
                                        Header: 'Gender',
                                        accessor: 'sex',
                                        id: 'gender',
                                        filterAll: true,
                                        filterMethod: (filter, rows) =>
                                          matchSorter(rows, filter.value.toLocaleString(), { keys: ["gender"] }),
                                      },
                                      {
                                        Header: 'Age',
                                        accessor: d => this.ages[d.type_passenger.name],
                                        id: 'age',
                                        filterAll: true,
                                        filterMethod: (filter, rows) =>
                                          matchSorter(rows, filter.value, { keys: ["age"] }),
                                      },
                                      {
                                        Header: 'Identity card / Passport',
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
                        <div className="note-zone">
                          <p className="note">
                            <strong>Note:</strong> If you don&apos;t login our website, after booking a tour you will
                            see the confirmation at this step and receive the same content email for your usually checking.
                          </p>
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
              }
            </div>
          </section>
        </Layout>
      </>
    )
  }
}

export default connect(mapStateToProps)(CheckOutConfirmation)
