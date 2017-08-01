import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch
} from 'react-router-dom'
import Dub from './Dub'
import Home from './Home'
import Error from './Error'
import LogoImage from './logo.svg'
import './index.css'

ReactDOM.render(
  <Router>
    <div className='container'>
      <div className='header'>
        <Link to='/'>
          <img src={LogoImage} alt='logo' />
        </Link>
      </div>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/d/:id" component={Dub}/>
        <Route component={Error}/>
      </Switch>
    </div>
  </Router>,
  document.getElementById('root')
)
