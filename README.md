
# Maestra Video Player

Maestra Video Player is a 26kB web player which supports changing audio tracks. It is built with [React](https://reactjs.org/) and [Video.js](https://videojs.com/).

## Installation

```npm install --save maestra-video-player```

or

```yarn add maestra-video-player```

## Requirements

You need to have [React](https://github.com/facebook/react) and [Video.js](https://github.com/videojs/video.js) available in your project to use Maestra Video Player.

## Example

```
import React from 'react';
import VideoPlayer from 'maestra-video-player'

const audioTracks = [
  {
    label: 'Spanish',
    src: '/myVoiceoverSp.mp3',
    type: 'audio/mp3'
  },
  {
    label: 'Turkish',
    src: '/myVoiceoverTr.mp3',
    type: 'audio/mp3'
  }
]

export default class App extends React.Component {
  render() {
    return (
      <div>
        <VideoPlayer
          src="/myVideo.mp4"
          type="video/mp4"
          audioTracks={audioTracks}
        />
      </div>
    )
  }
}
```

## VideoPlayer Available Props

| Name  | Required | Type | Information |
| ----- | -------- | ---- | ----------- |
| src | Yes | String | Relative path or URL for the video. |
| type | Yes | String | MIME type of the video.
| audioTracks | No | Array | Array of audio tracks.
| playIcon | No | Element | Element to replace the default play button on the player.
| pauseIcon | No | Element | Element to replace the default pause button on the player.
| maximizeIcon | No | Element | Element to replace the default maximize button on the player.
| minimizeIcon | No | Element | Element to replace the default minimize button on the player.
| audioTracksIcon | No | Element | Element to replace the default audio tracks button on the player.

## audioTracks Properties

| Name  | Required | Type | Information |
| ----- | -------- | ---- | ----------- |
| label | Yes | String | Label of the track. |
| src | Yes | String | Relative path or URL for the audio track. |
| type | Yes | String | MIME type of the audio. |


## License

Maestra Video Player is [MIT](https://github.com/batatop/maestra-video-player/blob/master/LICENSE) licensed.