import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Link } from 'routes'
import { formatDate } from '../../services/time.service'
import Countdown, { zeroPad } from 'react-countdown-now'
import { slugify } from '../../services/utils.service'

class TopPromotionItem extends React.Component {
  displayName = 'Top Promotion Item'

  static propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number,
    onLoadTour: PropTypes.func,
    lng: PropTypes.string,
    t: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.maxDes = 110
    this.colorClass = ['purple', 'blue', 'red', 'green', 'orange', 'yellow']
  }

  componentDidMount() {

  }

  handleComplete(){
    this.props.onLoadTour && this.props.onLoadTour()
  }

  render() {
    const { item, t } = this.props
    const renderTime = ({ days, hours, minutes, seconds, completed }) => {
      if(completed){
        return <span></span>
      }
      else{
        if(this.props.lng === 'vi'){
          return <span>còn lại {days} ngày {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>
        }
        return <span>{days} days left {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>
      }
    }
    return (
      <div className="promotion-item">
        <style jsx>{styles}</style>
        <div className="wrapper-item">
          <div className="content-item">
            <Link route="detail-tour" params={{id: item.code, name: slugify(item.tour.name)}}>
              <a>
                <div className="contain-price">
                  {!!item.discount &&
                    <span className="discount-price">{item.price.toLocaleString()}</span>
                  }
                  <span>{!item.discount ? item.price.toLocaleString() : ' ' + (item.price - item.price * item.discount).toLocaleString()} VND</span>
                </div>
                {!!item.discount &&
                  <span className="discount-mark">SALE</span>
                }
                <img alt="tour_img" src={item.tour.featured_img} />
              </a>
            </Link>
          </div>
          <div className="name-item">
            <Link route="detail-tour" params={{id: item.code, name: slugify(item.tour.name)}}>
              <a>
                <h3 style={item.tour.name.length > 30 ? {fontSize: '16px'} : null}>
                  {item.tour.name}
                  <br/>
                  <p>
                    <i className="far fa-calendar-alt" style={{fontSize: '15px', position: 'relative', top: '-1px'}}></i> {formatDate(item.start_date)}
                  </p>
                  <p className="count-down">
                    <i className="far fa-clock" style={{fontSize: '15px', position: 'relative', top: '-1px', marginRight: '5px'}}></i>
                    <Countdown zeroPadTime={2} date={new Date(item.start_date)} key={item.id} renderer={renderTime} onComplete={this.handleComplete.bind(this)}/>
                  </p>
                </h3>
              </a>
            </Link>
          </div>
          <div className="description-item">
            <p>{item.tour.description.substring(0, this.maxDes) + '...'}</p>
            <Link route="detail-tour" params={{id: item.code, name: slugify(item.tour.name)}}>
              <a>{t('home.top_item.detail')}</a>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default TopPromotionItem
