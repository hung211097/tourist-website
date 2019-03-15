import React from 'react'
import styles from './index.scss'
import { Layout, PopupInfo} from 'components'
import {UnmountClosed} from 'react-collapse'
import validateEmail from '../../services/validates/email.js'
import ApiService from 'services/api.service'
import { FaCheck } from "react-icons/fa"

class FAQ extends React.Component {
  displayName = 'FAQ'

  constructor(props) {
    super(props)
    this.questions = [
      {
        content: "Các mức giá được cho biết như thế nào trong kết quả tìm kiếm khi tôi muốn thực hiện một yêu cầu đặt tour?",
        isShow: false,
        answer: `Các mức giá luôn được cho biết là giá mỗi người. Nếu bạn có cả trẻ em và người lớn trong yêu cầu tìm kiếm,
        tổng số cho tất cả hành khách sẽ được hiển thị cũng như giá mỗi người lớn.
        Khi bạn chọn một lựa chọn và tiếp tục, giá sẽ được cho biết dưới dạng người lớn và trẻ em. Tổng giá luôn được hiển thị.`
      },
      {
        content: "Tôi có thể đặt tour trước bao lâu?",
        isShow: false,
        answer: `Bạn có thể đặt tour ngay khi công ty có tour cho đến 3 ngày trước ngày khởi hành nếu tour cón chỗ trống.`
      },
      {
        content: "Giá trên trang web có thể thay đổi hay không?",
        isShow: false,
        answer: `Giá trên trang web của chúng tôi là Công ty đã ước tính từ trước, các chi phí được tính toán một cách chính xác,
        vì thế giá không thay đổi trong quy trình đặt tour, một khi bạn đã chọn lựa chọn bạn muốn.`
      },
      {
        content: "Có bất kỳ khoản phí nào khi tôi thanh toán bằng thẻ hay không?",
        isShow: false,
        answer: `Bất kỳ khoản phí nào có thể áp dụng cũng sẽ được hiển thị tại thời điểm thực hiện yêu cầu đặt tour.`
      },
      {
        content: "Tôi có thể nhận được thông tin về bất kỳ sự thay đổi lịch nào bằng cách nào?",
        isShow: false,
        answer: `Giờ khởi hành cót thể được thay đổi trong thời gian ngắn. Điều quan trọng là bạn phải kiểm tra địa chỉ
        email mà bạn đã cung cấp khi đặt tour vì bất kỳ thay đổi lịch nào cũng sẽ được gửi vào đó. Bạn phải sử dụng địa chỉ
        email mà bạn cũng có thể kiểm tra trong khi đi xa, vì những thay đổi lịch đôi khi có thể xuất hiện sau khi bạn đã bắt đầu đi.
        Bạn luôn có thể kiểm tra giờ khởi hành dùng liên kết chúng tôi cung cấp cho bạn trong các giấy tờ đi lại của bạn.`
      },
      {
        content: "Tôi sẽ đi với một trẻ sơ sinh. Tôi có cần bất kỳ thông tin đặc biệt nào hay không?",
        isShow: false,
        answer: `Nếu bạn đã mua một tour và bạn đi đường dài, chúng tôi có thể yêu cầu nôi cho bé. Để thực hiện việc này,
        chúng tôi cần thông tin sau đây: ngày sinh và chiều cao và cân nặng ước tính của trẻ vào ngày khởi hành.
        Trong một số trường hợp chúng tôi cũng có thể đặt thức ăn cho trẻ sơ sinh và ghế đặc biệt cho các hành khách có con sơ sinh.
        Tuy nhiên, chúng tôi không bao giờ có thể đảm bảo các ghế ngồi này, vì các hãng hàng không đôi khi có những thay đổi
        (thay đổi loại máy bay, thay đổi lịch bay, v.v.) có thể dẫn đến việc không thể đáp ứng yêu cầu của bạn.`
      },
      {
        content: "Trẻ em có phải có hộ chiếu riêng hay không?",
        isShow: false,
        answer: `Có, tất cả trẻ em phải có hộ chiếu riêng. Không thể chỉ liệt kê trẻ em trong hộ chiếu của cha mẹ.`
      },
      {
        content: "Tại sao tôi không thể truy cập thông tin đặt tour trong tài khoản của tôi; tôi có thể đăng nhập bằng cách nào?",
        isShow: false,
        answer: `Để đăng ký chuyến đi khi bạn đặt tour trên trang web của chúng tôi bạn phải đăng nhập vào tài khoản của mình khi bạn thực hiện yêu cầu đặt tour.`
      },
      {
        content: "Mật khẩu vào tài khoản của tôi không có hiệu lực; tôi có thể đổi mật khẩu bằng cách nào?",
        isShow: false,
        answer: `Nhấp vào nút "Đăng nhập" trên trang chủ của chúng tôi ở đó bạn sẽ tìm thấy một liên kết,
        bạn có thể mở liên kết này để lấy mật khẩu mới. Nhấp vào liên kết "Quên mật khẩu" và nhập địa chỉ email của bạn
        và chúng tôi sẽ gửi cho bạn các hướng dẫn cách cài đặt mật khẩu mới.`
      },
      {
        content: "Tôi gặp vấn đề khi kích hoạt tài khoản của mình; có vấn đề gì?",
        isShow: false,
        answer: `Có thể có thiết lập bảo mật trong email của bạn khiến cho bạn không thể nhận email xác minh. Trước tiên hãy kiểm tra thiết lập bảo mật của bạn.
        Nếu cách này không có tác dụng, hãy liên hệ lại với chúng tôi để chúng tôi có thể kích hoạt tài khoản của bạn lại.`
      },
    ]
    this.apiService = ApiService()
    this.state = {
      questions: this.questions,
      name: '',
      email: '',
      message: '',
      showPopup: false,
      isSubmit: false
    }
  }

