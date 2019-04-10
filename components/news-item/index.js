import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Link } from 'routes'

class NewsItem extends React.Component {
  displayName = 'News Item'

  static propTypes = {
    item: PropTypes.object.isRequired,
    t: PropTypes.func,
    style: PropTypes.object
  }

  static defaultProps = {
    style: {}
  }

  constructor(props) {
    super(props)

  }

  render() {
    const { item, t } = this.props
    return (
      <div className="news-item" style={this.props.style}>
        <style jsx>{styles}</style>
        <div className="wrapper">
          <div className="news-img">
            <Link route="detail-news" params={{id: item.id, slug: item.slug}}>
              <a><img alt="featured_img" src={item.photo} /></a>
            </Link>
          </div>
          <div className="item-content">
            <Link route="detail-news" params={{id: item.id, slug: item.slug}}>
              <a><h3 dangerouslySetInnerHTML={{__html: item.title}}></h3></a>
            </Link>
            <div className="nd_options_section nd_options_height_20"/>
            <p dangerouslySetInnerHTML={{__html: item.excerpt}}></p>
            <div className="nd_options_section nd_options_height_20"/>
            <Link route="detail-news" params={{id: item.id, slug: item.slug}}>
              <a className="btn-read">{t('news.read_more')}</a>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default NewsItem
