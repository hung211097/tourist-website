import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Link } from 'routes'
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa"
import { formatDate } from '../../services/time.service'
import Countdown, { zeroPad } from 'react-countdown-now'

class TopPromotionItem extends React.Component {
  displayName = 'Top Promotion Item'

  static propTypes = {
    item: PropTypes.object.isRequired,
    index: PropTypes.number,
    onLoadTour: PropTypes.func
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
    const { item } = this.props
    const renderTime = ({ days, hours, minutes, seconds, completed }) => {
      if(completed){
        return <span></span>
      }
      else{
        return <span>{days} days left {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>
      }
    }
    return (
      <div className="promotion-item">
        <style jsx>{styles}</style>
        <div className="wrapper-item">
          <div className="content-item">
            <Link route="detail-tour" params={{id: item.id}}>
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
            <Link route="detail-tour" params={{id: item.id}}>
              <a>
                <h3 style={item.tour.name.length > 30 ? {fontSize: '16px'} : null}>
                  {item.tour.name}
                  <br/>
                  <p><FaRegCalendarAlt style={{fontSize: '15px', position: 'relative', top: '-1px'}} /> {formatDate(item.start_date)}</p>
                  <p className="float-right">
                    <FaRegClock style={{fontSize: '15px', position: 'relative', top: '-1px', marginRight: '5px'}} />
                    <Countdown zeroPadTime={2} date={new Date(item.start_date)} key={item.id} renderer={renderTime} onComplete={this.handleComplete.bind(this)}/>
                  </p>
                </h3>
              </a>
            </Link>
          </div>
          <div className="description-item">
            <p>{item.tour.description.substring(0, this.maxDes) + '...'}</p>
            <Link route="detail-tour" params={{id: item.id}}>
              <a>DETAILS</a>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default TopPromotionItem
