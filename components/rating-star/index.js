import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import {processMathRoundFix} from 'services/utils.service'

export default class extends React.Component {
  displayName = 'Rating Item'

  static defaultProps = {
    rate: 0,
    reviewCount: 0,
    smallTextReview: false
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
    smallTextReview: PropTypes.bool
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
            [0, 1, 2, 3, 4].map((item) => <span key={item} className="icon_star rating_star" onClick={this.handleSelect.bind(this, item + 1)}>
              <span className="icon_star rate_progress full_star" style={{
                  width: process[item] + '%'
                }}/>
            </span>)
          }
          {
            !this.props.hideNumber && (<span className={this.props.smallTextReview
                ? "rating-number small-text"
                : "rating-number"}>
              {processMathRoundFix(this.state.rate, 1)}
            </span>)
          }
      </div>
      </div>
    )
  }
}
