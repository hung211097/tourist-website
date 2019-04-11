import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import {Link} from 'routes'

export default class extends React.Component {
  displayName = 'Bread crumb Item'

  static propTypes = {
    data: PropTypes.array,
  }

  static defaultProps = {
    community: false
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <section className="sitemap" itemScope="itemScope" itemType="http://schema.org/BreadcrumbList">
        <style jsx="jsx">{styles}</style>
        <ul>
          <li itemProp="itemListElement" itemScope="itemScope" itemType="http://schema.org/ListItem">
            <Link route="home">
              <a itemProp="item">
                <span itemProp="name">Travel Tour</span>
                <span>&gt;</span>
              </a>
            </Link>
          </li>
          {
            !!this.props.data && this.props.data.map((item, key) => (
              <li key={key} itemProp="itemListElement" itemScope="itemScope" itemType="http://schema.org/ListItem">
                {item.route ?
                  <Link route={item.route} params={item.params}>
                    <a itemProp="item" key={key} className={key == this.props.data.length - 1? 'current': ''} title={item.title ? item.title : ''}>
                      <span itemProp="name">{item.name}</span>
                      {key !== this.props.data.length - 1 && <span>&gt;</span>}
                    </a>
                  </Link>
                  :
                  <a itemProp="item" key={key} className={key == this.props.data.length - 1? 'current': ''} title={item.title ? item.title : ''}>
                    <span itemProp="name">{item.name}</span>
                    {key !== this.props.data.length - 1 && <span>&gt;</span>}
                  </a>
                }
              </li>
            ))
          }
        </ul>
      </section>
    )
  }
}
