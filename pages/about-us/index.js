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
                    <p>
                      <strong>Lời đầu tiên, </strong>
                      công ty chúng tôi xin gửi lời chào thân ái đến Quý khách hàng và đối tác.
                      Kính chúc Quý khách hàng và đối tác luôn dồi dào sức khỏe và thành đạt.
                    </p>
                    <br/>
                    <p>
                      <strong>Lĩnh vực hoạt động: </strong>
                      Kinh doanh lữ hành nội địa và quốc tế.
                    </p>
                    <br/>
                    <p>
                      <strong>Công ty </strong>
                      được thành lập 25/03/2017 với hoạt động kinh doanh ban đầu là tổ chức các chương trình du lịch cho du khách nước ngoài
                      vào tham quan Việt Nam, đến nay trải qua 2 năm xây dựng và phát triển (2017–2019), công ty chúng tôi đã không ngừng lớn mạnh,
                      lĩnh vực kinh doanh ngày càng được mở rộng: kinh doanh du lịch trong và ngoài nước. Công ty cũng đã xây dựng được một hệ thống
                      chi nhánh ở Hà Nội, Đà Nẵng, Tp. Hồ Chí Minh và Cần Thơ và mạng lưới đại lý ở nhiều tỉnh thành của cả nước.  Là một công ty đã
                      thành lập cách đây 26 năm, uy tín cực cao trong lĩnh vực du lịch, lữ hành. <br/>
                      Công ty chúng tôi cung cấp không chỉ những thông tin
                      hữu ích cho người có nhu cầu du lịch
                      mà còn là nơi cung cấp các dịch vụ du lịch chuyên nghiệp, được đánh giá cao bởi khách hàng. Sau nhiều năm cạnh tranh,
                      phấn đấu và chứng minh,  chúng tôi đã được ving danh trong top các công ty du lịch nổi tiếng nhất Việt Nam. Với tiêu chí
                      tour chất lượng cao, an toàn, không thay đổi lịch trình, gía cả tốt nhất thị trường hơn hết đảm bảo cho du khách có những trải
                      nghiệm thú vị nhất, dịch vụ chuyên nghiệp nhất khi mua tour tại đây. Chúng tôi phục vụ du khách đi tham quan du lịch
                      trên cả 5 châu, du lịch ra nước ngoài tại đây rất được khách hàng tin tưởng và đánh giá cao.
                      Dịch vụ đặt tour nhanh chóng và dễ dàng, thao tác nhanh lẹ là công ty hàng đầu về chất lượng và phong cách phục vụ
                      chuyên nghiệp.
                    </p>
                    <br/>
                    <strong>Đội ngũ nhân viên chuyên nghiệp.</strong>
                    <p>
                      Công Ty tự hào tạo là một văn hóa doanh nghiệp tốt môi trường làm việc thân thiện,
                      các thành viên làm việc gắn kết, giúp đỡ và hỗ trợ nhau khi cần,là môi trường làm việc chuyên
                      nghiệp từ nhân viên văn phòng đến hướng dẫn viên du lịch, luôn đưa ra lời tư vấn và thông tin du lịch
                      chính xác cho khách hàng. Đội ngũ hướng dẫn viên được đào tạo bài bản, chuyên nghiệp và thân thiện am
                      hiểu văn hóa nước ngoài, có thể giới thiệu cho du khách Việt những thông tin hữu ích, cũng nhằm mục đích tạo
                      cảm tình tốt đẹp giữa người Việt Nam và bạn bè quốc tế.
                    </p>
                    <br/>
                    <strong>Tầm nhìn và sứ mệnh.</strong>
                    <p>
                      Công ty phấn đấu để luôn giữ vị trí là một trong những công ty du lịch hàng đầu của Việt Nam và khu vực về qui mô,
                      chất lượng và uy tín.
                      Với các nguồn lực dồi dào, tài chính vững mạnh, kinh nghiệm và uy tín trong lĩnh vực dịch vụ du lịch,
                      mối quan hệ bền vững với các đối tác lớn khắp nơi trên thế giới, đội ngũ nhân viên năng động và chuyên nghiệp,
                      chúng tôi luôn nỗ lực mang đến cho khách hàng những sản phẩm du lịch giá trị nhất.
                    </p>
                    <strong>Triết lý kinh doanh.</strong>
                    <p>
                      Công ty luôn coi trọng ý thức trách nhiệm của doanh nghiệp đối với cộng đồng và môi trường, phát triển
                      hoạt động kinh doanh trên tiêu chí hài hòa
                      lợi ích doanh nghiệp với cộng đồng xã hội, thân thiện môi trường thiên nhiên.
                    </p>
                    <br/>
                    <strong>Giá trị cốt lõi.</strong>
                    <p>
                      <ul>
                        <li>Luôn tuân thủ các quy chuẩn và cam kết chất lượng đã công bố với khách hàng.</li>
                        <li>
                          Xem chất lượng dịch vụ và sự tiện ích của khách hàng là tiêu chí hàng đầu trong các định hướng và
                          hoạt động kinh doanh của công ty.
                        </li>
                        <li>
                          Tiên phong trong việc gợi mở những cảm hứng, mong đợi tiềm ẩn của khách hàng để mang đến cho khách
                          những sản phẩm du lịch độc đáo, mới lạ mà khách chỉ có thể tìm thấy ở công ty chúng tôi.
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
