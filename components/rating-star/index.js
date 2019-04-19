import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import {processMathRoundFix} from 'services/utils.service'
import { withNamespaces } from "react-i18next"

class RatingStar extends React.Component {
  displayName = 'Rating Item'

  static defaultProps = {
    rate: 0,
    reviewCount: 0,
    smallTextReview: false,
    isWhite: false
  }

  static propTypes = {
    reviewCount: PropTypes.number,
    rate: PropTypes.number,
    hideNumber: PropTypes.bool,
    editor: PropTypes.bool,
    large: PropTypes.bool,
    medium: PropTypes.bool,
    rtChange: PropTypes.func,
    title: PropTypes.string,
    onWriteReview: PropTypes.func,
    smallTextReview: PropTypes.bool,
    isWhite: PropTypes.bool,
    t: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      rate: props.rate
    }
  }

  static getDerivedStateFromProps(props) {
    return {rate: props.rate}
  }

  handleSelect(start) {
    if (!this.props.editor) {
      return;
    }
    this.setState({rate: start})
    this.props.rtChange && this.props.rtChange(start)
    this.props.onWriteReview && this.props.onWriteReview()
  }

  render() {
    const {t} = this.props
    let process = [100, 100, 100, 100, 100]
    const value = Math.floor(this.state.rate)
    process[value] = Math.round((this.state.rate - value) * 10000) / 100
    for (var i = value + 1; i < process.length; i++) {
      process[i] = 0
    }
    return (
      <div>
        <style jsx="jsx">{styles}</style>
        {this.props.title && <p className="title">{this.props.title}</p>}
        <div itemProp="aggregateRating" itemScope="itemScope" itemType="http://schema.org/AggregateRating" className={this.props.large
          ? 'rating large'
          : this.props.medium
            ? 'rating medium'
            : 'rating'}>
          {
            [0, 1, 2, 3, 4].map((item) =>
            <span key={item} className="icon_star rating_star" onClick={this.handleSelect.bind(this, item + 1)}>
              <span className={this.props.isWhite ? "icon_star rate_progress white full_star" : "icon_star rate_progress full_star"} style={{
                  width: process[item] + '%'
                }}/>
            </span>)
          }
          {
            !this.props.hideNumber && this.props.rate > 0 &&
            (<span className={this.props.isWhite && !this.props.smallTextReview ?
              "rating-number white" :
              !this.props.isWhite && this.props.smallTextReview ?
              "rating-number small-text" :
              this.props.isWhite && this.props.smallTextReview ?
              "rating-number small-text white"
              : 'rating-number'}>
              {processMathRoundFix(this.state.rate, 1)}
            </span>)
          }
          {this.props.rate === 0 && !this.props.editor &&
            <span className="not_rated">&nbsp;&nbsp;{t('not_rated')}</span>
          }
        </div>
      </div>
    )
  }
}

export default withNamespaces('translation')(RatingStar)
