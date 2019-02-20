import React from 'react'
import { Link, Router } from 'routes'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
// import ApiService from 'services/api.service'

const mapStateToProps = () => {
    return {

    }
}

class Header extends React.Component {
    displayName = 'Header'

    static propTypes = {
        accessToken: PropTypes.string,
        page: PropTypes.string,
        dispatch: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
        // this.apiService = ApiService()
    }

    componentDidMount(){
    }

    render() {
        return (
            <div itemScope itemType="http://schema.org/WPHeader">
                {/*<style jsx>{styles}</style>*/}
                {/*header*/}
                <header className="header">

                </header>
            </div>
        )
    }
}

export default connect(mapStateToProps)(Header)
