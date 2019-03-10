import React from 'react'
import { LayoutProfile, AutoHide } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import ApiService from 'services/api.service'
import { connect } from 'react-redux'
import validateEmail from 'services/validates/email'
import validatePhone from 'services/validates/phone'
import Select from 'react-select'
import { getUserAuth } from 'services/auth.service'
import { moveToElementId } from '../../services/utils.service'
import tinifyImage from 'services/images'
import { saveProfile } from '../../actions'
import { formatDate } from '../../services/time.service'

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveProfile: () => {dispatch(saveProfile())},
  }
}

class UpdateProfile extends React.Component {
    displayName = 'Update Profile'
    static propTypes = {
        user: PropTypes.object,
        saveProfile: PropTypes.func,
    }

    constructor(props) {
        super(props)
        this.apiService = ApiService()
        this.refUpdloadAvatar = React.createRef()
        this.limitUpload = 1
        this.genders = [
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
          { value: 'Other', label: 'Other' }
        ]
        this.files_avatar = []
        this.state = {
            fullname: '',
            email: '',
            phone: '',
            action: false,
            files_avatar: [],
            birthdate: '',
            gender: '',
            isSubmit: false,
            error: '',
            actionError: false
        }
    }

    componentDidMount() {
        let user = getUserAuth()
        if (user) {
            this.setState({
                fullname: user.fullname ? user.fullname : '',
                email: user.email ? user.email : '',
                phone: user.phone ?  user.phone : '',
                birthdate: user.birthdate ? formatDate(user.birthdate, 'yyyy-MM-dd') : '',
                gender: user.sex ? user.sex : '',
                action: false
            })
        }
    }

    handleNameChange(event) {
        this.setState({
            fullname: event.target.value
        })
    }

    handleEmailChange(event) {
        this.setState({
            email: event.target.value
        })
    }

    handlePhoneChange(event) {
        this.setState({
            phone: event.target.value
        })
    }

    handleBirthdayChange(event) {
        this.setState({
            birthdate: event.target.value
        })
    }

    handleGenderChange(event) {
        this.setState({
            gender: event.value
        })
    }

    submitProfile() {
        this.setState({
            isSubmit: true
        })
        const validList = ['fullname', 'email', 'email-format', 'phone', 'phone-format']
        for (var i = validList.length - 1; i >= 0; i--) {
            if (!this.onValidated(validList[i], true)) {
                return moveToElementId(validList[i])
            }
        }
        let form = new FormData()
        form.append('fullname', this.state.fullname)
        form.append('email', this.state.email)
        form.append('phone', this.state.phone)
        if(this.state.birthdate !== "None"){
          form.append('birthdate', this.state.birthdate)
        }
        form.append('sex', this.state.gender)
        if (this.files_avatar.length) {
          form.append('avatar', this.files_avatar[0], 'file_avatar.jpg')
        }
        this.apiService.updateProfile(form).then(() => {
            this.props.saveProfile && this.props.saveProfile()
            this.files_avatar = []
            this.setState({
                action: true,
                files_avatar: []
            })
        }).catch(() => {
          let error = 'There is a problem, please try again!'
          this.setState({
            error: error,
            actionError: true
          })
        })
        this.setState({ action: false })
    }

    handleUploadAvatar() {
        this.refUpdloadAvatar.current.click()
    }

    handleOnSelectFileAvatar(event) {
        let files = event.target.files
        if(files[0].size > 10240){
          return
        }
        tinifyImage(files, this.limitUpload, this.files_avatar.length).then((data) => {
            this.files_avatar = [...this.files_avatar, ...data.preFiles]
            this.setState({
                files_avatar: [...this.state.files_avatar, ...data.tempFiles]
            })
        })
    }

    handleRemoveImageAvatar(index) {
        this.files_avatar.splice(index, 1)
        this.setState({
            files_avatar: this.state.files_avatar.filter((item, key) => key !== index)
        })
    }

    onValidated = (name, force = false) => {
        if (!this.state.isSubmit && !force) {
            return true
        }

        if (name == 'fullname') {
            return !!this.state.fullname
        }

        if (name == 'phone-format') {
            return !this.state.phone || validatePhone(this.state.phone)
        }

        if (name == 'email') {
            return !!this.state.email
        }

        if (name == 'phone') {
            return !!this.state.phone
        }

        if (name == 'email-format') {
            return !this.state.email || validateEmail(this.state.email)
        }

        return false
    }

