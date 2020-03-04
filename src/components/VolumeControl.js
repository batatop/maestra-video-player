import React from 'react';
import { volume0SVG, volume1SVG, volume2SVG, volumeXSVG } from '../assets/svg'
import Slider from './Slider';

class VolumeControl extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isVolumeHovering: false,
            isVolumeDragging: false
        }
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.handleMouseUp)
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.handleMouseUp)
    }

    handleMouseUp = () => {
        this.setVolumeDragging(false)
    }

    getVolumeIcon = () => {
        let volumeIcon = null

        if(this.props.isMuted) {
            volumeIcon = volumeXSVG
        }
        else if(this.props.value >= 0.7) {
            volumeIcon = volume2SVG
        }
        else if(this.props.value >= 0.25 && this.props.value < 0.7) {
            volumeIcon = volume1SVG
        }
        else {
            volumeIcon = volume0SVG
        }

        return (<div>{volumeIcon}</div>)
    }

    setSoundBarVisible = (val) => {
        this.setState({
            isVolumeHovering: val
        })
    }

    setVolumeDragging = (val) => {
        this.setState((prevState) => {
            if(prevState.isVolumeDragging !== val) {
                return { isVolumeDragging: val }
            } 
        })
    }
    
    render() {
        const isVolumeVisible = this.state.isVolumeHovering || this.state.isVolumeDragging
        
        return (
            <div
                onMouseEnter={() => this.setSoundBarVisible(true)}
                onMouseLeave={() => this.setSoundBarVisible(false)}
                onMouseDown={() => this.setVolumeDragging(true)}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer', paddingLeft: 14, paddingRight: 14}}
            >
                <div onClick={this.props.toggleMute}>
                    {this.getVolumeIcon()}
                </div>
                <div style={{ width: isVolumeVisible ? 100 : 0, paddingLeft: 7, transition: 'all 0.2s' }}>
                    <Slider isSolid value={this.props.value} limit={1} onChange={this.props.onChange}/>
                </div>
            </div>
        )
    }
}

VolumeControl.defaultProps = {
    value: 1
}

export default VolumeControl