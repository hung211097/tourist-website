import React from 'react'
import PropTypes from 'prop-types'

export default class AutoHide extends React.Component {
    displayName = 'Auto Hide Item'

    static propTypes = {
        children: PropTypes.any.isRequired,
        duration: PropTypes.number
    }

    constructor(props) {
        super(props)
        this.state = {
            status: 'show'
        }
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.setState({
                status: 'hide'
            })
        }, this.props.duration)
    }

    componentWillUnmount(){
      this.timeout && clearTimeout(this.timeout)
    }

    render() {
        let { children } = this.props
        const transitionStyles = {
            show: {
                display: 'block'
            },
            hide: {
                display: 'none'
            }
        }
        const currentStyles = transitionStyles[this.state.status]
        return React.cloneElement(children, {
            style: Object.assign({}, currentStyles)
        })
    }
}
