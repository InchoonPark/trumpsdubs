import React, { Component } from 'react'
import { FoldingCube } from 'better-react-spinkit'
import { Circle } from 'rc-progress'
import { Helmet } from 'react-helmet'
import Error from '../Error'
import DubImage from './dub.png'
import MessengerImage from './messenger.svg'
import './Dub.css'

const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://trumpsdubs.herokuapp.com'
const cloudfrontUrl = process.env.NODE_ENV === 'development' ? 'https://djqjlzttx6cx1.cloudfront.net' : 'https://d2ip5a362rxsb9.cloudfront.net'

export default class Dub extends Component {
  state = {
    fetching: true,
    dub: null,
    perc: 0,
    paused: false,
    error: null
  }
  componentDidMount() {
    const { match } = this.props
    const { params } = match
    const { id } = params

    fetch(`${apiUrl}/dubs/${id}`, {
      method: 'GET'
    }).then(response => {
      if(response.status === 200) {
        return response.json()
      }
      throw new Error()
    }).then(result => {
      if(!result) {
        this.setState({ fetching: false, error: 'Dub not found!' })
      }

      this.audio = new Audio(`${cloudfrontUrl}/${id}.mp3`)
      this.setState({ fetching: false, dub: result })
      this.audio.play()

      this.audio.addEventListener('timeupdate', () => {
        this.setState({ perc: this.audio.currentTime / this.audio.duration * 100 })
      })
    }).catch(error => {
      this.setState({ fetching: false, error: 'Dub not found!' })
    })
  }
  handlePause = () => {
    this.setState({ paused: true })
    this.audio.pause()
  }
  handlePlay = () => {
    this.setState({ paused: false })
    this.audio.play()
  }
  handleFacebook = () => {
    const { dub } = this.state

    window.FB.ui({
      method: 'share',
      href: `https://www.trumpsdubs.com/d/${dub._id}`
    })
  }
  handleMessenger = () => {
    const { dub } = this.state

    window.FB.ui({
      method: 'send',
      link: `https://www.trumpsdubs.com/d/${dub._id}`
    })
  }
  render() {
    const { fetching, dub, perc, paused, error } = this.state

    if(!fetching && dub) {
      const dubUrl = `https://www.trumpsdubs.com/d/${dub._id}`
      const title = `Hear Trump say "${dub.text}" at ${dubUrl}!`
      const twitterText = `Hear Trump say "${dub.text}"!`
      const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(dubUrl)}`

      return (
        <div>
          <Helmet>
            <meta name='description' content={title} />
            <meta property='og:title' content='TrumpsDubs' />
            <meta property='og:description' content={title} />
          </Helmet>
          <div className='dub-container'>
            <div className='audio-player'>
              <Circle percent={perc} strokeColor='#ed2845' trailWidth={2} strokeWidth={2} />
              <img src={DubImage} className='player-image' alt={`Trump's beautiful face`}/>
              {perc === 100 || paused ?
                <i className='fa fa-play player-btn' onClick={this.handlePlay}></i>
                :
                <i className='fa fa-pause player-btn' onClick={this.handlePause}></i>
              }
            </div>
            <h2 className='main-heading'>{dub.text}</h2>
          </div>
          <div className='social-container'>
            <a href='#' className='social-btn facebook-btn' onClick={this.handleFacebook}>
              <i className='fa fa-facebook social-icon'></i>
            </a>
            <a href='#' onClick={this.handleMessenger}>
              <img className='messenger-btn' src={MessengerImage} alt='messenger' />
            </a>
            <a
              href={twitterUrl}
              className='social-btn twitter-btn'>
              <i className='fa fa-twitter social-icon'></i>
            </a>
            <a
              href={`${cloudfrontUrl}/${dub._id}.mp3`}
              download={`${dub._id}.mp3`}
              className='social-btn download-btn'
              onClick={this.handleDownload}>
              <i className='fa fa-cloud-download social-icon'></i>
            </a>
          </div>
          <div className='credits'>
            <p>Created by <a href='https://github.com/inchoonpark'>Dennis Park</a></p>
          </div>
        </div>
      )
    }
    if(error) {
      return <Error error={error} />
    }
    return (
      <div>
        <FoldingCube size={80} color='#ed2845' />
      </div>
    )
  }
}
