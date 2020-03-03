import React from 'react';
import { volume0SVG, volume1SVG, volume2SVG, volumeXSVG } from '../assets/svg'
import Slider from './Slider';

class VolumeControl extends React.Component {
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

        return (<div style={{ cursor: 'pointer' }}>{volumeIcon}</div>)
    }
    
    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <div onClick={this.props.toggleMute}>
                    {this.getVolumeIcon()}
                </div>
                <div style={{ width: 100, paddingLeft: 7 }}>
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