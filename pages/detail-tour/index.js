import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, AutoHide } from 'components'
import { connect } from 'react-redux'
import ApiService from 'services/api.service'
import { Link } from 'routes'
import { RatingStar, BtnViewMore, MyMap, TourItem, Lightbox, Breadcrumb } from 'components'
import { getCode, convertFullUrl, slugify } from '../../services/utils.service'
import { FaRegCalendarAlt, FaEye, FaSuitcase } from "react-icons/fa"
import { formatDate, distanceFromDays, fromNow } from '../../services/time.service'
import validateEmail from '../../services/validates/email.js'
import { withNamespaces, Trans } from "react-i18next"
import { validateStringWithoutNumber } from '../../services/validates'
import { FacebookShareButton } from 'react-share'
import { FaFacebookF } from 'react-icons/fa'
import _ from 'lodash'
import { getLocalStorage } from '../../services/local-storage.service'
import { KEY } from '../../constants/local-storage'
import Redirect from 'routes/redirect'

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

class DetailTour extends React.Component {
  displayName = 'Detail Tour'

  static propTypes = {
    tourInfo: PropTypes.object,
    t: PropTypes.func,
    route: PropTypes.object,
    user: PropTypes.object,
    query: PropTypes.object
  }

  static async getInitialProps({ res, query }) {
      let apiService = ApiService()
      try{
          let tourTurn = await apiService.getToursTurnId(query.id)
          return { tourInfo: tourTurn.data, query };
      } catch(e) {
          Redirect(res, '404')
      }
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.tabs = [
      'description',
      'detail',
      'addition',
      'review'
    ]
    this.olds = {
      'adults': 'Adult',
      'children': 'Children'
    }
    this.per_page = 4
    this.id_domestic_tour = 1
    this.id_international_tour = 2
    this.categories = {
      "1": "domestic_tour",
      "2": "international_tour"
    }
    this.state = {
      tourTurn: this.props.tourInfo,
      tabId: 0,
      isLoading: false,
      nextPage: 1,
      email: '',
      author: '',
      comment: '',
      rating: 0,
      isSubmit: false,
      tourLike: [],
      relatedTour: [],
      images: [],
      error: '',
      action: false,
      actionError: false,
      reviews: [],
      average_rating: this.props.tourInfo.tour.average_rating,
      num_review: this.props.tourInfo.tour.num_review,
      skip_comment: 0,
      total_page: 0
    }
    this.breadcrumb = [
      {name: props.t(`detail_tour.${this.categories[props.tourInfo.tour.type_tour.id]}`),
      route: "tours", params: {id: props.tourInfo.tour.type_tour.id, name: slugify(props.tourInfo.tour.type_tour.name)}},
      {name: props.tourInfo.tour.name}
    ]
  }

  componentDidMount(){
    if(this.state.tourTurn){
      this.apiService.getImageByTour(this.state.tourTurn.tour.id).then(imgs => {
        this.setState({
          images: imgs.data
        })
      })
      this.onLoadMoreReviews()
      this.apiService.increaseView(this.state.tourTurn.id).then(() => {})
      this.loadOtherTour()
    }
  }

  loadOtherTour(){
    this.apiService.getToursTurn(1, 4).then((res) => {
      this.setState({
        tourLike: res.data
      })
    })
    this.apiService.getTourTurnByType(this.state.tourTurn.tour.type_tour.id).then((res) => {
      this.setState({
        relatedTour: res.data
      })
    })
  }

  handleChangeTab(index){
    this.setState({
      tabId: index
    })
  }

  onLoadMoreReviews(){
    this.apiService.getReviews(this.state.tourTurn.tour.id, this.state.nextPage, this.per_page,
      {offset: this.state.skip_comment + (this.state.nextPage - 1) * this.per_page}).then((res) => {
      this.setState({
        reviews: [...this.state.reviews, ...res.data],
        nextPage: this.state.nextPage + 1,
        total_page: res.itemCount % this.per_page === 0 ? parseInt(res.itemCount / this.per_page) : parseInt(res.itemCount / this.per_page) + 1
      })
    })
  }

  UNSAFE_componentWillReceiveProps(props){
    let temp = this.breadcrumb.find((item) => {
      return item.params && item.params.id === this.state.tourTurn.tour.type_tour.id
    })
    temp.name = props.t(`detail_tour.${this.categories[props.tourInfo.tour.type_tour.id]}`)
    temp.params = {id: props.tourInfo.tour.type_tour.id, name: slugify(props.tourInfo.tour.type_tour.name)}
  }

