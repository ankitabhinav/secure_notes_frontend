import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import NoteComponent from '../components/note';
import DropdownComponent from '../components/dropdown';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';


let proxy = process.env.BACKEND_LINK;


class MyNotes extends Component {
    constructor() {
        super();

        this.state = {
            response: [],
            flag: 'ankit',
            showNoMessage: false,
            showSpinner:true

        }

        this.loginButtonHandler = this.loginButtonHandler.bind(this);
        this.fetchNotes = this.fetchNotes.bind(this);
    }

    componentDidMount() {
        console.log('component did mount of my notes page');
        let authToken = localStorage.getItem("securevault_JWT");
        if (authToken === null) {
            // This means that there ISN'T JWT and no user is logged in.
            console.log('not jwt found on local storage');
            this.props.history.push('/login');

        } else {
            // This means that there IS a JWT so someone must be logged in.
            console.log('jwt FOUND on local storage');

            axios.post('https://secure-notes-backend.herokuapp.com/verifyjwt', {

                auth_token: authToken
            })
                .then(function (response) {
                    console.log(response.data.status);

                    if (response.data.status == 'true') {
                        this.fetchNotes(authToken);
                    }

                }.bind(this))
                .catch(function (error) {
                    this.props.history.push('/login');
                    // swal(error.response.data.status);
                    console.log(error.response.data.status);
                }.bind(this));

        }
    }

    fetchNotes(authToken) {
        console.log('from axiosa  ');
        //
        axios.post('https://secure-notes-backend.herokuapp.com/mynotes', {

            auth_token: authToken
        })
            .then(function (response) {
                console.log(response);
                if (response.data.length == 0) {
                    console.log('nothing to disp');
                    this.setState({ showNoMessage: true });
                    return;
                }
                if (response.status == 400) {
                    console.log('nothing to disp');
                    swal(response.data.status);
                    this.setState({ showNoMessage: true });
                    return;
                }
                this.setState({
                    response: response,
                    flag: 'abhinav',
                    showSpinner:false
                });


            }.bind(this))
            .catch(function (error) {
                this.setState({
                    showSpinner:false
                });
                // this.props.history.push('/login');
                // swal(error.response.data.status);
                console.log(error.response.data.status);
            }.bind(this));
        //
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

            axios.post('https://secure-notes-backend.herokuapp.com/login', {
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

        let mynotes = [];


        if (this.state.response != '') {
            console.log('size : ' + this.state.flag);
            console.log(this.state.response.data[0].title);

            this.state.response.data.forEach(v => {
                mynotes.push(<NoteComponent id={v._id} title={v.title} data={v.note} email={v.email} datetime={v.date} />);
            });

        }


        let componemtStyle = {
            onErrorTextColor: { color: this.state.OnErrorStyle },
            'margin-top': '10%',
            'background-color': ''
        }

        return (
            <div>

                <DropdownComponent />

                {this.state.showSpinner &&
                    <div class='row'>
                         <div class='center-align'>
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
                        
                    </div>

                }

                {
                    !this.state.showNoMessage &&
                    <div>
                        <ul class="collapsible popout">
                            {mynotes}
                        </ul>
                    </div>
                }
                {
                    this.state.showNoMessage &&
                    <div>
                        <p>You don't have any notes, create notes by clicking add notes button above</p>
                    </div>
                }


            </div >


        );
    }
}

export default MyNotes;
