import React from 'react'
import { Layout, Breadcrumb, BtnViewMore, NewsItem } from 'components'
import styles from './index.scss'
import ApiService from 'services/api.service'
import PropTypes from 'prop-types'
import { withNamespaces, Trans } from "react-i18next"
import { replaceInvalidCharacter } from '../../services/utils.service'
import { Router } from 'routes'
import Masonry from 'react-masonry-css'

class NewsSearch extends React.Component {
    displayName = 'News Search Page'

    static async getInitialProps({ query }) {
        return { query };
    }

    static propTypes = {
      blogs: PropTypes.any,
      query: PropTypes.object,
      total: PropTypes.string,
      route: PropTypes.object,
      nextPage: PropTypes.number,
      t: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.apiService = ApiService()
        this.state = {
            blogs: [],
            isLoading: false,
            next_page: null,
            totalItem: 0,
        }
        this.limit = 5
        this.breadcrumb = [
          {name: props.t('breadcrumb.news'), route: "news"},
          {name: `${props.t('breadcrumb.keyword_for')}"${this.props.query.keyword}"`}
        ]
    }

    init(props){
      this.setState({
        isLoading: true
      })
      this.apiService.getBlogs(1, this.limit, {keyword: replaceInvalidCharacter(props.query.keyword)}).then((res) => {
        this.setState({
          blogs: res.data,
          isLoading: false,
          next_page: res.nextPage,
          totalItem: res.total
        })
      })
    }

    componentDidMount(){
      this.init(this.props)
    }

    UNSAFE_componentWillReceiveProps(props) {
      this.init(props)
      let temp = this.breadcrumb.find((item) => {
        return item.route === 'news'
      })
      temp.name = props.t('breadcrumb.news')
      this.breadcrumb[this.breadcrumb.length - 1].name = `${props.t('breadcrumb.keyword_for')}"${props.query.keyword}"`
    }

    loadBlogs(){
      this.apiService.getBlogs(this.state.next_page, this.limit, {keyword: this.props.query.keyword}).then((res) => {
        this.setState({
          blogs: [...this.state.blogs, ...res.data],
          next_page: res.nextPage,
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
      const { t } = this.props
      const count = this.state.totalItem
      const keyword = this.props.query.keyword
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
                          <span>{t('news_search.title')}</span>
                          <div className="nd_options_section">
                            <span className="underline"></span>
                          </div>
                        </h1>
                      </div>
                      <form onSubmit={this.handleSubmit.bind(this)}>
                          <input type="text" value={this.state.keyword} name="keyword" onChange={this.handleChangeKeyword.bind(this)}
                             placeholder={t('news_search.search')} />
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
                        <div className="results-txt">
                          <h3>
                            {count <= 1 ?
                              <Trans i18nKey="news_search.num_result_is" count={count} keyword={keyword}>
                                There is {{count}} result for: &quot;{{keyword}}&quot;
                              </Trans>
                              :
                              <Trans i18nKey="news_search.num_result_are" count={count} keyword={keyword}>
                                There are {{count}} result for: &quot;{{keyword}}&quot;
                              </Trans>
                            }
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="row news-content no-margin">
                      {!!this.state.blogs.length &&
                        <Masonry
                           breakpointCols={{
                              default: 3,
                              1100: 3,
                              834: 2,
                              576: 1
                            }}
                           className="my-masonry-grid"
                           columnClassName="my-masonry-grid_column">
                           {this.state.blogs.map((item) => {
                               return (
                                <NewsItem key={item.id} item={item} t={t}/>
                               )
                             })
                           }
                        </Masonry>
                      }
                      <BtnViewMore
                        isLoading={this.state.isLoading}
                        show={!!this.state.next_page && !!this.state.blogs.length}
                        onClick={this.loadBlogs.bind(this)}
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

export default withNamespaces('translation')(NewsSearch)
