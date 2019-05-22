import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from './components/login';
import Options from './components/afterLoginPageOne';
import myNotes from './components/myNotes';
import note from './components/note';
import Test from './components/test';
import Dropdown from './components/dropdown';
import Create from './components/create';
import Register from './components/register';
import * as serviceWorker from './serviceWorker';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

const routing = (
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/options" component={Options} />
        <Route path="/notes" component={myNotes} />
        <Route path="/test" component={Test} />
        <Route path="/dropdown" component={Dropdown} />
        <Route path="/create" component={Create} />
        <Route path="/notAllowed" component={note} />
        <Route path="/register" component={Register} />
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
