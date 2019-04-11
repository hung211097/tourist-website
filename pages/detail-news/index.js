import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, Breadcrumb, CommentsFacebook } from 'components'
import { withNamespaces } from "react-i18next"
import ApiService from 'services/api.service'
import { getLocalStorage } from '../../services/local-storage.service'
import { KEY } from '../../constants/local-storage'
import { formatDate } from '../../services/time.service'
import { isServer, blogTitleString, convertFullUrl } from '../../services/utils.service'
import Redirect from 'routes/redirect'
import Calendar from 'react-calendar/dist/entry.nostyle'
import { Router, Link } from 'routes'
import { FacebookProvider, CommentsCount } from 'react-facebook'
const AppID = process.env.FB_CLIENT_ID

class DetailNews extends React.Component {
  displayName = 'Detail News'

  static propTypes = {
      route: PropTypes.object,
      t: PropTypes.func,
      blog: PropTypes.object,
      query: PropTypes.object,
      tags: PropTypes.array
  }

  static async getInitialProps({ res, query }) {
      let apiService = ApiService()
      try{
          let blog = await apiService.getBlogsDetail(query.id)
          let tags = await apiService.getTagsBlog(query.id)
          return { blog, query, tags }
      } catch(e) {
          Redirect(res, '404')
      }
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      keyword: '',
      relatedBlogs: [],
      date: new Date()
    }
    this.breadcrumb = [
      {name: props.t('breadcrumb.news'), route: "news"},
      {name: blogTitleString(props.blog.title, 10), title: props.blog.title}
    ]
  }

  componentDidMount() {
    this.loadSameBlog(this.props.blog.id)
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

    Router.pushRoute("news-search", {keyword: this.state.keyword})
  }

  loadSameBlog(excludeId) {
      this.apiService.getBlogs(1, 4, { exclude: excludeId }).then((res) => {
          this.setState({
              relatedBlogs: res.data
          })
      })
  }

  UNSAFE_componentWillReceiveProps(props) {
      this.loadSameBlog(props.blog.id)
      this.breadcrumbs[this.breadcrumbs.length - 1] = { name: blogTitleString(props.blog.title, 8), title: props.blog.title }
  }

  render() {
    const { t, blog } = this.props
    const url = convertFullUrl(this.props.route.parsedUrl.pathname)
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
                      <span>{t('detail_news.title')}</span>
                      <div className="nd_options_section">
                        <span className="underline"></span>
                      </div>
                    </h1>
                    <div className="nd_options_section nd_options_height_90"/>
                    <div className="figure-news">
                      <div className="d-inline-block">
                         <div className="nd_options_section nd_options_height_10" />
                         <div className="figure-container">
                           <img alt="icon" className="avatar" src="/static/images/admin.png" width={23} height={23} />
                           <div className="text-figure">
                             <div className="nd_options_section nd_options_height_5" />
                             <h3>Travel Tour</h3>
                           </div>
                         </div>
                         <div className="nd_options_section nd_options_height_10" />
                       </div>
                      <div className="d-inline-block">
                         <div className="nd_options_section nd_options_height_10" />
                         <div className="figure-container">
                           <img alt="icon" src="/static/svg/icon-calendar-2-white.svg" width={23} height={23} />
                           <div className="text-figure">
                             <div className="nd_options_section nd_options_height_5" />
                             {!isServer() &&
                               <h3>{formatDate(blog.date, "dd MMMM yyyy", getLocalStorage(KEY.LANGUAGE))}</h3>
                             }
                           </div>
                         </div>
                         <div className="nd_options_section nd_options_height_10" />
                       </div>
                      <div className="d-inline-block">
                         <div className="nd_options_section nd_options_height_10" />
                         <div className="figure-container">
                           <img alt="icon" src="/static/svg/icon-chat-white.svg" width={23} height={23} />
                           <div className="text-figure">
                             <div className="nd_options_section nd_options_height_5" />
                             <h3 className="fb-comments-count-container">
                               <FacebookProvider appId={AppID}>
                                 <CommentsCount width={'100%'} href={url}/>
                                </FacebookProvider>
                                &nbsp;{t('detail_news.comment')}
                              </h3>
                           </div>
                         </div>
                         <div className="nd_options_section nd_options_height_10" />
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="nd_options_container nd_options_clearfix content">
              <div className="content">
                <div className="row no-margin">
                  <div className="col-12 no-padding">
                    <Breadcrumb data={this.breadcrumb} />
                  </div>
                </div>
                <div className="row news-detail">
                  <div className="col-sm-4 order-sm-2">
                    <div className="widget widget_search">
                      <h3>{t('detail_news.title_search')}</h3>
                      <form role="search" onSubmit={this.handleSubmit.bind(this)} className="searchform">
                       <div>
                         <input type="text" name="keyword" value={this.state.keyword} onChange={this.handleChangeKeyword.bind(this)}/>
                         <button type="submit" className="co-btn green d-inline-block w-auto">{t('detail_news.search')}</button>
                       </div>
                     </form>
                   </div>
                   <div className="d-sm-block d-none">
                     <div className="widget widget_calendar">
                       <Calendar
                         value={this.state.date}
                       />
                     </div>
                     <div className="widget widget_tag_cloud">
                       <h3>{t('detail_news.tags')}</h3>
                       <div className="tagcloud">
                         {!!this.props.tags.length && this.props.tags.map((item, key) => {
                            return(
                              <Link route="news-tags" params={{id: item.id, slug: item.slug}} key={key}>
                                <a key={key}>{item.name}</a>
                              </Link>
                            )
                          })
                         }
                       </div>
                      </div>
                      <div className="widget widget_other_news">
                        <h3>{t('detail_news.other_news')}</h3>
                        <div className="other-news">
                          {!!this.state.relatedBlogs.length && this.state.relatedBlogs.map((item, key) => {
                             return(
                               <article itemScope itemType="http://schema.org/NewsArticle" className="feature-item" key={key}>
                                 <Link route="detail-news" params={{id: item.id, slug: item.slug}}>
                                   <a itemProp="url" className="row">
                                     <div className="col-6">
                                       <img itemProp="image" alt={item.title} title={item.title} src={item.thumnail}/>
                                     </div>
                                     <div className="col-6">
                                       <h3 itemProp="headline">{item.title}</h3>
                                     </div>
                                   </a>
                                 </Link>
                              </article>
                             )
                           })
                          }
                        </div>
                       </div>
                      <div className="widget widget_promotion">
                        <div className="row best-package no-margin">
                          <div className="col-sm-12 no-padding">
                            <div className="custom">
                              <div className="wrapper-custom">
                                <h5>{t('faq.package')}</h5>
                                <div className="nd_options_section nd_options_height_10"/>
                                <h2>{t('faq.best')}</h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                   </div>
                  </div>
                  <div className="col-sm-8 order-sm-1">
                    <div dangerouslySetInnerHTML={{__html: blog.content}} className="blog-content" />
                    <div className="comment">
                      {url &&
                        <CommentsFacebook url={url} />
                      }
                    </div>
                    <div className="d-sm-none d-block">
                      <div className="widget widget_calendar_responsive">
                        <Calendar
                          value={this.state.date}
                        />
                      </div>
                      <div className="widget widget_tag_cloud">
                        <h3>{t('detail_news.tags')}</h3>
                        <div className="tagcloud">
                          {!!this.props.tags.length && this.props.tags.map((item, key) => {
                             return(
                               <a key={key}>{item.name}</a>
                             )
                           })
                          }
                        </div>
                       </div>
                       <div className="widget widget_other_news">
                         <h3>{t('detail_news.other_news')}</h3>
                         <div className="other-news">
                           {!!this.state.relatedBlogs.length && this.state.relatedBlogs.map((item, key) => {
                              return(
                                <article itemScope itemType="http://schema.org/NewsArticle" className="feature-item" key={key}>
                                  <Link route="detail-news" params={{id: item.id, slug: item.slug}}>
                                    <a itemProp="url" className="row">
                                      <div className="col-6">
                                        <img itemProp="image" alt={item.title} title={item.title} src={item.thumnail}/>
                                      </div>
                                      <div className="col-6">
                                        <h3 itemProp="headline">{item.title}</h3>
                                      </div>
                                    </a>
                                  </Link>
                               </article>
                              )
                            })
                           }
                         </div>
                        </div>
                       <div className="widget widget_promotion">
                         <div className="row best-package no-margin">
                           <div className="col-sm-12 no-padding">
                             <div className="custom">
                               <div className="wrapper-custom">
                                 <h5>{t('faq.package')}</h5>
                                 <div className="nd_options_section nd_options_height_10"/>
                                 <h2>{t('faq.best')}</h2>
                               </div>
                             </div>
                           </div>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Layout>
      </>
    )
  }
}

export default withNamespaces('translation')(DetailNews)
