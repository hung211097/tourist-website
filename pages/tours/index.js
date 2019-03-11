import React from 'react'
import styles from './index.scss'
import { Layout } from 'components'
import ApiService from '../../services/api.service'
import { TourItem, BtnViewMore } from 'components'

class Tours extends React.Component {
  displayName = 'Tours Page'

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      tours: [],
      nextPage: 1,
      isLoading: false
    }
  }

  componentDidMount() {
    this.onLoadMore()
  }

  onLoadMore(){
    this.setState({
      isLoading: true
    })
    this.apiService.getTours(this.state.nextPage, 4).then((res) => {
      this.setState({
        tours: [...this.state.tours, ...res.data],
        nextPage: res.next_page,
        isLoading: false
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
