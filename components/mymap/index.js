import React from 'react'
import PropTypes from 'prop-types'
import Geocode from "react-geocode"
import { MapComponent } from 'components'
import { getLocalStorage } from '../../services/local-storage.service'
import { KEY } from '../../constants/local-storage'
import { connect } from 'react-redux'
import { toggleShowTour } from '../../actions'

const KEY_GOOGLE_MAP = process.env.KEY_GOOGLE_MAP
Geocode.setApiKey(KEY_GOOGLE_MAP);

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

class MyMap extends React.Component {
  displayName = 'Google Map'

  static defaultProps = {
    isMarkerShown: false,
    isSearchBox: false
  }

  static propTypes = {
    userLocation: PropTypes.any,
    isMarkerShown: PropTypes.bool,
    isSearchBox: PropTypes.bool,
    toggleShowTour: PropTypes.func,
    isShowTour: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.state = {
      myLocation: ''
    }
  }

  componentDidMount() {
    if(this.props.userLocation){
      Geocode.fromLatLng(this.props.userLocation.latitude, this.props.userLocation.longitude).then((result) => {
        this.setState({
          myLocation: result.results[0].formatted_address
        })
      })
    }
    else if(getLocalStorage(KEY.LOCATION)){
      const obj = JSON.parse(getLocalStorage(KEY.LOCATION))
      Geocode.fromLatLng(obj.latitude, obj.longitude).then((result) => {
        this.setState({
          myLocation: result.results[0].formatted_address
        })
      })
    }
  }

  onToggleShowTour(value){
    this.props.toggleShowTour && this.props.toggleShowTour(value)
  }

  render() {
    return (
      <div className="custom-map">
        <MapComponent
          isMarkerShown={this.props.isMarkerShown}
          isSearchBox={this.props.isSearchBox}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${KEY_GOOGLE_MAP}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          myLocation={{position: this.props.userLocation, address: this.state.myLocation}}
          toggleShowTour={this.onToggleShowTour.bind(this)}
          isShowTour={this.props.isShowTour}/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyMap)
