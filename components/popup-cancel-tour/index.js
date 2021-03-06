import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import Popup from 'reactjs-popup'
import ApiService from 'services/api.service'
import { CustomCheckbox } from 'components'
import { withNamespaces } from "react-i18next"
import { formatDate } from '../../services/time.service'
import { Link } from 'routes'
import { caculateRefund, slugify } from '../../services/utils.service'
import {UnmountClosed} from 'react-collapse'

let customStyles = {
    width: '90%',
    maxWidth: '800px',
    overflow: 'auto',
    maxHeight: '560px',
    zIndex: '999'
}

let customStyleOverlay = {

}

class PopupCancelTour extends React.Component {
    displayName = 'Popup Cancel Tour'

    static propTypes = {
        show: PropTypes.bool,
        onClose: PropTypes.func,
        children: PropTypes.any,
        customContent: PropTypes.object,
        customOverlay: PropTypes.object,
        changeStatus: PropTypes.func,
        tour: PropTypes.any,
        t: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.apiService = ApiService()
        this.state = {
          isSend: false,
          reason: '',
          reasonOpt: '',
          isAgree: false,
          isSubmit: false,
          tourInfo: null,
          isShow: false,
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

    handleToggleTerm(){
      this.setState({
        isShow: !this.state.isShow
      })
    }

    handleChangeReasonOpt(e){
      this.setState({
        reasonOpt: e.target.value,
        reason: e.target.value === 'other' ? '' : e.target.value
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

      this.apiService.cancelTour({
        idBookTour: this.props.tour.id,
        request_message: this.state.reason
      }).then((res) => {
        this.props.changeStatus && this.props.changeStatus(this.props.tour.id, res.data.status, res.data.isCancelBooking)
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
        const { t, tour } = this.props
        const tourInfo = tour.tour_turn

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
                            <h1>{t('cancel_tour.title')}</h1>
                            <div className="break" />
                            {this.state.isSend ?
                              <div className="result">
                                <h3>{t('cancel_tour.success')}</h3>
                                <p className="mb-3">{t('cancel_tour.reply')}</p>
                                <p className="thank">{t('cancel_tour.thank')}</p>
                              </div>
                              :
                              <div>
                                <div className="tour-info">
                                  <h3>{t('cancel_tour.tour_info')}: </h3>
                                  <div className="nd_options_section nd_options_line_height_0 underline-zone">
                                    <span className="underline"></span>
                                  </div>
                                  {tourInfo &&
                                    <div className="mt-3">
                                      <Link route="detail-tour" params={{id: tourInfo.code, name: slugify(tourInfo.tour.name)}}>
                                        <a className="tour-name">{tourInfo.tour.name}</a>
                                      </Link>
                                      <div className="row">
                                        <div className="col-sm-6">
                                          <ul>
                                            <li>{t('cancel_tour.start_date')}: <strong>{formatDate(tourInfo.start_date)}</strong></li>
                                            <li>{t('cancel_tour.book_at')}: <strong>{formatDate(tour.book_time, 'dd/MM/yyyy HH:mm')}</strong></li>
                                            <li>{t('cancel_tour.num_people')}: <strong>{tour.num_passenger}</strong></li>
                                          </ul>
                                        </div>
                                        <div className="col-sm-6">
                                          <ul>
                                            <li>{t('cancel_tour.total_money')}: <strong>{tour.total_pay.toLocaleString()} VND</strong></li>
                                            {tour.status === 'paid' &&
                                              <li>{t('cancel_tour.refund_money')}: &nbsp;
                                                <strong>{caculateRefund(tour.total_pay, tourInfo.start_date, tourInfo.isHoliday).toLocaleString()} VND</strong>
                                              </li>
                                            }
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  }
                                </div>
                                <form onSubmit={this.handleSubmit.bind(this)}>
                                  <div className="reason">
                                    <div className="nd_options_height_20"/>
                                      <div className="form-group has-danger">
                                        <label className="form-control-label">{t('cancel_tour.reason')}:</label>
                                        <div className="nd_options_section nd_options_line_height_0 underline-zone">
                                          <span className="underline"></span>
                                        </div>
                                        <div className="nd_options_height_10"/>
                                         <div className="input-group">
                                           <label>
                                             <input type="radio" checked={this.state.reasonOpt === 'busy'} value={'busy'}
                                               onChange={this.handleChangeReasonOpt.bind(this)} name="reason"/>
                                             <span> {t('cancel_tour.busy')}</span>
                                           </label>
                                         </div>
                                         <div className="input-group">
                                           <label>
                                             <input type="radio" checked={this.state.reasonOpt === 'sick'} value={'sick'}
                                               onChange={this.handleChangeReasonOpt.bind(this)} name="reason"/>
                                             <span> {t('cancel_tour.sick')}</span>
                                           </label>
                                         </div>
                                         <div className="input-group">
                                           <label>
                                             <input type="radio" checked={this.state.reasonOpt === 'other'} value={'other'}
                                               onChange={this.handleChangeReasonOpt.bind(this)} name="reason"/>
                                             <span> {t('cancel_tour.other')}</span>
                                           </label>
                                         </div>
                                         {this.state.reasonOpt === 'other' &&
                                           <textarea id="reason" className={this.state.isSubmit && !this.state.reason ?
                                               "form-control form-control-danger active" : "form-control"}
                                               rows="2" value={this.state.reason} onChange={this.handleChangeReason.bind(this)}></textarea>
                                         }
                                         {this.state.isSubmit && !this.state.reason &&
                                           <div className="form-control-feedback mt-3">{t('cancel_tour.reason_required')}</div>
                                         }
                                      </div>
                                  </div>

                                  <div className="condition">
                                    <a onClick={this.handleToggleTerm.bind(this)}><h3>{t('cancel_tour.terms')} &nbsp;<i className="fas fa-chevron-down"></i> </h3></a>
                                    {/*<div className="nd_options_section nd_options_line_height_0 underline-zone">
                                      <span className="underline"></span>
                                    </div>*/}
                                    <UnmountClosed isOpened={this.state.isShow} springConfig={{stiffness: 150, damping: 20}}>
                                      <div className="collapse-content">
                                        <div className="condition-content">
                                          <h3>{t('cancel_tour.domestic')}</h3>
                                          <h4><strong>{t('cancel_tour.domestic_week_day')}</strong></h4>
                                          <ul>
                                            <li>{t('cancel_tour.domestic_week_day_1')}</li>
                                            <li>{t('cancel_tour.domestic_week_day_2')}</li>
                                            <li>{t('cancel_tour.domestic_week_day_3')}</li>
                                            <li>{t('cancel_tour.domestic_week_day_4')}</li>
                                            <li>{t('cancel_tour.domestic_week_day_5')}</li>
                                            <li>{t('cancel_tour.domestic_week_day_6')}</li>
                                          </ul>
                                          <br/>
                                          <h4><strong>{t('cancel_tour.domestic_holiday')}</strong></h4>
                                          <ul>
                                            <li>{t('cancel_tour.domestic_holiday_1')}</li>
                                            <li>{t('cancel_tour.domestic_holiday_2')}</li>
                                            <li>{t('cancel_tour.domestic_holiday_3')}</li>
                                            <li>{t('cancel_tour.domestic_holiday_4')}</li>
                                            <li>{t('cancel_tour.domestic_holiday_5')}</li>
                                            <li>{t('cancel_tour.domestic_holiday_6')}</li>
                                          </ul>
                                          <br/>
                                          <h4><strong>{t('cancel_tour.note')}</strong></h4>
                                          <p>{t('cancel_tour.note_content')}</p>
                                          <br/>
                                          {/*<h3>{t('cancel_tour.foreign')}</h3>
                                          <h4><strong>{t('cancel_tour.foreign_week_day')}</strong></h4>
                                          <ul>
                                            <li>{t('cancel_tour.foreign_week_day_1')}</li>
                                            <li>{t('cancel_tour.foreign_week_day_2')}</li>
                                            <li>{t('cancel_tour.foreign_week_day_3')}</li>
                                            <li>{t('cancel_tour.foreign_week_day_4')}</li>
                                            <li>{t('cancel_tour.foreign_week_day_5')}</li>
                                            <li>{t('cancel_tour.foreign_week_day_6')}.</li>
                                            <li>{t('cancel_tour.foreign_week_day_7')}</li>
                                            <li>{t('cancel_tour.foreign_week_day_8')}</li>
                                          </ul>
                                          <br/>
                                          <h4><strong>{t('cancel_tour.foreign_holiday')}</strong></h4>
                                          <ul>
                                            <li>{t('cancel_tour.foreign_holiday_1')}</li>
                                            <li>{t('cancel_tour.foreign_holiday_2')}</li>
                                            <li>{t('cancel_tour.foreign_holiday_3')}</li>
                                            <li>{t('cancel_tour.foreign_holiday_4')}</li>
                                            <li>{t('cancel_tour.foreign_holiday_5')}</li>
                                            <li>{t('cancel_tour.foreign_holiday_6')}</li>
                                          </ul>
                                          <br/>
                                          <h4><strong>{t('cancel_tour.note')}</strong></h4>
                                          <p>{t('cancel_tour.note_content')}</p>*/}
                                        </div>
                                      </div>
                                    </UnmountClosed>
                                    <div className="checkbox-zone">
                                      <CustomCheckbox isCheck={this.state.isAgree} onCheck={this.handleCheck.bind(this)}
                                         content={t('cancel_tour.have_read')}/>
                                      {this.state.isSubmit && !this.state.isAgree &&
                                        <div className="form-control-feedback mt-3">{t('cancel_tour.not_agree')}</div>
                                      }
                                    </div>
                                    {this.state.error &&
                                      <p className="error">{t('cancel_tour.' + this.state.error)}</p>
                                    }
                                    <div className="confirm-zone">
                                      <button type="submit" className="co-btn" onClick={this.handleSubmit.bind(this)}>{t('cancel_tour.send')}</button>
                                      <button type="button" className="co-btn close-btn" onClick={this.handleClose.bind(this)}>{t('cancel_tour.close')}</button>
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

export default withNamespaces('translation')(PopupCancelTour)
