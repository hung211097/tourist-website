import React from 'react'
import { compose } from "recompose"
import { withScriptjs, withGoogleMap, DirectionsRenderer, GoogleMap } from "react-google-maps"
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox"
import _ from 'lodash'
import PropTypes from 'prop-types'
import Geocode from "react-geocode"
import { mapOption, mapDistance } from '../../constants/map-option'
import { MarkerComponent } from 'components'
import ApiService from '../../services/api.service'
import { FaEyeSlash } from "react-icons/fa"

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
    myLocation: PropTypes.object,
    toggleShowTour: PropTypes.func,
    isShowTour: PropTypes.bool
  }

  static defaultProps = {
    center: { lat: 10.762622, lng: 106.660172 }, //Vietnam
    // center: {lat: 10.758989, lng: 106.669403},
    myLocation: null
  }

  constructor(props){
    super(props)
    this.googleMap = React.createRef()
    this.searchBox = React.createRef()
    this.traceAddedLocation = []
    this.apiService = ApiService()
    this.state = {
      bounds: null,
      markerChoose: null,
      locationNearCenter: [],
      zoom: 15,
      address: '',
      center: this.props.center,
      isChangeCenter: false,
      idTourChosen: null,
      locationsInTour: [],
      directions: null
    }
  }

  componentDidMount(){
    if(this.props.myLocation){
      const body = {
        lat: this.props.myLocation.position.latitude,
        lng: this.props.myLocation.position.longitude,
        distance: mapDistance[this.googleMap.current.getZoom().toString()]
      }
      this.apiService.getLocationsNearCenter(body, {tour: true}).then((res) => {
        this.setState({
          locationNearCenter: this.addMarker(res.data),
        })
      })
    }
  }

  addMarker(locations){
    if(!this.state.locationNearCenter.length){
      locations.forEach((item) => {
        this.traceAddedLocation[item.id] = true
        item.isInTour = false
      })
      return locations
    }
    let temp = this.state.locationNearCenter
    locations.forEach((item) => {
      if(!this.traceAddedLocation[item.id]){
        item.isInTour = false
        temp.push(item)
        this.traceAddedLocation[item.id] = true
      }
    })
    return temp
  }

  onDragEndMap(){
    this.getLocations()
  }

  onZoomChanged(){
    this.getLocations()
  }

  getLocations(){
    const body = {
      lat: this.googleMap.current.getCenter().lat(),
      lng: this.googleMap.current.getCenter().lng(),
      distance: mapDistance[this.googleMap.current.getZoom().toString()]
    }
    this.apiService.getLocationsNearCenter(body, {tour: true}).then((res) => {
      this.setState({
        locationNearCenter: this.addMarker(res.data),
        isChangeCenter: true,
        center: this.googleMap.current.getCenter()
      })
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
      },
      isChangeCenter: true
    });
    // refs.map.fitBounds(bounds);
  }

  onDrawDirection(routes, idTour){
    if(!this.state.idTourChosen || this.state.idTourChosen != idTour){  //Xét tồn tại tour đã chọn chưa hoặc chọn hiển thị tour khác
      if(!this.state.idTourChosen){
        this.changeTourToDisplay(routes, idTour)
      }
      else{
        let temp = this.state.locationNearCenter
        this.state.locationsInTour.forEach((item) => {
          let tempItem = temp.find((filterItem) => {
            return item.location.id === filterItem.id
          })
          if(tempItem){
            tempItem.isInTour = false
          }
        })
        this.setState({
          locationNearCenter: temp
        }, () => {
          this.changeTourToDisplay(routes, idTour)
        })
      }
    }
    else{
      this.resetMarker()
    }
  }

  changeTourToDisplay(routes, idTour){
    let temp = this.state.locationNearCenter
    routes.forEach((item) => {
      let tempItem = temp.find((filterItem) => {
        return item.location.id === filterItem.id
      })
      if(tempItem){
        tempItem.isInTour = true
      }
      else{
        let addItem = item.location
        addItem.isInTour = true
        temp.push(addItem)
        this.traceAddedLocation[addItem.id] = true
      }
    })
    const DirectionsService = new google.maps.DirectionsService();
    let request = {}
    routes.forEach((item, i) => {
      if (i == 0) request.origin = new google.maps.LatLng(item.location.latitude, item.location.longitude);
      else if (i == routes.length - 1) request.destination = new google.maps.LatLng(item.location.latitude, item.location.longitude);
      else {
        if (!request.waypoints) request.waypoints = [];
        request.waypoints.push({
          location:  new google.maps.LatLng(item.location.latitude, item.location.longitude),
          stopover: true
        });
      }
    })
    request.travelMode = google.maps.TravelMode.DRIVING
    request.optimizeWaypoints = true
    DirectionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setState({
          directions: result,
          locationsInTour: routes,
          locationNearCenter: temp,
          idTourChosen: idTour
        });
      }
    })
  }

  resetMarker(){
    let temp = this.state.locationNearCenter
    this.state.locationsInTour.forEach((item) => {
      let tempItem = temp.find((filterItem) => {
        return item.location.id === filterItem.id
      })
      if(tempItem){
        tempItem.isInTour = false
      }

      this.setState({
        locationsInTour: [],
        locationNearCenter: temp,
        idTourChosen: null,
        directions: null
      })
    })
  }

  onToggleShowTour(){
    this.props.toggleShowTour && this.props.toggleShowTour(false)
    this.resetMarker()
  }

  render(){
    return(
      <div className="map-content">
        <GoogleMap
          ref={this.googleMap}
          center={this.props.myLocation && !this.state.isChangeCenter ?
            {lat: this.props.myLocation.position.latitude, lng: this.props.myLocation.position.longitude}
            : this.state.center}
            defaultZoom={this.state.zoom}
            defaultOptions={mapOption}
            onClick={this.onClickedMap.bind(this)}
            onDragEnd={this.onDragEndMap.bind(this)}
            onZoomChanged={this.onZoomChanged.bind(this)}>
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
              <MarkerComponent
                isMe
                infoLocation={{
                  latitude: this.props.myLocation.position.latitude,
                  longitude: this.props.myLocation.position.longitude,
                  address: this.props.myLocation.address}}/>
              }
              {this.state.markerChoose &&
                <MarkerComponent
                  infoLocation={{
                    latitude: this.state.markerChoose.latitude,
                    longitude: this.state.markerChoose.longitude,
                    address: this.state.address}}/>
                }
                {this.state.locationNearCenter.length && this.state.locationNearCenter.map((item) => {
                  return(
                    <MarkerComponent infoLocation={item} key={item.id}
                      onDrawDirection={this.onDrawDirection.bind(this)}
                      tourChosen={this.state.idTourChosen}/>
                  )
                })
              }
              {this.state.directions && <DirectionsRenderer directions={this.state.directions} options={{suppressMarkers: true}}/>}
            </GoogleMap>
            {this.props.isShowTour &&
              <a className="hide-tour" title="Hide tour's direction on map" onClick={this.onToggleShowTour.bind(this)}>
                <FaEyeSlash style={{fontSize: '20px'}}/>
              </a>
            }
      </div>
    )
  }
}

export default compose(withScriptjs, withGoogleMap)(MapComponent)
