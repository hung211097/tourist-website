import React from 'react'
import styles from './index.scss'
import { Layout } from 'components'
import ApiService from 'services/api.service'
import { Router, Link } from 'routes'
import { RatingStar, BtnViewMore, MyMap, TourItem, Lightbox } from 'components'
import { getCodeTour } from '../../services/utils.service'
import { FaRegCalendarAlt } from "react-icons/fa"
import { formatDate, distanceFromDays } from '../../services/time.service'
import validateEmail from '../../services/validates/email.js'

class DetailTour extends React.Component {
  displayName = 'Detail Tour'

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.tabs = [
      'Description',
      'Detailed',
      'Reviews'
    ]
    this.state = {
      tourTurn: null,
      tabId: 0,
      isLoading: false,
      nextPage: 1,
      email: '',
      author: '',
      review: '',
      rating: 0,
      isSubmit: false,
      tourLike: [],
      images: []
    }
  }

  componentDidMount(){
    const id = Router.query.id
    this.apiService.getToursTurnId(id).then((res) => {
      this.setState({
        tourTurn: res.data
      }, () => {
        this.apiService.getImageByTour(this.state.tourTurn.tour.id).then(imgs => {
          this.setState({
            images: imgs.data
          })
        })
      })
    })
    this.apiService.getToursTurn(1, 4).then((res) => {
      this.setState({
        tourLike: res.data
      })
    })
  }

  handleChangeTab(index){
    this.setState({
      tabId: index
    })
  }

  onLoadMore(){

  }

  handleSubmit(e){
    e.preventDefault()
    this.setState({
      isSubmit: true
    })

    if(!this.validate()){
      return
    }


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

  handleChangeReview(e){
    this.setState({
      review: e.target.value
    })
  }

  validate(){
    if(!this.state.email || !validateEmail(this.state.email)){
      return false
    }

    if(!this.state.author){
      return false
    }

    if(!this.state.review){
      return false
    }

    if(!this.state.rating){
      return false
    }

    return true
  }

  render() {
    const { tourTurn } = this.state
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
                      <span>DETAIL TOUR</span>
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
                  <div className="inner">
                    <div className="row img-tour">
                      <div className="col-sm-6 no-padding">
                        <div className="featured_img">
                          {!!tourTurn.discount &&
                            <span className="sale">SALE!</span>
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
                            <RatingStar hideNumber rate={3}/>
                          </div>
                          <p className="price">
                            {!!tourTurn.discount &&
                              <del>
                                <span className="amount">{tourTurn.price.toLocaleString()} VND</span>
                              </del>
                            }
                            <ins>
                              <span className="amount">
                                {tourTurn.discount ? (tourTurn.discount * tourTurn.price).toLocaleString() : tourTurn.price.toLocaleString()} VND
                              </span>
                            </ins>
                          </p>
                          <div className="row short-des">
                            <div className="col-12">
                              <div className="row" style={{marginBottom: '15px', marginTop: '30px'}}>
                                <div className="col-md-4 col-sm-4 col-6">Tour code:</div>
                                <div className="col-md-8 col-sm-8 col-6">{getCodeTour(tourTurn.id)}</div>
                              </div>
                              <div className="row">
                                <div className="col-lg-4 col-md-6 col-sm-4 col-6 mg-10">Start date:</div>
                                <div className="col-lg-3 col-md-6 col-sm-3 col-6">{formatDate(tourTurn.start_date)}</div>
                                <div className="col-lg-5 col-md-12 col-sm-5 col-12">
                                  <a style={{color: '#333'}}>
                                    <FaRegCalendarAlt style={{fontSize: '16px', color: 'rgb(67, 74, 84)'}}/>&nbsp;&nbsp;
                                      <span style={{color: '#fc6600'}}>Other day</span>
                                    </a>
                                  </div>
                                </div>
                                <div className="row" style={{marginTop: '15px'}}>
                                  <div className="col-lg-4 col-md-6 col-sm-4 col-6 mg-bot15">
                                    <span>Last in {distanceFromDays(new Date(tourTurn.start_date), new Date(tourTurn.end_date))} days</span>
                                  </div>
                                  <div className="col-lg-3 col-md-6 col-sm-3 col-6"> {distanceFromDays(Date.now(), new Date(tourTurn.start_date))} days left</div>
                                  <div className="col-lg-5 col-md-12 col-sm-5 col-12  mg-bot15">{tourTurn.num_max_people - tourTurn.num_current_people} slots left</div>
                                </div>
                              </div>
                            </div>
                            <Link route="home">
                              <a className="co-btn green w-auto mt-4">BOOK NOW</a>
                            </Link>
                            {/*<div className="product_meta">
                              <span className="posted-in">
                                Category:&nbsp;
                                <a href="javascript:;" rel="tag">Travel</a>
                              </span>
                              <span className="tagged-as">
                                Tag:&nbsp;
                                <a href="javascript:;" rel="tag">Promotion</a>
                              </span>
                            </div>*/}
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className="woocommerce-tabs wc-tabs-wrapper">
                    <ul className="tabs wc-tabs" role="tablist">
                      {this.tabs.map((item, key) => {
                          return(
                            <li className={this.state.tabId === key ? "tab_item active" : "tab_item"} role="tab" key={key}>
                              <a onClick={this.handleChangeTab.bind(this, key)}>{item}</a>
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
                                    <h3>Routes</h3>
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
                                    <h3 className="timeline-title">Timeline</h3>
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
                        <div className="reviews">
                          <div className="comments">
                            <h2>2 reviews for <span>Hawaii Coast</span></h2>
                            <ol className="commentlist">
                              <li>
                                <div className="comment-container">
                                  <img alt="avatar" src="/static/images/avatar.jpg"/>
                                  <div className="comment-text">
                                    <div className="star-rating">
                                      <RatingStar hideNumber rate={3}/>
                                    </div>
                                    <p className="meta">
                                      <strong className="woocommerce-review__author">Rebecca Stone</strong>
                                      <span className="woocommerce-review__dash">–</span>
                                      <time className="woocommerce-review__published-date">May 4, 2018</time>
                                    </p>
                                    <div className="description">
                                      <p>
                                        This is an amazing tour and i recommend this purchase to all family with kids.
                                         Thanks again for the excellent tour guide that allow us to visit the country in best way possible. Thanks !
                                       </p>
                                    </div>
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="comment-container">
                                  <img alt="avatar" src="/static/images/avatar.jpg"/>
                                  <div className="comment-text">
                                    <div className="star-rating">
                                      <RatingStar hideNumber rate={3}/>
                                    </div>
                                    <p className="meta">
                                      <strong className="woocommerce-review__author">Rebecca Stone</strong>
                                      <span className="woocommerce-review__dash">–</span>
                                      <time className="woocommerce-review__published-date">May 4, 2018</time>
                                    </p>
                                    <div className="description">
                                      <p>
                                        This is an amazing tour and i recommend this purchase to all family with kids.
                                         Thanks again for the excellent tour guide that allow us to visit the country in best way possible. Thanks !
                                       </p>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            </ol>
                            <BtnViewMore
                              isLoading={this.state.isLoading}
                              show={this.state.nextPage > 0}
                              onClick={this.onLoadMore.bind(this)}
                            />
                          </div>
                          <div className="review-form">
                            <div className={this.state.nextPage > 0 ? "respond margin-top20" : "respond"}>
                              <span>Add a review</span>
                              <form className="comment-form" onSubmit={this.handleSubmit.bind(this)}>
                                <p className="comment-notes">Your email address will not be published. Required fields are marked *</p>
                                <div className="comment-form-rating">
                                  <label htmlFor="rating">Your rating</label>
                                  <div className="stars">
                                    <RatingStar hideNumber editor rtChange={this.handleChangeRating.bind(this)} rate={this.state.rating}/>
                                  </div>
                                  {this.state.isSubmit && !this.state.rating &&
                                    <p className="error">Please rate this tour</p>
                                  }
                                  <p className="comment-form-comment">
                                    <label htmlFor="comment">Your review <span className="required">*</span></label>
                                    <textarea id="comment" name="comment" cols="45" rows="8" value={this.state.review}
                                      onChange={this.handleChangeReview.bind(this)}/>
                                  </p>
                                  {this.state.isSubmit && !this.state.review &&
                                    <p className="error">This field is required</p>
                                  }
                                  <p className="comment-form-author">
                                    <label htmlFor="author">Name <span className="required">*</span></label>
                                    <input id="author" name="author" type="text" value={this.state.author}
                                      onChange={this.handleChangeAuthor.bind(this)} size="30"/>
                                  </p>
                                  {this.state.isSubmit && !this.state.author &&
                                    <p className="error">This field is required</p>
                                  }
                                  <p className="comment-form-email">
                                    <label htmlFor="email">Email <span className="required">*</span></label>
                                    <input id="email" name="email" type="email" value={this.state.email}
                                      onChange={this.handleChangeEmail.bind(this)} size="30"/>
                                  </p>
                                  {this.state.isSubmit && !this.state.email &&
                                    <p className="error">This field is required</p>
                                  }
                                  {this.state.isSubmit && this.state.email && !validateEmail(this.state.email) &&
                                    <p className="error">Email must be right in format</p>
                                  }
                                  <p className="form-submit">
                                    <button type="submit" className="co-btn green w-auto" onClick={this.handleSubmit.bind(this)}>SUBMIT</button>
                                  </p>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                  <section className="related-products">
                    <h2>You may like</h2>
                    <div className="row">
                      {!!this.state.tourLike.length && this.state.tourLike.map((item) => {
                          return(
                            <div className="col-sm-3" key={item.id}>
                              <TourItem item={item}/>
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

export default DetailTour
