import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { RatingStar } from 'components'
import { Link } from 'routes'
import { FaRegCalendarAlt } from "react-icons/fa"
import { formatDate } from '../../services/time.service'

class TourItem extends React.Component {
  displayName = 'Tour Item'

  static propTypes = {
    item: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  render() {
    const { item } = this.props
    return (
      <div className="tour-item">
        <style jsx>{styles}</style>
        <Link route="detail-tour" params={{id: item.id}}>
          <a>
            {!!item.discount &&
              <span className="sale">SALE!</span>
            }
            <img alt="featured_image" src={item.tour.featured_img}/>
            <h2>{item.tour.name}</h2>
            <p><FaRegCalendarAlt style={{fontSize: '15px', position: 'relative', top: '-1px'}} /> {formatDate(item.start_date)}</p>
          </a>
        </Link>
        <div className="rating-star">
          <RatingStar hideNumber rate={3}/>
        </div>
        <div className="price">
          {!!item.discount &&
            <span className="discount-price">{item.price.toLocaleString()}</span>
          }
          <span className="amout">{!item.discount ? item.price.toLocaleString() : ' ' + (item.price * item.discount).toLocaleString()} VND</span>
        </div>
        <div className="action">
          <Link route="checkout-passengers" params={{tourId: item.id}}>
            <a className="button">BOOK NOW</a>
          </Link>
          <Link route="detail-tour" params={{id: item.id}}>
            <a className="button ml-4">DETAIL</a>
          </Link>
        </div>
      </div>
    )
  }
}

export default TourItem
