import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import M from "materialize-css";
import { Redirect, Link } from 'react-router-dom';
import DropdownComponent from '../components/dropdown';





class Create extends Component {
    constructor() {
        super();

        this.state = {
            spinnerStatus: false

        }

        this.saveNote = this.saveNote.bind(this);
    }

    componentDidMount() {
        console.log('component did mount of create note page');
        M.AutoInit();
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
                        // this.fetchNotes(authToken)
                        console.log('auth token is correct');
                    }

                }.bind(this))
                .catch(function (error) {
                    this.props.history.push('/login');
                    // swal(error.response.data.status);
                    console.log(error.response.data.status);
                }.bind(this));

        }
    }

    saveNote() {

        let data = document.getElementById('messageToBeEncrypted').value;
        let email = localStorage.getItem("securevault_EMAIL");
        let title = document.getElementById('title').value;
        if (data == '' || title == '') {
            swal('Message or title Field is empty');
            return;
        }


        swal("Enter your secret key", {
            content: {
                element: "input",
                attributes: {
                    placeholder: "your secret key",
                    type: "password",
                },
            },
        })
            .then((value) => {
                this.setState({ spinnerStatus: true });
                //
                let authToken = localStorage.getItem("securevault_JWT");
                axios.post('https://secure-notes-backend.herokuapp.com/encrypt', {

                    auth_token: authToken,
                    email: email,
                    data: data,
                    title: title,
                    secret_key: value

                })
                    .then(function (response) {
                        console.log(response);
                        if (response.status == 200) {
                            swal('Saved Successfully', '', 'success');
                            this.setState({ spinnerStatus: false });
                            this.props.history.push('/notes');
                        }

                    }.bind(this))
                    .catch(function (error) {
                        // this.props.history.push('/login');
                        this.setState({ spinnerStatus: false });
                        swal(error.response.data.status, ' ', 'error');
                        console.log(error.response.data.status);
                    }.bind(this));
                //

                // swal(`You typed: ${value}`);
            });

    }


    render() {



        let componemtStyle = {
            onErrorTextColor: { color: this.state.OnErrorStyle },

            'background-color': ''
        }

        return (
            <div class='' style={componemtStyle}>

                <div class='row'>

                    <DropdownComponent />
                </div>
                <div class="row">
                    <div class="input-field col s6">
                        <input id="title" type="text" class="validate" />
                        <label for="title">Title</label>
                    </div>
                    <form class="col s12">
                        <div class="row">
                            <div class="input-field col s12">
                                <textarea id="messageToBeEncrypted" class="materialize-textarea"></textarea>
                                <label for="messageToBeEncrypted">Textarea</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div>
                    <div class="right-align">
                        {!this.state.spinnerStatus &&
                            <React.Fragment>
                                <a onClick={this.saveNote} class="waves-effect waves-light btn ">
                                    Save
                             </a>
                                {"  "}
                                <Link to='/notes'> <a class="waves-effect waves-light btn ">
                                    Cancel
                                 </a>
                                </Link>
                            </React.Fragment>

                        }

                        {this.state.spinnerStatus &&
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
                        }

                    </div>
                </div>


            </div>


        );
    }
}

export default Create;
