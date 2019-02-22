import React from 'react'
import { compose, withProps, withStateHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox";
import PropTypes from 'prop-types'
const KEY_GOOGLE_MAP = process.env.KEY_GOOGLE_MAP

class MyMap extends React.Component {
  displayName = 'Google Map'

  static defaultProps = {
    isMarkerShown: false
  }

  static propTypes = {
    userLocation: PropTypes.object,
    isMarkerShown: PropTypes.bool
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
        center: { lat: 10.762622, lng: 106.660172 }, //Vietnam
      }),
      withStateHandlers(() => ({
        isOpen: false,
      }), {
        onToggleOpen: ({ isOpen }) => () => ({
          isOpen: !isOpen,
        })
      }),
      withScriptjs,
      withGoogleMap
    )(props =>
      <GoogleMap
        defaultZoom={5}
        defaultCenter={props.center}
      >
        {/*<InfoBox
          defaultPosition={new google.maps.LatLng(props.center.lat, props.center.lng)}
          options={{ closeBoxURL: ``, enableEventPropagation: true }}
        >
          <div style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}>
            <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
              Hello, Taipei!
            </div>
          </div>
        </InfoBox>*/}
        {props.isMarkerShown && userLocation &&
          <Marker position={{ lat: userLocation.latitude, lng: userLocation.longitude }} onClick={props.onToggleOpen}>
            {props.isOpen && <InfoBox
              onCloseClick={props.onToggleOpen}
              options={{ closeBoxURL: ``, enableEventPropagation: true }}
            >
              <div style={{ backgroundColor: `yellow`, opacity: 0.75, padding: `12px` }}>
                <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
                  Hello, Kaohsiung!
                </div>
              </div>
            </InfoBox>}
          </Marker>
        }
      </GoogleMap>
    )
    return (
      <div className="custom-map">
        <MapComponent isMarkerShown={this.props.isMarkerShown}/>
      </div>
    )
  }
}

// export default compose(
//   withProps({
//     googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places",
//     loadingElement: <div style={{ height: `100%` }} />,
//     containerElement: <div style={{ height: `400px` }} />,
//     mapElement: <div style={{ height: `100%` }} />,
//   }),
//   withScriptjs,
//   withGoogleMap)(MyMap)

export default MyMap
