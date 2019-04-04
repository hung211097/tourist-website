import React from 'react';
import styles from './index.scss';
import PropTypes from 'prop-types';
import { withNamespaces } from "react-i18next"

class BtnViewMore extends React.Component {
	displayName = 'BtnViewMore'

	static propTypes = {
        show: PropTypes.bool,
        onClick: PropTypes.func.isRequired,
        isLoading: PropTypes.bool,
        title: PropTypes.string,
        t: PropTypes.func
    }

    static defaultProps = {
        title: "show_more"
    }

	constructor(props) {
        super(props)
    }

	render() {
    const {t} = this.props
		return (
            <div className='btn-view-more'>
                <style jsx>{styles}</style>
                {!!this.props.show &&
                    <div className="text-center mg-top-40">
                        <button className="co-btn" onClick={this.props.onClick.bind(this)} disabled={this.props.isLoading}>
                            <div>{this.props.isLoading ? t('btn_loading') : t(this.props.title)}</div>
                        </button>
                    </div>
                }
            </div>
		)
	}
}

export default withNamespaces('translation')(BtnViewMore)
