import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { RatingStar } from 'components'
import { Link } from 'routes'
import { FaRegCalendarAlt } from "react-icons/fa"
import { formatDate } from '../../services/time.service'
import { slugify } from '../../services/utils.service'

class TourItem extends React.Component {
  displayName = 'Tour Item'

  static propTypes = {
    item: PropTypes.object.isRequired,
    t: PropTypes.func
  }

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  render() {
    const { item, t } = this.props
    const price = item.original_price ? item.original_price : item.price
    const discountPrice = item.end_price ? item.end_price : price - price * item.discount
    return (
      <div className="tour-item">
        <style jsx>{styles}</style>
        <Link route="detail-tour" params={{id: item.id, name: slugify(item.tour.name)}}>
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
          <Link route="checkout-passengers" params={{tour_id: item.id}}>
            <a className="button">{t('tours.book')}</a>
          </Link>
          <Link route="detail-tour" params={{id: item.id, name: slugify(item.tour.name)}}>
            <a className="button ml-4">{t('tours.detail')}</a>
          </Link>
        </div>
      </div>
    )
  }
}

export default TourItem
