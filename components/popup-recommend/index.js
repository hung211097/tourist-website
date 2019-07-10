import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import Popup from 'reactjs-popup'
import ApiService from 'services/api.service'
import { Link } from 'routes'
import { formatDate, distanceFromDays } from '../../services/time.service'
import { withNamespaces } from "react-i18next"
import { connect } from 'react-redux'
import { removeRecommendLocaiton, removeAllRecommendLocaiton } from '../../actions'
import { slugify } from '../../services/utils.service'

let customStyles = {
    width: '90%',
    maxWidth: '800px',
    overflow: 'auto',
    maxHeight: '560px',
    zIndex: '10000'
}

let customStyleOverlay = {
  zIndex: '10000'
}

const mapStateToProps = (state) => {
  return {
    recommendLocation: state.recommendLocation
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeRecommendLocaiton: (location) => {dispatch(removeRecommendLocaiton(location))},
    removeAllRecommendLocaiton: () => {dispatch(removeAllRecommendLocaiton())},
  }
}

class PopupRecommend extends React.Component {
    displayName = 'Popup Recommend'

    static propTypes = {
        show: PropTypes.bool,
        onClose: PropTypes.func,
        children: PropTypes.any,
        customContent: PropTypes.object,
        customOverlay: PropTypes.object,
        t: PropTypes.func,
        removeRecommendLocaiton: PropTypes.func,
        removeAllRecommendLocaiton: PropTypes.func,
        recommendLocation: PropTypes.array
    }

    constructor(props) {
        super(props)
        this.apiService = ApiService()
        this.state = {
          step: 1,
          isLoading: true,
          tour: []
        }
    }

    componentDidMount(){

    }

    handleClose() {
      this.props.onClose && this.props.onClose()
    }

    handleRemove(item){
      this.props.removeRecommendLocaiton && this.props.removeRecommendLocaiton(item)
    }

    clearAll(){
      this.props.removeAllRecommendLocaiton && this.props.removeAllRecommendLocaiton()
    }

    sendRequest(){
      this.setState({
        step: 2
      })
      this.apiService.getRecommendationTour({locations: this.props.recommendLocation}).then((res) => {
        this.setState({
          tour: res.data,
          isLoading: false
        })
      })
    }

