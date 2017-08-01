import React, { Component } from 'react'
import { FoldingCube } from 'better-react-spinkit'
import Modal from 'react-modal'
import TrumpImage from './trump.png'
import './Home.css'

const apiUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://trumpsdubs.herokuapp.com'

export default class Home extends Component {
  state = {
    input: null,
    fetching: false,
    error: false
  }
  handleChangeText = (event) => {
    this.setState({ input: event.target.value })
  }
  handleSubmit = (event) => {
    event.preventDefault()
    const { input, fetching } = this.state

    if(!fetching) {
      this.setState({ fetching: true })
      fetch(`${apiUrl}/dubs`, {
        method: 'POST',
        body: JSON.stringify({ text: input })
      }).then(response => {
        return response.json()
      }).then(result => {
        if(result.code) {
          throw new Error(result.message)
        }
        this.props.history.push(`/d/${result._id}`)
      }).catch(error => {
        this.setState({ fetching: false, error: error.message })
      })
    }
  }
  handleCloseModal = () => {
    this.setState({ error: false })
  }
  render() {
    const { fetching, error } = this.state

    return (
      <div>
        {fetching ?
          <FoldingCube size={80} color='#ed2845' />
          :
          <img src={TrumpImage} className='main-image' alt={`Trump's beautiful face`} />
        }
        <form onSubmit={this.handleSubmit} className='input-container'>
          <input
            type='text'
            className='input'
            disabled={fetching}
            onChange={this.handleChangeText}
            maxLength={80}
            placeholder='What do you want Donnie to say?' />
          <input type='submit' className='btn' value='OK, go!' />
        </form>
        <Modal
          isOpen={!(!error)}
          className='modal'
          contentLabel='Error'
          overlayClassName='overlay'
          onRequestClose={this.handleCloseModal}>
          <h2 className='modal-heading'>Uh oh.</h2>
          <hr />
          <p className='modal-desc'>{error}</p>
          <button className='btn' onClick={this.handleCloseModal}>OK</button>
        </Modal>
      </div>
    )
  }
}
