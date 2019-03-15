import React from 'react'
import styles from './index.scss'
import PropTypes from 'prop-types'
import Lightbox from 'react-images'
import { SlickItem } from 'components'

export default class extends React.Component {
	displayName = 'Layout Lightbox Component'

	static propTypes = {
		imageUrls: PropTypes.any.isRequired,
		small: PropTypes.bool,
		imageFromCommunity: PropTypes.bool,
	}

	static defaultProps = {
		imageFromCommunity: false,
	}

	constructor(props) {
		super(props)
		this.state = {
			lightboxIsOpen: false,
			currentImage: 0,
		};

		this.closeLightbox = this.closeLightbox.bind(this)
		this.gotoNext = this.gotoNext.bind(this)
		this.gotoPrevious = this.gotoPrevious.bind(this)
		this.gotoImage = this.gotoImage.bind(this)
		this.handleClickImage = this.handleClickImage.bind(this)
		this.openLightbox = this.openLightbox.bind(this)
	}

	openLightbox(index, event) {
		event.preventDefault()
		this.setState({
			currentImage: index,
			lightboxIsOpen: true,
		})
	}

	closeLightbox() {
		this.setState({
			currentImage: 0,
			lightboxIsOpen: false,
		})
	}

	gotoPrevious() {
		this.setState({
			currentImage: this.state.currentImage - 1,
		})
	}

	gotoNext() {
		this.setState({
			currentImage: this.state.currentImage + 1,
		})
	}

	gotoImage(index) {
		this.setState({
			currentImage: index,
		})
	}

	handleClickImage() {
		if (this.state.currentImage === this.props.imageUrls.length - 1) {
			return
		}
		this.gotoNext()
	}

	render() {
		if(this.props.imageUrls.length === 0)
			return null;
		let images = this.props.imageUrls.map(u => {
			return {src: u.name}
		})
		let imageClass = this.props.small ? 'comunity-photo-item-small' : 'comunity-photo-item'
		return (
			<>
				<div className="slider-photo">
					<style jsx>{styles}</style>
					<div className={this.props.imageFromCommunity ? "owl-carousel owl-photo" : this.props.imageUrls.length < 5 ? "owl-carousel owl-photo" : "owl-carousel owl-photo toMiddle"}>
						<SlickItem {...{
								lazyLoad: true,
								slidesToShow: this.props.small ? 4 : 6,
								small: this.props.small ? true : false,
								classKey: this.props.imageUrls.length < 5 ? "toLeft" : "toMiddle"
							}}>
							{this.props.imageUrls.map((item, index) => (
								<div key={item.id}>
									<div className={imageClass}>
										<a onClick={(e) => this.openLightbox(index, e)}>
											<img src={item.name} />
										</a>
									</div>
								</div>
							))}
						</SlickItem>
					</div>
				</div>
				<Lightbox
					backdropClosesModal
					currentImage={this.state.currentImage}
					images={images}
					isOpen={this.state.lightboxIsOpen}
					onClickImage={this.handleClickImage}
					onClickNext={this.gotoNext}
					onClickPrev={this.gotoPrevious}
					onClickThumbnail={this.gotoImage}
					onClose={this.closeLightbox}
				/>
			</>
		)
	}
}
