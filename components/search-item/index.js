import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { RatingStar } from 'components'
import { Link } from 'routes'
import { FaRegCommentDots, FaRegEye, FaBarcode, FaCalendarAlt, FaClock, FaUserAlt, FaRegCalendarAlt } from "react-icons/fa"
import { formatDate, distanceFromDays } from '../../services/time.service'
import { getCode } from '../../services/utils.service'
import { slugify } from '../../services/utils.service'

class SearchItem extends React.Component {
  displayName = 'Search Item'

  static propTypes = {
    item: PropTypes.object,
    isGrid: PropTypes.bool,
    t: PropTypes.func,
    isLast: PropTypes.bool
  }

  static defaultProps = {
    isGrid: false,
    isLast: false
  }
  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  render() {
    const {item, t} = this.props
    if(this.props.isGrid){
      return(
        <div className="col-sm-6 col-12">
          <style jsx>{styles}</style>
          <div className="item-tour-main">
            <div>
              <Link route="detail-tour" params={{id: item.id, name: slugify(item.tour.name)}}>
                <a title={item.tour.name}>
                  <div className="tour-img">
                    <img src={item.tour.featured_img} className="img-responsive" alt="featured_image" />
                    {!!item.discount &&
                      <span className="sale">{t('search.sale')}!</span>
                    }
                    <div className="tour-statistic">
                      <div className="row figure">
                        <div className="col-sm-6 col-12 text-left no-padding">
                          <i title="views"><FaRegEye /></i>&nbsp;&nbsp;
                          <span style={{color: 'white'}} title="views">{item.view.toLocaleString()}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                          <i title="comments"><FaRegCommentDots /></i>&nbsp;&nbsp;
                          <span style={{color: 'white'}} title="comments">{item.tour.num_review}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                        </div>
                        <div className="col-sm-6 col-12 no-padding ratingstar">
                          <RatingStar isWhite rate={item.tour.average_rating} />
                        </div>
                      </div>
                      <div className="row no-margin">
                        <div className="col-6 text-left no-padding">
                          <i><FaRegCalendarAlt style={{position: 'relative', top: '-2px'}}/></i>&nbsp;&nbsp;{formatDate(item.start_date)}
                        </div>
                        <div className="col-6 text-right no-padding">
                          <i><FaUserAlt style={{position: 'relative', top: '-2px'}}/></i>&nbsp;&nbsp;{item.num_max_people - item.num_current_people} {t('search.slot')}
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
              <div className="tour-content">
                    <div className="tour-title col-md-12 col-sm-12 col-12">
                      <div style={{display: 'table-cell', verticalAlign: 'middle'}}>
                        {item.tour.name}
                      </div>
                    </div>
                    <div className="tour-info row">
                      <div className="date col-2">
                        <div className="date-display">{distanceFromDays(new Date(item.start_date), new Date(item.end_date)) + 1}</div>
                        <div className="date-lang">{t('search.days')}</div>
                      </div>
                      <div className="price col-7">
                        {!!item.discount &&
                          <div className="price-discount f-left">{item.original_price.toLocaleString()} VND</div>
                        }
                        <div className="price-new_n f-left">{item.end_price.toLocaleString()} VND</div>
                        <div className="clear" />
                      </div>
                      <Link route="detail-tour" params={{id: item.id, name: slugify(item.tour.name)}}>
                        <a className="btn-book col-3">
                          <span>{t('search.detail')}</span>
                        </a>
                      </Link>
                    </div>
                  </div>
              <div className="clear" />
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className={this.props.isLast ? "search-item no-border-bot" : "search-item"}>
        <style jsx>{styles}</style>
        <div className="search-container row">
          <div className="col-lg-3 col-md-3 col-sm-12 featured_image-container">
            <div className="featured_image">
              <Link route="detail-tour" params={{id: item.id, name: slugify(item.tour.name)}}>
                <a>
                  <img src={item.tour.featured_img} className="img-responsive pic" alt="featured_image" />
                  {!!item.discount &&
                    <span className="sale">{t('search.sale')}!</span>
                  }
                </a>
              </Link>
            </div>
          </div>
          <div className="col-lg-9 col-md-9 col-sm-12 tour-info-new">
            <div className="row tour-name-container">
              <div className="col-12">
                <div className="tour-name">
                  <Link route="detail-tour" params={{id: item.id, name: slugify(item.tour.name)}}>
                    <a title={item.tour.name}>
                      {item.tour.name}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="row tour-statistic">
              <div className="col-12">
                <div className="star-rating">
                  <div className="rateit">
                    <RatingStar rate={item.tour.average_rating} />
                  </div>
                  <div className="statistic">
                    <span className="views" title="views">
                      <FaRegEye />&nbsp;{item.view.toLocaleString()}
                    </span>
                    <span className="comments" title="comment">
                      <FaRegCommentDots />&nbsp;{item.tour.num_review}
                    </span>
                  </div>
                  <div className="clear" />
                </div>
              </div>
              <div className="col-sm-12 statistic-content">
                <div className="row mg-listtour">
                  <div className="col-lg-6 col-md-6 mg-bot10">
                    <i><FaBarcode /></i>&nbsp;&nbsp;{t('search.tour_code')}: {getCode(item.id)}
                  </div>
                  <div className="col-lg-6 col-md-6 mg-bot10">
                    <i><FaCalendarAlt /></i>&nbsp;&nbsp;{t('search.start_date')}: {formatDate(item.start_date)}
                  </div>
                  <div className="col-lg-6 col-md-6 mg-bot10">
                    <i><FaClock /></i>&nbsp;&nbsp;{t('search.lasting')}: {distanceFromDays(new Date(item.start_date), new Date(item.end_date)) + 1} days
                  </div>
                  <div className="col-lg-6 col-md-6 mg-bot10">
                    <i><FaUserAlt /></i>&nbsp;&nbsp;{t('search.vacancy')}: {item.num_max_people - item.num_current_people}
                  </div>
                </div>
              </div>
              <div className="col-sm-12">
                <div className="price-container">
                  <div className="price-new">
                    {!!item.discount &&
                      <span className="discount-price mr-3">{item.original_price.toLocaleString()} VND</span>
                    }
                    <span>{item.end_price.toLocaleString()} VND</span>
                  </div>
                  <Link route="detail-tour" params={{id: item.id, name: slugify(item.tour.name)}}>
                    <a className="btn" title="Detail">{t('search.detail')}</a>
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
