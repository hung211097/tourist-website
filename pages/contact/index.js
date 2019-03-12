import React from 'react'
import styles from './index.scss'
import { Layout } from 'components'

class AboutUs extends React.Component {
  displayName = 'About Us'

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
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
                      <span>ABOUT US</span>
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
                    <strong>ABCDE</strong>
                    <p>
                      Lorem ipsum dolor sit amet,
                      consectetur adipiscing elit.Aliquam lobortis et libero at feugiat.Class
                      aptent taciti sociosqu ad litora torquent per conubia nostra,
                      per inceptos himenaeos.Curabitur sapien dolor,
                      egestas non consequat ullamcorper,
                      feugiat vel arcu.Morbi eu enim vitae urna consequat faucibus sed non turpis.Fusce
                      suscipit metus nunc, in eleifend arcu rhoncus sit amet.Mauris varius sem velit,
                      quis eleifend ante aliquam eget.Nulla pellentesque,
                      metus ut sodales imperdiet, nunc nunc porta diam,
                      vitae pellentesque leo nisl eu magna.Donec molestie imperdiet lacinia.Aenean sed viverra
                      libero.
                    </p>
                    <br/>
                    <strong>ABCDE</strong>
                    <p>
                      Phasellus ac nisl nec nisl pulvinar bibendum ut eget magna.Mauris in condimentum dolor.Vivamus
                      mollis erat id egestas pellentesque.Ut sodales dignissim tellus.Sed quis imperdiet elit.Integer pretium,
                      metus at dignissim molestie,
                      sapien eros placerat tellus,
                      non sagittis orci tellus nec tortor.Aliquam dictum tempor felis,
                      non euismod dolor pharetra a.Proin ultricies ligula in purus ullamcorper,
                      non tincidunt libero viverra.Donec ut vehicula urna.Morbi laoreet interdum lorem,
                      eu consequat nulla.Maecenas magna magna,
                      semper non luctus efficitur,
                      sollicitudin ac arcu.Cras porttitor lectus id consectetur semper.Curabitur hendrerit venenatis mauris,
                      vitae molestie leo consectetur eu.Curabitur neque felis,
                      semper sit amet aliquet sed,
                      porta vel sem.
                    </p>
                    <br/>
                    <strong>ABCDE</strong>
                    <p>
                      Duis nec turpis ac odio elementum ultrices.Praesent euismod diam at ante volutpat,
                      et hendrerit lacus semper.Pellentesque cursus maximus erat,
                      ac vehicula mauris mollis id.Sed sed ipsum vestibulum,
                      ultricies est vitae,
                      malesuada turpis.Etiam libero ipsum,
                      commodo non sodales a,
                      auctor a mauris.Vivamus vestibulum felis congue odio condimentum,
                      id aliquet turpis auctor.Pellentesque ultrices sodales dui gravida molestie.Suspendisse potenti.In eleifend lectus eu mi laoreet,
                      maximus semper purus varius.Praesent ut arcu neque.Suspendisse sodales lacus eget ante vestibulum,
                      sed egestas massa dictum.Nullam eget posuere urna.Sed malesuada dui libero,
                      at tempus nibh pulvinar ac.Nullam quis tristique lorem.Nullam porta sit amet metus vel pharetra.Curabitur tincidunt venenatis facilisis.Integer lobortis justo vitae dolor congue,
                      et gravida felis condimentum.Morbi eget ante eget magna gravida porta ut ac augue.
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
                                <h3>CITY TOURS</h3>
                                <div className="nd_options_section nd_options_height_10"></div>
                                <h6><p>CULTURAL AND ARTS</p></h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="box-img">
                            <img alt="featured_img" src="/static/images/sqb-3.jpg"/>
                            <div className="box-title">
                              <div className="title">
                                <h3>HONEYMOON</h3>
                                <div className="nd_options_section nd_options_height_10"></div>
                                <h6><p>LUXURY RESORTS</p></h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="box-img">
                            <img alt="featured_img" src="/static/images/sqb-1.jpg"/>
                            <div className="box-title">
                              <div className="title">
                                <h3>ADVENTURE</h3>
                                <div className="nd_options_section nd_options_height_10"></div>
                                <h6><p>COOL EXPERIENCES</p></h6>
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
                        <h1><strong>Doing the right thing,<br/>at the right time.</strong></h1>
                      </div>
                    </div>
                    <div style={{height: '70px'}}/>
                    <div className="row">
                      <div className="col-md-6 col-lg-3">
                        <div className="inner-statistic">
                          <div className="wrapper-statistic">
                            <h1>15</h1>
                            <div className="nd_options_height_20"/>
                            <p>BRANCHES</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="inner-statistic">
                          <div className="wrapper-statistic">
                            <h1>100</h1>
                            <div className="nd_options_height_20"/>
                            <p>TOURS</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="inner-statistic">
                          <div className="wrapper-statistic">
                            <h1>47</h1>
                            <div className="nd_options_height_20"/>
                            <p>DESTINATIONS</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-3">
                        <div className="inner-statistic">
                          <div className="wrapper-statistic">
                            <h1>10</h1>
                            <div className="nd_options_height_20"/>
                            <p>STAFF</p>
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
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                              Aenean egestas magna at porttitor vehicula nullam augue ipsum dolor.
                            </p>
                            <a className="yellow">SUPPORT</a>
                          </div>
                        </div>
                        <div className="nd_options_section nd_options_position_relative service-contain">
                          <img alt="icon" src="/static/images/icon-island.png" />
                          <div className="service-item">
                            <p>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                              Aenean egestas magna at porttitor vehicula nullam augue ipsum dolor.
                            </p>
                            <a className="red">RESORTS</a>
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
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                          Aenean egestas magna at porttitor vehicula nullam augue ipsum dolor.
                        </p>
                        <a className="blue">BEST TOURS</a>
                      </div>
                    </div>
                    <div className="nd_options_section nd_options_position_relative service-contain">
                      <img alt="icon" src="/static/images/icon-map.png" />
                      <div className="service-item">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                          Aenean egestas magna at porttitor vehicula nullam augue ipsum dolor.
                        </p>
                        <a className="green">MAP GUIDES</a>
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

export default AboutUs
