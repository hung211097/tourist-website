import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import Slider from 'react-slick'

export default class extends React.Component {
	displayName = 'Slick Item'

	static defaultProps = {
		classKey: '',
		dots: false,
		infinite: false,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 5,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 5
				}
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 4
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3
				}
			},
			{
				breakpoint: 576,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					arrows: false,
					dots: true
				}
			}
		],
		small: false
	}

	static propTypes = {
		children: PropTypes.any.isRequired,
		classKey: PropTypes.string.isRequired,
		slideShow: PropTypes.bool,
		small: PropTypes.bool
	}

	constructor(props) {
		super(props)
	}

	render() {
		const global_styles = styles
		const { slideShow, small, ...props } = this.props
		let config = props
		if (slideShow) {
			config = {
				dots: true,
				infinite: true,
				speed: 800,
				autoplay: true,
				autoplaySpeed: 6000,
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false
			}
		}
		if (small) {
			config = {...props, ...{
				slidesToShow: 4,
				slidesToScroll: 4,
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 4,
							slidesToScroll: 4
						}
					},
					{
						breakpoint: 991,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 3
						}
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 3
						}
					},
					{
						breakpoint: 576,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 2,
							arrows: false,
							dots: true
						}
					}
				]
			}}
		}
		return (
			<>
				<style jsx global>
					{global_styles}
				</style>
				<Slider {...config} className={this.props.classKey}>
					{this.props.children}
				</Slider>
			</>
		)
	}
}