    handleBack(){
      this.setState({
        step: 1,
        isLoading: true
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

        const { t } = this.props
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
                            <h1>{t('recommendation.title')}</h1>
                            <div className="break" />
                            <div className="nd_options_height_20"/>
                            {!this.props.recommendLocation.length &&
                              <div className="no-location">
                                <p>{t('recommendation.no_location')}</p>
                              </div>
                            }
                            {this.state.step === 1 && !!this.props.recommendLocation.length &&
                              <div className="step-location">
                                <div className="list-location">
                                  {!!this.props.recommendLocation.length && this.props.recommendLocation.map((item, key) => {
                                      return(
                                        <div className="row location" key={key}>
                                          <div className="col-sm-3">
                                            <div className="location-img">
                                              <a onClick={this.handleRemove.bind(this, item)} className="d-sm-none d-block">
                                                <i className="fas fa-times"></i>
                                              </a>
                                              <img alt="featured_img" src={item.featured_img ? item.featured_img : '/static/images/no_image.jpg'} />
                                            </div>
                                          </div>
                                          <div className="d-sm-none d-block col-12 mt-4 text-center">
                                            <img alt="featured_img" src={`/static/images/${item.type.marker}.png`} />
                                          </div>
                                          <div className="col-sm-6 name-location">
                                            <p><strong>{item.name}</strong></p>
                                            <p>{t('recommendation.address')}: {item.address}</p>
                                          </div>
                                          <div className="col-sm-2 icon d-sm-flex d-none">
                                            <img alt="featured_img" src={`/static/images/${item.type.marker}.png`} />
                                          </div>
                                          <div className="col-sm-1 remove-icon d-sm-flex d-none">
                                            <a onClick={this.handleRemove.bind(this, item)}>
                                              <i className="fas fa-times"></i>
                                            </a>
                                          </div>
                                        </div>
                                      )
                                    })
                                  }
                                </div>
                                <p className="text-right clear"><a onClick={this.clearAll.bind(this)}>{t('recommendation.clear_all')}</a></p>
                                <div className="clearfix" />
                                <button type="button" className="co-btn get" onClick={this.sendRequest.bind(this)}>{t('recommendation.get')}</button>
                              </div>
                            }
                            {this.state.step === 2 &&
                              <div className="result">
                                {this.state.isLoading &&
                                  <div className="loading-zone">
                                    <img alt="loading" src="/static/svg/searching.svg"/>
                                    <p>{t('recommendation.searching')}</p>
                                  </div>
                                }
                                {!this.state.isLoading && !this.state.tour.length &&
                                  <div className="no-result">
                                    <div className="inform">
                                      <p>
                                        <i className="far fa-frown"></i>
                                        {t('recommendation.no_result')}
                                      </p>
                                    </div>
                                    <button type="button" className="co-btn get mt-4" onClick={this.handleBack.bind(this)}>{t('recommendation.back')}</button>
                                  </div>
                                }
                                {!this.state.isLoading && !!this.state.tour.length &&
                                  <div className="step-tour">
                                    <div className="list-tour">
                                      {!!this.state.tour.length && this.state.tour.map((item, key) => {
                                          return(
                                            <div className="row tour" key={key}>
                                              <div className="col-sm-3">
                                                <div className="tour-img">
                                                  <Link route="detail-tour" params={{id: item.code, name: slugify(item.tour.name)}}>
                                                    <a onClick={this.handleClose.bind(this)}>
                                                      <img alt="featured_img" src={item.tour.featured_img ? item.tour.featured_img : '/static/images/no_image.jpg'} />
                                                    </a>
                                                  </Link>
                                                </div>
                                              </div>
                                              <div className="col-sm-9 name-tour">
                                                <h3>
                                                  <Link route="detail-tour" params={{id: item.code, name: slugify(item.tour.name)}}>
                                                    <a onClick={this.handleClose.bind(this)}>{item.tour.name}</a>
                                                  </Link>
                                                  {!!item.discount &&
                                                    <div className="d-inline">
                                                      &nbsp;&nbsp;&nbsp;
                                                      <span className="sale">{t('tours.sale')}!</span>
                                                    </div>
                                                  }
                                                </h3>
                                                <div className="row">
                                                  <div className="col-sm-6">
                                                    <p>
                                                      <i className="fa fa-barcode" aria-hidden="true"></i>
                                                      {t('checkout_confirmation.code')}:&nbsp;
                                                      <span>{item.code}</span>
                                                    </p>
                                                    {!!item.discount &&
                                                      <p>
                                                        <i className="fas fa-money-bill"></i>
                                                        {t('recommendation.origin_price')}:&nbsp;
                                                        <span>{item.original_price.toLocaleString()} VND</span>
                                                      </p>
                                                    }
                                                    <p>
                                                      <i className="fas fa-money-bill"></i>
                                                      {t('recommendation.sale_price')}:&nbsp;
                                                      <span>{item.end_price.toLocaleString()} VND</span>
                                                    </p>
                                                    <p>
                                                      <i className="fas fa-users"></i>
                                                      {t('recommendation.max_people')}:&nbsp;
                                                      <span>{item.num_max_people}</span>
                                                    </p>
                                                    <p>
                                                      <i className="fas fa-user"></i>
                                                      {t('recommendation.rest_people')}:&nbsp;
                                                      <span>{item.num_max_people - item.num_current_people}</span>
                                                    </p>
                                                  </div>
                                                  <div className="col-sm-6">
                                                    <p>
                                                      <i className="far fa-calendar-minus"></i>
                                                      {t('checkout_confirmation.start_date')}:&nbsp;
                                                      <span>{formatDate(item.start_date)}</span>
                                                    </p>
                                                    <p>
                                                      <i className="far fa-calendar-plus"></i>
                                                      {t('checkout_confirmation.end_date')}:&nbsp;
                                                      <span>{formatDate(item.end_date)}</span>
                                                    </p>
                                                    <p>
                                                      <i className="far fa-calendar-alt"></i>
                                                      {t('checkout_confirmation.lasting')}:&nbsp;
                                                      <span>{distanceFromDays(new Date(item.start_date), new Date(item.end_date)) + 1} {t('checkout_confirmation.days')}</span>
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )
                                        })
                                      }
                                    </div>
                                    <div className="clearfix" />
                                    <button type="button" className="co-btn get mt-4" onClick={this.handleBack.bind(this)}>{t('recommendation.back')}</button>
                                  </div>
                                }
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

export default withNamespaces('translation')(connect(mapStateToProps, mapDispatchToProps)(PopupRecommend))
