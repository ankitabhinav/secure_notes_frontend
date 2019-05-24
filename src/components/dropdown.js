import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import M from "materialize-css";
import { Redirect, Link } from 'react-router-dom';



class DropdownComponent extends Component {
    constructor() {
        super();

        this.state = {


        }

        this.logoutHandler = this.logoutHandler.bind(this);
    }

    componentDidMount() {
        console.log('component did mount of options page');
        M.AutoInit();
    }

    logoutHandler() {
        console.log("Logout Handler function");

        let deleteJWT = localStorage.removeItem('securevault_JWT');
        //  this.props.history.push('/login');

    }


    render() {

        let componemtStyle = {
            onErrorTextColor: { color: this.state.OnErrorStyle },
            'margin-top': '10%',
            'background-color': ''
        }
        // $('.dropdown-trigger').dropdown();

        return (

            <div class='row'>

                <nav>
                    <div class="nav-wrapper">
                        <a href="#!" class="brand-logo">Secure Notes</a>
                        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
                        <ul class="right hide-on-med-and-down">
                            <li><a href="badges.html">About Us</a></li>
                            <li><Link to='/create' ><a href="#">Add Note</a></Link></li> 
                            <li><Link to='/login' ><a onClick={this.logoutHandler} href="#">Logout</a></Link></li>

                        </ul>
                    </div>
                </nav>

                <ul class="sidenav" id="mobile-demo">

                    <li><a href="badges.html">About Us</a></li>
                    <li><Link to='/create' ><a href="#">Add Note</a></Link></li> 
                    <Link to='/login' ><li><a onClick={this.logoutHandler} href="#">Logout</a></li> </Link>
                </ul>
            </div>

            /*   <div>
  
                  <a class='dropdown-trigger btn' href='#' data-target='dropdown1'><i class="material-icons">person_pin</i></a>
                  <ul id='dropdown1' class='dropdown-content'>
                      <li><a href="#!">one</a></li>
                      <li><a href="#!">two</a></li>
                      <li class="divider" tabindex="-1"></li>
                      <Link to='/login' > <li><a onClick={this.logoutHandler}>Logout</a></li> </Link>
                     
                     
                  </ul>
              </div> */



        );
    }
}

export default DropdownComponent;
