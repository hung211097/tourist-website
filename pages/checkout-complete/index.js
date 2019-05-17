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
import { slugify } from '../../services/utils.service'
// import ReactTable from 'react-table'
// import InfiniteScroll from 'react-infinite-scroller'
import { withNamespaces } from "react-i18next"
import { metaData } from '../../constants/meta-data'
import Redirect from 'routes/redirect'
import { addInfoPassengers } from '../../actions'

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

class CheckOutConfirmation extends React.Component {
  displayName = 'Checkout Confirmation Page'

  static propTypes = {
    user: PropTypes.object,
    bookInfo: PropTypes.object,
    t: PropTypes.func,
    addInfoPassengers: PropTypes.func
  }

  static async getInitialProps({ res, query }) {
      let apiService = ApiService()
      let result = {
        bookInfo: null
      }
      if(!query.book_completed){
        result.bookInfo = null
      }

      try{
        let bookInfo = await apiService.getBookTourHistoryByCode(query.book_completed, {isTour: true})
        result.bookInfo = bookInfo.data
      }
      catch(e){
        Redirect(res, '404')
      }
      if(!result.bookInfo){
        Redirect(res, '404')
      }
      return result
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
      passengers: []
    }
  }

  loadMore(){
    this.apiService.getPassengersInBookTour(this.state.bookInfo.id).then((res) => {
      this.setState({
        passengers: res.data
      })
    })
  }

  componentDidMount() {
    this.props.addInfoPassengers && this.props.addInfoPassengers(null)
    this.loadMore()

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
                <WizardStep step={wizardStep.COMPLETE} t={t}/>
              </div>
              {tourInfo && bookInfo &&
                <div className="confirmation-info">
                  <div className="row">
                    <div className="col-12 col-sm-10 offset-sm-1 no-padding-res">
                      <div className="book-form">
                        <div className="text-center">
                          <h1>{t('checkout_confirmation.title')}</h1>
                          <span className="undericon"><FaPlaneDeparture /></span>
                        </div>
                        <div className="tour-info">
                          <div className="title ">
                            <h3>{t('checkout_confirmation.tour_info')}</h3>
                            <div className="underline-zone">
                              <span className="underline"></span>
                            </div>
                          </div>
                          <div className="content-tour row">
                            <div className="col-sm-4">
                              <Link route="detail-tour" params={{id: tourInfo.code, name: slugify(tourInfo.tour.name)}}>
                                <a><img alt="featured_img" src={tourInfo.tour.featured_img}/></a>
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
                                    <i className="fa fa-barcode" aria-hidden="true"><FaBarcode /></i>
                                    {t('checkout_confirmation.book_code')}:&nbsp;
                                    <span>{bookInfo.code}</span>
                                  </p>
                                  <p>
                                    <i className="fa fa-barcode" aria-hidden="true"><FaBarcode /></i>
                                      {t('checkout_confirmation.code')}:&nbsp;:&nbsp;
                                    <span>{tourInfo.code}</span>
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
                                          {t('checkout_confirmation.' + this.ages[item.type])} price:&nbsp;
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
                                    {t('checkout_confirmation.total_price')}:&nbsp;
                                    <span>{bookInfo.total_pay.toLocaleString()} VND</span>
                                  </p>
                                </div>
                                <div className="col-sm-6">
                                  <p>
                                    <i className="fa fa-calendar-minus-o" aria-hidden="true"><FaRegCalendarMinus /></i>
                                    {t('checkout_confirmation.start_date')}:&nbsp;
                                    <span>{formatDate(tourInfo.start_date)}</span>
                                  </p>
                                  <p>
                                    <i className="fa fa-calendar-plus-o" aria-hidden="true"><FaRegCalendarPlus /></i>
                                    {t('checkout_confirmation.end_date')}:&nbsp;
                                    <span>{formatDate(tourInfo.end_date)}</span>
                                  </p>
                                  <p>
                                    <i className="fa fa-calendar" aria-hidden="true"><FaRegCalendarAlt /></i>
                                    {t('checkout_confirmation.lasting')}:&nbsp;
                                    <span>{distanceFromDays(new Date(tourInfo.start_date), new Date(tourInfo.end_date)) + 1} {t('checkout_confirmation.days')}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="apart" />
                        <div className="contact-info">
                          <div className="title">
                            <h3>{t('checkout_confirmation.contact_info')}</h3>
                            <div className="underline-zone">
                              <span className="underline"></span>
                            </div>
                          </div>
                          <div className="content-contact row">
                            <div className="col-12">
                              <div className="contact">
                                <p>{t('checkout_confirmation.fullname')}: <span>{bookInfo.book_tour_contact_info.fullname}</span></p>
                                <p>{t('checkout_confirmation.phone')}: <span> {bookInfo.book_tour_contact_info.phone}</span></p>
                                <p>Email: <span>{bookInfo.book_tour_contact_info.email}</span></p>
                                <p>{t('checkout_confirmation.address')}: <span>{bookInfo.book_tour_contact_info.address}</span></p>
                                <p>{t('checkout_confirmation.passport')}: <span>{bookInfo.book_tour_contact_info.passport}</span></p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="apart" />
                        <div className="passenger-info">
                          <div className="title">
                            <h3>{t('checkout_confirmation.passenger_info')}</h3>
                            <div className="underline-zone">
                              <span className="underline"></span>
                            </div>
                          </div>
                          <div className="content-contact row">
                            <div className="col-12">
                              <div className="table-responsive mt-5">
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
                                {/*<InfiniteScroll
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
                                    columns={[
                                      {
                                        Header: t('checkout_confirmation.fullname'),
                                        accessor: 'fullname',
                                        id: 'fullname',
                                        className: 'text-center'
                                      },
                                      {
                                        Header: t('checkout_confirmation.phone'),
                                        accessor: 'phone',
                                        id: 'phone',
                                        className: 'text-center'
                                      },
                                      {
                                        Header: t('checkout_confirmation.birthdate'),
                                        accessor: d => formatDate(d.birthdate),
                                        id: 'birthdate',
                                        className: 'text-center',
                                        sortMethod: (a, b) =>
                                          compareDate(a, b)
                                      },
                                      {
                                        Header: t('checkout_confirmation.gender'),
                                        accessor: d => t('checkout_confirmation.' + d.sex),
                                        id: 'gender',
                                        className: 'text-center'
                                      },
                                      {
                                        Header: t('checkout_confirmation.age'),
                                        accessor: d => t('checkout_confirmation.' + this.ages[d.type_passenger.name]),
                                        id: 'age',
                                        className: 'text-center'
                                      },
                                      {
                                        Header: t('checkout_confirmation.passport'),
                                        id: 'passport',
                                        accessor: 'passport',
                                        className: 'text-center'
                                      }
                                    ]}
                                  />
                                </InfiniteScroll>*/}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="note-zone">
                          <p className="note">
                            <strong>{t('checkout_confirmation.note')}:</strong>&nbsp;
                            {t('checkout_confirmation.note_content')}
                          </p>
                        </div>
                        <div className="confirm-zone">
                          <Link route="home">
                            <a className="co-btn w-auto">
                              {t('checkout_confirmation.back_home')}
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

export default withNamespaces('translation')(connect(mapStateToProps, mapDispatchToProps)(CheckOutConfirmation))
