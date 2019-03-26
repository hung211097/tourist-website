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
        circle: PropTypes.bool,
        onClose: PropTypes.func,
        children: PropTypes.any,
        customContent: PropTypes.object,
        customOverlay: PropTypes.object,
        tour: PropTypes.any
    }

    constructor(props) {
        super(props)
        this.apiService = ApiService()
        this.state = {
          isSend: false,
          reason: '',
          isAgree: false,
          isSubmit: false,
          tourInfo: null
        }
    }

    componentDidMount(){
      this.apiService.getToursTurnId(this.props.tour.fk_tour_turn).then((res) => {
        this.setState({
          tourInfo: res.data
        })
      })
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

      this.setState({
        isSend: true
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
                                      <p>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                        Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s
                                         when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five
                                         centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                                         with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like
                                         Aldus PageMaker including versions of Lorem Ipsum.
                                        <br/>
                                        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                                        The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
                                        &apos;Content here, content here&apos;, making it look like readable English. Many desktop publishing packages and web page editors
                                        now use Lorem Ipsum as their default model text, and a search for &apos;lorem ipsum&apos; will uncover many web sites still in their
                                        infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
                                      </p>
                                    </div>
                                    <div className="checkbox-zone">
                                      <CustomCheckbox isCheck={this.state.isAgree} onCheck={this.handleCheck.bind(this)}
                                         content={'I have read and accepted with these above terms of condition'}/>
                                      {this.state.isSubmit && !this.state.isAgree &&
                                        <div className="form-control-feedback mt-3">You haven&apos;t agreed with our terms of condition yet!</div>
                                      }
                                    </div>
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
