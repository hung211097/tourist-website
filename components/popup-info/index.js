import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import Popup from 'reactjs-popup'

const customStyles = {
    width: '90%',
    maxWidth: '400px'
}

export default class extends React.Component {
    displayName = 'Popup Info'

    static propTypes = {
        show: PropTypes.bool,
        circle: PropTypes.bool,
        onClose: PropTypes.func,
        children: PropTypes.any,
        contributor: PropTypes.bool
    }

    constructor(props) {
        super(props)
    }

    handleClose() {
        this.props.onClose && this.props.onClose()
    }

    render() {
        let localStyles = customStyles

        return (
            <div>
                <style jsx>{styles}</style>
                <Popup onClose={this.handleClose.bind(this)} open={this.props.show} contentStyle={localStyles} modal closeOnDocumentClick>
                    {close => (
                    <>
                        <div className="close-modal" data-dismiss="modal" aria-label="Close" onClick={close}/>
                        <div className="modal-annouce-success">
                            {this.props.children}
                        </div>
                    </>
                    )}
                </Popup>
            </div>
        )
    }
}
