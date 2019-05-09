import React from 'react'
import { LayoutProfile, PopupCancelTour, BookedTourItem } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ApiService from 'services/api.service'
import InfiniteScroll from 'react-infinite-scroller'
import { withNamespaces } from "react-i18next"
import Select from 'react-select'
import arraySort from 'array-sort'
// import matchSorter from 'match-sorter'
// import ReactTable from 'react-table'

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

class MyBooking extends React.Component {
    displayName = 'My Booking'
    static propTypes = {
        useModal: PropTypes.func,
        user: PropTypes.object,
        t: PropTypes.func
    }

    constructor(props) {
      super(props)
      this.apiService = ApiService()
      this.state = {
        page: 1,
        hasMore: true,
        bookTours: [],
        showPopup: false,
        dataPopup: null,
        bookingCode: '',
        searchTour: '',
        sort: 'bookDayDesc',
      }
      this.sorts = [
        { value: 'bookDayDesc', label: props.t('my_booking.bookDayDesc') },
        { value: 'bookDayAsc', label: props.t('my_booking.bookDayAsc') },
        { value: 'priceDesc', label: props.t('my_booking.priceDesc') },
        { value: 'priceAsc', label: props.t('my_booking.priceAsc') }
      ]
    }

    loadMore(){
      if(this.state.page > 0){
        this.apiService.getBookToursHistory(this.state.page, 3).then((res) => {
          this.setState({
            bookTours: [...this.state.bookTours, ...res.data],
            page: res.next_page,
            hasMore: res.next_page > 0
          })
        })
      }
    }

    componentDidMount(){
      this.loadMore()
    }

    handleCancelTour(value){
      this.setState({
        showPopup: true,
        dataPopup: this.getTourById(value)
      })
    }

    getTourById(id){
      let res = null
      res = this.state.bookTours.find((item) => {
        return item.id === id
      })

      return res
    }

    handleClosePopup() {
      this.setState({
        showPopup: false,
        dataPopup: null
      })
    }

    handleChangeStatus(id, status, flag){
      let arr = this.state.bookTours
      let temp = arr.find((item) => {
        return item.id === id
      })
      if(temp){
        temp.status = status
        temp.isCancelBooking = flag
      }
      this.setState({
        bookTours: arr
      })
    }

    handleChangeBookingCode(e){
      this.setState({
        bookingCode: e.target.value
      })
    }

    handleChangeSearchTour(e){
      this.setState({
        searchTour: e.target.value
      })
    }

    handleChangeSort(e){
      this.setState({
        sort: e.value
      })
    }

    UNSAFE_componentWillReceiveProps(props){
      this.sorts.forEach((item) => {
        item.label = props.t('my_booking.' + item.value)
      })
    }

    sortArray(arr){
      switch(this.state.sort){
        case 'bookDayDesc':
          arraySort(arr, 'book_time', {reverse: true})
          break
        case 'bookDayAsc':
          arraySort(arr, 'book_time')
          break
        case 'priceDesc':
          arraySort(arr, 'total_pay', {reverse: true})
          break
        case 'priceAsc':
          arraySort(arr, 'total_pay')
          break
      }
      return arr
    }

