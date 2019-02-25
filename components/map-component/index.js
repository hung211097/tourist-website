import React from 'react'
import { compose } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps"
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox"
import _ from 'lodash'
import PropTypes from 'prop-types'
import Geocode from "react-geocode"
import {mapOption} from '../../constants/map-option'
import { MarkerComponent } from 'components'

class MapComponent extends React.Component{

  static propTypes = {
    userLocation: PropTypes.object,
    isMarkerShown: PropTypes.bool,
    isSearchBox: PropTypes.bool,
    googleMapURL: PropTypes.string,
    loadingElement: PropTypes.any,
    containerElement: PropTypes.any,
    mapElement: PropTypes.any,
    center: PropTypes.object,
    myLocation: PropTypes.object
  }

  static defaultProps = {
    center: { lat: 10.762622, lng: 106.660172 }, //Vietnam
    myLocation: null
  }

  constructor(props){
    super(props)
    this.googleMap = React.createRef()
    this.searchBox = React.createRef()
    this.state = {
      bounds: null,
      markerChoose: null,
      zoom: 6,
      address: '',
      center: this.props.center
    }
  }

  componentDidMount(){

  }

  onBoundsChanged() {
    this.setState({
      bounds: this.googleMap.current.getBounds()
    })
  }

  onClickedMap(event){
    let newLat = event.latLng.lat();
    let newLng = event.latLng.lng();
    const newCenter = this.googleMap.current.getCenter();

    Geocode.fromLatLng(newLat, newLng).then((result) => {
      const {lat, lng} = result.results[0].geometry.location;
      this.setState({
        center: {
          lat: newCenter.lat(),
          lng: newCenter.lng()
        },
        markerChoose: {
          latitude: lat,
          longitude: lng
        },
        address: result.results[0].formatted_address,
        zoom: this.googleMap.current.getZoom()
      })
    })
  }

  onPlacesChanged(){
    const places = this.searchBox.current.getPlaces();
    const bounds = new google.maps.LatLngBounds();
    // console.log("PLACE", places);
    // console.log("BOUND", bounds);
    places.forEach(place => {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport)
      } else {
        bounds.extend(place.geometry.location)
      }
    });
    const nextMarkers = places.map(place => ({position: place.geometry.location}));
    const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

    Geocode.fromLatLng(nextMarkers[0].position.lat(), nextMarkers[0].position.lng()).then((result) => {
      this.setState({address: result.results[0].formatted_address})
    })

    this.setState({
      center: nextCenter,
      markerChoose: {
        latitude: nextMarkers[0].position.lat(),
        longitude: nextMarkers[0].position.lng()
      }
    });
    // refs.map.fitBounds(bounds);
  }

  render(){
    return(
      <GoogleMap
        ref={this.googleMap}
        center={this.state.center}
        onBoundsChanged={this.onBoundsChanged.bind(this)}
        defaultZoom={this.state.zoom}
        defaultOptions={mapOption}
        onClick={this.onClickedMap.bind(this)}
      >
      {this.props.isSearchBox &&
        <SearchBox
          ref={this.searchBox}
          bounds={this.state.bounds}
          controlPosition={google.maps.ControlPosition.TOP_LEFT}
          onPlacesChanged={this.onPlacesChanged.bind(this)}>
            <input
              type="text"
              placeholder="Search location"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                marginTop: `14px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
              }}
            />
          </SearchBox>
        }
        {this.props.myLocation &&
          <MarkerComponent isMe position={this.props.myLocation.position} address={this.props.myLocation.address}/>
        }
        {this.state.markerChoose &&
          <MarkerComponent position={this.state.markerChoose} address={this.state.address}/>
        }
      </GoogleMap>
    )
  }
}

export default compose(withScriptjs, withGoogleMap)(MapComponent)
