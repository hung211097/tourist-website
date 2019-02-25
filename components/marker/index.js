import React from 'react'
import { Marker, InfoWindow } from "react-google-maps"
import PropTypes from 'prop-types'

class MarkerComponent extends React.Component{
  static propTypes = {
    position: PropTypes.object.isRequired,
    isMe: PropTypes.bool,
    address: PropTypes.string
  }

  static defaultProps = {
    isMe: false,
    address: ''
  }

  constructor(props){
    super(props)
    this.state = {
      isOpen: false
    }
  }

  componentDidMount(){
  }

  toggleOpen(){
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render(){
    return(
      <Marker
        position={{lat: this.props.position.latitude, lng: this.props.position.longitude}}
        onClick={this.toggleOpen.bind(this)}
        icon={this.props.isMe ? '/static/images/person.png' : null}
        animation={google.maps.Animation.DROP}
      >
      {this.state.isOpen &&
        <InfoWindow options={{ closeBoxURL: ``, enableEventPropagation: true }}>
          <div className="info-box animated fadeIn">
            <div className="info-content">
              <img alt="feature_img" src="/static/images/japan.jpg"/>
              {this.props.isMe &&
                <p>You are here!</p>
              }
              <p>{this.props.address}</p>
            </div>
          </div>
        </InfoWindow>
      }
      </Marker>
    )
  }
}

export default MarkerComponent
