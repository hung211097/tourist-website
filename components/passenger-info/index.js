import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import Select from 'react-select'
import validatePhone from '../../services/validates/phone.js'

class PassengerInfo extends React.Component {
  displayName = 'Passenger Info'

  static propTypes = {
    index: PropTypes.number,
    isSubmit: PropTypes.bool,
    age: PropTypes.string.isRequired,
    onChangePassenger: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.genders = [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Other', label: 'Other' }
    ]
    this.olds = [
      { value: 'Adult', label: 'Adult' },
      { value: 'Children', label: 'Children' },
    ]
    this.state = {
      name: '',
      phone: '',
      identity: '',
      gender: '',
      birthdate: '',
      olds: this.props.age
    }
  }

  componentDidMount() {
  }

  changePassengerInfo(){
    this.props.onChangePassenger && this.props.onChangePassenger(this.state, this.props.index)
  }

  handleChangeName(e){
    this.setState({
      name: e.target.value
    }, () => {
      this.changePassengerInfo()
    })
  }

  handleChangePhone(e){
    this.setState({
      phone: e.target.value
    }, () => {
      this.changePassengerInfo()
    })
  }

  handleChangeIdentity(e){
    this.setState({
      identity: e.target.value
    }, () => {
      this.changePassengerInfo()
    })
  }

  handleChangeGender(e){
    this.setState({
      gender: e.value
    }, () => {
      this.changePassengerInfo()
    })
  }

  handleChangeBirthdate(e){
    this.setState({
      birthdate: e.target.value
    }, () => {
      this.changePassengerInfo()
    })
  }

  handleSubmit(e){
    e.preventDefault()
    this.setState({
      isSubmit: true
    })

    if(!this.validate()){
      return
    }

  }

  validate(){
    if(!this.state.name){
      return false
    }

    if(!this.state.gender){
      return false
    }

    if(this.state.phone && !validatePhone(this.state.phone)){
      return false
    }

    if(!this.state.birthdate){
      return false
    }

    return true
  }

  render() {
    return (
      <div className="passenger-info">
        <style jsx>{styles}</style>
        <div className="col-md-12 col-sm-12 col-12">
          <div className="title">
            <h3>PASSENGER&apos;S INFORMATION # {this.props.index + 1}</h3>
          </div>
          <div className="row">
            <div className="form-group col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor={"name" + this.props.index}>Fullname (*)</label>
                <input type="text" name="name" id={"name" + this.props.index} value={this.state.name}
                  onChange={this.handleChangeName.bind(this)} data-validation="required"
                  className={this.props.isSubmit && !this.state.name ? "error" : ""} />
                  {this.props.isSubmit && !this.state.name &&
                    <p className="error">This field is required!</p>
                  }
              </div>
            </div>
            <div className="form-group col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor={"date" + this.props.index}>Birthday (*)</label>
                <input type="date" name="date" id={"formatDate" + this.props.index} value={this.state.birthdate}
                  onChange={this.handleChangeBirthdate.bind(this)}
                  className={this.props.isSubmit && !this.state.birthdate ? "error" : "" }/>
                {this.props.isSubmit && !this.state.birthdate &&
                  <p className="error">This field is required!</p>
                }
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor="age">Age (*)</label>
                <input className="disabled" type="text" name="age" id="age" value={this.state.olds} disabled />
              </div>
            </div>
            <div className="form-group col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor="gender">Gender (*)</label>
                <div className="booking-drop">
                <Select
                    instanceId="gender"
                    value={this.state.gender}
                    onChange={this.handleChangeGender.bind(this)}
                    placeholder={this.state.gender ? this.state.gender : 'Choose your gender'}
                    options={this.genders}
                />
                </div>
                {this.props.isSubmit && !this.state.gender &&
                  <p className="error">This field is required!</p>
                }
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor={"phone" + this.props.index}>Phone number</label>
                <input type="text" name="phone" id={"phone" + this.props.index} value={this.state.phone}
                  onChange={this.handleChangePhone.bind(this)}
                  maxLength={15}
                  className={(this.props.isSubmit && this.state.phone && !validatePhone(this.state.phone)) ? "error" : "" }/>
                {this.props.isSubmit && this.state.phone && !validatePhone(this.state.phone) &&
                  <p className="error">Phone number must be in 10 digits!</p>
                }
              </div>
            </div>
            <div className="form-group col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor={"passport" + this.props.index}>Identity number / Passport</label>
                <input type="text" name="passport" id={"passport" + this.props.index} value={this.state.identity}
                  onChange={this.handleChangeIdentity.bind(this)}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PassengerInfo
