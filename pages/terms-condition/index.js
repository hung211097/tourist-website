import React from 'react'
import styles from './index.scss'
import { Layout } from 'components'

class TermsCondition extends React.Component {
  displayName = 'Terms Condition'

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    return (
      <>
        <Layout page="terms-condition" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>TERMS CONDITION</span>
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
                      Những điều khoản sử dụng quy định việc sử dụng của quý khách đối với trang web của công ty chúng tôi.
                      Việc quý khách sử dụng trang web này có nghĩa là quý khách chấp thuận những Điều Khoản này.
                    </p>
                    <br/>
                    <strong>Quyền của công ty</strong>
                    <ul>
                      <li>
                        Công ty sẽ tiến hành cung cấp các dịch tốt nhất cho khách hàng sau khi hoàn thành
                        các thủ tục và các điều kiện công ty nêu ra.
                      </li>
                      <li>
                        Trong trường hợp khách hàng cung cấp thông tin cho công ty không chính xác,
                        hoặc vi phạm pháp luật thì chúng tôi có quyền từ chối hoặc chấm dứt cung cấp dịch vụ.
                      </li>
                      <li>
                         Công ty chúng tôi giữ bản quyền sử dụng dịch vụ và các nội dung trên trang web của công ty theo luật
                         bản quyền và các quy định pháp luật về bảo hộ sở hữu trí tuệ tại Việt Nam. Nghiêm cấm mọi hành vi sao chép,
                         sử dụng và phổ biến bất hợp pháp các quyền sở hữu trên.
                      </li>
                      <li>
                        Công ty chúng tôi giữ quyền thay đổi biểu giá dịch vụ của tour và phương thức thanh toán theo nhu cầu và điều kiện của tour du lịch.
                      </li>
                    </ul>
                    <br/>
                    <strong>Nghĩa vụ của công ty</strong>
                    <ul>
                      <li>
                        Công ty sẽ tiến hành triển khai và hợp tác với các đối tác lữ hành trong việc xây dựng hệ thống các
                        dịch vụ, các công cụ tiện ích phục vụ cho hành khách.
                      </li>
                      <li>
                        Công ty luôn chịu trách nhiệm nâng cấp trang thiết bị, bổ sung dịch vụ, chất lượng liên quan đến hoạt động du
                        lịch, phục vụ quý khách.
                      </li>
                      <li>
                        Công ty sẽ cố gắng đến mức cao nhất trong phạm vi và điều kiện có thể để duy trì hoạt động du lịch bình thường.
                        Tuy nhiên nếu những sự cố trên xẩy ra nằm ngoài khả năng kiểm soát, những trường hợp bất khả kháng gây thiệt hại
                        cho khách hàng thì công ty chung tôi không phải chịu trách nhiệm liên đới.
                      </li>
                      <li>
                        Bảo mật: cam kết sẽ bảo mật mọi thông tin của quý khách khi đăng ký sử dụng dịch vụ đặt tour trên website.
                      </li>
                    </ul>
                    <strong className="mb-3 d-block mt-5">Điều kiện tham gia tour của khách hàng.</strong>
                    <p>1. Đăng ký chương trình du lịch.</p>
                    <ul>
                      <li>
                        Công ty sẽ cung cấp cho khách hàng mọi thông tin du lịch miễn phí.
                      </li>
                      <li>
                        Khách hàng có thể đăng ký chương trình du lịch trực tiếp tại văn phòng của công ty hoặc bằng online trên website.
                        Việc đăng ký tour phải được thực hiện ít
                        nhất trước 3 ngày và khách hàng sẽ xác nhận chương trình du lịch cụ thể thông qua hợp đồng.
                      </li>
                      <li>
                        Những yêu cầu đặc biệt của khách hàng phải được thông báo ngay tại thời điểm đăng ký.
                        Công ty sẽ cố gắng đáp ứng những nhu cầu này trong khả năng của mình
                      </li>
                    </ul>
                    <br/>
                    <p>2. Giá chương trình du lịch.</p>
                    <ul>
                        <li>
                          Giá của chương trình du lịch được bảo đảm trong thời hạn hợp đồng được ký kết.
                        </li>
                        <li>
                          Giá bao gồm chi tiết trong từng chương trình cụ thể.
                        </li>
                        <li>
                          Giá các chương trình du lịch có thể tăng trong dịp lễ Giáng sinh, Tết dương lịch, Tết nguyên đán Việt Nam,
                          ngày 30/4 và ngày Quốc khánh 2/9,
                          Công ty có trách nhiệm thông báo cụ thể mức giá theo từng chương trình cho khách hàng.
                        </li>
                        <li>
                          Giá áp dụng cho trẻ em (Không phát sinh thêm giường):
                          <ul>
                            <li>
                              Trên 11 tuổi: Áp dụng giá người lớn.
                            </li>
                            <li>
                              Từ 05 đến dưới 11 tuổi: 75% giá người lớn; dưới 05 tuổi: miễn phí dịch vụ du lịch
                              ( Chi phí phát sinh tại điểm Bố, mẹ trực tiếp thanh toán – Riêng vé máy bay trẻ em dưới 2 tuổi phụ thu 10% giá vé máy bay)
                            </li>
                          </ul>
                        </li>
                      </ul>
                    <br/>
                    <p>3. Hoãn hủy chương trình.</p>
                    <ul>
                      <li>
                        Trường hợp chuyến đi bị huỷ bỏ do Công ty : Công ty phải báo ngay cho khách hàng biết và
                        thanh toán lại cho khách hàng toàn bộ số tiền khách hàng đã đặt trước hoặc sắp xếp thương lượng với
                        khách hàng chương trình du lịch khác hay đối tác khác phục vụ.
                      </li>
                      <li>
                        Trường hợp chuyến đi bị huỷ do khách hàng: Trước ngày khởi hành, nếu khách hàng không thể tham dự được chuyến đi với bất kỳ lý
                        do gì, phải báo trực tiếp ngay cho
                        Công ty bằng văn bản hoặc gửi qua mail và khách hàng phải chịu chi phí làm thủ tục như sau:
                        <ul>
                          <li>
                            Huỷ trước 05 ngày: Khách hàng sẽ chi trả các chi phí mà Công ty phải chi cho việc huỷ bỏ các dịch vụ.
                          </li>
                          <li>
                             Huỷ trước 72 giờ so với giờ khởi hành: 50% tổng giá trị của chương trình du lịch.
                          </li>
                          <li>
                            Huỷ trước 24 giờ so với giờ khởi hành: 75% tổng giá trị của chương trình du lịch.
                          </li>
                          <li>
                            Huỷ sau 24 giờ so với giờ khởi hành: 100% tổng giá trị của chương trình du lịch.
                          </li>
                          <li>
                            Không hoàn tiền với những khách hàng bỏ chương trình du lịch.<br/>(Và tùy thuộc vào tuor du lịch cụ thể, sẽ được thông báo rõ trong từng tour).
                          </li>
                        </ul>
                      </li>
                      <li>
                        Trường hợp bất khả kháng: Nếu chương trình du lịch bị huỷ bỏ hoặc bị thay đổi vì lý do bất khả kháng
                        (Hoả hoạn, thời tiết, thiên tai, chiến tranh…), thì hai bên sẽ không chịu bất kỳ nghĩa vụ bồi hoàn các tổn
                        thất đã xẩy ra và không chịu bất kỳ trách nhiệm pháp lý nào.
                      </li>
                    </ul>
                    <br/>
                    <p>4.  Thanh toán tiền.</p>
                    <ul>
                      <li>
                        Thanh toán bằng tiền mặt hoặc chuyển khoản.
                      </li>
                      <li>
                        Khách hàng phải đặt cọc ít nhất 50% giá tour trọn gói khi đăng ký chính thức và ký hợp đồng.
                        Số tiền còn lại phải thanh toán hết trước khi khởi hành 07 ngày
                      </li>
                    </ul>
                    <br/>
                  </div>
                  <div className="col-sm-4">
                    <div className="gallery">
                      <div className="row">
                        <div className="col-12">
                          <div className="box-img no-margin responsive">
                            <img alt="featured_img" src="/static/images/sqb-4.jpg"/>
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
                            <img alt="featured_img" src="/static/images/sqb-5.jpg"/>
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
                            <img alt="featured_img" src="/static/images/sqb-6.jpg"/>
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
          </section>
        </Layout>
      </>
    )
  }
}

export default TermsCondition
