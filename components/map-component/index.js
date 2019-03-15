import React from 'react'
import { compose } from "recompose"
import styles from './index.scss'
import { withScriptjs, withGoogleMap, DirectionsRenderer, GoogleMap, Polyline } from "react-google-maps"
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox"
import _ from 'lodash'
import PropTypes from 'prop-types'
import Geocode from "react-geocode"
import { mapOption, mapDistance, filter, transports } from '../../constants/map-option'
import { MarkerComponent } from 'components'
import ApiService from '../../services/api.service'
import { FaEyeSlash, FaFilter } from "react-icons/fa"
import { PopupInfo, CustomCheckbox } from 'components'
import { getAirportPoint } from '../../services/utils.service'

const customStyles = {
    width: '90%',
    maxWidth: '800px',
    maxHeight: '500px',
    overflow: 'auto'
}

class MapComponent extends React.Component{

  static propTypes = {
    isMarkerShown: PropTypes.bool,
    isSearchBox: PropTypes.bool,
    googleMapURL: PropTypes.string,
    loadingElement: PropTypes.any,
    containerElement: PropTypes.any,
    mapElement: PropTypes.any,
    center: PropTypes.object,
    myLocation: PropTypes.object,
    toggleShowTour: PropTypes.func,
    isShowTour: PropTypes.bool,
    isSetTour: PropTypes.bool,
    idTourSet: PropTypes.number,
  }

  static defaultProps = {
    center: { lat: 10.762622, lng: 106.660172 }, //Vietnam
    // center: {lat: 10.758989, lng: 106.669403},
    myLocation: null,
    isSetTour: false
  }

  constructor(props){
    super(props)
    this.googleMap = React.createRef()
    this.searchBox = React.createRef()
    this.traceAddedLocation = []  //Đánh dấu các điểm có trên map sẽ ko add render lại
    this.filterOptions = filter
    this.apiService = ApiService()
    this.state = {
      bounds: null,
      markerChoose: null, //Điểm marker click trên map
      locationNearCenter: [],
      zoom: 15,
      address: '',
      center: this.props.center,
      isChangeCenter: false,
      idTourChosen: null,
      locationsInTour: [],
      directions: [],
      showFilter: false,
      filterOptions: [],
      airport: []
    }
  }