    render() {
        const {t} = this.props
        let displayArray = this.state.bookTours.filter((item) => {
          return item.code.search(this.state.bookingCode.toString()) > -1 &&
          item.tour_turn.tour.name.toLowerCase().search(this.state.searchTour.toLowerCase()) > -1
        })
        displayArray = this.sortArray(displayArray);
        return (
            <LayoutProfile page="profile" tabName="my-booking" {...this.props}>
                <style jsx>{styles}</style>
                <div className="profile-detail">
                  <div className="title">
                    <div className="text-center title-contain">
                      <h1 className="my-profile__title">{t('my_booking.title')}</h1>
                    </div>
                    <div className="row content">
                      <div className="col-md-12">
                        <div className="filter-zone">
                          <div className="row">
                            <div className="col-lg-4">
                              <input type="text" value={this.state.bookingCode} onChange={this.handleChangeBookingCode.bind(this)}
                                className="form-control" placeholder={t('my_booking.code')}/>
                            </div>
                            <div className="col-lg-4">
                              <input type="text" value={this.state.searchTour} onChange={this.handleChangeSearchTour.bind(this)}
                                className="form-control" placeholder={t('my_booking.search_tour')}/>
                            </div>
                            <div className="col-lg-4">
                              <div className="select-zone">
                                <Select
                                  instanceId="sort"
                                  value={this.state.sort}
                                  onChange={this.handleChangeSort.bind(this)}
                                  placeholder={t('my_booking.' + this.state.sort)}
                                  options={this.sorts}/>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="my-booking table-responsive">
                          <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadMore.bind(this)}
                            hasMore={this.state.page > 0}
                            useWindow={false}
                            threshold={20}
                            initialLoad={false}>
                            {/*<ReactTable
                              data={this.state.bookTours}
                              className="-striped -highlight"
                              showPagination={false}
                              filterable={true}
                              columns={[
                                {
                                  Header: t('my_booking.code'),
                                  accessor: d => getCode(d.id),
                                  id: 'id',
                                  className: "text-center",
                                  style: {fontWeight: '700', color: '#ff891e'},
                                  filterAll: true,
                                  filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["id"] }),
                                  Cell: props => <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      textAlign: 'center'
                                    }}>
                                    <Link route="detail-booked-tour" params={{id: shrinkCode(props.value)}}>
                                      <a>{props.value}</a>
                                    </Link>
                                  </div>
                                },
                                {
                                  Header: t('my_booking.book_day'),
                                  accessor: d => formatDate(d.book_time, "dd/MM/yyyy HH:mm"),
                                  id: 'date',
                                  filterAll: true,
                                  filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["date"] }),
                                },
                                {
                                  Header: t('my_booking.total_slot'),
                                  accessor: 'num_passenger',
                                  className: "text-center"
                                },
                                {
                                  Header: t('my_booking.total_money'),
                                  accessor: d => d.total_pay.toLocaleString() + " VND",
                                  id: 'total_money',
                                  filterAll: true,
                                  filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value.toLocaleString(), { keys: ["total_money"] }),
                                },
                                {
                                  Header: t('my_booking.status'),
                                  accessor: d => capitalize(t('my_booking.' + d.status)),
                                  id: 'status',
                                  className: "text-center",
                                  filterAll: true,
                                  filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["status"] }),
                                },
                                {
                                  Header: t('my_booking.detail'),
                                  id: 'Detail',
                                  accessor: 'id',
                                  sortable: false,
                                  filterable: false,
                                  Cell: props => <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      textAlign: 'center'
                                    }}>
                                    <Link route="detail-booked-tour" params={{id: props.value}}>
                                      <a className="detail-btn">{t('my_booking.detail')}</a>
                                    </Link>
                                  </div>
                                },
                                {
                                  Header: t('my_booking.cancel'),
                                  id: 'Cancel',
                                  accessor: props => ({
                                    id: props.id,
                                    statusCancel: props.statusCancel,
                                    isCancelBooking: props.isCancelBooking,
                                    request_cancel_bookings: props.request_cancel_bookings
                                  }),
                                  sortable: false,
                                  filterable: false,
                                  Cell: ({value: {
                                    id,
                                    statusCancel,
                                    isCancelBooking,
                                    request_cancel_bookings
                                  }}) => {
                                    return (
                                      <div
                                        style={{
                                          width: "100%",
                                          height: "100%",
                                          textAlign: 'center'
                                        }}>
                                        {statusCancel &&
                                          <p style={{lineHeight: '2'}}>{statusCancel}</p>
                                        }
                                        {!isCancelBooking && request_cancel_bookings ?
                                            <p style={{lineHeight: '2'}}>{capitalize(t('my_booking.' + request_cancel_bookings.status))}</p>
                                          :
                                          isCancelBooking && !request_cancel_bookings ?
                                            <a href="javascript:;" onClick={this.handleCancelTour.bind(this, id)}
                                              className="cancel-btn">{t('my_booking.cancel')}</a>
                                          : null
                                        }
                                      </div>
                                    )
                                  }
                                }
                              ]}
                            />*/}
                            {!!displayArray.length && displayArray.map((item, key) => {
                                return(
                                  <BookedTourItem key={key} t={t} item={item} onCancelTour={this.handleCancelTour.bind(this)}/>
                                )
                              })
                            }

                          </InfiniteScroll>
                          {!this.state.bookTours.length &&
                            <p className="no-tour">{t('my_booking.no_tour')}</p>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {this.state.showPopup &&
                  <PopupCancelTour show={true} onClose={this.handleClosePopup.bind(this)} tour={this.state.dataPopup}
                    changeStatus={this.handleChangeStatus.bind(this)}/>
                }
            </LayoutProfile>
        )
    }
}

export default withNamespaces('translation')(connect(mapStateToProps)(MyBooking))
