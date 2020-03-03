import React from 'react'
import { borderColor, darkColor, lightColor } from '../assets/constants';
import { insideOutsideMultiply } from '../functions';

class Slider extends React.Component {
	constructor(props) {
		super(props)

		const circleX = insideOutsideMultiply(props.limit, 100, props.value)

		this.state = {
			isHovering: false,
			isCircleDragging: false,
			circleX: circleX
		}

		this.progressBarRef = React.createRef()
	}

	componentDidMount() {		
		window.addEventListener('mousemove', this.handleMouseMove)
		window.addEventListener('mouseup', this.handleMouseUp)
	}

	componentWillUnmount() {
		window.removeEventListener('mousemove', this.handleMouseMove)
		window.removeEventListener('mouseup', this.handleMouseUp)
	}

	getProgressWidth = (value) => {
		if(this.progressBarRef && this.progressBarRef.current) {
			const boundingClientRect = this.progressBarRef.current.getBoundingClientRect()
			if (this.props.limit > 0 && value > 0) {
				const currentTimeWidth = insideOutsideMultiply(this.props.limit, value, boundingClientRect.width)
				if (currentTimeWidth > 0) {
					return currentTimeWidth
				}
			}
		}

		return 0
	}

	setCircleDragging = (val) => {
		this.setState((prevState) => {
			if(prevState.isCircleDragging !== val) {
				return { isCircleDragging: val }
			}
		})
	}

	setIsHovering = (val) => {
		this.setState((prevState) => {
			if(prevState.isHovering !== val) {
				return { isHovering: val }
			}
		})
	}

	handleMouseMove = (e) => {
		if(this.state.isCircleDragging) {
			this.updateCircleX(e.clientX)
		}
	}

	updateCircleX = (x) => {
		if(this.progressBarRef && this.progressBarRef.current) {
			const boundingClientRect = this.progressBarRef.current.getBoundingClientRect()
			if(x < boundingClientRect.x) {
				this.setState({
					circleX: 0
				})
			}
			else if(x > (boundingClientRect.x + boundingClientRect.width)) {
				this.setState({
					circleX: 100
				})
			}
			else {
				const widthPercentage = insideOutsideMultiply(boundingClientRect.width, 100, x - boundingClientRect.x)
				this.setState({
					circleX: widthPercentage
				})
			}
		}
	}

	handleMouseEnter = () => {
		this.setIsHovering(true)
	}

	handleMouseLeave = () => {
		this.setIsHovering(false)
	}

	handleMouseUp = () => {
		if(this.state.isCircleDragging) {
			this.setCircleDragging(false)
			this.props.onChange(this.state.circleX)
		}
	}

	handleMouseDown = (e) => {
		this.updateCircleX(e.clientX)
		this.setCircleDragging(true)
	}

	handleTouchStart = () => {
		this.setCircleDragging(true)
		this.setIsHovering(true)
	}

	handleTouchEnd = () => {
		this.setIsHovering(false)
	}

	render() {
		let progressWidth = `${this.state.circleX}%`
		if(!this.props.isSolid && !this.state.isCircleDragging) {
			progressWidth = this.getProgressWidth(this.props.value)
		}
		
		return (
			<div
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				onMouseDown={this.handleMouseDown}
				onTouchStart={this.handleTouchStart}
				onTouchEnd={this.handleTouchEnd}
				style={styles.container}
			>
				{/* PROGRESS BAR */}
				<div
					ref={this.progressBarRef}
					style={{
						...styles.progressBar,
						backgroundColor: `${darkColor}`,
						height: 4
					}}
				>
					{/* CIRCLE */}
					<div
						style={{
							...styles.circleContainer,
							pointerEvents: this.state.isHovering ? 'auto' : 'none',
							opacity: this.state.isHovering ? 1 : 0
						}}
					>
						<div
							style={{
								...styles.circle,
								left: progressWidth,
								transition: this.state.isCircleDragging ? 'none' : 'all 0.1s',
								height: 12,
								width: 12,
								marginLeft: -4,
								marginTop: -4,
							}}
						/>
					</div>

					{/* PROGRESS BAR ITSELF */}
					<div style={{
						...styles.progress,
						width: progressWidth,
						transition: this.state.isCircleDragging ? 'none' : 'all 0.1s',
					}} />
				</div>
			</div>
		)
	}
}

const styles = {
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
		userSelect: 'none',
		cursor: 'pointer',
		paddingTop: 3,
		paddingBottom: 3, // same as Slider container paddingBottom
		WebkitTapHighlightColor: 'transparent',
	},
	progressBar: {
		position: 'relative',
		width: '100%',
		borderRadius: 10
	},
	progress: {
		backgroundColor: `${lightColor}`,
		height: '100%',
		willChange: 'transform',
		borderRadius: 10
	},
	cursorIndicatorContainer: {
		position: 'absolute',
		height: '100%',
		width: '100%',
		zIndex: 1
	},
	cursorIndicator: {
		position: 'absolute',
		width: 1,
		height: '100%'
	},
	timestampContainer: {
		position: 'absolute',
		height: '100%',
		width: '100%',
		zIndex: 3,
		transition: 'none',
		willChange: 'transform'
	},
	timestamp: {
		position: 'absolute',
		backgroundColor: `${lightColor}`,
		fontSize: 12,
		marginTop: -22,
		marginLeft: -25,
		textAlign: 'center',
		padding: '1px 7px 1px 7px',
		borderRadius: 10,
		letterSpacing: 1.25,
		lineHeight: 1.1,
		fontWeight: '500'
	},
	circleContainer: {
		position: 'absolute',
		height: '100%',
		width: '100%',
		zIndex: 2,
		transition: 'all 0.1s',
		willChange: 'transform'
	},
	circle: {
		position: 'absolute',
		backgroundColor: `${lightColor}`,
		borderRadius: 50,
		willChange: 'transform',
		border: `1px solid ${borderColor}`
	}
}

Slider.defaultProps = {
	value: 0,
	limit: 0,
}

export default Slider