import React from 'react';
import styles from './index.scss';
import PropTypes from 'prop-types';

export default class extends React.Component {
	displayName = 'BtnViewMore'

	static propTypes = {
        show: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        title: PropTypes.string
    }

    static defaultProps = {
        title: "SHOW MORE"
    }

	constructor(props) {
        super(props)
    }

	render() {
		return (
            <div className='btn-view-more'>
                <style jsx>{styles}</style>
                {!!this.props.show &&
                    <div className="text-center mg-top-40">
                        <button className="co-btn" onClick={this.props.onClick.bind(this)} disabled={this.props.isLoading}>
                            <div>{this.props.isLoading ? 'Loading...' : this.props.title}</div>
                        </button>
                    </div>
                }
            </div>
		)
	}
}
