import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import Popup from 'reactjs-popup'
import ApiService from 'services/api.service'
import { CustomCheckbox } from 'components'
import { Link } from 'routes'
import { formatDate } from '../../services/time.service'

let customStyles = {
    width: '90%',
    maxWidth: '800px',
    overflow: 'auto',
    maxHeight: '560px',
    zIndex: '999'
}

let customStyleOverlay = {

}

export default class extends React.Component {
    displayName = 'Popup Cancel Tour'

    static propTypes = {
        show: PropTypes.bool,
        onClose: PropTypes.func,
        children: PropTypes.any,
        customContent: PropTypes.object,
        customOverlay: PropTypes.object,
        tour: PropTypes.any,
        changeStatus: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.apiService = ApiService()
        this.state = {
          isSend: false,
          reason: '',
          isAgree: false,
          isSubmit: false,
          tourInfo: null,
          error: ''
        }
    }

    componentDidMount(){
      if(this.props.tour){
        this.apiService.getToursTurnId(this.props.tour.fk_tour_turn).then((res) => {
          this.setState({
            tourInfo: res.data
          })
        })
      }
    }

    handleClose() {
        this.props.onClose && this.props.onClose()
    }

    handleSubmit(e){
      e.preventDefault()
      this.setState({
        isSubmit: true
      })

      if(!this.validate()){
        return
      }

      this.apiService.cancelTour({
        idBookTour: this.props.tour.id,
        message: this.state.reason
      }).then((data) => {
        this.props.changeStatus && this.props.changeStatus(this.props.tour.id, data.status)
        this.setState({
          isSend: true
        })
      }).catch(() => {
        this.setState({
          error: 'There is an error, please try again!'
        })
      })
    }

    validate(){
      if(!this.state.reason){
        return false
      }

      if(!this.state.isAgree){
        return false
      }

      return true
    }

    handleChangeReason(e){
      this.setState({
        reason: e.target.value
      })
    }

    handleCheck(flag){
      this.setState({
        isAgree: flag
      })
    }

