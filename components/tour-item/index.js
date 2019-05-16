import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { RatingStar } from 'components'
import { Link, Router } from 'routes'
import { FaRegCalendarAlt } from "react-icons/fa"
import { formatDate } from '../../services/time.service'
import { slugify } from '../../services/utils.service'
import { useModal } from '../../actions'
import { modal } from '../../constants'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch) => {
  return {
    useModal: (data) => {dispatch(useModal(data))}
  }
}

class TourItem extends React.Component {
  displayName = 'Tour Item'

  static propTypes = {
    item: PropTypes.object.isRequired,
    t: PropTypes.func,
    useModal: PropTypes.func
  }

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  handleBook(){
    const { item } = this.props
    if(item.num_max_people - item.num_current_people === 0 || !item.isAllowBooking){
      this.props.useModal && this.props.useModal({type: modal.NO_BOOK, isOpen: true, data: ''})
      return
    }
    Router.pushRoute("checkout-passengers", {tour_id: item.code})
  }

  render() {
    const { item, t } = this.props
    const price = item.original_price ? item.original_price : item.price
    const discountPrice = item.end_price ? item.end_price : price - price * item.discount
    return (
      <div className="tour-item">
        <style jsx>{styles}</style>
        <Link route="detail-tour" params={{id: item.code, name: slugify(item.tour.name)}}>
          <a>
            {!!item.discount &&
              <span className="sale">{t('tours.sale')}!</span>
            }
            <img alt="featured_image" src={item.tour.featured_img}/>
            <h2>{item.tour.name}</h2>
            <p><FaRegCalendarAlt style={{fontSize: '15px', position: 'relative', top: '-1px'}} /> {formatDate(item.start_date)}</p>
          </a>
        </Link>
        <div className="rating-star">
          <RatingStar rate={item.tour.average_rating}/>
        </div>
        <div className="price">
          {!!item.discount &&
            <span className="discount-price">{price.toLocaleString()}</span>
          }
          <span className="amout"> {discountPrice.toLocaleString()} VND</span>
        </div>
        <div className="action">
          <a className={item.num_max_people - item.num_current_people === 0 || !item.isAllowBooking ? "button disabled" : "button"}
            onClick={this.handleBook.bind(this)}>{t('tours.book')}
          </a>
          <Link route="detail-tour" params={{id: item.code, name: slugify(item.tour.name)}}>
            <a className="button ml-4">{t('tours.detail')}</a>
          </Link>
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(TourItem)
