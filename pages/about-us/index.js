import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Layout } from 'components'
import { withNamespaces } from "react-i18next"

class AboutUs extends React.Component {
  displayName = 'About Us'

  static propTypes = {
      t: PropTypes.func
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    const {t} = this.props
    return (
      <>
        <Layout page="about-us" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>{t('about.title')}</span>
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
              <div className="content">
                <div className="row about">
                  <div className="col-sm-8">
                    <p>
                      <strong>{t('about.part_1')}</strong>
                      {t('about.sub_part_1')}
                    </p>
                    <br/>
                    <p>
                      <strong>{t('about.part_2')}</strong>
                      {t('about.sub_part_2')}
                    </p>
                    <br/>
                    <p>
                      <strong>{t('about.part_3')}</strong>
                      {t('about.sub_part_3')}
                    </p>
                    <br/>
                    <strong>{t('about.part_4')}</strong>
                    <p>
                      {t('about.sub_part_4')}
                    </p>
                    <br/>
                    <strong>{t('about.part_5')}</strong>
                    <p>
                      {t('about.sub_part_5')}
                    </p>
                    <br/>
                    <strong>{t('about.part_6')}</strong>
                    <p>
                      {t('about.sub_part_6')}
                    </p>
                    <br/>
                    <strong>{t('about.part_7')}</strong>
                    <p>
                      <ul>
                        <li>{t('about.sub_part_7_1')}</li>
                        <li>
                          {t('about.sub_part_7_2')}
                        </li>
                        <li>
                          {t('about.sub_part_7_3')}
                        </li>
                      </ul>
                    </p>
                  </div>
                  <div className="col-sm-4">
                    <div className="gallery">
                      <div className="row">
                        <div className="col-12">
                          <div className="box-img no-margin responsive">
                            <img alt="featured_img" src="/static/images/sqb-2.jpg"/>
                            <div className="box-title">
                              <div className="title">
                                <h3>{t('about.city_tour')}</h3>
                                <div className="nd_options_section nd_options_height_10"></div>
                                <h6><p>{t('about.culture')}</p></h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="box-img">
                            <img alt="featured_img" src="/static/images/sqb-3.jpg"/>
                            <div className="box-title">
                              <div className="title">
                                <h3>{t('about.honeymoon')}</h3>
                                <div className="nd_options_section nd_options_height_10"></div>
                                <h6><p>{t('about.luxury')}</p></h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="box-img">
                            <img alt="featured_img" src="/static/images/sqb-1.jpg"/>
                            <div className="box-title">
                              <div className="title">
                                <h3>{t('about.adventure')}</h3>
                                <div className="nd_options_section nd_options_height_10"></div>
                                <h6><p>{t('about.cool')}</p></h6>
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
            <div className="row parallax-area">
              <div className="col-sm-12 col-lg-8">
                <div className="inner">
                  <div className="wrapper">
                    <div className="nd_options_section nd_options_position_relative nd_options_about_us_service">
                      <div className="parallax-title">
                        <h1><strong>{t('about.do_right_1')} <br /> {t('about.do_right_2')}</strong></h1>
                      </div>
                    </div>
                    <div style={{height: '70px'}}/>
                    <div className="row">
                      <div className="col-md-6 col-lg-3">
                        <div className="inner-statistic">
                          <div className="wrapper-statistic">
                            <h1>15</h1>
                            <div className="nd_options_height_20"/>
                            <p>{t('about.branch')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="inner-statistic">
                          <div className="wrapper-statistic">
                            <h1>100</h1>
                            <div className="nd_options_height_20"/>
                            <p>{t('about.tours')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="inner-statistic">
                          <div className="wrapper-statistic">
                            <h1>47</h1>
                            <div className="nd_options_height_20"/>
                            <p>{t('about.destination')}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="inner-statistic">
                          <div className="wrapper-statistic">
                            <h1>10</h1>
                            <div className="nd_options_height_20"/>
                            <p>{t('about.staff')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-12 col-lg-4"></div>
              <div className="vc_parallax-inner skrollable skrollable-before"></div>
            </div>
            <div className="nd_options_container nd_options_clearfix content">
              <div className="content">
                <div className="row services">
                  <div className="col-sm-1"></div>
                  <div className="col-sm-5">
                    <div className="inner">
                      <div className="wrapper">
                        <div className="nd_options_section nd_options_position_relative service-contain">
                          <img alt="icon" src="/static/images/icon-support.png" />
                          <div className="service-item">
                            <p>
                              {t('about.support_content')}
                            </p>
                            <a className="yellow">{t('about.support')}</a>
                          </div>
                        </div>
                        <div className="nd_options_section nd_options_position_relative service-contain">
                          <img alt="icon" src="/static/images/icon-island.png" />
                          <div className="service-item">
                            <p>
                              {t('about.resort_content')}
                            </p>
                            <a className="red">{t('about.resort')}</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-5">
                    <div className="nd_options_section nd_options_position_relative service-contain">
                      <img alt="icon" src="/static/images/icon-landmark.png" />
                      <div className="service-item">
                        <p>
                          {t('about.best_content')}
                        </p>
                        <a className="blue">{t('about.best')}</a>
                      </div>
                    </div>
                    <div className="nd_options_section nd_options_position_relative service-contain">
                      <img alt="icon" src="/static/images/icon-map.png" />
                      <div className="service-item">
                        <p>
                          {t('about.guide_content')}
                        </p>
                        <a className="green">{t('about.guide')}</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-1"></div>
                </div>
              </div>
            </div>
          </section>
        </Layout>
      </>
    )
  }
}

export default withNamespaces('translation')(AboutUs)
