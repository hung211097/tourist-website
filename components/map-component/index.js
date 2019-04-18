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
    maxWidth: '970px',
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
    isSetTour: PropTypes.bool,  //Có thể hiện tour đã chọn sẵn hay không? Ở trang chi tiết tour
    idTourSet: PropTypes.number,  //Id tour cần show sẵn, trang chi tiết tour
    t: PropTypes.func,
    currentLocation: PropTypes.any // Điểm đi tới trong lộ trình hiện tại
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
      locationNearCenter: [], //Mảng location trên map quét theo khung hình
      zoom: 15,
      address: '',
      center: this.props.center,
      isChangeCenter: false,  //Mặc định ban đầu center là vị trí nơi người dùng cho phép truy cập vị trí cá nhân, nếu không thì theo center mặc định trên props
      idTourChosen: null,
      locationsInTour: [],  //Các điểm trong tour đang show, đánh dấu bằng marker khác
      directions: [], //Mảng direction để vẽ
      showFilter: false,
      filterOptions: [],  //Mảng location type cần filter
      airport: [], //Mảng các điểm sân bay để vẽ polyline,
      routes: []
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
        this.setState({
          routes: res.data
        })
        this.onDrawDirection(res.data, this.props.idTourSet, this.props.currentLocation, true)
      })
    }
  }

  addMarker(locations){ //Add thêm marker mới vào bản đồ
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
    }, () => {  //Sau khi search ra điểm thì load địa điểm xung quanh center mới
      this.getLocations()
    });
    // refs.map.fitBounds(bounds);
  }

  onDrawDirection(routes, idTour, currentLocation = null, firstLoad = false){
    if(!this.state.idTourChosen || this.state.idTourChosen != idTour){  //Xét tồn tại tour đã chọn chưa hoặc chọn hiển thị tour khác
      if(!this.state.idTourChosen){ //Chưa chọn tour nào để hiển thị
        this.changeTourToDisplay(routes, idTour, currentLocation, firstLoad)
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
          this.changeTourToDisplay(routes, idTour, currentLocation, firstLoad)
        })
      }
    }
    else{ //Tắt hiển thị
      if(!currentLocation){
        this.resetMarker()
      }
      else{
        this.changeTourToDisplay(routes, idTour, currentLocation, firstLoad)
      }
    }
  }

  UNSAFE_componentWillReceiveProps(props){
    if(props.currentLocation){
      this.onDrawDirection(this.state.routes, props.idTourSet, props.currentLocation)
    }
  }

  changeTourToDisplay(routes, idTour, currentLocation, firstLoad){
    let temp = this.state.locationNearCenter
    if(currentLocation){
      for(let i = 0 ; i < routes.length; i++){
        routes[i].isPass = true
        if(routes[i].id === currentLocation.id){
          break
        }
      }
    }
    routes.forEach((item, key) => {
      let tempItem = temp.find((filterItem) => {
        return item.location.id === filterItem.id
      })
      if(tempItem){
        tempItem.isInTour = true
        if(!tempItem.isPass){ //Trùng điểm nên điểm sau sẽ đè đánh dấu điểm trước, kiểm tra ở đây
          tempItem.isPass = item.isPass ? item.isPass : false
        }
        if(firstLoad){
          if(tempItem.order){
            tempItem.order = tempItem.order + ', ' + (key + 1).toString()
          }
          else{
            tempItem.order = (key + 1).toString()
          }
        }
      }
      else{
        let addItem = item.location
        addItem.isInTour = true
        addItem.isPass = item.isPass ? item.isPass : false
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
      if(!currentLocation || (currentLocation && firstLoad)){ //Không tracking thì mới vẽ lại direction
        let airport = getAirportPoint(routes)
        if(!airport.length){  //Nếu không xuất hiện các điểm sân bay thì vẽ đường đi bằng xe bình thường
          this.setDirections(routes)
        }
        else{   //Nếu có xuất hiện các điểm sân bay thì tách các đoạn đi bằng xe ra vẽ riêng, đi bằng đường hàng không vẽ riêng
          let directionRoutes = []
          let tempPoint = []
          routes.forEach((item) => {
            tempPoint.push(item)
            if(item.transport.name_en === transports.AIRWAY){
              directionRoutes.push(tempPoint)
              tempPoint = []
            }
          })
          if(tempPoint.length){ //Trường hợp chỉ có 1 lần bay thì đưa những điểm đi bằng đường bộ còn lại vào để vẽ
            directionRoutes.push(tempPoint)
          }
          directionRoutes.forEach(item => {
            this.setDirections(item)
          })
          this.setState({
            airport: airport
          })
        }
      }
    })
  }

  setDirections(routes){
    const DirectionsService = new google.maps.DirectionsService();
    let maximumWaypoints = 22 //actually is 23, index from 0
    if(routes.length <= maximumWaypoints + 1 && routes.length >= 2){  //Số điểm trung gian ít hơn 23 (giới hạn api google map)
      let request = {}
      routes.forEach((item, i) => {
        if (i == 0) request.origin = new google.maps.LatLng(item.location.latitude, item.location.longitude);
        else if (i == routes.length - 1) request.destination = new google.maps.LatLng(item.location.latitude, item.location.longitude);
        else {
          if (!request.waypoints) request.waypoints = [];
          request.waypoints.push({
            location:  new google.maps.LatLng(routes[i].location.latitude, routes[i].location.longitude),
            stopover: true
          });
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
    else if(routes.length > maximumWaypoints + 1){
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
            request.waypoints.push({
              location:  new google.maps.LatLng(routes[j].location.latitude, routes[j].location.longitude),
              stopover: true
            });
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
        tempItem.isPass = false
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
    const {t} = this.props
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
                  placeholder={t('search_location')}
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
                t={t}
                infoLocation={{
                  latitude: this.props.myLocation.position.latitude,
                  longitude: this.props.myLocation.position.longitude,
                  address: this.props.myLocation.address}}/>
            }
            {this.state.markerChoose &&
              <MarkerComponent
                t={t}
                infoLocation={{
                  latitude: this.state.markerChoose.latitude,
                  longitude: this.state.markerChoose.longitude,
                  address: this.state.address}}/>
            }
            {!!this.state.locationNearCenter.length && this.state.locationNearCenter.map((item) => {
                if(!this.state.filterOptions.length){
                  return(
                    <MarkerComponent infoLocation={item} key={item.id} t={t}
                      onDrawDirection={this.onDrawDirection.bind(this)}
                      tourChosen={this.state.idTourChosen} isSetTour={this.props.isSetTour}/>
                  )
                }
                let temp = this.state.filterOptions.find((findItem) => {return findItem === item.type.marker})
                if(temp || item.isInTour === true){
                  return(
                    <MarkerComponent infoLocation={item} key={item.id} t={t}
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
            <h1 className="bold">{t('map_filter.title')}</h1>
            <span className="underline-popup"/>
          </div>
          <div className="row">
            {this.filterOptions.map((item, key) => {
                return(
                  <div className="col-6 col-sm-3 text-left mb-4" key={key}>
                    <CustomCheckbox item={item} onCheck={this.handleCheck.bind(this)} isNormal={false} t={t}/>
                  </div>
                )
              })
            }
          </div>
          <p className="caption">
            {t('map_filter.note')}&nbsp;
            <a onClick={this.handleShowAll.bind(this)} className="show-all">{t('map_filter.show_all')}</a>
          </p>
          <button type="button" className="co-btn" style={{width: '30%', marginTop: '20px'}} onClick={this.handleClose.bind(this)}>{t('map_filter.OK')}</button>
        </PopupInfo>
      </div>
    )
  }
}

export default compose(withScriptjs, withGoogleMap)(MapComponent)
