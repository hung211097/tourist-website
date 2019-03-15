import React from 'react'
import styles from './index.scss'
import { Layout } from 'components'
import ApiService from '../../services/api.service'
import { TourItem, BtnViewMore } from 'components'
import ContentLoader from "react-content-loader"

class Tours extends React.Component {
  displayName = 'Tours Page'

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      tours: [],
      nextPage: 1,
      isLoading: false,
      isLoadContent: true
    }
  }

  componentDidMount() {
    this.onLoadMore()
  }

  onLoadMore(){
    this.setState({
      isLoading: true
    })
    this.apiService.getToursTurn(this.state.nextPage, 4).then((res) => {
      this.setState({
        tours: [...this.state.tours, ...res.data],
        nextPage: res.next_page,
        isLoading: false,
        isLoadContent: false
      })
    })
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
              <div className="row list-tour">
                {!!this.state.tours && this.state.tours.map((item, key) => {
                    return(
                      <div className="col-sm-6 col-md-4 col-lg-3" key={key}>
                        <TourItem item={item}/>
                      </div>
                    )
                  })
                }
                {!this.state.tours.length && this.state.isLoadContent && [1,2,3,4].map((item, key) => {
                    return(
                      <div className="col-sm-6 col-md-4 col-lg-3" key={key}>
                        <ContentLoader
                          height={340}
                          width={270}
                          speed={2}
                          primaryColor="#f3f3f3"
                          secondaryColor="#ecebeb">
                          <rect x="2.14" y="1.67" rx="0" ry="0" width="266.98" height="194.22" />
                          <rect x="1.31" y="216.08" rx="0" ry="0" width="217.46" height="27.93" />
                          <rect x="2.41" y="255.67" rx="0" ry="0" width="123.09" height="24.96" />
                          <rect x="4.27" y="294.67" rx="0" ry="0" width="115.1" height="37.6" />
                          <rect x="136.23" y="293.67" rx="0" ry="0" width="112.86" height="40" />
                        </ContentLoader>
                      </div>
                    )
                  })
                }
              </div>
              <BtnViewMore
                isLoading={this.state.isLoading}
                show={this.state.nextPage > 0}
                onClick={this.onLoadMore.bind(this)}
              />
            </div>
          </section>
        </Layout>
      </>
    )
  }
}

export default Tours
