import React from 'react';
import VideoPlayer from './components/VideoPlayer';

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
      <div
        style={{
          backgroundColor: '#565378',
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <VideoPlayer
          src="/assets/avengers.mp4"
          type="video/mp4"
          audioTracks={audioTracks}
        />
      </div>
    )
  }
}
