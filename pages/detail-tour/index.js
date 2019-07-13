import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout, AutoHide } from 'components'
import { connect } from 'react-redux'
import ApiService from 'services/api.service'
import { Link, Router } from 'routes'
import { RatingStar, BtnViewMore, MyMap, TourItem, Lightbox, Breadcrumb } from 'components'
import { convertFullUrl, slugify } from '../../services/utils.service'
import { formatDate, distanceFromDays, fromNow, subDay } from '../../services/time.service'
import validateEmail from '../../services/validates/email.js'
import { withNamespaces, Trans } from "react-i18next"
import { validateStringWithoutNumber } from '../../services/validates'
import { FacebookShareButton } from 'react-share'
import { metaData } from '../../constants/meta-data'
import { getLocalStorage } from '../../services/local-storage.service'
import { KEY } from '../../constants/local-storage'
import Redirect from 'routes/redirect'
import { useModal } from '../../actions'
import { modal } from '../../constants'

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    useModal: (data) => {dispatch(useModal(data))}
  }
}

class DetailTour extends React.Component {
  displayName = 'Detail Tour'

  static propTypes = {
    tourInfo: PropTypes.object,
    t: PropTypes.func,
    route: PropTypes.object,
    user: PropTypes.object,
    query: PropTypes.object,
    useModal: PropTypes.func
  }

