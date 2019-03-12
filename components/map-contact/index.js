import React from 'react'
import PropTypes from 'prop-types'
import Geocode from "react-geocode"
import { compose, withProps } from "recompose";
import  {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

const KEY_GOOGLE_MAP = process.env.KEY_GOOGLE_MAP
Geocode.setApiKey(KEY_GOOGLE_MAP);

class MapContact extends React.Component {
  displayName = 'Map Contact'

  static propTypes = {
    location: PropTypes.object
  }

  constructor(props) {
    super(props)
  }

  render() {
    const MapWithControlledZoom = compose(
      withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${KEY_GOOGLE_MAP}&v=3.exp&libraries=geometry,drawing,places`,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />,
        location: this.props.location,
      }),
      withScriptjs,
      withGoogleMap
    )(props =>
      <GoogleMap
        defaultCenter={{ lat: props.location.lat, lng: props.location.lng }}
        zoom={15}
      >
        <Marker
          position={{ lat: props.location.lat, lng: props.location.lng }}
        >
        </Marker>
      </GoogleMap>
    );

    return (
      <div className="map-contact">
        <MapWithControlledZoom />
      </div>
    )
  }
}

export default MapContact
