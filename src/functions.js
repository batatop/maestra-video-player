
export function getAudioOptions(audioTrack) {
    if(audioTrack === 'empty') {
        return {
            controls: false,
        }
    }

    if(!audioTrack.src) {
        console.error('src of ' + audioTrack.label + ' is ' + audioTrack.src + '.')
        return null
    }
    else if(!audioTrack.type) {
        console.error('type of ' + audioTrack.label + ' is ' + audioTrack.type + '.')
        return null
    }

    return {
        controls: false,
        sources: [{
            src: audioTrack.src,
            type: audioTrack.type
        }]
    }
}

export function convertSecondsToTime(seconds) {
    if (seconds && seconds > 0) {
        let date = new Date(null)
        date.setSeconds(seconds)
        const time = date.toISOString().substr(12, 7)
        return time
    }

    return "0:00:00"
}

export function insideOutsideMultiply(ifX1, isY1, X2) {
    if(ifX1 === 0 || isY1 === 0 || X2 === 0) {
        return 0
    }
    else {
        return (X2 * isY1) / ifX1
    }
}