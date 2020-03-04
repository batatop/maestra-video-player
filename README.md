
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

## License

Maestra Video Player is [MIT](https://github.com/batatop/maestra-video-player/blob/master/LICENSE) licensed.