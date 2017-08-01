import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import ErrorImage from './error.png'

export default class Error extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <meta name='description' content='An error occurred.' />
          <meta property='og:title' content='Uh oh.' />
          <meta property='og:description' content='An error occurred.' />
        </Helmet>
        <img className='main-image' src={ErrorImage} alt={`Trump's beautiful face`}/>
        <h2 className='main-heading'>{this.props.error || 'Page Not Found'}</h2>
      </div>
    )
  }
}
