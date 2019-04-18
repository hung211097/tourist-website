import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import Popup from 'reactjs-popup'

let customStyles = {
    width: '90%',
    maxWidth: '400px'
}

let customStyleOverlay = {

}

export default class extends React.Component {
    displayName = 'Popup Info'

    static propTypes = {
        show: PropTypes.bool,
        circle: PropTypes.bool,
        onClose: PropTypes.func,
        children: PropTypes.any,
        customContent: PropTypes.object,
        customOverlay: PropTypes.object,
        timeOut: PropTypes.number
    }

    constructor(props) {
        super(props)
    }

    handleClose() {
        this.props.onClose && this.props.onClose()
    }

    componentWillUnmount(){
      this.timeout && clearTimeout(this.timeout)
    }

    componentDidMount(){
      if(this.props.timeOut){
        this.timeout = setTimeout(() => {
          this.handleClose()
        }, this.props.timeOut)
      }
    }

    render() {
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
                  modal
                  closeOnDocumentClick>
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
