import React from 'react';
import VideoPlayer from './components/VideoPlayer';

const videoJsOptions = {
  autoplay: false,
  controls: false,
  height: 300,
  sources: [{
    src: '/assets/avengers.mp4',
    type: 'video/mp4'
  }]
}

const audioTracks = [
  {
    label: 'Arabic',
    src: '/assets/avengersArabic.mp3',
    type: 'audio/mp3'
  },
  {
    label: 'French',
    src: '/assets/avengersFrench.mp3',
    type: 'audio/mp3'
  }
]

export default class App extends React.Component {
  render() {
    return (
      <div>
        <VideoPlayer
          videoJsOptions={videoJsOptions}
          audioTracks={audioTracks}
        />
      </div>
    )
  }
}
