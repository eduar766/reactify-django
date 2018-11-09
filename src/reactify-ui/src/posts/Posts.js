import React, { Component } from 'react';
import 'whatwg-fetch';
import cookie from 'react-cookies';

import PostInline from './PostInline';


class Posts extends Component {
  state = {
    posts: [],
  }
  loadPosts(){
    const endpoint = '/api/posts/'
    let thisComp = this
    let lookupOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }

    fetch(endpoint, lookupOptions)
    .then(function(response){
      return response.json()
    }).then(function(responseData){
      console.log(responseData)
      thisComp.setState({ // Aqui se guarda la respuesta de la api en el state
        posts: responseData
      })
    }).catch(function(err){
      console.log("error", err)
    })
  }

  createPost(){
    const endpoint = '/api/posts/'
    const csrfToken = cookie.load('csrftoken')
    let data = {
      "slug": "",
      "title": "",
      "content": "",
      "draft": false,
      "publish": null
    }
    if (csrfToken !== undefined) {
      let lookupOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(data),
        credentials: 'include'
      }

      fetch(endpoint, lookupOptions)
      .then(function(response){
        return response.json()
      }).then(function(responseData){
        console.log(responseData)
      }).catch(function(err){
        console.log("error", err)
      })
    }
  }

  componentDidMount(){
    this.setState({ // Cuando se carga el componente se establece Post como vacio
      posts: []
    })
    this.loadPosts()
  }

  render() {
    const {posts} = this.state
    return (
      <div>
        <h1>Holitas :3 </h1>
        {posts.length > 0 ? posts.map((postItem, index) => {
          return(
            <PostInline post={postItem}/>
          )
        }) : <p> No Post Found </p>}
      </div>
    );
  }
}

export default Posts;
