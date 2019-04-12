import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, Breadcrumb, BtnViewMore } from 'components'
import ApiService from '../../services/api.service'
import { TourItem } from 'components'
import ContentLoader from "react-content-loader"
import { withNamespaces } from "react-i18next"
import Redirect from 'routes/redirect'

class Tours extends React.Component {
  displayName = 'Tours Page'

  static propTypes = {
    t: PropTypes.func,
    tourInfo: PropTypes.object,
    query: PropTypes.object,
  }

  static async getInitialProps({ res, query }) {
      let apiService = ApiService()
      try{
          let tourInfo = await apiService.getTourTurnByType(query.id, 1, 4)
          if(!tourInfo.data.length){
            Redirect(res, '404')
          }
          return { tourInfo, query };
      } catch(e) {
          Redirect(res, '404')
      }
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      tourTurn: props.tourInfo.data,
      isLoadContent: true,
      isLoading: false,
      nextPage: props.tourInfo.next_page
    }
    this.per_page = 4
    this.id_domestic_tour = 1
    this.id_international_tour = 2
    this.categories = {
      "1": "domestic_tour",
      "2": "international_tour"
    }
    this.breadcrumb = [
      {name: props.t(`detail_tour.${this.categories[props.query.id]}`)}
    ]
  }

  componentDidMount() {
    this.setState({
      isLoadContent: false
    })
  }

  onLoadMore(){
    this.setState({
      isLoading: true,
    })
    this.apiService.getTourTurnByType(this.props.query.id, this.state.nextPage, this.per_page).then((res) => {
      this.setState({
        tourTurn: [...this.state.tourTurn, ...res.data],
        isLoading: false,
        nextPage: res.next_page
      })
    })
  }

  UNSAFE_componentWillReceiveProps(props){
    this.breadcrumb[this.breadcrumb.length - 1].name = props.t(`detail_tour.${this.categories[props.query.id]}`)
  }

  componentDidUpdate(prevProps){
    if(this.props.query.id !== prevProps.query.id){
      this.setState({
        tourTurn:[],
        isLoading: false,
        nextPage: 1
      }, () => {
        this.onLoadMore()
      })
    }
  }

  render() {
    const {t} = this.props
    return (
      <>
        <Layout page={+this.props.query.id === this.id_domestic_tour ? 'domestic_tour' :
          +this.props.query.id === this.id_international_tour ? 'international_tour' : ''} {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>{t('tours.title')}</span>
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
              <div className="row list-tour top-popular">
                <div className="col-12">
                  <Breadcrumb data={this.breadcrumb} />
                </div>
                {!!this.state.tourTurn && this.state.tourTurn.map((item, key) => {
                    return(
                      <div className="col-sm-3 mt-4" key={key}>
                        <TourItem item={item} t={t}/>
                      </div>
                    )
                  })
                }
                {!this.state.tourTurn.length && this.state.isLoadContent && [1,2,3,4].map((item, key) => {
                    return(
                      <div className="col-sm-3" key={key}>
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

export default withNamespaces('translation')(Tours)