  componentDidUpdate(prevProps) {
    if(+prevProps.query.id !== +this.props.query.id){
      this.setState(
        {
          tourTurn: null,
          tabId: 0,
          isLoading: false,
          nextPage: 1,
          email: '',
          author: '',
          comment: '',
          rating: 0,
          isSubmit: false,
          tourLike: [],
          images: [],
          error: '',
          action: false,
          actionError: false,
          reviews: [],
          average_rating: 0,
          num_review: 0,
          skip_comment: 0,
          total_page: 0
        },
        () => {
          this.init()
        }
      )
    }
  }

  init() {
    this.apiService.getToursTurnId(this.props.query.id).then((res) => {
      this.setState({
        tourTurn: res.data,
        average_rating: res.data.tour.average_rating,
        num_review: res.data.tour.num_review
      }, () => {
        this.apiService.getImageByTour(this.state.tourTurn.tour.id).then(imgs => {
          this.setState({
            images: imgs.data
          })
        })
        this.onLoadMoreReviews()
        this.apiService.increaseView(this.state.tourTurn.id).then(() => {})
        this.loadOtherTour()
      })
      this.breadcrumb[this.breadcrumb.length - 1] = { name: this.state.tourTurn.tour.name }
    })
  }

  handleSubmit(e){
    e.preventDefault()
    this.setState({
      isSubmit: true
    })

    if(!this.validate()){
      return
    }

    this.apiService.writeReview({
      idTour: this.state.tourTurn.tour.id,
      name: !_.isEmpty(this.props.user) ? this.props.user.fullname : this.state.author,
      email: !_.isEmpty(this.props.user) ? this.props.user.email : this.state.email,
      comment: this.state.comment,
      rate: this.state.rating
    }).then((res) => {
      let review = res.data.review
      review.user = res.data.user
      this.setState({
        author: '',
        email: '',
        comment: '',
        rating: 0,
        action: true,
        isSubmit: false,
        average_rating: res.data.average_tour,
        reviews: [review, ...this.state.reviews],
        num_review: this.state.num_review + 1,
        skip_comment: this.state.skip_comment + 1
      })
    }).catch(() => {
      this.setState({
        error: "There is an error, please try again!",
        actionError: true,
        isSubmit: false
      })
    })
    this.setState({ action: false, actionError: false })
  }

  handleChangeRating(star){
    this.setState({
      rating: star
    })
  }

  handleChangeAuthor(e){
    this.setState({
      author: e.target.value
    })
  }

  handleChangeEmail(e){
    this.setState({
      email: e.target.value
    })
  }

  handleChangeComment(e){
    this.setState({
      comment: e.target.value
    })
  }

  validate(){
    if(_.isEmpty(this.props.user) && (!this.state.email || !validateEmail(this.state.email))){
      return false
    }

    if(_.isEmpty(this.props.user) && (!this.state.author || !validateStringWithoutNumber(this.state.author))){
      return false
    }

    if(!this.state.comment){
      return false
    }

    if(!this.state.rating){
      return false
    }

    return true
  }

