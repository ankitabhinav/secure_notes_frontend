import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import DropdownComponent from '../components/dropdown';
import  { Link } from 'react-router-dom';


class Options extends Component {
    constructor() {
        super();

        this.state = {
            showLoginPage: false,
            showSpinner: false,
            showLoginButton: true,
            isEditable: true,
            OnErrorStyle: '',

        }

        this.loginButtonHandler = this.loginButtonHandler.bind(this);
    }

    componentDidMount() {
        console.log('component did mount of options page');
        let authToken = localStorage.getItem("securevault_JWT");
        if (authToken === null) {
            // This means that there ISN'T JWT and no user is logged in.
            console.log('not jwt found on local storage');
            this.props.history.push('/login');

        } else {
            // This means that there IS a JWT so someone must be logged in.
            console.log('jwt FOUND on local storage');

            axios.post('http://localhost:3000/verifyjwt', {
       
                auth_token : authToken
              })
              .then(function (response) {
                console.log(response.data.status);
               
              }.bind(this))
              .catch(function (error) {
                  this.props.history.push('/login');
                  swal(error.response.data.status);
                  console.log(error.response.data.status);
              }.bind(this));

        }
    }

    loginButtonHandler() {
        console.log("login button handler");


        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        if (email == '' || password == '') {
            swal('email and passwords fileds cannot be empty');
        }
        else {
            this.setState(
                {
                    clicked: true,
                    showSpinner: true,
                    showLoginButton: false,
                    isEditable: false
                }
            );

            axios.post('http://localhost:3000/login', {
                email: email,
                password: password
            })
                .then(function (response) {

                    if (response.status == 200 && response.data.status == 'login successful') {
                        swal("login Successful");
                        let savejwt = localStorage.setItem("securevault_JWT", response.data.jwt);
                        console.log('jwt save status :' + savejwt);
                        console.log(response.data.status)
                    }
                    else {
                        swal(response.data.status);
                        console.log(response.status);

                        this.setState(
                            {
                                clicked: true,
                                showSpinner: false,
                                showLoginButton: true,
                                isEditable: true,
                                OnErrorStyle: 'red'
                            }
                        );
                    }
                    console.log(response);
                }.bind(this))
                .catch(function (error) {
                    swal(error.response.data.status);
                    this.setState(
                        {
                            clicked: true,
                            showSpinner: false,
                            showLoginButton: true,
                            isEditable: true,
                            OnErrorStyle: 'red'
                        }
                    );
                    console.log(error.response);
                }.bind(this));

        }


    }


    render() {

        let componemtStyle = {
            onErrorTextColor: { color: this.state.OnErrorStyle },
            'margin-top':'5%',
            'background-color':''
        }

        let editState = this.state.isEditable;
        return (
            <div class='container' style={componemtStyle}>
            <div class='right-align'> <DropdownComponent/> </div>
                <div class="row" style={componemtStyle}>
                    <div class="col s12 m4 ">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                                <span class="card-title">Create Note</span>
                                <p>Create an encrypted text note which can be opened only by your secret key.
          </p>
                            </div>
                            <div class="card-action">
                            <Link to='/login' > Create </Link>
                                
                            </div>
                        </div>
                    </div>

                    <div class="col s12 m4 ">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                                <span class="card-title">View Notes</span>
                                <p>View all your previously created notes, decrypt them uisng your secret key.
          </p>
                            </div>
                            <div class="card-action">
                                <a href="#">This is a link</a>
                            </div>
                        </div>
                    </div>

                    <div class="col s12 m4 ">
                        <div class="card blue-grey darken-1">
                            <div class="card-content white-text">
                                <span class="card-title">Comming Soon</span>
                                <p>This section is under development, it willl be available very soon, till then enjoy.
          </p>
                            </div>
                            <div class="card-action">
                                <a href="#">This is a link</a>
                            </div>
                        </div>
                    </div>


                </div>
               
                
            </div>


        );
    }
}

export default Options;
