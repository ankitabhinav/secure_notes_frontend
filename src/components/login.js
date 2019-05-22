import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';



class Login extends Component {
    constructor() {
        super();

        this.state = {
            clicked: false,
            showSpinner: false,
            showLoginButton: true,
            isEditable: true,
            OnErrorStyle: '',

        }

        this.loginButtonHandler = this.loginButtonHandler.bind(this);
    }

    componentDidMount() {
        console.log('component did mount of login ');
        let authToken = localStorage.getItem("securevault_JWT");
        if (authToken === null) {
            // This means that there ISN'T JWT and no user is logged in.
            console.log('not jwt found on local storage');
        } else {
            // This means that there IS a JWT so someone must be logged in.
            console.log('jwt FOUND on local storage');

            axios.post('http://localhost:3000/verifyjwt', {
       
                auth_token : authToken
              })
              .then(function (response) {
                console.log(response);
                if(response.status == 200) {
                    this.props.history.push('/notes');
                }
                
              }.bind(this))
              .catch(function (error) {
                  
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
                        let saveemail = localStorage.setItem("securevault_EMAIL", email);
                        console.log('jwt save status :' + savejwt);
                        console.log(response.data.status);
                        this.props.history.push('/notes');
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
            'margin-top':'10%',
            'background-color':''
        }

        let editState = this.state.isEditable;
        return (
            <div class='container' style={componemtStyle}>
                <div class="row" style={componemtStyle}>
                    <div class=" input-field col s12 m6 offset-m3">
                        <input placeholder="enter your email address " id="email" type="text" class="validate" disabled={!this.state.isEditable} />
                        <label class="active" style={componemtStyle.onErrorTextColor} for="email">Email Address</label>
                    </div>
                </div>
                <div class="row" style={componemtStyle}>
                    <div class="center-align input-field col s12 m6 offset-m3">
                        <input placeholder="enter your password" id="password" type="password" class="validate" disabled={!this.state.isEditable} />
                        <label class="active" style={componemtStyle.onErrorTextColor} for="password">Password</label>
                    </div>
                </div>

                <div class="row" style={componemtStyle}>
                    {this.state.showLoginButton &&

                        <div class="center-align input-field col s12 m6 offset-m3">
                            <a class="waves-effect waves-light btn-large" onClick={this.loginButtonHandler}>Login</a>
                        </div>
                    }

                    {this.state.showSpinner &&
                        <div class="center-align input-field col s12 m6 offset-m3">
                            <div class="preloader-wrapper small active">
                                <div class="spinner-layer spinner-green-only">
                                    <div class="circle-clipper left">
                                        <div class="circle"></div>
                                    </div><div class="gap-patch">
                                        <div class="circle"></div>
                                    </div><div class="circle-clipper right">
                                        <div class="circle"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }



                </div>
            </div>


        );
    }
}

export default Login;
