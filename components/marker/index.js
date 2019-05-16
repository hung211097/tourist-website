import React from 'react'
import { Marker, InfoWindow } from "react-google-maps"
import PropTypes from 'prop-types'
import { FaEye, FaEyeSlash, FaPlusCircle } from "react-icons/fa"
import ApiService from '../../services/api.service'
import { connect } from 'react-redux'
import { toggleShowTour, addRecommendLocaiton } from '../../actions'
import { Link } from 'routes'
import { slugify } from '../../services/utils.service'

const mapStateToProps = (state, props) => {
  let isInSuitcase = false
  let temp = state.recommendLocation.find((item) => {
    return item.id === props.infoLocation.id && !props.isMe
  })
  if(temp){
    isInSuitcase = true
  }
  return {
    isShowTour: state.isShowTour,
    isInSuitcase
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleShowTour: (isShow) => {dispatch(toggleShowTour(isShow))},
    addRecommendLocaiton: (location) => {dispatch(addRecommendLocaiton(location))}
  }
}

class MarkerComponent extends React.Component{
  static propTypes = {
    isMe: PropTypes.bool,
    infoLocation: PropTypes.object.isRequired,
    onDrawDirection: PropTypes.func,
    tourChosen: PropTypes.number, //id tour được chọn
    toggleShowTour: PropTypes.func,
    isShowTour: PropTypes.bool,
    isSetTour: PropTypes.bool,
    t: PropTypes.func,
    isInSuitcase: PropTypes.bool,
    addRecommendLocaiton: PropTypes.func
  }

  static defaultProps = {
    isMe: false,
    infoLocation: null,
    isSetTour: false
  }

  constructor(props){
    super(props)
    this.apiService = ApiService()
    this.maxDes = 100
    this.state = {
      isOpen: false,
      isShowMore: false
    }
  }

  componentDidMount(){
  }

  toggleOpen(){
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  toggleShowMore(){
    this.setState({
      isShowMore: !this.state.isShowMore
    })
  }

  onShowRoute(id){
    if(this.props.toggleShowTour){
      if(this.props.tourChosen === id){
        this.props.toggleShowTour(false)
      }
      else{
        this.props.toggleShowTour(true)
      }
    }
    this.setState({
      isOpen: false
    })
    this.apiService.getRouteByTour(id).then((res) => {
      this.props.onDrawDirection(res.data, id, null, true);
    })
  }

  handlePutInSuitcase(){
    this.props.addRecommendLocaiton && this.props.addRecommendLocaiton(this.props.infoLocation)
  }

  render(){
    const {t} = this.props
    if(this.props.isSetTour && !this.props.infoLocation.isInTour){
      return null
    }
    return(
      <Marker
        position={{lat: +this.props.infoLocation.latitude, lng: +this.props.infoLocation.longitude}}
        onClick={this.toggleOpen.bind(this)}
        icon={this.props.isMe ? '/static/images/person.png' :
          this.props.infoLocation.isInTour && !this.props.infoLocation.isPass ? {url: '/static/images/location.png', labelOrigin: new google.maps.Point(20, 17)} :
          this.props.infoLocation.isInTour && this.props.infoLocation.isPass ? {url: '/static/images/pass.png', labelOrigin: new google.maps.Point(20, 17)} :
          this.props.infoLocation.type ? `/static/images/${this.props.infoLocation.type.marker}.png` : null}
        animation={this.props.isMe ? null : google.maps.Animation.DROP}
        label={this.props.infoLocation.isInTour && this.props.infoLocation.order.indexOf(',') < 0 ?
                {color: "black", text: this.props.infoLocation.order, fontWeight: '600'} :
                this.props.infoLocation.isInTour && this.props.infoLocation.order.indexOf(',') >= 0 ?
                {color: "black", text: '...', fontWeight: '700'} : null}
        title={this.props.infoLocation.isInTour && this.props.infoLocation.order.indexOf(',') >= 0 ? 'Click for more information' : null}
      >
      {this.state.isOpen &&
        <InfoWindow options={{ closeBoxURL: ``, enableEventPropagation: true }}>
          <div className="info-box animated fadeIn">
            <div className="info-content">
              {this.props.infoLocation.featured_img &&
                <img alt="feature_img" src={this.props.infoLocation.featured_img}/>
              }
              {this.props.isMe &&
                <p className="bold">{t('marker.here')}</p>
              }
              {this.props.infoLocation.name &&
                <p><span className="bold">{t('marker.location')}:</span> {this.props.infoLocation.name}</p>
              }
              {this.props.infoLocation.description &&
                <p>
                  <span className="bold">{t('marker.description')}: </span>
                    {this.state.isShowMore ? this.props.infoLocation.description :
                      this.props.infoLocation.description.substring(0, this.maxDes)}
                  <a onClick={this.toggleShowMore.bind(this)}> {this.state.isShowMore ? t('marker.show_less') : '... ' + t('marker.show_more')}</a>
                </p>
              }
              {this.props.infoLocation.address &&
                <p><span className="bold">{t('marker.address')}: </span> {this.props.infoLocation.address}</p>
              }
              {this.props.infoLocation.tours && !!this.props.infoLocation.tours.length && !this.props.isSetTour &&
                <div>
                  <p className="bold">{t('marker.tour_pass')}: </p>
                  <ol className="tour-list">
                    {this.props.infoLocation.tours.map((item) => {
                        return(
                          <li className="tour-item" key={item.id}>
                            {item.tour_turns ?
                              <Link route="detail-tour" params={{id: item.tour_turns.code, name: slugify(item.name)}}>
                                <a>{item.name}</a>
                              </Link>
                              :
                              <a>{item.name}</a>
                            }
                            &nbsp;&nbsp;&nbsp;
                            <a className="display-tour" onClick={this.onShowRoute.bind(this, item.id)} title="Display tour on the map">
                              {this.props.tourChosen && this.props.tourChosen === item.id && this.props.isShowTour ?
                                <FaEyeSlash style={{fontSize: '19px'}}/>
                                :
                                <FaEye style={{fontSize: '19px'}}/>
                              }
                            </a>
                          </li>
                        )
                      })
                    }
                  </ol>
                </div>
              }
              {this.props.infoLocation.isInTour && this.props.infoLocation.order.indexOf(',') >= 0 &&
                <p><span className="bold">{t('marker.order')}: </span> {this.props.infoLocation.order}</p>
              }
              {!this.props.isInSuitcase && !this.props.isMe &&
                <a onClick={this.handlePutInSuitcase.bind(this)} className="put-into" title="Add this location">
                  <span><i><FaPlusCircle /></i> {t('marker.put')}</span>
                </a>
              }
            </div>
          </div>
        </InfoWindow>
      }
      </Marker>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MarkerComponent)