  componentDidMount(){
    this.filterOptions.forEach((item) => {
      item.isCheck = false
    })
    if(this.props.myLocation && this.props.myLocation.position){
      const body = {
        lat: this.props.myLocation.position.latitude,
        lng: this.props.myLocation.position.longitude,
        distance: mapDistance[this.googleMap.current.getZoom().toString()]
      }
      this.apiService.getLocationsNearCenter(body, {tour: true}).then((res) => {
        this.setState({
          locationNearCenter: this.addMarker(res.data)
        })
      })
    }
    else{
      this.setState({
        zoom: this.props.isSetTour ? 14 : 9
      }, () => {
        const body = {
          lat: this.props.center.lat,
          lng: this.props.center.lng,
          distance: mapDistance[this.googleMap.current.getZoom().toString()]
        }
        this.apiService.getLocationsNearCenter(body, {tour: true}).then((res) => {
          this.setState({
            locationNearCenter: this.addMarker(res.data)
          })
        })
      })
    }
    if(this.props.isSetTour && this.props.idTourSet){
      this.apiService.getRouteByTour(this.props.idTourSet).then((res) => {
        this.onDrawDirection(res.data, this.props.idTourSet)
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
      if(!this.state.idTourChosen){ //Chưa chọn tour nào để hiển thị
        this.changeTourToDisplay(routes, idTour)
      }
      else{
        let temp = this.state.locationNearCenter
        this.state.locationsInTour.forEach((item) => { //Tắt những marker trong tour cũ đã hiển thị
          let tempItem = temp.find((filterItem) => {
            return item.location.id === filterItem.id
          })
          if(tempItem){
            tempItem.isInTour = false
            tempItem.order = null
          }
        })
        this.setState({
          locationNearCenter: temp,
          directions: [],
          airport: []
        }, () => {
          this.changeTourToDisplay(routes, idTour)
        })
      }
    }
    else{ //Tắt hiển thị
      this.resetMarker()
    }
  }

  changeTourToDisplay(routes, idTour){
    let temp = this.state.locationNearCenter
    routes.forEach((item, key) => {
      let tempItem = temp.find((filterItem) => {
        return item.location.id === filterItem.id
      })
      if(tempItem){
        tempItem.isInTour = true
        if(tempItem.order){
          tempItem.order = tempItem.order + ', ' + (key + 1).toString()
        }
        else{
          tempItem.order = (key + 1).toString()
        }
      }
      else{
        let addItem = item.location
        addItem.isInTour = true
        addItem.order = (key + 1).toString()
        temp.push(addItem)
        this.traceAddedLocation[addItem.id] = true
      }
    })
    this.setState({
      locationsInTour: routes,
      locationNearCenter: temp,
      idTourChosen: idTour
    }, () => {
      let airport = getAirportPoint(routes)
      if(!airport.length){  //Nếu không xuất hiện các điểm sân bay thì vẽ đường đi bằng xe bình thường
        this.setDirections(routes)
      }
      else{   //Nếu có xuất hiện các điểm sân bay thì tách các đoạn đi bằng xe ra vẽ riêng, đi bằng đường hàng không vẽ riêng
        let directionRoutes = []
        let tempPoint = []
        routes.forEach((item) => {
          if(item.transport.name_en === transports.AIRWAY){
            directionRoutes.push(tempPoint)
            tempPoint = []
          }
          else{
            tempPoint.push(item)
          }
        })
        directionRoutes.forEach(item => {
          this.setDirections(item)
        })
        this.setState({
          airport: airport
        })
      }
    })
  }

  setDirections(routes){
    const DirectionsService = new google.maps.DirectionsService();
    let maximumWaypoints = 22 //actually is 23, index from 0
    if(routes.length <= maximumWaypoints + 1){  //Số điểm trung gian ít hơn 23 (giới hạn api google map)
      let request = {}
      routes.forEach((item, i) => {
        if (i == 0) request.origin = new google.maps.LatLng(item.location.latitude, item.location.longitude);
        else if (i == routes.length - 1) request.destination = new google.maps.LatLng(item.location.latitude, item.location.longitude);
        else {
          if (!request.waypoints) request.waypoints = [];
          if(routes[i].location.id != 72){
            request.waypoints.push({
              location:  new google.maps.LatLng(routes[i].location.latitude, routes[i].location.longitude),
              stopover: true
            });
          }
        }
      })
      request.travelMode = google.maps.TravelMode.DRIVING
      // request.optimizeWaypoints = true
      DirectionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: [...this.state.directions, result]
          });
        }
      })
    }
    else{
      let numRequests = parseInt(routes.length / (maximumWaypoints + 1))
      if(routes.length % maximumWaypoints !== 0){
        numRequests = numRequests + 1
      }
      for(let i = 0; i < numRequests; i++){
        let request = {}
        request.travelMode = google.maps.TravelMode.DRIVING
        for(let j = maximumWaypoints * i; j <= maximumWaypoints * (i + 1) && j < routes.length; j++){
          if (j == maximumWaypoints * i){
            request.origin = new google.maps.LatLng(routes[j].location.latitude, routes[j].location.longitude);
          }
          else if (j == maximumWaypoints * (i + 1) || j == routes.length - 1){
            request.destination = new google.maps.LatLng(routes[j].location.latitude, routes[j].location.longitude);
          }
          else {
            if (!request.waypoints) request.waypoints = [];
            if(routes[j].location.id != 72){
              request.waypoints.push({
                location:  new google.maps.LatLng(routes[j].location.latitude, routes[j].location.longitude),
                stopover: true
              });
            }
          }
        }
        DirectionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.setState({
              directions: [...this.state.directions, result]
            });
          }
        })
      }
    }
  }

  resetMarker(){
    let temp = this.state.locationNearCenter
    this.state.locationsInTour.forEach((item) => {
      let tempItem = temp.find((filterItem) => {
        return item.location.id === filterItem.id
      })
      if(tempItem){
        tempItem.isInTour = false
        tempItem.order = null
      }

      this.setState({
        locationsInTour: [],
        locationNearCenter: temp,
        idTourChosen: null,
        directions: [],
        airport: []
      })
    })
  }

  onToggleShowTour(){
    this.props.toggleShowTour && this.props.toggleShowTour(false)
    this.resetMarker()
  }

  onFilterTour(){
    this.setState({
      showFilter: true
    })
  }

  handleClose(){
    this.setState({
      showFilter: false
    })
  }

  handleCheck(value, isCheck){
    if(isCheck){
      this.setState({
        filterOptions: [...this.state.filterOptions, value]
      })
      let temp = this.filterOptions.find((item) => {return item.value === value})
      temp.isCheck = true
    }
    else{
      this.setState({
        filterOptions: this.state.filterOptions.filter((item) => {return item !== value})
      })
      let temp = this.filterOptions.find((item) => {return item.value === value})
      temp.isCheck = false
    }
  }

  handleShowAll(){
    this.filterOptions.forEach((item) => {
      item.isCheck = false
    })
    this.setState({
      filterOptions: [],
      showFilter: false
    })
  }

  render(){
    // console.log(styles);
    return(
      <div className="map-content">
        <style jsx>{styles}</style>
        <GoogleMap
          ref={this.googleMap}
          defaultZoom={15}
          center={this.props.myLocation && this.props.myLocation.position && !this.state.isChangeCenter ?
            {lat: this.props.myLocation.position.latitude, lng: this.props.myLocation.position.longitude}
            : this.state.center}
            zoom={this.state.zoom}
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
                  className="search-box-map"
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
            {this.props.myLocation && this.props.myLocation.position &&
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
            {!!this.state.locationNearCenter.length && this.state.locationNearCenter.map((item) => {
                if(!this.state.filterOptions.length){
                  return(
                    <MarkerComponent infoLocation={item} key={item.id}
                      onDrawDirection={this.onDrawDirection.bind(this)}
                      tourChosen={this.state.idTourChosen} isSetTour={this.props.isSetTour}/>
                  )
                }
                let temp = this.state.filterOptions.find((findItem) => {return findItem === item.type.marker})
                if(temp || item.isInTour === true){
                  return(
                    <MarkerComponent infoLocation={item} key={item.id}
                      onDrawDirection={this.onDrawDirection.bind(this)}
                      tourChosen={this.state.idTourChosen} isSetTour={this.props.isSetTour}/>
                  )
                }
                return null
              })
            }
            {!!this.state.directions.length && this.state.directions.map((item, key) => {
                return(
                  <DirectionsRenderer directions={item} key={key} options={{
                      suppressMarkers: true,
                    }} />
                )
              })
            }
            {!!this.state.airport.length && this.state.airport.map((item, key) => {
                let temp = []
                item.forEach(place => {
                  temp.push({lat: place.location.latitude, lng: place.location.longitude })
                })
                return(
                  <Polyline
                      path={temp}
                      key={key}
                      geodesic={true}
                      options={{
                          strokeColor: "#ff3232",
                          strokeOpacity: 0.75,
                          strokeWeight: 7,
                          icons: [
                            {
                              icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                strokeColor: '#ff3232',
                                fillColor: '#ff3232',
                                fillOpacity: 1,
                                scale: 4
                              },
                              offset: '0%',
                            },
                            {
                              icon: {
                                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                strokeColor: '#f1ff19',
                                fillColor: '#f1ff19',
                                fillOpacity: 1,
                                scale: 3
                              },
                              offset: '50px',
                              repeat: "20%"
                            },
                            {
                              icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                strokeColor: '#ff3232',
                                fillColor: '#ff3232',
                                fillOpacity: 1,
                                scale: 4
                              },
                              offset: '100%'
                            }
                          ]
                      }}/>
                )
              })
            }
        </GoogleMap>
        {this.props.isShowTour && !this.props.isSetTour &&
          <a className="hide-tour" title="Hide tour's direction on map" onClick={this.onToggleShowTour.bind(this)}>
            <FaEyeSlash style={{fontSize: '20px'}}/>
          </a>
        }
        <a className={this.props.isSetTour ? "filter detail" : "filter"} title="Filter" onClick={this.onFilterTour.bind(this)}>
          <FaFilter style={{fontSize: '20px'}}/>
        </a>
        <PopupInfo show={this.state.showFilter} onClose={this.handleClose.bind(this)} customContent={customStyles}>
          <div className="popup-title-filter">
            <h1 className="bold">LOCATION FILTER</h1>
            <span className="underline-popup"/>
          </div>
          <div className="row">
            {this.filterOptions.map((item, key) => {
                return(
                  <div className="col-6 col-sm-3 text-left mb-4" key={key}>
                    <CustomCheckbox item={item} onCheck={this.handleCheck.bind(this)} />
                  </div>
                )
              })
            }
          </div>
          <p className="caption">
            Choose location&apos;s type you would like to display on the map or&nbsp;
            <a onClick={this.handleShowAll.bind(this)} className="show-all">Show all</a>
          </p>
          <button type="button" className="co-btn" style={{width: '30%', marginTop: '20px'}} onClick={this.handleClose.bind(this)}>OK</button>
        </PopupInfo>
      </div>
    )
  }
}

export default compose(withScriptjs, withGoogleMap)(MapComponent)
