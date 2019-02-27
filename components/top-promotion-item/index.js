import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
// import { Router } from 'routes'

class TopPromotionItem extends React.Component {
  displayName = 'Top Promotion Item'

  static propTypes = {
    item: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="promotion-item">
        <style jsx>{styles}</style>
        <div className="wrapper-item">
          <div className="content-item">
            <a>
              <span>700 $</span>
            </a>
            <img alt="tour_img" src="/static/images/image_demo.jpg" />
          </div>
          <div className="name-item">
            <a><h3>Berlin</h3></a>
          </div>
          <div className="description-item">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ut efficitur ante. Donec dapibus dictum scelerisque.</p>
            <a>DETAILS</a>
          </div>
        </div>
      </div>
    )
  }
}

export default TopPromotionItem
