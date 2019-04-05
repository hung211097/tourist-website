import React from 'react'
import { LayoutProfile } from 'components'
import styles from './index.scss'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { formatDate, isValidDate } from '../../services/time.service'
import _ from 'lodash'
import { withNamespaces } from "react-i18next"

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
        user: PropTypes.object,
        t: PropTypes.func
    }

    render() {
        const {t} = this.props
        return (
            <LayoutProfile page="profile" tabName="profile" {...this.props}>
                <style jsx>{styles}</style>
                <div className="profile-detail">
                  <div className="title">
                    <div className="text-center title-contain">
                      <h1 className="my-profile__title">{t('profile.personal_info')}</h1>
                    </div>
                    <div className="row content">
                      <div className="col-md-6">
                        {!_.isEmpty(this.props.user) &&
                          <ul>
                            <li className="d-md-none d-block"><span>{t('profile.avatar')}:</span>
                            <img alt="avatar" src={this.props.user.avatar ? (this.props.user.avatar) : "/static/images/default-avatar.png"} />
                            &nbsp;
                            </li>
                            <li><span>{t('profile.fullname')}:</span>{this.props.user.fullname}&nbsp;</li>
                            <li title={this.props.user.email}><span>Email:</span> {this.props.user.email}</li>
                            <li><span>{t('profile.phone')}:</span>{this.props.user.phone}&nbsp;</li>
                            <li className="capitalize"><span>{t('profile.gender')}:</span> {this.props.user.sex ? t('profile.' + this.props.user.sex) : ''} &nbsp;</li>
                            <li><span>{t('profile.birthdate')}:</span> {this.props.user.birthdate && isValidDate(this.props.user.birthdate) ? formatDate(this.props.user.birthdate) : ''} &nbsp;</li>
                            <li><span>{t('profile.address')}:</span>{this.props.user.address}&nbsp;</li>
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

export default withNamespaces('translation')(connect(mapStateToProps)(Profile))
