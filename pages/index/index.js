import React from 'react'
import { Layout, MyMap } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { Router } from 'routes'
import { connect } from 'react-redux'
import { isServer } from 'services/utils.service'
import { saveRedirectUrl } from 'actions'

const mapStateToProps = state => {
  return {
    user: state.user,
    location: state.location,
    errorPermission: state.error
  }
}

class Home extends React.Component {
  displayName = 'Home Page'

  static propTypes = {
    dispatch: PropTypes.func,
    user: PropTypes.object,
    location: PropTypes.object,
    errorPermission: PropTypes.string
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {dispatch} = this.props
    dispatch(saveRedirectUrl(''))
  }

  saveCurrentUrl(){
    const { dispatch } = this.props

    let { user } = this.props
    if (!user && !isServer()) {
        dispatch(saveRedirectUrl(Router.asPath))
        Router.pushRoute('login')
    }
  }

  render() {
    return (
      <>
        <Layout page="home" {...this.props}>
          <style jsx>{styles}</style>
          <section className='map-content'>
            {/* section box*/}
            <MyMap isMarkerShown isSearchBox userLocation={this.props.location}/>
          </section>
        </Layout>
      </>
    )
  }
}

export default connect(mapStateToProps)(Home)
