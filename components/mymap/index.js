import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.scss'
import Geocode from "react-geocode"
import { MapComponent } from 'components'
import { getLocalStorage } from '../../services/local-storage.service'
import { KEY } from '../../constants/local-storage'
import { connect } from 'react-redux'
import { toggleShowTour } from '../../actions'
import ApiService from '../../services/api.service'
import { withNamespaces } from "react-i18next"

const KEY_GOOGLE_MAP = process.env.KEY_GOOGLE_MAP
Geocode.setApiKey(KEY_GOOGLE_MAP);

const mapStateToProps = (state) => {
  return {
    isShowTour: state.isShowTour,
    location: state.location
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
    isSearchBox: false,
    isSetTour: false,
  }

  static propTypes = {
    location: PropTypes.any,
    isMarkerShown: PropTypes.bool,
    isSearchBox: PropTypes.bool,
    toggleShowTour: PropTypes.func,
    isShowTour: PropTypes.bool,
    isSetTour: PropTypes.bool,
    idTourSet: PropTypes.number,
    customStyles: PropTypes.any,
    t: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.apiService = ApiService()
    this.state = {
      myLocation: '',
    }
  }

  componentDidMount() {
    if(this.props.location){
      Geocode.fromLatLng(this.props.location.latitude, this.props.location.longitude).then((result) => {
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

  componentWillUnmount(){
    this.props.toggleShowTour && this.props.toggleShowTour(false)
  }

  onToggleShowTour(value){
    this.props.toggleShowTour && this.props.toggleShowTour(value)
  }

  render() {
    const {t} = this.props
    return (
      <div className="custom-map" style={this.props.customStyles}>
        <style jsx>{styles}</style>
        <MapComponent
          isMarkerShown={this.props.isMarkerShown}
          isSearchBox={this.props.isSearchBox}
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${KEY_GOOGLE_MAP}&v=3.exp&libraries=geometry,drawing,places`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          myLocation={{position: this.props.location, address: this.state.myLocation}}
          toggleShowTour={this.onToggleShowTour.bind(this)}
          isShowTour={this.props.isShowTour}
          isSetTour={this.props.isSetTour}
          idTourSet={this.props.idTourSet}
          t={t}/>
      </div>
    )
  }
}

export default withNamespaces('translation')(connect(mapStateToProps, mapDispatchToProps)(MyMap))
