import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { RatingStar } from 'components'
import { Link } from 'routes'
import { FaRegCommentDots, FaRegEye, FaBarcode, FaCalendarAlt, FaClock, FaUserAlt } from "react-icons/fa"
import { formatDate } from '../../services/time.service'

class SearchItem extends React.Component {
  displayName = 'Search Item'

  static propTypes = {
    item: PropTypes.object
  }

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="search-item">
        <style jsx>{styles}</style>
        <div className="search-container row">
          <div className="col-lg-3 col-md-3 col-sm-12 featured_image-container">
            <div className="featured_image">
              <Link route="home">
                <a>
                  <img src="/static/images/image_demo.jpg" className="img-responsive pic" alt="featured_image" />
                  <span className="sale">SALE!</span>
                </a>
              </Link>
            </div>
          </div>
          <div className="col-lg-9 col-md-9 col-sm-12 tour-info-new">
            <div className="row tour-name-container">
              <div className="col-12">
                <div className="tour-name">
                  <Link route="home">
                    <a title="Đồng Nai - Núi Chứa Chan - Chương Trình Hành Hương Đầu Năm - (Tour Giá Sốc) ">
                      Đồng Nai - Núi Chứa Chan - Chương Trình Hành Hương Đầu Năm - (Tour Giá Sốc)
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="row tour-statistic">
              <div className="col-12">
                <div className="star-rating">
                  <div className="rateit">
                    <RatingStar rate={4} />
                  </div>
                  <div className="statistic">
                    <span className="views" title="views">
                      <FaRegEye />&nbsp;100
                    </span>
                    <span className="comments" title="comment">
                      <FaRegCommentDots />&nbsp;10
                    </span>
                  </div>
                  <div className="clear" />
                </div>
              </div>
              <div className="col-sm-12 statistic-content">
                <div className="row mg-listtour">
                  <div className="col-lg-6 col-md-6 mg-bot10">
                    <i><FaBarcode /></i>&nbsp;&nbsp;230319XE
                  </div>
                  <div className="col-lg-6 col-md-6 mg-bot10">
                    <i><FaCalendarAlt /></i>&nbsp;&nbsp;Start date: 23/03/2019
                  </div>
                  <div className="col-lg-6 col-md-6 mg-bot10">
                    <i><FaClock /></i>&nbsp;&nbsp;Lasting: 1 days
                  </div>
                  <div className="col-lg-6 col-md-6 mg-bot10">
                    <i><FaUserAlt /></i>&nbsp;&nbsp;Vacancy: 3
                  </div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="price-container">
                  <div className="price-new">
                    <span className="discount-price">1,000,000</span>&nbsp;&nbsp;
                    <span>550,000 VND</span>
                  </div>
                  <Link route="home">
                    <a className="btn" title="Detail">DETAIL</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SearchItem