  render() {
    const { tourTurn, num_review } = this.state
    const {t} = this.props
    const distance = tourTurn ? distanceFromDays(new Date(tourTurn.start_date), new Date(tourTurn.end_date)) + 1 : 0
    const day_left = tourTurn ? distanceFromDays(Date.now(), new Date(tourTurn.start_date)) : 0
    const slot = tourTurn ? tourTurn.num_max_people - tourTurn.num_current_people : 0
    const url = convertFullUrl(this.props.route.parsedUrl.pathname)
    return (
      <>
        <Layout page={tourTurn && tourTurn.tour.type_tour.id === this.id_domestic_tour ? 'domestic_tour' :
        tourTurn && tourTurn.tour.type_tour.id === this.id_international_tour ? 'international_tour' : ''} {...this.props}
          seo={tourTurn ? {
              title: tourTurn.tour.name,
              description: tourTurn.tour.description.substring(0, 100),
              image: tourTurn.tour.featured_img
          } : {}}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>{t('detail_tour.title')}</span>
                      <div className="nd_options_section">
                        <span className="underline"></span>
                      </div>
                    </h1>
                  </div>
                  <div className="nd_options_section nd_options_height_110"/>
                </div>
              </div>
            </div>
            {tourTurn &&
              <div className="nd_options_container nd_options_clearfix content">
                <div className="content-page">
                  <div className="row">
                    <div className="col-12">
                      <Breadcrumb data={this.breadcrumb} />
                    </div>
                  </div>
                  <div className="inner">
                    <div className="row img-tour">
                      <div className="col-sm-6 no-padding">
                        <div className="featured_img">
                          {!!tourTurn.discount &&
                            <span className="sale">{t('detail_tour.sale')}!</span>
                          }
                          <figure className="img-wrapper">
                            <div className="big-img">
                              <img alt="featured_img" src={tourTurn.tour.featured_img}/>
                            </div>
                            {!!this.state.images.length &&
                              <Lightbox imageUrls={this.state.images} small />
                            }
                          </figure>
                        </div>
                      </div>
                      <div className="col-sm-6 paddingResponsive">
                        <div className="summary">
                          <h1 className="product_title entry-title">{tourTurn.tour.name}</h1>
                          <div className="rating-zone">
                            <RatingStar rate={this.state.average_rating}/>
                          </div>
                          <div className="views-zone">
                            <span>
                              <i><FaEye /></i>
                              {tourTurn.view.toLocaleString()} {t('detail_tour.view')}
                            </span>
                          </div>
                          <p className="price">
                            {!!tourTurn.discount &&
                              <del>
                                <span className="amount">{tourTurn.price.toLocaleString()} VND</span>
                              </del>
                            }
                            <ins>
                              <span className="amount">
                                {tourTurn.discount ? (tourTurn.price - tourTurn.discount * tourTurn.price).toLocaleString() : tourTurn.price.toLocaleString()} VND
                              </span>
                            </ins>
                          </p>
                          <div className="row short-des">
                            <div className="col-12">
                              <div className="row" style={{marginBottom: '15px', marginTop: '30px'}}>
                                <div className="col-md-4 col-sm-4 col-6">{t('detail_tour.tour_code')}:</div>
                                <div className="col-md-8 col-sm-8 col-6">{getCode(tourTurn.id)}</div>
                              </div>
                              <div className="row">
                                <div className="col-lg-4 col-md-6 col-sm-4 col-6 mg-10">{t('detail_tour.start_date')}:</div>
                                <div className="col-lg-4 col-md-6 col-sm-3 col-6">{formatDate(tourTurn.start_date)}</div>
                                <div className="col-lg-4 col-md-12 col-sm-5 col-12">
                                  <Link route="search-result" params={{keyword: tourTurn.tour.name}}>
                                    <a style={{color: '#333'}}>
                                      <FaRegCalendarAlt style={{fontSize: '16px', color: 'rgb(67, 74, 84)', position: 'relative', top: '-2px'}}/>
                                      &nbsp;&nbsp;
                                      <span style={{color: '#fc6600'}}>{t('detail_tour.other_day')}</span>
                                    </a>
                                  </Link>
                                  </div>
                                </div>
                                <div className="row" style={{marginTop: '15px'}}>
                                  <div className="col-lg-4 col-md-6 col-sm-4 col-6 mg-bot15">
                                    <span>
                                      <Trans i18nKey="detail_tour.last_in" count={distance}>
                                        Last in: {{distance}} days
                                      </Trans>
                                    </span>
                                  </div>
                                  <div className="col-lg-4 col-md-6 col-sm-3 col-6">
                                    <Trans i18nKey="detail_tour.days_left" count={day_left}>
                                      {{day_left}} days left
                                    </Trans>
                                  </div>
                                  <div className="col-lg-4 col-md-12 col-sm-5 col-12  mg-bot15">
                                    <Trans i18nKey="detail_tour.vacancy" count={slot}>
                                      {{slot}} vacancies left
                                    </Trans>
                                   </div>
                                </div>
                              </div>
                            </div>
                            <Link route="checkout-passengers" params={{tour_id: tourTurn.id}}>
                              <a className="co-btn green w-auto mt-4">{t('detail_tour.book')}</a>
                            </Link>
                            <FacebookShareButton
                              url={url}
                              quote={tourTurn.tour.name}
                              style={{display: 'inline-block'}}>
                              <div id="fb-share-button">
                                <i><FaFacebookF /></i>
                                <span>Share</span>
                              </div>
                            </FacebookShareButton>
                            <div className="product_meta">
                              <span className="posted-in">
                                {t('detail_tour.category')}:&nbsp;
                                <Link route="tours" params={{id: tourTurn.tour.type_tour.id, name: slugify(tourTurn.tour.type_tour.name)}}>
                                  <a rel="tag">{t(`detail_tour.${this.categories[tourTurn.tour.type_tour.id]}`)}</a>
                                </Link>
                              </span>
                              <span className="tagged-as">
                                {t('detail_tour.tag')}:&nbsp;
                                {!!tourTurn.tour.tour_countries.length && tourTurn.tour.tour_countries.map((item, key) => {
                                    return(
                                      <Link route="tours-tags" params={{id: item.country.id, name: slugify(item.country.name), mark: "c"}} key={key}>
                                        <a rel="tag" key={key}>{item.country.name}</a>
                                      </Link>
                                    )
                                  })
                                }
                                {!!tourTurn.tour.tour_provinces.length && tourTurn.tour.tour_provinces.map((item, key) => {
                                    return(
                                      <Link route="tours-tags" params={{id: item.province.id, name: slugify(item.province.name), mark: "p"}} key={key}>
                                        <a rel="tag" key={key}>{item.province.name}</a>
                                      </Link>
                                    )
                                  })
                                }
                              </span>
                            </div>
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className="woocommerce-tabs wc-tabs-wrapper">
                    <ul className="tabs wc-tabs" role="tablist">
                      {this.tabs.map((item, key) => {
                          return(
                            <li className={this.state.tabId === key ? "tab_item active" : "tab_item"} role="tab" key={key}>
                              <a onClick={this.handleChangeTab.bind(this, key)}>{t('detail_tour.' + item)} {item === 'review' ? '('+ num_review +')' : ''}</a>
                            </li>
                          )
                        })
                      }
                    </ul>
                    {this.state.tabId === 0 &&
                      <div className="tab-panel">
                        <div className="row">
                          <div className="col-12">
                            <div className="wrapper">
                              <p>{tourTurn.tour.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    {this.state.tabId === 1 &&
                      <div className="tab-panel">
                        <div className="row">
                          <div className="col-12">
                            <div className="row">
                              <div className="col-sm-12">
                                <div className="wrapper-map">
                                  <div className="wrapper-title">
                                    <h3>{t('detail_tour.route')}</h3>
                                    <div className="nd_options_height_10"/>
                                    <div className="nd_options_section nd_options_line_height_0 underline-zone">
                                      <span className="underline"></span>
                                    </div>
                                    <MyMap
                                        isMarkerShown={true}
                                        isSearchBox={true}
                                        isSetTour
                                        idTourSet={tourTurn.tour.id}
                                        customStyles={{height: '500px'}}/>
                                  </div>
                                </div>
                              </div>
                              <div className="col-sm-8">
                                <div className="wrapper-detail">
                                  <div className="wrapper-title">
                                    <h3 className="timeline-title">{t('detail_tour.timeline')}</h3>
                                    <div className="nd_options_height_10"/>
                                    <div className="nd_options_section nd_options_line_height_0 underline-zone">
                                      <span className="underline"></span>
                                    </div>
                                  </div>
                                  <p className="timeline">{tourTurn.tour.detail}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    {this.state.tabId === 2 &&
                      <div className="tab-panel">
                        <div className="row">
                          <div className="col-12">
                            <div className="wrapper">
                              <div className="addtional-info">
                                <p>
                                  <i><FaSuitcase style={{position: 'relative', top: '-2px'}}/></i> {t('detail_tour.price_tour')}
                                </p>
                                {!!tourTurn.price_passengers.length &&
                                  <table className="table table-bordered">
                                    <thead>
                                      <tr>
                                        <td>{t('detail_tour.age_passenger')}</td>
                                        <td>{t('detail_tour.price')}</td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {tourTurn.price_passengers.map((item, key) => {
                                          return(
                                            <tr key={key}>
                                              <td>{t('detail_tour.' + this.olds[item.type])}</td>
                                              <td>{item.price.toLocaleString()} VND</td>
                                            </tr>
                                          )
                                        })
                                      }
                                    </tbody>
                                  </table>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                    {this.state.tabId === 3 &&
                      <div className="tab-panel">
                        <div className="reviews">
                          <div className="comments">
                            <h2>
                              <Trans i18nKey="detail_tour.review_for" count={num_review}>
                                {{num_review}} reviews for
                              </Trans>
                              <span className="bold"> {tourTurn.tour.name}</span>
                            </h2>
                            <ol className="commentlist">
                              {!!this.state.reviews.length && this.state.reviews.map((item) => {
                                  return(
                                    <li key={item.id}>
                                      <div className="comment-container">
                                        <img alt="avatar" src={item.user && item.user.avatar ? item.user.avatar : "/static/images/avatar.jpg"}/>
                                        <div className="comment-text">
                                          <div className="star-rating">
                                            <RatingStar rate={item.rate}/>
                                          </div>
                                          <p className="meta">
                                            <strong className="woocommerce-review__author">{item.name}</strong>
                                            <span className="woocommerce-review__dash"> – </span>
                                            <time className="woocommerce-review__published-date">{fromNow(item.createdAt, getLocalStorage(KEY.LANGUAGE))}</time>
                                          </p>
                                          <div className="description">
                                            <p>{item.comment}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  )
                                })
                              }
                            </ol>
                            <BtnViewMore
                              isLoading={this.state.isLoading}
                              show={this.state.nextPage <= this.state.total_page}
                              onClick={this.onLoadMoreReviews.bind(this)}
                            />
                          </div>
                          <div className="review-form">
                            <div className={this.state.nextPage > 0 ? "respond margin-top30" : "respond"}>
                              <span className="bold">{t('detail_tour.add_review')}</span>
                              <form className="comment-form" onSubmit={this.handleSubmit.bind(this)}>
                                <p className="comment-notes">{t('detail_tour.note')} *</p>
                                <div className="comment-form-rating">
                                  <label htmlFor="rating">{t('detail_tour.your_rating')} *</label>
                                  <div className="stars">
                                    <RatingStar hideNumber editor rtChange={this.handleChangeRating.bind(this)} rate={this.state.rating}/>
                                  </div>
                                  {this.state.isSubmit && !this.state.rating &&
                                    <p className="error">{t('detail_tour.please_rate')}</p>
                                  }
                                  <p className="comment-form-comment">
                                    <label htmlFor="comment">{t('detail_tour.your_review')} <span className="required">*</span></label>
                                    <textarea id="comment" name="comment" cols="45" rows="8" value={this.state.comment}
                                      onChange={this.handleChangeComment.bind(this)}/>
                                  </p>
                                  {this.state.isSubmit && !this.state.comment &&
                                    <p className="error">{t('detail_tour.review_required')}</p>
                                  }
                                  {_.isEmpty(this.props.user) &&
                                    <p className="comment-form-author">
                                      <label htmlFor="author">{t('detail_tour.name')} <span className="required">*</span></label>
                                      <input id="author" name="author" type="text" value={this.state.author}
                                        onChange={this.handleChangeAuthor.bind(this)} size="30"/>
                                    </p>
                                  }
                                  {this.state.isSubmit && !this.state.author && _.isEmpty(this.props.user) &&
                                    <p className="error">{t('detail_tour.fullname_required')}</p>
                                  }
                                  {this.state.isSubmit && this.state.author && !validateStringWithoutNumber(this.state.author) &&
                                    <p className="error">{t('detail_tour.fullname_format')}</p>
                                  }
                                  {_.isEmpty(this.props.user) &&
                                    <p className="comment-form-email">
                                      <label htmlFor="email">Email <span className="required">*</span></label>
                                      <input id="email" name="email" type="email" value={this.state.email}
                                        onChange={this.handleChangeEmail.bind(this)} size="30"/>
                                    </p>
                                  }
                                  {this.state.isSubmit && !this.state.email && _.isEmpty(this.props.user) &&
                                    <p className="error">{t('detail_tour.email_required')}</p>
                                  }
                                  {this.state.isSubmit && this.state.email && !validateEmail(this.state.email) &&
                                    <p className="error">{t('detail_tour.email_format')}</p>
                                  }
                                  <p className="form-submit">
                                    <button type="submit" className="co-btn green w-auto" onClick={this.handleSubmit.bind(this)}>{t('detail_tour.submit')}</button>
                                  </p>
                                  {this.state.action &&
                                    <AutoHide duration={5000} display="inline-block">
                                      <div className="alert alert-custom" role="alert">
                                        {t('detail_tour.success')}!
                                      </div>
                                    </AutoHide>
                                  }
                                  {this.state.actionError &&
                                    <AutoHide duration={5000} display="inline-block">
                                      <div className="alert alert-danger" role="alert">
                                        {t('detail_tour.' + this.state.error)}!
                                      </div>
                                    </AutoHide>
                                  }
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                  <section className="related-products">
                    <h2>{t('detail_tour.you_May_like')}</h2>
                    <div className="row">
                      {!!this.state.tourLike.length && this.state.tourLike.map((item) => {
                          return(
                            <div className="col-sm-3" key={item.id}>
                              <TourItem item={item} t={t}/>
                            </div>
                          )
                        })
                      }
                    </div>
                    <div className="nd_options_height_40" />
                    <h2>{t('detail_tour.related_tour')}</h2>
                    <div className="row">
                      {!!this.state.relatedTour.length && this.state.relatedTour.map((item) => {
                          return(
                            <div className="col-sm-3" key={item.id}>
                              <TourItem item={item} t={t}/>
                            </div>
                          )
                        })
                      }
                    </div>
                  </section>
                </div>
              </div>
            }
          </section>
        </Layout>
      </>
    )
  }
}

export default withNamespaces('translation')(connect(mapStateToProps)(DetailTour))
