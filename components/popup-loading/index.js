import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import Popup from 'reactjs-popup'
import { withNamespaces } from "react-i18next"

let customStyles = {
    width: '90%',
    maxWidth: '400px'
}

let customStyleOverlay = {

}

class PopupLoading extends React.Component {
    displayName = 'Popup Loading'

    static propTypes = {
        show: PropTypes.bool,
        circle: PropTypes.bool,
        onClose: PropTypes.func,
        children: PropTypes.any,
        customContent: PropTypes.object,
        customOverlay: PropTypes.object,
        t: PropTypes.func
    }

    constructor(props) {
        super(props)
    }

    handleClose() {
        this.props.onClose && this.props.onClose()
    }

    render() {
        const {t} = this.props
        if(this.props.customContent){
          customStyles = this.props.customContent
        }
        if(this.props.customOverlay){
          customStyleOverlay = this.props.customOverlay
        }
        let localStyles = customStyles
        let overlayStyles = customStyleOverlay
        return (
            <div>
                <style jsx>{styles}</style>
                <Popup onClose={this.handleClose.bind(this)} open={this.props.show}
                  contentStyle={localStyles}
                  overlayStyle={overlayStyles}
                  modal>
                    {() => (
                    <>
                        <div className="modal-annouce-success">
                          <div className="content">
                            <h2>{t('processing')}</h2>
                            <img alt='loading' src="/static/svg/loading.svg" />
                          </div>
                        </div>
                    </>
                    )}
                </Popup>
            </div>
        )
    }
}

export default withNamespaces('translation')(PopupLoading)
