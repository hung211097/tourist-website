import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, NewsItem, BtnViewMore, Breadcrumb } from 'components'
import { withNamespaces } from "react-i18next"
import ApiService from 'services/api.service'
import ContentLoader from "react-content-loader"
import Masonry from 'react-masonry-css'
import { Router } from 'routes'

class News extends React.Component {
  displayName = 'News'

  static propTypes = {
      t: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      isLoading: false,
      nextPage: 1,
      news: [],
      isFirstLoad: false,
      keyword: ''
    }
    this.breadcrumb = [
      {name: props.t('breadcrumb.news'), route: "news"}
    ]
  }

  componentDidMount() {
    this.setState({
      isFirstLoad: true
    })
    this.apiService.getBlogs(this.state.nextPage, 3).then((res) => {
      this.setState({
        news: [...this.state.news, ...res.data],
        nextPage: res.nextPage,
        isFirstLoad: false
      })
    })
  }

  UNSAFE_componentWillReceiveProps(props) {
    let temp = this.breadcrumb.find((item) => {
      return item.route === 'news'
    })
    temp.name = props.t('breadcrumb.news')
  }

  onLoadMore(){
    this.setState({
      isLoading: true
    })
    this.apiService.getBlogs(this.state.nextPage, 3).then((res) => {
      this.setState({
        news: [...this.state.news, ...res.data],
        nextPage: res.nextPage,
        isLoading: false
      })
    })
  }

  handleChangeKeyword(e){
    this.setState({
      keyword: e.target.value
    })
  }

  handleSubmit(e){
    e.preventDefault()

    if(!this.state.keyword){
      return
    }

    this.setState({
      keyword: ''
    })
    Router.pushRoute("news-search", {keyword: this.state.keyword})
  }

  render() {
    const {t} = this.props
    return (
      <>
        <Layout page="news" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>{t('news.title')}</span>
                      <div className="nd_options_section">
                        <span className="underline"></span>
                      </div>
                    </h1>
                  </div>
                  <form onSubmit={this.handleSubmit.bind(this)}>
                      <input type="text" value={this.state.keyword} name="keyword" onChange={this.handleChangeKeyword.bind(this)}
                         placeholder={t('news.search')} />
                  </form>
                  <div className="nd_options_section nd_options_height_110"/>
                </div>
              </div>
            </div>
            <div className="nd_options_container nd_options_clearfix content">
              <div className="news-container">
                <div className="row no-margin">
                  <div className="col-12">
                    <Breadcrumb data={this.breadcrumb} />
                  </div>
                </div>
                <div className="row news-content no-margin">
                  {this.state.isFirstLoad && [1,2,3].map((item, key) => {
                      return(
                        <div className="col-sm-4" key={key}>
                          <ContentLoader
                            height={605}
                            width={400}
                            speed={2}
                            primaryColor="#f3f3f3"
                            secondaryColor="#ecebeb"
                            >
                            <rect x="0" y="0" rx="0" ry="0" width="400" height="605" />
                          </ContentLoader>
                        </div>
                      )
                    })
                  }
                  {!!this.state.news.length &&
                    <Masonry
                     breakpointCols={{
                      default: 3,
                      1100: 3,
                      834: 2,
                      576: 1
                    }}
                     className="my-masonry-grid"
                     columnClassName="my-masonry-grid_column">
                       {this.state.news.map((item, key) => {
                           return(
                             <NewsItem t={t} key={key} item={item}/>
                           )
                         })
                       }
                    </Masonry>
                  }
                  <BtnViewMore
                    isLoading={this.state.isLoading}
                    show={!!this.state.nextPage && !!this.state.news.length}
                    onClick={this.onLoadMore.bind(this)}
                  />
                </div>
              </div>
            </div>
          </section>
        </Layout>
      </>
    )
  }
}

export default withNamespaces('translation')(News)
