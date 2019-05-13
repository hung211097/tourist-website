import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import Select from 'react-select'
import validatePhone from '../../services/validates/phone.js'
import { validateStringWithoutNumber } from '../../services/validates'

class PassengerInfo extends React.Component {
  displayName = 'Passenger Info'

  static propTypes = {
    index: PropTypes.number,
    isSubmit: PropTypes.bool,
    age: PropTypes.string.isRequired,
    onChangePassenger: PropTypes.func,
    t: PropTypes.func,
    traveler: PropTypes.object
  }

  static defaultProps = {
    traveler: null
  }

  constructor(props) {
    super(props)
    this.genders = [
      { value: 'male', label: props.t('checkout_passenger.male') },
      { value: 'female', label: props.t('checkout_passenger.female') },
      { value: 'other', label: props.t('checkout_passenger.other') }
    ]
    this.olds = {
      'adults': 'Adult',
      'children': 'Children'
    }
    this.state = {
      fullname: props.traveler && props.traveler.name ? props.traveler.name : '',
      phone: props.traveler && props.traveler.phone ? props.traveler.phone : '',
      passport: props.traveler && props.traveler.passport ? props.traveler.passport : '',
      sex: props.traveler && props.traveler.sex ? props.traveler.sex : '',
      birthdate: props.traveler && props.traveler.birthdate ? props.traveler.birthdate : '',
      type: this.props.age
    }
  }

  // static getDerivedStateFromProps (nextProps, prevState){
  //   if(!nextProps.traveler){
  //     return{
  //       fullname: '',
  //       phone: '',
  //       passport: '',
  //       sex: '',
  //       birthdate: '',
  //       type: nextProps.age
  //     }
  //   }
  //   else if(nextProps.traveler){
  //     return{
  //       fullname: nextProps.traveler.name ? nextProps.traveler.name : '',
  //       phone: nextProps.traveler.phone ? nextProps.traveler.phone : '',
  //       passport: '',
  //       sex: nextProps.traveler.sex ? nextProps.traveler.sex : '',
  //       birthdate: nextProps.traveler.birthdate ? nextProps.traveler.birthdate : '',
  //       type: nextProps.age
  //     }
  //   }
  //   return null
  // }

  UNSAFE_componentWillReceiveProps(props){
    this.genders.forEach((item) => {
      item.label = props.t('checkout_passenger.' + item.value)
    })
  }

  changePassengerInfo(){
    this.props.onChangePassenger && this.props.onChangePassenger(this.state, this.props.index)
  }

  handleChangeName(e){
    this.setState({
      fullname: e.target.value
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

  handleChangePassport(e){
    this.setState({
      passport: e.target.value
    }, () => {
      this.changePassengerInfo()
    })
  }

  handleChangeSex(e){
    this.setState({
      sex: e.value
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

  validate(){
    if(!this.state.fullname || !validateStringWithoutNumber(this.state.fullname)){
      return false
    }

    if(!this.state.sex){
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
    const {t} = this.props
    return (
      <div className="passenger-info row" id={"passenger-" + this.props.index}>
        <style jsx>{styles}</style>
        <div className="col-md-12 col-sm-12 col-12">
          <div className="title">
            <h3>{t('checkout_passenger.passenger_info')} # {this.props.index + 1}</h3>
          </div>
          <div className="row">
            <div className="form-group col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor={"name" + this.props.index}>{t('checkout_passenger.fullname')} (*)</label>
                <input type="text" name="name" id={"name" + this.props.index} value={this.state.fullname}
                  onChange={this.handleChangeName.bind(this)} data-validation="required"
                  className={this.props.isSubmit && !this.state.fullname ? "error" : ""} />
                  {this.props.isSubmit && !this.state.fullname &&
                    <p className="error">{t('checkout_passenger.fullname_required')}</p>
                  }
                  {this.props.isSubmit && this.state.fullname && !validateStringWithoutNumber(this.state.fullname) &&
                    <p className="error">{t('checkout_passenger.fullname_format')}</p>
                  }
              </div>
            </div>
            <div className="form-group col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor={"date" + this.props.index}>{t('checkout_passenger.birthdate')} (*)</label>
                <input type="date" name="date" id={"formatDate" + this.props.index} value={this.state.birthdate}
                  onChange={this.handleChangeBirthdate.bind(this)}
                  className={this.props.isSubmit && !this.state.birthdate ? "error" : "" }/>
                {this.props.isSubmit && !this.state.birthdate &&
                  <p className="error">{t('checkout_passenger.birthdate_required')}</p>
                }
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor="age">{t('checkout_passenger.age')} (*)</label>
                <input className="disabled" type="text" name="age" id="age" value={t('checkout_passenger.' + this.olds[this.state.type])} disabled />
              </div>
            </div>
            <div className="form-group col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor="gender">{t('checkout_passenger.gender')} (*)</label>
                <div className="booking-drop">
                <Select
                    instanceId="gender"
                    value={this.state.sex}
                    onChange={this.handleChangeSex.bind(this)}
                    placeholder={this.state.sex ? t('checkout_passenger.' + this.state.sex) : t('checkout_passenger.choose_gender')}
                    options={this.genders}
                />
                </div>
                {this.props.isSubmit && !this.state.sex &&
                  <p className="error">{t('checkout_passenger.gender_required')}</p>
                }
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor={"passport" + this.props.index}>{t('checkout_passenger.passport')}</label>
                <input type="text" name="passport" id={"passport" + this.props.index} value={this.state.passport}
                  onChange={this.handleChangePassport.bind(this)}/>
              </div>
            </div>
            <div className="form-group col-sm-6 col-12">
              <div className="form-group">
                <label htmlFor={"phone" + this.props.index}>{t('checkout_passenger.phone')}</label>
                <input type="text" name="phone" id={"phone" + this.props.index} value={this.state.phone}
                  onChange={this.handleChangePhone.bind(this)}
                  maxLength={15}
                  className={(this.props.isSubmit && this.state.phone && !validatePhone(this.state.phone)) ? "error" : "" }/>
                {this.props.isSubmit && this.state.phone && !validatePhone(this.state.phone) &&
                  <p className="error">{t('checkout_passenger.phone_format')}</p>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PassengerInfo
