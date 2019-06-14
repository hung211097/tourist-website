import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Link } from 'routes'
import { FaBarcode, FaRegCalendarAlt, FaRegCalendarMinus, FaRegCalendarPlus, FaMoneyBill, FaInfoCircle, FaUsers } from "react-icons/fa"
import { formatDate, distanceFromDays } from '../../services/time.service'
import { capitalize } from '../../services/utils.service'

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
            {!!item.tour_turn.discount &&
              <span className="sale">{t('tours.sale')} {item.tour_turn.discount * 100}%</span>
            }
            <Link route="detail-booked-tour" params={{id: item.code}}>
              <a className="detail-btn">
                <img alt="featured_img" src={item.tour_turn.tour.featured_img ? item.tour_turn.tour.featured_img : '/static/images/no_image.jpg'} />
              </a>
            </Link>
          </div>
          <div className="col-lg-8 col-sm-12 book-info">
            <h2>{item.tour_turn.tour.name}</h2>
            <div className="detail-info">
              <div className="row">
                <div className="col-sm-7">
                  <p><span><i><FaBarcode /></i>{t('my_booking.code')}:</span> {item.code}</p>
                  <p style={{color: 'red'}}><span style={{color: '#434a54'}}><i><FaInfoCircle /></i>{t('my_booking.status')}:</span> {capitalize(t('detail_booked_tour.' + item.status))}</p>
                  <p><span><i><FaRegCalendarAlt /></i>{t('my_booking.book_day')}:</span> {formatDate(item.book_time, "dd/MM/yyyy HH:mm")}</p>
                  <p><span><i><FaUsers /></i>{t('my_booking.total_slot')}:</span> {item.num_passenger}</p>
                  <p><span><i><FaMoneyBill /></i>{t('my_booking.total_money')}:</span> {item.total_pay.toLocaleString()} VND</p>
                </div>
                <div className="col-sm-5">
                  <p>
                    <span><i className="fa fa-calendar-minus-o" aria-hidden="true"><FaRegCalendarMinus /></i>{t('detail_booked_tour.start_date')}:&nbsp;</span>
                    {formatDate(item.tour_turn.start_date)}
                  </p>
                  <p>
                    <span><i className="fa fa-calendar-plus-o" aria-hidden="true"><FaRegCalendarPlus /></i>{t('detail_booked_tour.end_date')}:&nbsp;</span>
                    {formatDate(item.tour_turn.end_date)}
                  </p>
                  <p>
                    <span><i className="fa fa-calendar" aria-hidden="true"><FaRegCalendarAlt /></i>{t('detail_booked_tour.lasting')}:&nbsp;</span>
                    {distanceFromDays(new Date(item.tour_turn.start_date), new Date(item.tour_turn.end_date)) + 1} {t('detail_booked_tour.days')}
                  </p>
                </div>
                <div className="btn-zone col-12">
                  <Link route="detail-booked-tour" params={{id: item.code}}>
                    <a className="detail-btn">{t('my_booking.detail')}</a>
                  </Link>
                  {item.isCancelBooking &&
                    <a className="cancel-btn" onClick={this.handleCancelTour.bind(this)}>{t('my_booking.cancel')}</a>
                  }
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
