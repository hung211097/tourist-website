import React from 'react'
import { LayoutProfile, AutoHide } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import ApiService from 'services/api.service'
import { connect } from 'react-redux'
import validateEmail from 'services/validates/email'
import validatePhone from 'services/validates/phone'
import Select from 'react-select'
import { checkLogin, getUserAuth } from 'services/auth.service'
import { moveToElementId } from '../../services/utils.service'

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

class Profile extends React.Component {
    displayName = 'Profile'
    static propTypes = {
        dispatch: PropTypes.func,
        account: PropTypes.object,
        store: PropTypes.any,
        user: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.apiService = ApiService()
        this.refUpdloadAvatar = React.createRef()
        this.genders = ['Male', 'Female', 'Other']
        this.files_avatar = []
        this.limitUpload = 1
        this.state = {
            fullname: '',
            email: '',
            phone: '',
            action: false,
            files_avatar: [],
            birthdate: '',
            gender: '',
            isSubmit: false
        }
    }

    componentDidMount() {
        if (!checkLogin()) {
            return
        }
        let user = getUserAuth()
        if (user) {
            this.setState({
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                birthdate: user.birthdate,
                gender: user.gender,
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

    submitProfile() {
        this.setState({
            isSubmit: true
        })
        const validList = ['name', 'display-name', 'phone-format', 'email', 'email-format', 'phone']
        for (var i = validList.length - 1; i >= 0; i--) {
            if (!this.onValidated(validList[i], true)) {
                return moveToElementId(validList[i])
            }
        }
        let form = new FormData()
        form.append('fullname', this.state.fullname)
        form.append('email', this.state.email)
        form.append('phone', this.state.phone)
        if(this.state.date_of_birth !== "None"){
          form.append('birthdate', this.state.birthdate)
        }
        form.append('gender', this.state.gender)
        if (this.files_avatar.length) form.append('avatar', this.files_avatar[0], 'file_avatar.jpg')
        // this.apiService.updateProfile(form).then(() => {
        //     //dispatch(saveProfile(user))
        //     this.setState({
        //         action: true
        //     })
        // })
        // this.setState({ action: false })
    }

    handleUploadAvatar() {
        this.refUpdloadAvatar.current.click()
    }

    handleOnSelectFileAvatar(event) {
        let files = event.target.files
        console.log(files);
        // tinifyImage(files, this.limitUpload, this.files_avatar.length).then((data) => {
        //     this.files_avatar = [...this.files_avatar, ...data.preFiles]
        //     this.setState({
        //         files_avatar: [...this.state.files_avatar, ...data.tempFiles]
        //     })
        // })
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

        if (name == 'name') {
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
            <LayoutProfile page="profile" tabName="profile" {...this.props}>
                <style jsx>{styles}</style>
                <div className="profile-detail">
                  <div className="title">
                    <div className="text-center title-contain">
                      <h1 className="my-profile__title">PERSONAL INFORMATION</h1>
                    </div>
                    <div className="row content">
                      <div className="col-md-6">
                        {this.props.user &&
                          <ul>
                            <li className="d-md-none d-block"><span>Avatar:</span>
                            <img alt="avatar" src={this.props.user.avatar ? this.props.user.avatar : "/static/images/default-avatar.png"} />
                            &nbsp;
                            </li>
                            <li><span>Fullname:</span>{this.props.user.fullname}&nbsp;</li>
                            <li><span>Email:</span> {this.props.user.email}</li>
                            <li><span>Phone number:</span>{this.props.user.phone}&nbsp;</li>
                            <li><span>Gender:</span> {this.props.user.gender} &nbsp;</li>
                            <li><span>Birthdate:</span> {this.props.user.birthdate} &nbsp;</li>
                          </ul>
                        }
                      </div>
                      <div className="col-md-6 d-none d-md-block">
                        <div className="avatar-contain">
                          {this.props.user &&
                            <img alt="avatar" src={this.props.user.avatar ? this.props.user.avatar : "/static/images/default-avatar.png"} />
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </LayoutProfile>
        )
    }
}

export default connect(mapStateToProps)(Profile)
