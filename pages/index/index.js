import React from 'react'
import { Layout, MyMap, TopPromotionItem, SlickItem, RatingStar } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Router } from 'routes'
import { connect } from 'react-redux'
import { saveRedirectUrl } from 'actions'
import ApiService from 'services/api.service'
import { withNamespaces  } from "react-i18next"

const mapStateToProps = state => {
  return {
    user: state.user,
    location: state.location,
    errorPermission: state.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveRedirectUrl: (url) => {dispatch(saveRedirectUrl(url))}
  }
}

class Home extends React.Component {
  displayName = 'Home Page'

  static propTypes = {
    saveRedirectUrl: PropTypes.func,
    user: PropTypes.object,
    location: PropTypes.any,
    errorPermission: PropTypes.string,
    t: PropTypes.func,
    lng: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.destinations = [
      {
        route: '',
        title: 'oceania',
        featured_img: '/static/images/oceania.jpg'
      },
      {
        route: '',
        title: 'africa',
        featured_img: '/static/images/africa.jpg'
      },
      {
        route: '',
        title: 'america',
        featured_img: '/static/images/america.jpg'
      },
      {
        route: '',
        title: 'asia',
        featured_img: '/static/images/asia.jpg'
      }
    ]
    this.apiService = ApiService()
    this.state = {
      num_tours: '',
      num_locations: '',
      topTours: []
    }
  }

  componentDidMount() {
    this.props.saveRedirectUrl && this.props.saveRedirectUrl(Router.asPath)
    this.apiService.getStatisticNumber().then((data) => {
      this.setState({
        num_tours: data.num_of_tours,
        num_locations: data.num_of_locations
      })
    })
    this.loadTour()
  }

  loadTour(){
    this.apiService.getToursTurn(1, 6, {isDiscount: true}).then((res) => {
      this.setState({
        topTours: res.data
      })
    })
  }