  static async getInitialProps({ res, query }) {
      let apiService = ApiService()
      try{
          let tourTurn = await apiService.getToursTurnByCode(query.id)
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
      timeline: [],
      average_rating: this.props.tourInfo.tour.average_rating,
      num_review: this.props.tourInfo.tour.num_review,
      skip_comment: 0,
      total_page: 0,
      showPopup: false
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
      this.apiService.getRouteByTour(this.state.tourTurn.tour.id, {vs: 2}).then((res) => {
        this.setState({
          timeline: res.data
        })
      })
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
    if(prevProps.query.id !== this.props.query.id){
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
    this.apiService.getToursTurnByCode(this.props.query.id).then((res) => {
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
        this.apiService.getRouteByTour(this.state.tourTurn.tour.id, {vs: 2}).then((result) => {
          this.setState({
            timeline: result.data
          })
        })
        this.breadcrumb[this.breadcrumb.length - 1] = { name: this.state.tourTurn.tour.name }
      })
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
      name: this.props.user && !!Object.keys(this.props.user).length ? this.props.user.fullname : this.state.author,
      email: this.props.user && !!Object.keys(this.props.user).length ? this.props.user.email : this.state.email,
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
    if(!this.props.user && (!this.state.email || !validateEmail(this.state.email))){
      return false
    }

    if(!this.props.user && (!this.state.author || !validateStringWithoutNumber(this.state.author))){
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

  handleBook(){
    const { tourTurn } = this.state
    if(tourTurn.num_max_people - tourTurn.num_current_people === 0 || !tourTurn.isAllowBooking){
      this.props.useModal && this.props.useModal({type: modal.NO_BOOK, isOpen: true, data: ''})
      return
    }
    Router.pushRoute("checkout-passengers", {tour_id: tourTurn.code})
  }

  handleClosePopup(){
    this.setState({
      showPopup: false
    })
  }

  render() {
    const { tourTurn, num_review } = this.state
    const {t} = this.props
    const distance = tourTurn ? distanceFromDays(new Date(tourTurn.start_date), new Date(tourTurn.end_date)) + 1 : 0
    const slot = tourTurn ? tourTurn.num_max_people - tourTurn.num_current_people : 0
    const url = convertFullUrl(this.props.route.parsedUrl.pathname)
    return (
      <>
        <Layout page={tourTurn && tourTurn.tour.type_tour.id === this.id_domestic_tour ? 'domestic_tour' :
        tourTurn && tourTurn.tour.type_tour.id === this.id_international_tour ? 'international_tour' : ''} {...this.props}
          seo={tourTurn ? {
              title: metaData.TOUR_DETAIL.title.replace('[PRODUCTNAME]', tourTurn.tour.name),
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
                            <span className="sale">{t('detail_tour.sale')} {tourTurn.discount * 100}%</span>
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
                              <i className="fas fa-eye"></i>
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
                              <div className="row" style={{marginBottom: '15px', marginTop: '15px'}}>
                                <div className="col-md-4 col-sm-4 col-6">{t('detail_tour.tour_code')}:</div>
                                <div className="col-md-8 col-sm-8 col-6">{tourTurn.code}</div>
                              </div>
                              <div className="row">
                                <div className="col-lg-4 col-md-6 col-sm-4 col-6 mg-10">{t('detail_tour.start_date')}:</div>
                                <div className="col-lg-4 col-md-6 col-sm-3 col-6">{formatDate(tourTurn.start_date)}</div>
                                <div className="col-lg-4 col-md-12 col-sm-5 col-12">
                                  <Link route="search-result" params={{keyword: tourTurn.tour.name}}>
                                    <a style={{color: '#333'}}>
                                      <i className="far fa-calendar-alt" style={{fontSize: '16px', color: 'rgb(67, 74, 84)'}}></i>
                                      &nbsp;&nbsp;
                                      <span style={{color: '#fc6600'}}>{t('detail_tour.other_day')}</span>
                                    </a>
                                  </Link>
                                  </div>
                                </div>
                                <div className="row" style={{marginTop: '15px'}}>
                                  <div className="col-lg-4 col-md-6 col-sm-6 col-6 mg-bot15">
                                    <span>
                                      <Trans i18nKey="detail_tour.last_in" count={distance}>
                                        Last in: {{distance}} days
                                      </Trans>
                                    </span>
                                  </div>
                                  <div className="col-lg-4 col-md-6 col-sm-6 col-6  mg-bot15">
                                    <Trans i18nKey="detail_tour.vacancy" count={slot}>
                                      {{slot}} vacancies left
                                    </Trans>
                                  </div>
                                  <div className="col-sm-12">
                                    <span>{t('detail_tour.booking_term')}: {formatDate(subDay(new Date(tourTurn.start_date), tourTurn.booking_term))}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <a className={slot && tourTurn.isAllowBooking ? "co-btn green w-auto mt-4" : "co-btn silver w-auto mt-4"}
                              onClick={this.handleBook.bind(this)}>{t('detail_tour.book')}
                            </a>
                            <FacebookShareButton
                              url={url}
                              quote={tourTurn.tour.name}
                              style={{display: 'inline-block'}}>
                              <div id="fb-share-button">
                                <i className="fab fa-facebook-f"></i>
                                <span>{t('share')}</span>
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
                            <div className="wrapper wrapper-desc">
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
                              <div className="col-sm-12">
                                <div className="wrapper-detail">
                                  <div className="wrapper-title">
                                    <h3 className="timeline-title">{t('detail_tour.timeline')}</h3>
                                    <div className="nd_options_height_10"/>
                                    <div className="nd_options_section nd_options_line_height_0 underline-zone">
                                      <span className="underline"></span>
                                    </div>
                                  </div>
                                  <div className="timeline-detail">
                                    <ul className="list-timeline">
                                      {!!this.state.timeline.length && this.state.timeline.map((item, key) => {
                                        return(
                                            <li key={key} className="item-timeline">
                                              <div className="timeline-wrapper">
                                                <span>{t('detail_tour.day')} {item.day} {item.list_province.length ? ' - ' : ''}</span>
                                                <span>
                                                  {!!item.list_province.length && item.list_province.map((province, pkey) => {
                                                      return(
                                                        <span key={pkey}>{province}{pkey !== item.list_province.length - 1 ? " - " : ""}</span>
                                                      )
                                                    })
                                                  }
                                                </span>
                                              </div>
                                              <ul className="sub-timeline">
                                                {!!item.list_routes.length && item.list_routes.map((item_2, key_2) => {
                                                    return(
                                                      <li key={key_2}>
                                                        {item_2.arrive_time && item_2.leave_time &&
                                                          <h4 className="time">{item_2.arrive_time.replace(':00', '')} - {item_2.leave_time.replace(':00', '')}</h4>
                                                        }
                                                        {item_2.arrive_time && !item_2.leave_time &&
                                                          <h4 className="time">{t('detail_tour.arrive_at')} {item_2.arrive_time.replace(':00', '')}</h4>
                                                        }
                                                        {!item_2.arrive_time && item_2.leave_time &&
                                                          <h4 className="time">{t('detail_tour.leave_at')} {item_2.leave_time.replace(':00', '')}</h4>
                                                        }
                                                        <h4 className="name-location">&nbsp;- {item_2.location.name} ({item_2.location.type.name})</h4>
                                                        <p>{item_2.detail}</p>
                                                      </li>
                                                      )
                                                    })
                                                  }
                                              </ul>
                                            </li>
                                          )
                                        })
                                      }
                                    </ul>
                                  </div>
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
                                <p className="bold">
                                  <i className="fas fa-suitcase" style={{position: 'relative', top: '-1px'}}></i> {t('detail_tour.price_tour')}
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
                                <div className="nd_options_height_20"/>
                                <p className="bold"><img alt="icon" src="/static/svg/policy.svg" /> {t('detail_tour.policy')}</p>
                                <p className="mt-3 policy">{tourTurn.tour.policy}</p>
                                <p className="bold">Giá vé dành cho trẻ em:</p>
                                <ul>
                                  <li>
                                    Trẻ em dưới 5 tuổi: không thu phí dịch vụ, bố mẹ tự lo cho bé và thanh toán các chi phí phát sinh
                                    (đối với các dịch vụ tính phí theo chiều cao…). Hai người lớn chỉ được kèm 1 trẻ em dưới 5 tuổi, trẻ em thứ 2 sẽ
                                    đóng phí theo quy định dành cho độ tuổi từ 5 đến dưới 12 tuổi và phụ thu phòng đơn.
                                    Vé máy bay, tàu hỏa, phương tiện vận chuyển công cộng mua vé theo quy định của các đơn vị vận chuyển.
                                  </li>
                                  <li>
                                    Trẻ em từ 5 tuổi đến dưới 12 tuổi: 75% giá tour người lớn (không có chế độ giường riêng).
                                    Hai người lớn chỉ được kèm 1 trẻ em từ 5 - dưới 12 tuổi, em thứ hai trở lên phải mua 1 suất giường đơn.
                                  </li>
                                  <li>Từ 11 tuổi trở lên: 100% giá tour và tiêu chuẩn như người lớn.</li>
                                </ul>
                                <p className="bold">Điều kiện thanh toán:</p>
                                <p className="no-margin">Thanh toán hết trước ngày khởi hành {tourTurn.payment_term ? tourTurn.payment_term : 3} ngày</p>
                                <p className="bold">Các điều kiện khi đăng ký tour:</p>
                                <ul>
                                  <li>
                                    Khi đăng ký vui lòng cung cấp giấy tờ tùy thân tất cả người đi: Chứng minh nhân dân/Hộ chiếu
                                    (Passport)/Giấy khai sinh (trẻ em dưới 14 tuổi). Trong trường hợp đăng ký trực tuyến qua
                                    <a href="www.travel-tour.com"> www.travel-tour.com</a> vui lòng nhập tên chính xác theo thứ tự: Họ/tên lót/tên xuất vé máy bay.
                                    Quý khách khi đăng ký cung cấp tên theo giấy tờ tùy thân nào, khi đi tour mang theo giấy tờ
                                    tùy thân đó.
                                  </li>
                                  <li>
                                    Quy định giấy tờ tùy thân khi đi tour :<br/>
                                    Khách quốc tịch Việt Nam: Trẻ em dưới 14 tuổi Giấy khai sinh bản chính/Hộ chiếu bản chính còn giá trị sử dụng.
                                    Trẻ em từ 14 tuổi trở lên và Người lớn CMND/ Hộ chiếu bản chính còn giá trị sử dụng. Lưu ý trẻ em trên 14 tuổi bắt buộc
                                    phải có CMND/Hộ chiếu làm thủ tục lên máy bay hoặc Giấy xác nhận nhân thân theo mẫu quy định và chỉ có giá trị trong vòng
                                    30 ngày kể từ ngày xác nhận.
                                    Khách quốc tịch nước ngoài hoặc là Việt kiều: Khi đi tour vui lòng mang theo hộ chiếu bản chính (Passport) hoặc thẻ
                                    xanh kèm thị thực nhập cảnh (visa dán vào hộ chiếu hoặc tờ rời hoặc cuốn miễn thị thực, các loại giấy tờ này phải có dấu
                                    nhập cảnh Việt Nam và còn giá trị sử dụng theo quy định khi đi tour).
                                  </li>
                                  <li>
                                    Thông tin tập trung: Tại sân bay Tân Sơn Nhất, Ga đi trong nước, trước giờ bay 2 tiếng
                                    (áp dụng ngày thường), trước 2 tiếng 30 phút (áp dụng lễ tết). Trong trường hợp bay hãng
                                    hàng không Vietjet cột 5, trong trường hợp bay hãng hàng không Vietnam, Jetstar cột 12
                                    Quầy TravelTour
                                  </li>
                                  <li>
                                    Thông tin hành lý khi đi tour, xách tay dưới 7kg/1khách - kích thước không quá:
                                    56cm x 36cm x 23 cm, chất lỏng với thể tích không quá 100ml. Ký gửi 20kg/1khách -
                                    kích thước không quá: 119cm x 119cm x 81cm. Các vật phẩm không được chấp nhận dưới dạng
                                    hành lý ký gởi hoặc vận chuyển trong hành lý theo quy định hàng không
                                  </li>
                                  <li>
                                    Do các chuyến bay phụ thuộc vào các hãng Hàng Không (Vietnam, Vietjet, Jetstar,..)
                                    nên trong một số trường hợp giá vé, chuyến bay, giờ bay có thể thay đổi mà không được báo trước.
                                    Tùy vào tình hình thực tế, chương trình và điểm tham quan có thể linh động thay đổi thứ tự các
                                    điểm phù hợp điều kiện giờ bay và thời tiết thực tế. TravelTour sẽ không chịu trách nhiệm bảo đảm
                                    các điểm tham quan trong trường hợp:
                                    <ul>
                                      <li>Xảy ra thiên tai: bão lụt, hạn hán, động đất...</li>
                                      <li>Sự cố về an ninh: khủng bố, biểu tình</li>
                                      <li>Sự cố về hàng không: trục trặc kỹ thuật, an ninh, dời, hủy, hoãn chuyến bay.</li>
                                    </ul>
                                  </li>
                                </ul>
                                <p className="no-margin">
                                  Nếu những trường hợp trên xảy ra, TravelTour sẽ xem xét để hoàn trả chi phí không tham quan cho khách
                                  trong điều kiện có thể (sau khi đã trừ lại các dịch vụ đã thực hiện... .và không chịu trách nhiệm bồi
                                  thường thêm bất kỳ chi phí nào khác).
                                </p>
                                <ul>
                                  <li>
                                    Sau khi Quý khách đã làm thủ tục Hàng Không và nhận thẻ lên máy bay,
                                    đề nghị Quý khách giữ cẩn thận và lưu ý lên máy bay đúng giờ. TravelTour không chịu
                                    trách nhiệm trong trường hợp khách làm mất thẻ lên máy bay và không lên máy bay đúng
                                    theo giờ quy định của Hàng Không.
                                  </li>
                                  <li>
                                    Đối với các chương trình tham quan biển đảo, trong trường hợp Quý khách không khỏe,
                                    có tiền sử bệnh hoặc có chất kích thích trong người (rượu, bia…) thì không nên tắm & lặn biển để đảm bảo sự an toàn.
                                  </li>
                                  <li>
                                    Cam kết đã được tư vấn hiểu rõ và đồng ý các quy định liên quan về điều kiện sức khỏe khi
                                    tham gia chương trình du lịch. Khách nữ từ 55 tuổi trở lên và khách nam từ 60 trở lên: nên
                                    có người thân dưới 55 tuổi (đầy đủ sức khỏe) đi cùng. Riêng khách từ 70 tuổi trở lên:
                                    Bắt buộc phải có người thân dưới 55 tuổi (đầy đủ sức khỏe) đi cùng. Hạn chế nhận khách từ 80
                                    tuổi trở lên. Khách từ 80 tuổi không có chế độ bảo hiểm. Quý khách mang thai vui lòng báo
                                    cho nhân viên bán tour ngay tại thời điểm đăng ký. Phải có ý kiến của bác sĩ trước khi đi tour,
                                    tự chịu trách nhiệm về sức khỏe của mình và thai nhi trong suốt thời gian tham gia chương trình du lịch.
                                    Khi đi tour phải mang theo sổ khám thai và giấy tờ tùy thân theo quy định hãng hàng không.
                                    Tuần thai từ 28 tuần trở đi phải mang theo giấy khám thai trong vòng 7 ngày trở lại. Cam kết bản thân và
                                    người thân hoàn toàn có đủ sức khỏe để đi du lịch theo chương trình. Đồng ý miễn trừ toàn bộ trách nhiệm
                                    pháp lý, không khiếu nại, không yêu cầu bồi thường đối với TravelTour nói chung và nhân viên TravelTour nói
                                    riêng về tất cả các vấn đề xảy ra liên quan đến tình trạng sức khỏe của khách hàng khi tham gia tour hoặc
                                    sử dụng các dịch vụ do TravelTour cung cấp. Quý khách cam kết tự chịu mọi chi phí phát sinh ngoài chương
                                    trình tour liên quan đến việc giải quyết các rủi ro về sức khỏe (lưu trú, vận chuyển, chi phí khám chữa bệnh...)
                                  </li>
                                  <li>
                                    Quý khách có nhu cầu cần xuất hóa đơn vui lòng cung cấp thông tin xuất hóa đơn cho nhân
                                    viên bán tour khi ngay khi đăng ký hoặc trước khi thanh toán hết, không nhận xuất hóa đơn
                                    sau khi tour đã kết thúc.
                                  </li>
                                  <li>
                                    Quý khách vui lòng đọc kỹ chương trình, giá tour, các khoản bao gồm cũng như không bao gồm trong chương trình,
                                    các điều kiện hủy tour trên biên nhận đóng tiền. Tùy thời điểm đăng ký, kênh bán, giá tour có thể thay đổi.
                                    Trong trường hợp Quý khách không trực tiếp đến đăng ký tour mà do người khác đến đăng ký thì Quý khách vui
                                    lòng tìm hiểu kỹ chương trình từ người đăng ký cho mình.
                                  </li>
                                </ul>
                                <p className="bold">Lưu ý khi hủy tour:</p>
                                <p className="no-margin">
                                  Sau khi thanh toán tiền, nếu Quý khách muốn hủy tour xin vui lòng mang Vé Du Lịch đến văn
                                  phòng đăng ký tour để làm thủ tục hủy tour và chịu chi phí theo quy định của TravelTour.
                                  Không giải quyết các trường hợp liên hệ hủy tour qua điện thoại.
                                </p>
                                <p className="bold">Các điều kiện hủy tour: (đối với ngày thường)</p>
                                <ul>
                                  <li>
                                    Nếu hủy chuyến du lịch trong vòng từ 15-19 ngày trước ngày khởi hành: Chi phí hủy tour: 15% trên giá tour du lịch.
                                  </li>
                                  <li>
                                    Nếu hủy chuyến du lịch trong vòng từ 12-14 ngày trước ngày khởi hành: Chi phí hủy tour: 30% trên giá tour du lịch.
                                  </li>
                                  <li>
                                    Nếu hủy chuyến du lịch trong vòng từ 08-11 ngày trước ngày khởi hành: Chi phí hủy tour: 50% trên giá tour du lịch.
                                  </li>
                                  <li>
                                    Nếu hủy chuyến du lịch trong vòng từ 05-07 ngày trước ngày khởi hành: Chi phí hủy tour: 70% trên giá tour du lịch.
                                  </li>
                                  <li>
                                    Nếu hủy chuyến du lịch trong vòng từ 02-04 ngày trước ngày khởi hành: Chi phí hủy tour: 90% trên giá vé du lịch.
                                  </li>
                                  <li>
                                    Nếu hủy chuyến du lịch trong vòng 1 ngày trước ngày khởi hành : Chi phí hủy tour: 100% trên giá vé du lịch.
                                  </li>
                                </ul>
                                <p className="bold">Các điều kiện hủy tour: (đối với ngày lễ, tết)</p>
                                <ul>
                                  <li>
                                    Nếu hủy chuyến du lịch trong vòng từ 25-29 ngày trước ngày khởi hành: Chi phí hủy tour: 15% trên giá tour du lịch.
                                  </li>
                                  <li>
                                    Nếu hủy chuyến du lịch trong vòng từ 20-24 ngày trước ngày khởi hành: Chi phí hủy tour: 30% trên giá tour du lịch.
                                  </li>
                                  <li>
                                    Nếu hủy chuyến du lịch trong vòng từ 17-19 ngày trước ngày khởi hành: Chi phí hủy tour: 50% trên giá tour du lịch.
                                  </li>
                                  <li>
                                    Nếu hủy chuyến du lịch trong vòng từ 08-16 ngày trước ngày khởi hành: Chi phí hủy tour: 70% trên giá tour du lịch.
                                  </li>
                                  <li>
                                    Nếu hủy chuyến du lịch trong vòng từ 02-07 ngày trước ngày khởi hành: Chi phí hủy tour: 90% trên giá vé du lịch.
                                  </li>
                                  <li>
                                    Nếu hủy chuyến du lịch trong vòng 1 ngày trước ngày khởi hành : Chi phí hủy tour: 100% trên giá vé du lịch.
                                  </li>
                                </ul>
                                <p className="bold">Các tour Lễ, Tết là tour có thời gian diễn ra rơi vào một trong các ngày Lễ, Tết theo quy định</p>
                                <p className="bold">Thời gian hủy được tính cho ngày làm việc, không tính thứ 7, Chủ Nhật và các ngày Lễ, Tết.</p>
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
                                  {!this.props.user &&
                                    <p className="comment-form-author">
                                      <label htmlFor="author">{t('detail_tour.name')} <span className="required">*</span></label>
                                      <input id="author" name="author" type="text" value={this.state.author}
                                        onChange={this.handleChangeAuthor.bind(this)} size="30"/>
                                    </p>
                                  }
                                  {this.state.isSubmit && !this.state.author && !this.props.user &&
                                    <p className="error">{t('detail_tour.fullname_required')}</p>
                                  }
                                  {this.state.isSubmit && this.state.author && !validateStringWithoutNumber(this.state.author) &&
                                    <p className="error">{t('detail_tour.fullname_format')}</p>
                                  }
                                  {!this.props.user &&
                                    <p className="comment-form-email">
                                      <label htmlFor="email">Email <span className="required">*</span></label>
                                      <input id="email" name="email" type="email" value={this.state.email}
                                        onChange={this.handleChangeEmail.bind(this)} size="30"/>
                                    </p>
                                  }
                                  {this.state.isSubmit && !this.state.email && !this.props.user &&
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
                            <div className="col-lg-3 col-sm-6" key={item.id}>
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
                            <div className="col-lg-3 col-sm-6" key={item.id}>
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

export default withNamespaces('translation')(connect(mapStateToProps, mapDispatchToProps)(DetailTour))
