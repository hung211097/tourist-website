import React from 'react'
import { compose, withProps, withStateHandlers, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox"
import { SearchBox } from "react-google-maps/lib/components/places/SearchBox"
import _ from 'lodash'
import PropTypes from 'prop-types'
import Geocode from "react-geocode"

const KEY_GOOGLE_MAP = process.env.KEY_GOOGLE_MAP
Geocode.setApiKey(KEY_GOOGLE_MAP);

class MyMap extends React.Component {
  displayName = 'Google Map'

  static defaultProps = {
    isMarkerShown: false,
    isSearchBox: false
  }

  static propTypes = {
    userLocation: PropTypes.object,
    isMarkerShown: PropTypes.bool,
    isSearchBox: PropTypes.bool
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    const { userLocation } = this.props
    const MapComponent = compose(
      withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${KEY_GOOGLE_MAP}&v=3.exp&libraries=geometry,drawing,places`,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100vh` }} />,
        mapElement: <div style={{ height: `100%` }} />,
        center: { lat: userLocation ? userLocation.latitude : 10.762622, lng: userLocation ? userLocation.longitude : 106.660172 }, //Vietnam
      }),
      lifecycle({
        componentDidMount() {
          const refs = {}

          this.setState({
            bounds: null,
            markers: [],
            markerClick: null,
            mapPosition: null,
            zoom: 5,
            address: '',
            onMapMounted: ref => {
              refs.map = ref;
            },
            onBoundsChanged: () => {
              this.setState({
                bounds: refs.map.getBounds(),
              })
            },
            onSearchBoxMounted: ref => {
              refs.searchBox = ref;
            },
            onPlacesChanged: () => {
              const places = refs.searchBox.getPlaces();
              const bounds = new google.maps.LatLngBounds();

              places.forEach(place => {
                if (place.geometry.viewport) {
                  bounds.union(place.geometry.viewport)
                } else {
                  bounds.extend(place.geometry.location)
                }
              });
              const nextMarkers = places.map(place => ({
                position: place.geometry.location,
              }));
              const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

              this.setState({
                center: nextCenter,
                markers: nextMarkers,
              });
              // refs.map.fitBounds(bounds);
            },
            onClickedMap: (event) => {
              let newLat = event.latLng.lat();
              let newLng = event.latLng.lng();
              const newCenter = refs.map.getCenter();

              Geocode.fromLatLng(newLat, newLng).then((result) => {
                  const { lat, lng } = result.results[0].geometry.location;
                  this.setState({
                      mapPosition: {
                          latitude: newCenter.lat(),
                          longitude: newCenter.lng()
                      },
                      markerClick: {
                          latitude: lat,
                          longitude: lng
                      },
                      address: result.results[0].formatted_address,
                      zoom: refs.map.getZoom()
                  })
              })
            },
          })
        },
      }),
      withStateHandlers(() => ({
        isOpen: false,
        isOpenClickedMarker: false
      }), {
        onToggleOpen: ({ isOpen }) => () => ({
          isOpen: !isOpen,
        }),
        onToggleOpenClickedMarker: ({ isOpenClickedMarker }) => () => ({
          isOpenClickedMarker: !isOpenClickedMarker,
        })
      }),
      withScriptjs,
      withGoogleMap
    )(props =>
      <GoogleMap
        ref={props.onMapMounted}
        center={props.center}
        onBoundsChanged={props.onBoundsChanged}
        defaultZoom={props.zoom}
        defaultCenter={props.center}
        onClick={props.onClickedMap}>
        {props.isSearchBox &&
          <SearchBox
            ref={props.onSearchBoxMounted}
            bounds={props.bounds}
            controlPosition={google.maps.ControlPosition.TOP_LEFT}
            onPlacesChanged={props.onPlacesChanged}>
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
        {props.isMarkerShown && userLocation && //Your location
          <Marker
            position={{ lat: userLocation.latitude, lng: userLocation.longitude }}
            onClick={props.onToggleOpen}
            icon='/static/images/person.png'>
            {props.isOpen && <InfoBox
              onCloseClick={props.onToggleOpen}
              options={{ closeBoxURL: ``, enableEventPropagation: true }}
            >
              <div style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}>
                <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
                  You are here!
                </div>
              </div>
            </InfoBox>}
          </Marker>
        }
        {props.isMarkerShown && props.markerClick &&  //Clicked marker location
          <Marker
            position={{ lat: props.markerClick.latitude, lng: props.markerClick.longitude }}
            onClick={props.onToggleOpenClickedMarker}>
            {props.isOpenClickedMarker && <InfoBox
              onCloseClick={props.onToggleOpenClickedMarker}
              options={{ closeBoxURL: ``, enableEventPropagation: true }}
            >
              <div style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}>
                <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
                  {props.address}
                </div>
              </div>
            </InfoBox>}
          </Marker>
        }
      </GoogleMap>
    )
    return (
      <div className="custom-map">
        <MapComponent isMarkerShown={this.props.isMarkerShown} isSearchBox={this.props.isSearchBox}/>
      </div>
    )
  }
}

export default MyMap