    render() {
        return (
            <LayoutProfile page="profile" tabName="update-profile" {...this.props}>
                <style jsx>{styles}</style>
                <div className="profile-detail">
                  <div className="title">
                    <div className="text-center title-contain">
                      <h1 className="my-profile__title">UPDATE INFORMATION</h1>
                    </div>
                    <div className="content">
                      <div className="profile-info row">
                        <div className="col-md-6">
                          <div className="co-field" id="fullname">
                              <p>
                                  <strong>Fullname*</strong>
                              </p>
                              <input
                                  type="text"
                                  className="co-text low"
                                  value={this.state.fullname}
                                  onChange={this.handleNameChange.bind(this)}
                              />
                              {!this.onValidated('fullname') && (
                                  <div className="notify-box">
                                      <p className="error">This field is required</p>
                                  </div>
                              )}
                          </div>
                          <div className="co-field">
                              <p>
                                  <strong>Gender</strong>
                              </p>
                              <Select
                                  instanceId="gender"
                                  value={this.state.gender}
                                  onChange={this.handleGenderChange.bind(this)}
                                  placeholder={this.state.gender ? this.state.gender : 'Choose your gender'}
                                  options={this.genders}
                              />
                          </div>
                          <div className="co-field">
                              <p>
                                  <strong>Birthday</strong>
                              </p>
                              <input
                                  type="date"
                                  className="co-text low"
                                  placeholder=""
                                  value={this.state.birthdate}
                                  onChange={this.handleBirthdayChange.bind(this)}
                              />
                          </div>
                          {/*<div className="co-field" id="email">
                              <p>
                                  <strong>Email*</strong>
                              </p>
                              <input
                                  type="text"
                                  className="co-text low"
                                  value={this.state.email}
                                  onChange={this.handleEmailChange.bind(this)}
                              />
                              {!this.onValidated('email') && (
                                  <div className="notify-box">
                                      <p className="error">This field is required</p>
                                  </div>
                              )}
                              {!this.onValidated('email-format') && (
                                  <div className="notify-box">
                                      <p className="error">This field is not in right format</p>
                                  </div>
                              )}
                          </div>
                          <div className="co-field" id="phone">
                              <p>
                                  <strong>Phone number*</strong>
                              </p>
                              <input
                                  type="text"
                                  className="co-text low"
                                  value={this.state.phone}
                                  onChange={this.handlePhoneChange.bind(this)}
                              />
                          </div>
                          {!this.onValidated('phone') && (
                              <div className="notify-box">
                                  <p className="error">This field is required</p>
                              </div>
                          )}
                          {!this.onValidated('phone-format') && (
                              <div className="notify-box">
                                  <p className="error">This phone number is not right</p>
                              </div>
                          )}*/}
                        </div>
                        <div className="col-md-6">
                          <div className="co-field">
                              <p>
                                  <strong>Avatar</strong>
                              </p>
                              <div className="nrr-image">
                                  <div className="nrr-image-upload">
                                      <div
                                          className="nrr-updload-zone"
                                          onClick={this.handleUploadAvatar.bind(this)}
                                      />
                                      <input
                                          type="file"
                                          accept="image/*"
                                          ref={this.refUpdloadAvatar}
                                          onChange={this.handleOnSelectFileAvatar.bind(this)}
                                          className="nrr-updload-file"
                                      />
                                      <span className="sub">
                                          Maximum size: 1MB<br /> Supported format: jpg, png
                                      </span>
                                  </div>
                              </div>
                              <div className="nrr-image-box">
                                  {!!this.state.files_avatar &&
                                      this.state.files_avatar.map((item, key) => (
                                          <div key={key} className="upload-img">
                                              <div
                                                  onClick={this.handleRemoveImageAvatar.bind(this, key)}
                                                  className="icon-delete">
                                                  <span className="x">x</span>
                                              </div>
                                              <img src={item} alt="preview_img"/>
                                          </div>
                                      ))}
                              </div>
                          </div>
                        </div>
                        <div className="row w-100 text-center alert-zone">
                          {this.state.action == true && (
                            <AutoHide duration={10000}>
                              <div className="alert alert-custom" role="alert">
                                Update profile successfully!
                              </div>
                            </AutoHide>
                          )}
                          {this.state.actionError == true && this.state.error &&(
                            <AutoHide duration={10000}>
                              <div className="alert alert-danger" role="alert">
                                {this.state.error}
                              </div>
                            </AutoHide>
                          )}
                        </div>
                        <div className="confirm-zone row">
                          <div className="text-center comfirm-order-control">
                              <a className="co-btn" onClick={this.submitProfile.bind(this)}>
                                  Update
                              </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </LayoutProfile>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile)
