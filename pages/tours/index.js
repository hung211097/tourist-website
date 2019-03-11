import React from 'react'
import styles from './index.scss'
import { Layout } from 'components'
import { Link } from 'routes'
import ApiService from '../../services/api.service'

class Tours extends React.Component {
  displayName = 'Tours Page'

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      tours: []
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <>
        <Layout page="tours" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>TOURS</span>
                      <div className="nd_options_section">
                        <span className="underline"></span>
                      </div>
                    </h1>
                  </div>
                  <div className="nd_options_section nd_options_height_110"/>
                </div>
              </div>
            </div>
            <div className="nd_options_container nd_options_clearfix content">
              <p>asdsakdjh</p>
            </div>
          </section>
        </Layout>
      </>
    )
  }
}

export default Tours
