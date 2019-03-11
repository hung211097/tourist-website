import React from 'react'
import { Marker, InfoWindow } from "react-google-maps"
import PropTypes from 'prop-types'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import ApiService from '../../services/api.service'
import { connect } from 'react-redux'
import { toggleShowTour } from '../../actions'

const mapStateToProps = (state) => {
  return {
    isShowTour: state.isShowTour
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleShowTour: (isShow) => {dispatch(toggleShowTour(isShow))}
  }
}

class MarkerComponent extends React.Component{
  static propTypes = {
    isMe: PropTypes.bool,
    infoLocation: PropTypes.object.isRequired,
    onDrawDirection: PropTypes.func,
    tourChosen: PropTypes.number,
    toggleShowTour: PropTypes.func,
    isShowTour: PropTypes.bool
  }

  static defaultProps = {
    isMe: false,
    infoLocation: null
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
      this.props.onDrawDirection(res.data, id);
    })
  }

  render(){
    return(
      <Marker
        position={{lat: this.props.infoLocation.latitude, lng: this.props.infoLocation.longitude}}
        onClick={this.toggleOpen.bind(this)}
        icon={this.props.isMe ? '/static/images/person.png' :
          this.props.infoLocation.isInTour ? {url: '/static/images/location.png', labelOrigin: new google.maps.Point(20, 16)} :
          this.props.infoLocation.type ? `static/images/${this.props.infoLocation.type.marker}.png` : null}
        animation={google.maps.Animation.DROP}
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
                <p className="bold">You are here!</p>
              }
              {this.props.infoLocation.name &&
                <p><span className="bold">Location:</span> {this.props.infoLocation.name}</p>
              }
              {this.props.infoLocation.description &&
                <p>
                  <span className="bold">Description: </span> {this.state.isShowMore ? this.props.infoLocation.description : this.props.infoLocation.description.substring(0, this.maxDes)}
                  <a onClick={this.toggleShowMore.bind(this)}> {this.state.isShowMore ? 'Show less' : '... Show more'}</a>
                </p>
              }
              {this.props.infoLocation.address &&
                <p><span className="bold">Address: </span> {this.props.infoLocation.address}</p>
              }
              {this.props.infoLocation.tours && !!this.props.infoLocation.tours.length &&
                <div>
                  <p className="bold">Some tours pass over: </p>
                  <ol className="tour-list">
                    {this.props.infoLocation.tours.map((item) => {
                        return(
                          <li className="tour-item" key={item.id}>
                            <a>{item.name}</a>&nbsp;&nbsp;&nbsp;
                            <a className="display-tour" onClick={this.onShowRoute.bind(this, item.id)}>
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
                <p><span className="bold">Numerical of order: </span> {this.props.infoLocation.order}</p>
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
