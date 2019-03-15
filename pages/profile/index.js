import React from 'react'
import { LayoutProfile } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { formatDate, isValidDate } from '../../services/time.service'
import _ from 'lodash'

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
                        {!_.isEmpty(this.props.user) &&
                          <ul>
                            <li className="d-md-none d-block"><span>Avatar:</span>
                            <img alt="avatar" src={this.props.user.avatar ? (this.props.user.avatar) : "/static/images/default-avatar.png"} />
                            &nbsp;
                            </li>
                            <li><span>Fullname:</span>{this.props.user.fullname}&nbsp;</li>
                            <li title={this.props.user.email}><span>Email:</span> {this.props.user.email}</li>
                            <li><span>Phone number:</span>{this.props.user.phone}&nbsp;</li>
                            <li className="capitalize"><span>Gender:</span> {this.props.user.sex} &nbsp;</li>
                            <li><span>Birthdate:</span> {this.props.user.birthdate && isValidDate(this.props.user.birthdate) ? formatDate(this.props.user.birthdate) : ''} &nbsp;</li>
                          </ul>
                        }
                      </div>
                      <div className="col-md-6 d-none d-md-block">
                        <div className="avatar-contain">
                          {this.props.user &&
                            <img alt="avatar" src={this.props.user.avatar ? (this.props.user.avatar) : "/static/images/default-avatar.png"} />
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
