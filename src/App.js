import React, { Component } from 'react';
import Login from './components/login';
import Options from './components/afterLoginPageOne';
import 'materialize-css/dist/css/materialize.min.css';

class App extends Component {
  render() {
    let componemtStyle={
       'margin-top':'10%',
       'background-color':''
    }
    return (
      <div className="App">
        <div  >
           <p>This is home page oif secure vault</p>
        </div>
      </div>
    );
  }
}

export default App;
