import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { RatingStar } from 'components'
import { Link } from 'routes'

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
        <Link route="home">
          <a>
            <img alt="featured_image" src={item.featured_img}/>
            <h2>{item.name}</h2>
          </a>
        </Link>
        <div className="rating-star">
          <RatingStar hideNumber rate={3}/>
        </div>
        <div className="price">
          {/*<span className="amout">{item.price.toLocaleString()} VND</span>*/}
        </div>
        <div className="action">
          <Link route="home">
            <a className="button">BOOK NOW</a>
          </Link>
          <Link route="home">
            <a className="button ml-4">DETAIL</a>
          </Link>
        </div>
      </div>
    )
  }
}

export default TourItem