    render() {
        if(this.props.customContent){
          customStyles = this.props.customContent
        }
        if(this.props.customOverlay){
          customStyleOverlay = this.props.customOverlay
        }
        let localStyles = customStyles
        let overlayStyles = customStyleOverlay
        if(this.state.isSend){
          localStyles.maxWidth = '400px'
        }
        const { tour } = this.props
        const { tourInfo } = this.state
        return (
            <div>
                <style jsx>{styles}</style>
                <Popup onClose={this.handleClose.bind(this)} open={this.props.show}
                  contentStyle={localStyles}
                  overlayStyle={overlayStyles}
                  modal
                  closeOnDocumentClick>
                    {close => (
                    <>
                        <div className="close-modal" data-dismiss="modal" aria-label="Close" onClick={close}/>
                        <div className="modal-annouce-success">
                          <div className="content">
                            <h1>CANCEL TOUR</h1>
                            <div className="break" />
                            {this.state.isSend ?
                              <div className="result">
                                <h3>Your request is sent to us succefully!</h3>
                                <p className="mb-3">We will make a phone call and send email to you after processing your request!</p>
                                <p className="thank">Thank you!</p>
                              </div>
                              :
                              <div>
                                <div className="tour-info">
                                  <h3>Tour information: </h3>
                                  <div className="nd_options_section nd_options_line_height_0 underline-zone">
                                    <span className="underline"></span>
                                  </div>
                                  {tourInfo &&
                                    <ul>
                                      <li>
                                        <Link route="detail-tour" params={{id: tourInfo.id}}>
                                          <a>{tourInfo.tour.name}</a>
                                        </Link>
                                      </li>
                                      <li>Start date: {formatDate(tourInfo.start_date)}</li>
                                      <li>Book at: {formatDate(tour.book_time, 'dd/MM/yyyy HH:MM')}</li>
                                      <li>Number of people: {tour.num_passenger}</li>
                                      <li>Total money: {tour.total_pay.toLocaleString()} VND</li>
                                    </ul>
                                  }
                                </div>
                                <form onSubmit={this.handleSubmit.bind(this)}>
                                  <div className="reason">
                                    <div className="nd_options_height_20"/>
                                      <div className="form-group has-danger">
                                        <label className="form-control-label" htmlFor="reason">Your reason:</label>
                                        <div className="nd_options_section nd_options_line_height_0 underline-zone">
                                          <span className="underline"></span>
                                        </div>
                                        <textarea id="reason" className={this.state.isSubmit && !this.state.reason ?
                                            "form-control form-control-danger active" : "form-control"}
                                           rows="5" value={this.state.reason} onChange={this.handleChangeReason.bind(this)}></textarea>
                                         {this.state.isSubmit && !this.state.reason &&
                                           <div className="form-control-feedback mt-3">This field is required!</div>
                                         }
                                      </div>
                                  </div>
                                  <div className="condition">
                                    <h3>Terms of condition: </h3>
                                    <div className="nd_options_section nd_options_line_height_0 underline-zone">
                                      <span className="underline"></span>
                                    </div>
                                    <div className="condition-content">
                                      <h3>ĐIỀU KIỆN HỦY TOUR TRONG NƯỚC</h3>
                                      <h4><strong>Đối với ngày thường:</strong></h4>
                                      <ul>
                                        <li>Hủy vé 5-7 ngày trước ngày khởi hành: phí hủy 40% tiền tour.</li>
                                        <li>Hủy vé 3-4 ngày trước ngày khởi hành: phí hủy 60% tiền tour.</li>
                                        <li>Hủy vé 2 ngày trước ngày khởi hành: phí hủy 70% tiền tour.</li>
                                        <li>Hủy vé 1 ngày trước ngày khởi hành: phí hủy 100% tiền tour.</li>
                                        <li>Trường hợp quý khách đến trễ giờ khởi hành được tính là hủy ngay trong ngày : phí phạt 100% tiền tour.</li>
                                      </ul>
                                      <br/>
                                      <h4><strong>Đối với ngày lễ, Tết:</strong></h4>
                                      <ul>
                                        <li>Hủy tour từ 8-10 ngày trước ngày khởi hành: Phí huỷ tour là 30% trên tổng giá tour.</li>
                                        <li>Hủy tour từ 5-7 ngày trước ngày khởi hành: Phí huỷ tour là 60% trên tổng giá tour.</li>
                                        <li>Hủy tour từ 3-4 ngày trước ngày khởi hành: Phí huỷ tour là 90% trên tổng giá tour.</li>
                                        <li>Hủy tour từ 1-2 ngày trước ngày khởi hành: Phí huỷ tour là 100% trên tổng giá tour.</li>
                                        <li>Các tour ngày lễ, tết là các tour có thời gian diễn ra rơi vào một trong các ngày lễ, tết theo qui định.</li>
                                      </ul>
                                      <br/>
                                      <h4><strong>Lưu ý khi chuyển/hủy tour</strong></h4>
                                      <p>Thời gian hủy chuyến du lịch được tính cho ngày làm việc, không tính Thứ Bảy, Chủ Nhật & các ngày Lễ, Tết.</p>
                                      <br/>
                                      <h3>ĐIỀU KIỆN HỦY TOUR NƯỚC NGOÀI</h3>
                                      <h4><strong>Đối với ngày thường:</strong></h4>
                                      <ul>
                                        <li>Nếu hủy hoặc chuyển sang các tuyến du lịch khác trước ngày khởi hành 30 ngày: Không bị mất chi phí.</li>
                                        <li>Nếu hủy hoặc chuyển sang các chuyến du lịch khác từ 24-29 ngày trước ngày khởi hành: Phạt 50% tiền cọc tour.</li>
                                        <li>Nếu hủy hoặc chuyển sang các chuyến du lịch khác từ 20-24 ngày trước ngày khởi hành: Phạt 100% tiền cọc tour.</li>
                                        <li>Nếu hủy chuyến du lịch ngay sau khi Đại Sứ Quán, Lãnh Sự Quán đã cấp visa (đối với các nước cần visa): Phạt 100% tiền cọc tour.</li>
                                        <li>Nếu hủy chuyến du lịch trong vòng từ 14-19 ngày trước ngày khởi hành: Phạt 50% trên giá tour du lịch.</li>
                                        <li>Nếu hủy chuyến du lịch trong vòng từ 10-13 ngày trước ngày khởi hành: Phạt 70% trên giá tour du lịch.</li>
                                        <li>Nếu hủy chuyến du lịch trong vòng từ 02-09 ngày trước ngày khởi hành: Phạt 90% trên giá vé du lịch.</li>
                                        <li>Nếu hủy chuyến du lịch trong vòng 01 ngày trước ngày khởi hành : Phạt 100% trên giá vé du lịch.</li>
                                      </ul>
                                      <br/>
                                      <h4><strong>Đối với ngày lễ, Tết:</strong></h4>
                                      <ul>
                                        <li>Hủy tour ngay sau khi Đại Sứ Quán, Lãnh Sự Quán đã cấp visa: Chi phí huỷ tour là 100% tiền cọc tour.</li>
                                        <li>Hủy tour từ 30 – 45 ngày trước ngày khởi hành: Phí huỷ tour là 30% trên tổng giá tour.</li>
                                        <li>Hủy tour từ 16 – 29 ngày trước ngày khởi hành: Phí huỷ tour là 60% trên tổng giá tour.</li>
                                        <li>Hủy tour từ 08 – 15 ngày trước ngày khởi hành: Phí huỷ tour là 90% trên tổng giá tour.</li>
                                        <li>Hủy tour từ 01 – 07 ngày trước ngày khởi hành: Phí huỷ tour là 100% trên tổng giá tour.</li>
                                        <li>Các tour ngày lễ, tết là các tour có thời gian diễn ra rơi vào một trong các ngày lễ, tết theo qui định.</li>
                                      </ul>
                                      <br/>
                                      <h4><strong>Lưu ý khi chuyển/hủy tour</strong></h4>
                                      <p>Thời gian hủy chuyến du lịch được tính cho ngày làm việc, không tính Thứ Bảy, Chủ Nhật & các ngày Lễ, Tết.</p>
                                    </div>
                                    <div className="checkbox-zone">
                                      <CustomCheckbox isCheck={this.state.isAgree} onCheck={this.handleCheck.bind(this)}
                                         content={'I have read and accepted with these above terms of condition'}/>
                                      {this.state.isSubmit && !this.state.isAgree &&
                                        <div className="form-control-feedback mt-3">You haven&apos;t agreed with our terms of condition yet!</div>
                                      }
                                    </div>
                                    {this.state.error &&
                                      <p className="error">{this.state.error}</p>
                                    }
                                    <div className="confirm-zone">
                                      <button type="submit" className="co-btn" onClick={this.handleSubmit.bind(this)}>SEND REQUEST</button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            }
                          </div>
                        </div>
                    </>
                    )}
                </Popup>
            </div>
        )
    }
}
