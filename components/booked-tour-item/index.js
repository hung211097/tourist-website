import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Link } from 'routes'
import { FaBarcode, FaRegCalendarAlt, FaRegCalendarMinus, FaRegCalendarPlus, FaMoneyBill, FaInfoCircle, FaUsers } from "react-icons/fa"
import { formatDate } from '../../services/time.service'
import { getCode, capitalize } from '../../services/utils.service'

class BookedTourItem extends React.Component {
  displayName = 'Booked Tour Item'

  static propTypes = {
    item: PropTypes.object.isRequired,
    t: PropTypes.func,
    onCancelTour: PropTypes.func
  }

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  handleCancelTour(){
    this.props.onCancelTour && this.props.onCancelTour(this.props.item.id)
  }

  render() {
    const { item, t } = this.props
    // const price = item.original_price ? item.original_price : item.price
    // const discountPrice = item.end_price ? item.end_price : price - price * item.discount
    return (
      <div className="booked-item">
        <style jsx>{styles}</style>
        <div className="row">
          <div className="col-lg-4 col-sm-12 featured_img">
            <span className="sale">SALE!</span>
            <img alt="featured_img" src="/static/images/image_demo.jpg" />
          </div>
          <div className="col-lg-8 col-sm-12 book-info">
            <h2>Vũng Tàu - Đà Lạt</h2>
            <div className="detail-info">
              <div className="row">
                <div className="col-sm-7">
                  <p><span><i><FaBarcode /></i>{t('my_booking.code')}:</span> {getCode(item.id)}</p>
                  <p><span><i><FaInfoCircle /></i>{t('my_booking.status')}:</span> {capitalize(t('my_booking.' + item.status))}</p>
                  <p><span><i><FaRegCalendarAlt /></i>{t('my_booking.book_day')}:</span> {formatDate(item.book_time, "dd/MM/yyyy HH:mm")}</p>
                  <p><span><i><FaUsers /></i>{t('my_booking.total_slot')}:</span> {item.num_passenger}</p>
                  <p><span><i><FaMoneyBill /></i>{t('my_booking.total_money')}:</span> {item.total_pay.toLocaleString()} VND</p>
                </div>
                <div className="col-sm-5">
                  <p>
                    <span><i className="fa fa-calendar-minus-o" aria-hidden="true"><FaRegCalendarMinus /></i>{t('detail_booked_tour.start_date')}:&nbsp;</span>
                    24/04/2019
                  </p>
                  <p>
                    <span><i className="fa fa-calendar-plus-o" aria-hidden="true"><FaRegCalendarPlus /></i>{t('detail_booked_tour.end_date')}:&nbsp;</span>
                    24/04/2019
                  </p>
                  <p>
                    <span><i className="fa fa-calendar" aria-hidden="true"><FaRegCalendarAlt /></i>{t('detail_booked_tour.lasting')}:&nbsp;</span>
                    1 ngày
                  </p>
                </div>
                <div className="btn-zone col-12">
                  <Link route="detail-booked-tour" params={{id: item.id}}>
                    <a className="detail-btn">{t('my_booking.detail')}</a>
                  </Link>
                  <a className="cancel-btn" onClick={this.handleCancelTour.bind(this)}>{t('my_booking.cancel')}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default BookedTourItem
