import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Link } from 'routes'

class TopPromotionItem extends React.Component {
  displayName = 'Top Promotion Item'

  static propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number
  }

  constructor(props) {
    super(props)
    this.maxDes = 110
    this.colorClass = ['purple', 'blue', 'red', 'green', 'orange', 'yellow']
  }

  componentDidMount() {

  }

  render() {
    const { item } = this.props
    return (
      <div className="promotion-item">
        <style jsx>{styles}</style>
        <div className="wrapper-item">
          <div className="content-item">
            <Link route="home">
              <a>
                <div className="contain-price">
                  <span>{item.price.toLocaleString()} VND</span>
                </div>
              </a>
            </Link>
            <a href={item.featured_img}>
              <img alt="tour_img" src={item.featured_img} />
            </a>
          </div>
          <div className="name-item">
            <Link route="home">
              <a>
                <h3 style={item.name.length > 30 ? {fontSize: '16px'} : null}>
                  {item.name}
                </h3>
              </a>
            </Link>
          </div>
          <div className="description-item">
            <p>{item.description.substring(0, this.maxDes) + '...'}</p>
            <Link route="home">
              <a>DETAILS</a>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default TopPromotionItem
