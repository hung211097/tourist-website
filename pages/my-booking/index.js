import React from 'react'
import { LayoutProfile } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import ApiService from 'services/api.service'
// import { formatDate } from '../../services/time.service'
// import _ from 'lodash'
import { Link } from 'routes'
import InfiniteScroll from 'react-infinite-scroller'

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

class MyBooking extends React.Component {
    displayName = 'My Booking'
    static propTypes = {
        dispatch: PropTypes.func,
        user: PropTypes.object
    }

    constructor(props) {
      super(props)
      // this.apiService = ApiService()
      this.state = {
        page: 1,
        hasMore: false
      }
    }

    loadMore(){

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
                            hasMore={this.state.hasMore}
                            useWindow={false}
                            threshold={10}>
                            <table id="list-booking" className="table">
                              <thead>
                                <tr>
                                  <th>Code</th>
                                  <th>Booking Day</th>
                                  <th>Total slot</th>
                                  <th>Total money</th>
                                  <th>Status</th>
                                  <th width="100"></th>
                                  <th width="100"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {[1,2,3,4,5,6].map((item, key) => {
                                    return(
                                      <tr className="post" key={key}>
                                        <td className="code">
                                          <Link route="detail-booked-tour" params={{id: 9522}}>
                                            <a>0009522</a>
                                          </Link>
                                        </td>
                                        <td>08/03/2019 10:04</td>
                                        <td className="seats">
                                            1
                                        </td>
                                        <td>2.179.000 VNĐ</td>
                                        <td>Mới</td>
                                        <td className="action">
                                          <Link route="detail-booked-tour" params={{id: 9522}}>
                                            <a>Chi tiết</a>
                                          </Link>
                                        </td>
                                        <td className="action danger">
                                            <a href="/vi/my-booking/9522">Hủy tour</a>
                                        </td>
                                      </tr>
                                    )
                                  })
                                }
                              </tbody>
                            </table>
                          </InfiniteScroll>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </LayoutProfile>
        )
    }
}

export default connect(mapStateToProps)(MyBooking)
