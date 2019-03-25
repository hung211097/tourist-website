import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
// import { Link } from 'routes'
import { FaUser, FaCreditCard, FaReceipt } from "react-icons/fa"
import { wizardStep } from '../../constants'

class WizardStep extends React.Component {
  displayName = 'Wizard Step'

  static propTypes = {
    step: PropTypes.string.isRequired
  }

  static defaultProps = {
    step: wizardStep.PASSENGER
  }

  constructor(props) {
    super(props)

  }

  componentDidMount() {

  }

  handleClickPassenger(){

  }

  handleClickPayment(){

  }

  handleClickConfirmation(){

  }

  render() {
    const { step } = this.props
    return (
      <div className="wizard-step">
        <style jsx>{styles}</style>
        <ul className="steps">
          <li role="tab" className={step === wizardStep.PASSENGER ? "first current" : "first done"}
            aria-disabled="false" aria-selected="false">
            <a id="form-total-t-0" aria-controls="form-total-p-0" onClick={this.handleClickPassenger.bind(this)}>
              <div className="title">
                <span className="step-icon"><i><FaUser/></i></span>
                <span className="step-number">Step 1</span>
                <span className="step-text">Passenger Infomation</span>
              </div>
            </a>
          </li>
          <li role="tab" className={step === wizardStep.PAYMENT ? "current"
            : step === wizardStep.PASSENGER ? '' : "done"}
            aria-disabled="false" aria-selected="true">
            <a id="form-total-t-1" aria-controls="form-total-p-1" onClick={this.handleClickPayment.bind(this)}>
              <span className="current-info audible"> </span>
              <div className="title">
                <span className="step-icon"><i><FaCreditCard/></i></span>
                <span className="step-number">Step 2</span>
                <span className="step-text">Payment Infomation</span>
              </div>
            </a>
          </li>
          <li role="tab" className={step === wizardStep.CONFIRMATION ? "last current"
            : ""} aria-disabled="true">
            <a id="form-total-t-2" aria-controls="form-total-p-2" onClick={this.handleClickConfirmation.bind(this)}>
              <div className="title">
                <span className="step-icon"><i><FaReceipt/></i></span>
                <span className="step-number">Step 3</span>
                <span className="step-text">Confirm Your Booking</span>
              </div>
            </a>
          </li>
        </ul>
      </div>
    )
  }
}

export default WizardStep