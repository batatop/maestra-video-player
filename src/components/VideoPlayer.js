import React from 'react';
import PropTypes from 'prop-types'
import videojs from 'video.js'
import { playSVG, pauseSVG, maximizeSVG, minimizeSVG, headphonesSVG } from '../assets/svg'
import VolumeControl from './VolumeControl';
import Slider from './Slider';
import { lightColor } from '../assets/constants';
import { getAudioOptions } from '../functions'

const SEEK_SECONDS = 5

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isPlaying: false,
            currentTime: 0,
            volume: 0.5,
            isFullscreen: false,
            isControlsVisible: true,
            duration: 0,
            isMuted: false,
            voiceoverLabel: this.props.originalAudioTrackLabel,
            isAudioTrackMenuOpen: false
        }

        this.hidePlayerTimeout = null
    }

    componentDidMount() {
        // initializePlayers
        const videoJsOptions = {
            autoplay: false,
            controls: false,
            height: this.props.height,
            sources: [{
                src: this.props.src,
                type: this.props.type
            }]
        }

        this.player = videojs(this.videoNode, videoJsOptions, () => {
            this.player.volume(this.state.volume)

            this.player.on('play', this.handlePlay);
            this.player.on('pause', this.handlePause);
            this.player.on('timeupdate', this.handleTimeUpdate);
            this.player.on('fullscreenchange', this.handleFullscreenChange);
            this.player.on('loadedmetadata', this.handleLoadedMetadata);
        });

        const emptyAudioOptions = getAudioOptions('empty')
        this.audioPlayer = videojs(this.audioNode, emptyAudioOptions, () => {
            this.audioPlayer.on('play', this.handleAudioPlay);
        });

        // set audio track options
        for (let i = 0; i < this.props.audioTracks.length; i++) {
            if (!this.props.audioTracks[i].label) {
                console.error('label of audioTrack ' + i + ' is ' + this.props.audioTracks[i].label + '.')
            }
            else if (this.props.audioTracks[i].language) {
                console.error('language of audioTrack ' + i + ' is ' + this.props.audioTracks[i].language + '.')
            }
            else {
                const trackId = 'audioTrack_' + this.props.audioTracks[i].label

                const track = new videojs.AudioTrack({
                    id: trackId,
                    kind: 'translation',
                    label: this.props.audioTracks[i].label,
                    language: this.props.audioTracks[i].language
                });

                this.player.audioTracks().addTrack(track);
            }
        }

        // other event listeners
        this.player.audioTracks().on('change', this.handleAudioTrackChange)
    }

    componentWillUnmount() {
        if (this.player) {
            // turn off listeners
            this.player.off('play', this.handlePlay);
            this.player.off('pause', this.handlePause);
            this.player.off('timeupdate', this.handleTimeUpdate);
            this.player.off('fullscreenchange', this.handleFullscreenChange);
            this.player.off('loadedmetadata', this.handleLoadedMetadata);
            this.audioPlayer.off('play', this.handleAudioPlay);
            this.player.audioTracks().off('change', this.handleAudioTrackChange)

            // clear timeouts
            clearTimeout(this.hidePlayerTimeout)

            // dispose players
            this.player.dispose()
            this.audioPlayer.dispose()
        }
    }

    handlePlayerClick = () => {
        this.playPause()
        this.setState(prevState => {
            if(prevState.isAudioTrackMenuOpen) {
                return { isAudioTrackMenuOpen: false }
            }
        })
    }

    handleLoadedMetadata = () => {
        if (this.player) {
            this.setState({
                duration: this.player.duration()
            })
        }
    }

    handlePlay = () => {
        if(this.state.voiceoverLabel !== this.props.originalAudioTrackLabel) {
            this.audioPlayer.play()
        }

        clearTimeout(this.hidePlayerTimeout)
        this.hidePlayerTimeout = setTimeout(this.hidePlayerControls, 2000)

        this.setState({
            isPlaying: true,
            isControlsVisible: true
        });
    }

    handlePause = () => {
        this.audioPlayer.pause()
        clearTimeout(this.hidePlayerTimeout)

        this.setState({
            isPlaying: false,
            isControlsVisible: true
        });
    }

    handleTimeUpdate = () => {
        const currentTime = this.player && this.player.currentTime();
        if (currentTime === 0 || currentTime > 0) {
            this.setState({
                currentTime,
            });
        }
    }

    setVolume = (percentage) => {
        let volume = percentage && parseFloat(percentage) / 100
        if (volume === 0 || volume > 0) {
            if (volume < 0.05) {
                volume = 0
            }
            else if (volume > 0.95) {
                volume = 1
            }

            if(this.state.voiceoverLabel === this.props.originalAudioTrackLabel) {
                this.player.volume(volume)
            }
            else {
                this.audioPlayer.volume(volume)
            }
            
            this.setState({ volume })
        }
    }

    handleFullscreenChange = () => {
        if (this.player.isFullscreen()) {
            this.setState({
                isFullscreen: true
            })
        }
        else {
            this.setState({
                isFullscreen: false
            })
        }
    }

    handlePlayerMouseMove = () => {
        if (this.state.isPlaying) {
            clearTimeout(this.hidePlayerTimeout)
            this.hidePlayerTimeout = setTimeout(this.hidePlayerControls, 2000)
        }

        this.setState((prevProps) => {
            if (!prevProps.isControlsVisible) {
                return { isControlsVisible: true }
            }
        })
    }

    hidePlayerControls = () => {
        this.setState({
            isControlsVisible: false
        })
    }

    handleAudioPlay = () => {
        if (this.state.isPlaying) {
            const playerCurrentTime = this.player && this.player.currentTime();
            const audioCurrentTime = this.audioPlayer && this.audioPlayer.currentTime();

            if (playerCurrentTime !== audioCurrentTime) {
                if (this.player.volume() !== 0) {
                    this.player.volume(0)
                }

                if(this.audioPlayer.volume() !== this.state.volume) {
                    this.audioPlayer.volume(this.state.volume)
                }

                this.audioPlayer.currentTime(this.state.currentTime)
            }
        }
        else {
            this.audioPlayer.pause()
        }
    }

    handleAudioTrackChange = () => {
        if (this.player && this.audioPlayer) {
            this.player.pause()
            this.audioPlayer.pause()

            const audioTracks = this.player.audioTracks()
            let isFound = false
            for (let i = 0; i < audioTracks.length; i++) {
                if (
                    !isFound && audioTracks[i].enabled &&
                    this.props.audioTracks[i] && this.props.audioTracks[i].src
                ) {
                    this.setState((prevState) => {
                        if(this.props.audioTracks[i].label !== prevState.voiceoverLabel) {
                            this.audioPlayer.src(this.props.audioTracks[i].src)
        
                            return {
                                voiceoverLabel: this.props.audioTracks[i].label
                            }
                        }
                    })

                    isFound = true
                }
            }

            if(!isFound) {
                // means it is original audio
                this.setState((prevState) => {
                    if(prevState.voiceoverLabel !== this.props.originalAudioTrackLabel) {
                        if(this.player && this.audioPlayer) {
                            this.player.volume(this.state.volume)
                            this.audioPlayer.volume(0)
                        }

                        return {
                            voiceoverLabel: this.props.originalAudioTrackLabel
                        }
                    }
                })
            }
        }
    }

    playPause = () => {
        if (!this.state.isPlaying) {
            this.player.play()
        }
        else {
            this.player.pause()
        }
    }

    toggleFullscreen = () => {
        if (this.player) {
            if (!this.player.isFullscreen()) {
                this.player.requestFullscreen()
            }
            else {
                this.player.exitFullscreen()
            }
        }
    }

    getFullscreenButton = () => {
        if (this.player && this.player.isFullscreen()) {
            return this.props.minimizeIcon
        }
        else {
            return this.props.maximizeIcon
        }
    }

    getPlayPauseButton = () => {
        if (this.state.isPlaying) {
            return this.props.pauseIcon
        }
        else {
            return this.props.playIcon
        }
    }

    handleControlsClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    toggleMute = () => {
        if (this.player.muted()) {
            this.player.muted(false)
            this.setState({
                isMuted: false
            })
        }
        else {
            this.player.muted(true)
            this.setState({
                isMuted: true
            })
        }
    }

    percentageSeek = (percentage) => {
        if (this.player) {
            const newTime = (this.state.duration / 100) * percentage
            this.seek(newTime)
        }
    }

    seek = (time) => {
        this.player.currentTime(time)
        if(this.state.voiceoverLabel !== this.props.originalAudioTrackLabel) {
            this.audioPlayer.currentTime(time)
        }
    }

    setAudioTrack = (label) => {
        const audioTracks = (this.player && this.player.audioTracks() && this.player.audioTracks().tracks_) || []
        if(label !== this.props.originalAudioTrackLabel) {
            for (let i = 0; i < audioTracks.length; i++) {
                if (audioTracks[i].label === label) {
                    audioTracks[i].enabled = true
                }
            }
        }
        else {
            for (let i = 0; i < audioTracks.length; i++) {
                if (audioTracks[i].enabled) {
                    audioTracks[i].enabled = false
                }
            }
        }
    }

    toggleAudioTrackMenu = () => {
        this.setState((prevState) => {
            return { isAudioTrackMenuOpen: !prevState.isAudioTrackMenuOpen }
        })
    }

    getAudioTracksButton = () => {
        const audioTracks = this.player && this.player.audioTracks() && this.player.audioTracks().tracks_
        let audioTracksList = null
        let audioTracksListItems = null

        if (audioTracks && audioTracks.length > 0) {
            audioTracksListItems = Object.keys(audioTracks).map(key => {
                const audioTrack = audioTracks[key]
                if (audioTrack.label) {
                    const key = audioTrack.label && `audioListItem_${audioTrack.label}`
                    return (
                        <div
                            key={key}
                            onClick={() => (this.setAudioTrack(audioTrack.label))}
                            style={{
                                ...styles.audioTrackItem,
                                backgroundColor: audioTrack.enabled ? 'rgba(70,80,93,0.4)' : 'transparent'
                            }}
                        >
                            {audioTrack.label}
                        </div>
                    )
                }

                return null
            })

            audioTracksList = (
                <div
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        position: 'absolute',
                        bottom: 30,
                        right: 0,
                        border: '2px solid rgba(70,80,93,0.4)',
                        opacity: this.state.isAudioTrackMenuOpen ? 1 : 0,
                        pointerEvents: this.state.isAudioTrackMenuOpen ? 'auto' : 'none',
                        transition: 'opacity 0.1s ease-in',
                    }}
                >
                    <div
                        key={`audioListItem_Original`}
                        onClick={() => (this.setAudioTrack(this.props.originalAudioTrackLabel))}
                        style={{
                            ...styles.audioTrackItem, 
                            backgroundColor: this.state.voiceoverLabel === this.props.originalAudioTrackLabel ? 'rgba(70,80,93,0.4)' : 'transparent'
                        }}
                    >
                        {this.props.originalAudioTrackLabel}
                    </div>
                    {audioTracksListItems}
                </div>
            )
        }
        else {
            return null
        }

        return (
            <div onClick={this.toggleAudioTracksList} style={{ cursor: 'pointer', paddingLeft: 14, position: 'relative' }}>
                <div onClick={this.toggleAudioTrackMenu}>
                    {this.props.audioTracksIcon}
                </div>
                {audioTracksList}
            </div>
        )
    }

    seekWithArrow = (direction) => {
        if(this.player) {
            let newTime = this.state.currentTime
            if(direction === 'forwards') {
                newTime += SEEK_SECONDS
            }
            else if(direction === 'backwards') {
                newTime -= SEEK_SECONDS
            }

            if(newTime < 0) {
                newTime = 0
            }
            
            if(newTime > this.state.duration) {
                newTime = this.state.duration
            }

            this.seek(newTime)
        }
    }

    handleKeyDown = (e) => {
        if(e.keyCode === 37) {
            // seek backwards
            this.seekWithArrow('backwards')
        }
        else if(e.keyCode === 39) {
            // seek forwards
            this.seekWithArrow('forwards')
        }
        else if(e.keyCode === 77) {
            // mute
            this.toggleMute()
        } 
        else if(e.keyCode === 70) {
            // fullscreen
            this.toggleFullscreen()
        } 
        else if(e.keyCode === 32) {
            // play/pause
            this.playPause()
        }
    }

    render() {
        return (
            <div
                onMouseMove={this.handlePlayerMouseMove}
                onClick={this.handlePlayerClick}
                onDoubleClick={this.toggleFullscreen}
                style={{ userSelect: 'none' }}
            >
                <div data-vjs-player style={{ position: 'relative' }} onKeyDown={this.handleKeyDown}>
                    <video ref={node => this.videoNode = node} autoPlay={false} className="video-js"></video>

                    {/* VIDEO CONTROLS */}
                    <div
                        onClick={this.handleControlsClick}
                        style={{
                            ...styles.videoControls,
                            opacity: this.state.isControlsVisible ? 1 : 0,
                            pointerEvents: this.state.isControlsVisible ? 'auto' : 'none',
                            transition: 'opacity 0.1s ease-in'
                        }}
                    >
                        {/* play/pause */}
                        <div onClick={this.playPause} style={{ cursor: 'pointer' }} >
                            {this.getPlayPauseButton()}
                        </div>

                        {/* volume control */}
                        <VolumeControl value={this.state.volume} onChange={this.setVolume} toggleMute={this.toggleMute} isMuted={this.state.isMuted} />

                        <Slider value={this.state.currentTime} limit={this.state.duration} onChange={this.percentageSeek} />

                        {this.getAudioTracksButton()}

                        {/* full screen */}
                        <div onClick={this.toggleFullscreen} style={{ cursor: 'pointer', paddingLeft: 14 }}>
                            {this.getFullscreenButton()}
                        </div>
                    </div>
                </div>
                <div data-vjs-player style={{ display: 'none' }}>
                    <audio ref={node => this.audioNode = node} autoPlay={false} className="video-js"></audio>
                </div>
            </div>
        )
    }
}

const styles = {
    audioTrackItem: {
        fontSize: 13,
        fontFamily: ['Nunito', 'sans-serif'],
        height: 28,
        minWidth: 100,
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    videoControls: {
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 50,
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 58%,rgba(255,255,255,0) 100%)',
        paddingLeft: 14,
        paddingRight: 14,
        color: lightColor,
    }
}

VideoPlayer.defaultProps = {
    height: 300,
    originalAudioTrackLabel: 'Original',
    audioTracks: [],
    playIcon: playSVG,
    pauseIcon: pauseSVG,
    maximizeIcon: maximizeSVG,
    minimizeIcon: minimizeSVG,
    audioTracksIcon: headphonesSVG
}

VideoPlayer.propTypes = {
    src: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    height: PropTypes.number,
    originalAudioTrackLabel: PropTypes.string,
    audioTracks: PropTypes.array,
    playIcon: PropTypes.element,
    pauseIcon: PropTypes.element,
    maximizeIcon: PropTypes.element,
    minimizeIcon: PropTypes.element,
    audioTracksIcon: PropTypes.element
}

export default VideoPlayer