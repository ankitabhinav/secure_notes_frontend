import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import M from "materialize-css";


class Note extends Component {
    constructor(props) {
        super();

        this.state = {
            data: '',
            email: '',
            decryptStatus: false,
            id: '',
            title: '',
            showComponent: true,
            updateSpinnerStatus: false
        }

        this.loginButtonHandler = this.loginButtonHandler.bind(this);
        this.formatAMPM = this.formatAMPM.bind(this);
        this.decryptMessage = this.decryptMessage.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.saveNote = this.saveNote.bind(this);
    }

    componentDidMount() {
        console.log('component did mount of single note component');
        M.AutoInit();
        this.setState(
            {
                data: this.props.data,
                email: this.props.email,
                id: this.props.id,
                title: this.props.title,
                spinnerStatus: false,
                showUpdate: false
            })
    }

    fetchNotes(authToken) {
        //
        axios.post('https://secure-notes-backend.herokuapp.com/mynotes', {

            auth_token: authToken
        })
            .then(function (response) {
                console.log(response);
                this.setState({
                    response: response,
                    flag: 'abhinav'
                });


            }.bind(this))
            .catch(function (error) {
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

    decryptMessage() {
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
                axios.post('https://secure-notes-backend.herokuapp.com/decrypt', {

                    auth_token: authToken,
                    email: this.state.email,
                    data: this.state.data,
                    secret_key: value

                })
                    .then(function (response) {
                        console.log(response);
                        if (response.status == 200) {
                            this.setState({ decryptStatus: true, spinnerStatus: false, data: response.data.decrypted })
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

    deleteMessage() {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    //
                    let authToken = localStorage.getItem("securevault_JWT");
                    axios.post('https://secure-notes-backend.herokuapp.com/delete', {

                        auth_token: authToken,
                        id: this.props.id

                    })
                        .then(function (response) {
                            console.log(response);
                            if (response.status == 200) {
                                this.setState({ decryptStatus: true, spinnerStatus: false });
                                swal("Note has been deleted!", {
                                    icon: "success",
                                });

                                this.setState({ showComponent: false })
                                // this.props.history.push('/notes');


                            }

                        }.bind(this))
                        .catch(function (error) {
                            // this.props.history.push('/login');
                            this.setState({ spinnerStatus: false });
                            swal(error.response.data.status, ' ', 'error');
                            console.log(error.response.data.status);
                        }.bind(this));
                    //




                } else {
                    swal("Your Note file is safe!");
                }
            });
    }

    updateMessage() {
        console.log('update clicked');
        this.setState({ showUpdate: true })
    }

    formatAMPM(mydate) {
        let date = new Date(mydate);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    saveNote() {

        let data = document.getElementById('messageToBeEncrypted').value;
        let email = this.state.email;
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
                this.setState({ updateSpinnerStatus: true });
                //
                let authToken = localStorage.getItem("securevault_JWT");
                axios.post('https://secure-notes-backend.herokuapp.com/update', {

                    auth_token: authToken,
                    email: email,
                    data: data,
                    title: title,
                    secret_key: value,
                    id: this.state.id

                })
                    .then(function (response) {
                        console.log(response);
                        if (response.status == 200) {
                            swal('Updated Successfully', '', 'success');


                            this.setState(
                                { 
                                    updateSpinnerStatus: false,
                                    data: response.data.note,
                                    decryptStatus: false,
                                    title:title,
                                    showComponent: true, 
                                    showUpdate: false
                                })
                        }

                    }.bind(this))
                    .catch(function (error) {
                        // this.props.history.push('/login');
                        this.setState({ updateSpinnerStatus: false });
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
            timeAndDecrypt: { 'padding-bottom': '30px' },
            noteStyle: { 'word-wrap': 'break-word' },
            'margin-top': '10%',
            'background-color': ''
        }
        var d1 = this.props.datetime;
        d1 = d1.replace(/T|Z/g, ' ');
        var d = new Date(d1);
        let formatteddate = d.toDateString() + ' ' + this.formatAMPM(this.props.datetime);

        return (

            <React.Fragment>

                {this.state.showComponent &&

                    <li>

                        <div class="collapsible-header"><i class="material-icons">filter_drama</i>

                            <span ><b>{this.state.title}</b> </span>


                        </div>
                        <div class="collapsible-body">
                            {!this.state.showUpdate &&
                                <p style={componemtStyle.noteStyle}>{this.state.data}</p>

                            }
                            {this.state.showUpdate &&
                                <React.Fragment>
                                    <div class="row">
                                        <div class="input-field col s6">
                                            <input id="title" defaultValue={this.state.title} type="text" class="validate" />
                                            <label for="title">Title</label>
                                        </div>
                                        <div class="col s12">
                                            <div class="row">
                                                <div class="input-field col s12">
                                                    <textarea id="messageToBeEncrypted" defaultValue={this.state.data} class="materialize-textarea"></textarea>
                                                    <label for="messageToBeEncrypted">Textarea</label>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                    <div class='row'>
                                        {this.state.updateSpinnerStatus &&
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
                                         {!this.state.updateSpinnerStatus && 
                                             <a onClick={this.saveNote} class="waves-effect waves-light btn ">
                                             Save
                                          </a>
                                        }
                                       
                                    </div>
                                </React.Fragment>


                            }


                            <div style={componemtStyle.timeAndDecrypt}>
                                <div class="divider"></div>
                                <span class='right'>
                                    {formatteddate + ' '}
                                </span>

                                <p>
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
                                    {!this.state.spinnerStatus &&


                                        <React.Fragment>

                                            <a onClick={this.decryptMessage} class="waves-effect waves-light btn-small" disabled={this.state.decryptStatus}>Decrypt</a>
                                            <a onClick={this.deleteMessage} class="waves-effect waves-light btn-small" disabled={this.state.showUpdate}>Delete</a>

                                            {this.state.decryptStatus &&
                                                <a onClick={this.updateMessage} class="waves-effect waves-light btn-small" disabled={this.state.showUpdate}>Update</a>
                                            }

                                        </React.Fragment>


                                    }

                                </p>


                            </div>

                        </div>
                    </li>
                }


            </React.Fragment>




        );
    }
}

export default Note;
