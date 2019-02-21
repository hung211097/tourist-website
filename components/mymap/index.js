import React from 'react'
import { compose, withProps } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import PropTypes from 'prop-types'

class MyMap extends React.Component {
  displayName = 'Google Map'

  static defaultProps = {
    isMarkerShown: false
  }

  static propTypes = {
    location: PropTypes.object,
    isMarkerShown: PropTypes.bool
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    const { location } = this.props
    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
      >
        {this.props.isMarkerShown && <Marker position={{ lat: location.lat, lng: location.lng }} />}
      </GoogleMap>
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

export default withScriptjs(withGoogleMap(MyMap))