  handleToggle(index){
    let arr = this.state.questions
    let temp = arr.find((item, key) => {return index === key})
    if(temp.isShow){
      temp.isShow = false
    }
    else{
      temp.isShow = true
    }
    this.setState({
      questions: arr
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

    this.apiService.sendRequest({name: this.state.name, email: this.state.email, message: this.state.message}).then(() => {
      this.setState({
        name: '',
        email: '',
        message: '',
        showPopup: true,
        isSubmit: false
      })
    }).catch(e => {
      if(e.status !== 200){
        this.setState({
          error: 'There is an error, please try again!'
        })
      }
    })
  }

  handleChangeName(e){
    this.setState({
      name: e.target.value
    })
  }

  handleChangeEmail(e){
    this.setState({
      email: e.target.value
    })
  }

  handleChangeMessage(e){
    this.setState({
      message: e.target.value
    })
  }

  handleClose(){
    this.setState({
      showPopup: false
    })
  }

  validate(){
    if(!this.state.name){
      return false
    }

    if(!this.state.email || !validateEmail(this.state.email)){
      return false
    }

    if(!this.state.message){
      return false
    }

    return true
  }

  render() {
    return (
      <>
        <Layout page="faq" {...this.props}>
          <style jsx>{styles}</style>
          <section className='middle'>
            {/* section box*/}
            <div className="content-title nd_options_section">
              <div className="nd_options_section overlay">
                <div className="nd_options_container nd_options_clearfix">
                  <div className="nd_options_section nd_options_height_110"/>
                  <div className="nd_options_section title-contain">
                    <h1>
                      <span>FAQ</span>
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
                <div className="row faq">
                  <div className="col-sm-8">
                    <div className="inner">
                      <div className="wrapper">
                        <div className="row">
                          <div className="col-12">
                            <strong>Thông tin thực tế.</strong>
                            <p>1. Những giờ được cho biết?</p>
                            <p>
                              Tất cả giờ bay đã cho biết là theo giờ địa phương. Ví dụ như, nếu nó cho biết là chuyến bay khởi hành
                              lúc 15:00 từ Arlanda và đến Luân Đôn lúc 16:30, thời gian bay là 2,5 giờ, vì giờ tại Anh Quốc trễ hơn giờ
                              Thụy Điển 1 giờ. Ví dụ như, nếu bạn bay từ Hoa Kỳ, bạn thường rời khỏi Hoa Kỳ vào buổi tối và đến Châu Âu
                              vào ngày hôm sau. Thông tin này được cho biết với một ngày mới cùng với các thời điểm.
                            </p>
                            <br/>
                            <p>2. Khi tôi đặt chuyến đi của mình tôi đã không nhận được các giấy tờ đi lại qua email, tôi phải làm gì?</p>
                            <p>
                              Giấy tờ đi lại của bạn được tự động gửi đến địa chỉ email bạn đã cung cấp khi thực hiện yêu cầu đặt tour.
                              Nếu bạn chưa nhận được giấy tờ đi lại, có thể là bạn đã cung cấp địa chỉ email không chính xác.
                              Giấy tờ đi lại chứa mọi chi tiết về yêu cầu đặt trư của bạn. Một số máy chủ email đôi khi cũng có thể
                              phân loại các email này là &quot;thư rác&quot;. Đảm bảo rằng email đã không bị phân loại là thư rác.
                              Bạn luôn có thể liên hệ với chúng tôi và chúng tôi sẽ gửi cho bạn các giấy tờ đi lại mới.
                              Lưu ý rằng điều rất quan trọng là phải cung cấp cho chúng tôi địa chỉ email chính xác, vì chúng tôi cũng
                              sẽ sử dụng địa chỉ này để gửi cho bạn bất kỳ thông tin thay đổi lịch nào hoặc những thay đổi khác đối với
                              yêu cầu đặt tour của bạn.
                            </p>
                            <br/>
                          </div>
                        </div>
                        <div className="nd_options_height_40"/>
                        <h3>MOST FREQUENT QUESTION - CUSTOMER</h3>
                        <div className="nd_options_height_20"/>
                        <div className="nd_options_section nd_options_line_height_0 underline-zone">
                          <span className="underline"></span>
                        </div>
                        <div className="nd_options_height_30"/>
                        {this.state.questions.map((item, key) => {
                            return(
                              <div className="nd_options_section nd_options_toogles_faq" key={key}>
                                <div className="question">
                                  <p>
                                    {!item.isShow ?
                                      <span className="toggleBtn" onClick={this.handleToggle.bind(this, key)}>
                                        <img alt="toggle" src="/static/images/icon-add-white.png"/>
                                      </span>
                                      :
                                      <span className="toggleBtn" onClick={this.handleToggle.bind(this, key)}>
                                        <img alt="toggle" src="/static/images/icon-less-white.png"/>
                                      </span>
                                    }
                                    {item.content}
                                  </p>
                                </div>
                                <UnmountClosed isOpened={item.isShow} springConfig={{stiffness: 150, damping: 20}}>
                                  <div className="collapse-content">
                                    <p>
                                      {item.answer}
                                    </p>
                                  </div>
                                </UnmountClosed>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="inner-msg">
                      <div className="wrapper-msg">
                        <div className="row">
                          <div className="col-12 no-padding">
                            <div className="custom">
                              <div className="wrapper-title">
                                <h2>Get In Touch</h2>
                                <div className="nd_options_height_20"/>
                                <div className="underline-zone">
                                  <span className="underline"></span>
                                </div>
                                <div className="nd_options_height_20"/>
                                <div className="form-msg">
                                  <form onSubmit={this.handleSubmit.bind(this)}>
                                    <div className="input-field">
                                      <span>
                                        <input type="text" name="name" placeholder="Name" value={this.state.name}
                                          onChange={this.handleChangeName.bind(this)}/>
                                      </span>
                                      {this.state.isSubmit && !this.state.name &&
                                        <p className="error">This field is required</p>
                                      }
                                    </div>
                                    <div className="input-field">
                                      <span>
                                        <input type="text" name="email" placeholder="Email" value={this.state.email}
                                          onChange={this.handleChangeEmail.bind(this)}/>
                                      </span>
                                      {this.state.isSubmit && !this.state.email &&
                                        <p className="error">This field is required</p>
                                      }
                                      {this.state.isSubmit && this.state.email && !validateEmail(this.state.email) &&
                                        <p className="error">Email must be right in format</p>
                                      }
                                    </div>
                                    <div className="input-field">
                                      <span>
                                        <textarea type="text" name="message" placeholder="Message" value={this.state.message}
                                          onChange={this.handleChangeMessage.bind(this)}/>
                                      </span>
                                      {this.state.isSubmit && !this.state.message &&
                                        <p className="error">This field is required</p>
                                      }
                                    </div>
                                    <div className="confirm-field">
                                      <button type="submit" onClick={this.handleSubmit.bind(this)}>SEND NOW</button>
                                      {this.state.error &&
                                        <p className="error">{this.state.error}</p>
                                      }
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row best-package">
                          <div className="col-sm-12 no-padding">
                            <div className="custom">
                              <div className="wrapper-custom">
                                <h5>PACKAGES</h5>
                                <div className="nd_options_section nd_options_height_10"/>
                                <h2>Best Promotions</h2>
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
          <PopupInfo show={this.state.showPopup} onClose={this.handleClose.bind(this)}>
            <FaCheck size={100} style={{color: 'rgb(67, 74, 84)'}}/>
            <h1>Successfully!</h1>
            <div className="nd_options_height_10" />
            <p>Your message is sent to us.</p>
            <p>Please check your email in a few day.</p>
            <button className="co-btn mt-5" onClick={this.handleClose.bind(this)}>OK</button>
          </PopupInfo>
        </Layout>
      </>
    )
  }
}

export default FAQ