  render() {
    const { t } = this.props
    return (
      <>
        <Layout page="home" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <MyMap
                isMarkerShown={true}
                isSearchBox={true}/>
            <div className="contain nd_options_container nd_options_clearfix">
              <div className="page-content">
                <div className="row top-promotion">
                  <div className="col-sm-12 top-promotion-title">
                    <div className="top-promotion-inner">
                      <div className="wrapper text-center">
                        <h1>{t('home.topsale')}</h1>
                        <div className="nd_options_height_20" />
                        <h3>{t('home.sub_topsale')}</h3>
                        <div className="nd_options_height_20" />
                        <div className="nd_options_section nd_options_line_height_0 text-center">
                          <span className="underline-title"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row top-promotion-item">
                  {!!this.state.topTours.length && this.state.topTours.map((item, key) => {
                      return(
                        <div className="col-sm-4 no-padding" key={key}>
                          <TopPromotionItem item={item} index={key} onLoadTour={this.loadTour.bind(this)} lng={this.props.lng} t={t}/>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <div className="row parallax-area">
              <div className="col-sm-4 parallax-item">
                <div className="inner">
                  <div className="wrapper">
                    <div className="nd_options_height_20" />
                    <h1>{this.state.num_locations}</h1>
                    <div className="nd_options_height_20" />
                    <div className="nd_options_section text-center">
                      <a className="yellow-bg">{t('home.destination')}</a>
                    </div>
                    <div className="nd_options_height_20" />
                  </div>
                </div>
              </div>
              <div className="col-sm-4 parallax-item">
                <div className="inner">
                  <div className="wrapper">
                    <div className="nd_options_height_20" />
                    <h1>{this.state.num_tours}</h1>
                    <div className="nd_options_height_20" />
                    <div className="nd_options_section text-center">
                      <a className="green-bg">{t('home.tours')}</a>
                    </div>
                    <div className="nd_options_height_20" />
                  </div>
                </div>
              </div>
              <div className="col-sm-4 parallax-item">
                <div className="inner">
                  <div className="wrapper">
                    <div className="nd_options_height_20" />
                    <h1>24</h1>
                    <div className="nd_options_height_20" />
                    <div className="nd_options_section text-center">
                      <a className="red-bg">{t('home.support')}</a>
                    </div>
                    <div className="nd_options_height_20" />
                  </div>
                </div>
              </div>
              <div className="vc_parallax-inner skrollable skrollable-before"></div>
            </div>
            <div className="contain nd_options_container nd_options_clearfix">
              <div className="page-content">
                <div className="row our-destination">
                  <div className="col-sm-12 our-destination-title">
                    <div className="our-destination-inner">
                      <div className="our_destination text-center">
                        <h1>{t('home.our_destination')}</h1>
                        <div className="nd_options_height_20" />
                        <h3>{t('home.sub_our_destination')}</h3>
                        <div className="nd_options_height_20" />
                        <div className="nd_options_section nd_options_line_height_0 text-center">
                          <span className="underline-title"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row our-destination-item">
                  {this.destinations.map((item, key) => {
                      return(
                        <div className="col-sm-3 no-padding destination-item" key={key}>
                          <div className="destination-item-contain">
                            <div className="content">
                              <div className="title-item">
                                <a>{t('home.' + item.title)}</a>
                              </div>
                              <img alt="featured_img" src={item.featured_img} />
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <section className="box">
              <div className="row user-feedback no-margin">
                <div className="col-sm-12 user-feedback-title">
                  <div className="user-feedback-inner">
                    <div className="wrapper text-center">
                      <h1>{t('home.testimonial')}</h1>
                      <div className="nd_options_height_20" />
                      <h3>{t('home.sub_testimonial')}</h3>
                      <div className="nd_options_height_20" />
                      <div className="nd_options_section nd_options_line_height_0 text-center">
                        <span className="underline-title"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             <div className="banner">
               <SlickItem slideShow>
                 <div className="testimonial-container">
                   <div className="avatar">
                     <img alt="avatar" src="/static/images/avatar_user_1.jpg"/>
                   </div>
                   <div className="comment">
                     <div className="rating-contain">
                       <RatingStar rate={5} hideNumber/>
                     </div>
                     <div className="comment-content">
                       Nói thật, ban đầu chưa dám đặt niềm tin nhiều ! Nhưng sau những ngày du lịch ở đà lạt, giờ thì thay mặt đoàn,
                       rất cảm ơn các em ! Dịch vụ rất tốt, các em rất nhiệt tình, thân thiện và thiệt là uy tín ! Chúc 2 em nhiều sức khoẻ
                       và luôn vững vàng trong công việc ! Hẹn gặp lại.
                     </div>
                   </div>
                   <div className="author">
                     <div className="info">
                       <h3>Diane Pennebaker</h3>
                     </div>
                   </div>
                 </div>
                 <div className="testimonial-container">
                   <div className="avatar">
                     <img alt="avatar" src="/static/images/avatar_user_2.jpg"/>
                   </div>
                   <div className="comment">
                     <div className="rating-contain">
                       <RatingStar rate={5} hideNumber/>
                     </div>
                     <div className="comment-content">
                       Cám ơn vì nhà mình đã có chuyến đi rất vui. Mọi người đều hài lòng hết.
                       Hdv ai cũng trẻ trung dễ thương nên hợp gu mấy đứa nhỏ ở nhà. Nói chung nếu có quay lại ĐL sẽ đi cùng với
                       page nữa. Hẹn gặp lại
                     </div>
                   </div>
                   <div className="author">
                     <div className="info">
                       <h3>Kevin Godwin</h3>
                     </div>
                   </div>
                 </div>
                 <div className="testimonial-container">
                   <div className="avatar">
                     <img alt="avatar" src="/static/images/avatar_user_3.jpg"/>
                   </div>
                   <div className="comment">
                     <div className="rating-contain">
                       <RatingStar rate={5} hideNumber/>
                     </div>
                     <div className="comment-content">
                       Thật là buồn khi đến với Đà lạt vào những ngày mưa nhưng nỗi buồn ấy tan biến nhanh vì có các bạn. Cảm ơn các bạn rất nhiều. 👍👍👍
                     </div>
                   </div>
                   <div className="author">
                     <div className="info">
                       <h3>Marva Flores</h3>
                     </div>
                   </div>
                 </div>
                 <div className="testimonial-container">
                   <div className="avatar">
                     <img alt="avatar" src="/static/images/avatar_user_4.jpg"/>
                   </div>
                   <div className="comment">
                     <div className="rating-contain">
                       <RatingStar rate={5} hideNumber/>
                     </div>
                     <div className="comment-content">
                       Cảm ơn các thành viên của Cty đã giúp mình và các thành viên trong đoàn có 1 chuyến đi thành công, e HDV Tâm
                       rất nhiệt tình và đáng iu. Lần sau nếu quay lại Đà Lạt sẽ tiếp tục nhờ đến sự giúp đỡ của Cty.
                     </div>
                   </div>
                   <div className="author">
                     <div className="info">
                       <h3>Tony Johnson</h3>
                     </div>
                   </div>
                 </div>
               </SlickItem>
             </div>
           </section>
          </section>
        </Layout>
      </>
    )
  }
}

export default withNamespaces('translation')(connect(mapStateToProps, mapDispatchToProps)(Home))
