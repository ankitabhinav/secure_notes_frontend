import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';


class Options extends Component {
    constructor() {
        super();

        this.state = {
           response:[]
           
        }

    }

    componentDidMount() {
     let auth_tokenn="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjYjIzYzI0ODcwNGVlMjE0NGEzYjg4NyIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNTU1ODI3MDk3LCJleHAiOjE1NTU4MzA2OTd9.jCcg8kytNrZV0EGnReViQHmJ3JLmpAW96qfTuvOUw2k";
     
/*      axios.post('http://localhost:3000/mynotes', {
       
        auth_token : localStorage.getItem("securevault_JWT")
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error.response.data.status);
      });
 */
       
      let auth_token=localStorage.getItem("securevault_JWT");
     // console.log('auth token = '+auth_token);
     fetch('http://localhost:3000/mynotes', {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({auth_token: auth_token, new: 'Some string: &=&'})
      }).then(res=>res.json())
        .then(res => console.log(res));






    
    }

   

    render() {

     let auth_token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjYjIzYzI0ODcwNGVlMjE0NGEzYjg4NyIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwiaWF0IjoxNTU1ODI3MDk3LCJleHAiOjE1NTU4MzA2OTd9.jCcg8kytNrZV0EGnReViQHmJ3JLmpAW96qfTuvOUw2k';

      
     

      

        return (
<div>
    <p>This is test component</p>
</div>


        );
    }
}

export default Options;
