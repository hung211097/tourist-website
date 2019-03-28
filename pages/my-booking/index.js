import React from 'react'
import { LayoutProfile, PopupCancelTour } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ApiService from 'services/api.service'
import { formatDate } from '../../services/time.service'
// import _ from 'lodash'
import { Link } from 'routes'
import InfiniteScroll from 'react-infinite-scroller'
import ReactTable from 'react-table'
import { getCode, shrinkCode, capitalize } from '../../services/utils.service'
import matchSorter from 'match-sorter'

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

class MyBooking extends React.Component {
    displayName = 'My Booking'
    static propTypes = {
        useModal: PropTypes.func,
        user: PropTypes.object
    }

    constructor(props) {
      super(props)
      this.apiService = ApiService()
      this.state = {
        page: 1,
        hasMore: true,
        bookTours: [],
        showPopup: false,
        dataPopup: null
      }
    }

    loadMore(){
      if(this.state.page > 0){
        this.apiService.getBookToursHistory(this.state.page, 6).then((res) => {
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

    handleChangeStatus(id, status){
      let arr = this.state.bookTours
      let temp = arr.find((item) => {
        return item.id === id
      })
      if(temp){
        temp.statusCancel = capitalize(status)
      }
      this.setState({
        bookTours: arr
      })
    }

    render() {
        return (
            <LayoutProfile page="profile" tabName="my-booking" {...this.props}>
                <style jsx>{styles}</style>
                <div className="profile-detail">
                  <div className="title">
                    <div className="text-center title-contain">
                      <h1 className="my-profile__title">MY BOOKING</h1>
                    </div>
                    <div className="row content">
                      <div className="col-md-12">
                        <div className="my-booking table-responsive">
                          <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadMore.bind(this)}
                            hasMore={this.state.page > 0}
                            useWindow={false}
                            threshold={400}
                            initialLoad={false}>
                            <ReactTable
                              data={this.state.bookTours}
                              className="-striped -highlight"
                              showPagination={false}
                              filterable={true}
                              columns={[
                                {
                                  Header: 'Code',
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
                                  Header: 'Booking day',
                                  accessor: d => formatDate(d.book_time, "dd/MM/yyyy HH:mm"),
                                  id: 'date',
                                  filterAll: true,
                                  filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["date"] }),
                                },
                                {
                                  Header: 'Total slot',
                                  accessor: 'num_passenger',
                                  className: "text-center"
                                },
                                {
                                  Header: 'Total money',
                                  accessor: d => d.total_pay.toLocaleString() + " VND",
                                  id: 'total_money',
                                  filterAll: true,
                                  filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value.toLocaleString(), { keys: ["total_money"] }),
                                },
                                {
                                  Header: 'Status',
                                  accessor: d => capitalize(d.status),
                                  id: 'status',
                                  className: "text-center",
                                  filterAll: true,
                                  filterMethod: (filter, rows) =>
                                    matchSorter(rows, filter.value, { keys: ["status"] }),
                                },
                                {
                                  Header: 'Detail',
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
                                      <a className="detail-btn">Detail</a>
                                    </Link>
                                  </div>
                                },
                                {
                                  Header: 'Cancel',
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
                                            <p style={{lineHeight: '2'}}>{capitalize(request_cancel_bookings.status)}</p>
                                          :
                                          isCancelBooking && !request_cancel_bookings ?
                                            <a href="javascript:;" onClick={this.handleCancelTour.bind(this, id)}
                                              className="cancel-btn">Cancel</a>
                                          : null
                                        }
                                      </div>
                                    )
                                  }
                                }
                              ]}
                            />
                          </InfiniteScroll>
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

export default connect(mapStateToProps)(MyBooking)
