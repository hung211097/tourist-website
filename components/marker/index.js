import React from 'react'
import { Marker, InfoWindow } from "react-google-maps"
import PropTypes from 'prop-types'
const ENV = process.env.NODE_ENV

class MarkerComponent extends React.Component{
  static propTypes = {
    isMe: PropTypes.bool,
    infoLocation: PropTypes.object.isRequired
  }

  static defaultProps = {
    isMe: false,
    infoLocation: null
  }

  constructor(props){
    super(props)
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

  render(){
    return(
      <Marker
        position={{lat: this.props.infoLocation.latitude, lng: this.props.infoLocation.longitude}}
        onClick={this.toggleOpen.bind(this)}
        icon={this.props.isMe ? '/static/images/person.png' : null}
        animation={google.maps.Animation.DROP}
      >
      {this.state.isOpen &&
        <InfoWindow options={{ closeBoxURL: ``, enableEventPropagation: true }}>
          <div className="info-box animated fadeIn">
            <div className="info-content">
              {this.props.infoLocation.featured_img &&
                <img alt="feature_img" src={ENV === 'development' ? 'http://' + this.props.infoLocation.featured_img : this.props.infoLocation.featured_img}/>
              }
              {this.props.isMe &&
                <p>Bạn ở đây!</p>
              }
              {this.props.infoLocation.name &&
                <p>Tên địa điểm: {this.props.infoLocation.name}</p>
              }
              {this.props.infoLocation.description &&
                <p>
                  Thông tin: {this.state.isShowMore ? this.props.infoLocation.description : this.props.infoLocation.description.substring(0, this.maxDes)}
                  <a onClick={this.toggleShowMore.bind(this)}> {this.state.isShowMore ? 'Show less' : '... Show more'}</a>
                </p>
              }
              {this.props.infoLocation.address &&
                <p>Địa chỉ: {this.props.infoLocation.address}</p>
              }
            </div>
          </div>
        </InfoWindow>
      }
      </Marker>
    )
  }
}

export default MarkerComponent
