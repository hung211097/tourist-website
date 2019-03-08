import React from 'react'
import { LayoutProfile } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import InfiniteScroll from 'react-infinite-scroller'
import { FaMoneyBill, FaPhone, FaUsers, FaArrowLeft } from "react-icons/fa"
import { Link } from 'routes'
// import ApiService from 'services/api.service'
// import { formatDate } from '../../services/time.service'

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

class DetailBookedTour extends React.Component {
    displayName = 'Detail Booked Tour'
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
                      <Link route="my-booking">
                        <a className="back"><FaArrowLeft style={{fontSize: '25px'}}/></a>
                      </Link>
                      <h1 className="my-profile__title">DETAIL BOOKED TOUR INFORMATION <span>#0009522</span></h1>
                      <h3 className="booking-status">Status: <span>New</span></h3>
                    </div>
                    <div className="content">
                      <div className="container">
                        <div className="finish">
                          <div className="checkout-info">
                            <div className="header-title has-top-border">Checkout information
                              <span className="icon"><FaMoneyBill style={{fontSize: '25px', position: 'relative', top: '-1px'}}/></span>
                            </div>
                            <div className="row no-padding">
                              <div className="col-md-6 col-sm-6 col-12">
                                <div className="checkout-contact">
                                  <div className="item-row">
                                    <span className="item-label">Adult price</span>
                                    <span className="value">2.179.000</span>
                                  </div>
                                  <div className="item-row">
                                    <span className="item-label">Children price</span>
                                    <span className="value">1.089.500</span>
                                  </div>
                                  <div className="item-row">
                                    <span className="item-label bold">Total price</span>
                                    <span className="value">2.179.000</span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-6 col-12">
                                <div className="checkout-contact">
                                  <div className="item-row">
                                    <span className="item-label">Number of adults</span>
                                    <span className="value">1</span>
                                  </div>
                                  <div className="item-row">
                                    <span className="item-label">Number of children</span>
                                    <span className="value">0</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="contact-info">
                            <div className="header-title has-top-border">Contact information
                              <span className="icon"><FaPhone style={{fontSize: '18px', position: 'relative', top: '-2px'}}/></span>
                            </div>
                            {!_.isEmpty(this.props.user) &&
                              <div className="booking-contact">
                                <div className="item-row">
                                  <span className="item-label">Fullname: </span>
                                  <span className="value responsive">{this.props.user.fullname}</span>
                                </div>
                                <div className="item-row">
                                  <span className="item-label">Phone number: </span>
                                  <span className="value responsive">{this.props.user.phone}</span>
                                </div>
                                <div className="item-row">
                                <span className="item-label bold">Email: </span>
                                  <span className="value responsive">{this.props.user.email}</span>
                                </div>
                              </div>
                            }
                          </div>
                          <div className="pax-info">
                            <div className="header-title has-top-border">Passenger information
                              <span className="icon"><FaUsers style={{fontSize: '24px', position: 'relative', top: '-2px'}}/></span>
                            </div>
                            <div className="table-responsive">
                              <InfiniteScroll
                                pageStart={0}
                                loadMore={this.loadMore.bind(this)}
                                hasMore={this.state.hasMore}
                                useWindow={false}
                                threshold={10}>
                                <div className="passenger-info">
                                  <table className="table passenger-table">
                                    <thead>
                                      <tr>
                                        <th>Fullname</th>
                                        <th>Phone number</th>
                                        <th>Birthdate</th>
                                        <th>Gender</th>
                                        <th>Address</th>
                                        <th>Identity card / Passport</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[1,2,3,4,5,6].map((item, key) => {
                                          return(
                                            <tr key={key}>
                                              <td>Tạ Nguyễn Hưng</td>
                                              <td>1234567890</td>
                                              <td>08/03/2019</td>
                                              <td>Nam</td>
                                              <td>Ho Chi Minh City</td>
                                              <td>3523354654</td>
                                            </tr>
                                          )
                                        })
                                      }
                                    </tbody>
                                  </table>
                                </div>
                              </InfiniteScroll>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </LayoutProfile>
        )
    }
}

export default connect(mapStateToProps)(DetailBookedTour)
