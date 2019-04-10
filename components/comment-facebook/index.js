import React, { Component} from 'react';
import { FacebookProvider, Comments, CommentsCount } from 'react-facebook';
import PropTypes from 'prop-types'
const AppID = process.env.FB_CLIENT_ID

export default class CommentsFacebook extends Component {
    displayName="CommentsFacebook"

    static propTypes = {
        url: PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
        <FacebookProvider appId={AppID}>
            <Comments width={'100%'} href={this.props.url}/>
        </FacebookProvider>
        );
    }
}
