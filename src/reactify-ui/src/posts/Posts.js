import React, { Component } from 'react';
import 'whatwg-fetch';
import cookie from 'react-cookies';

import PostCreate from './PostCreate';
import PostInline from './PostInline';


class Posts extends Component {
  constructor(props){
    super(props)
    this.togglePostListClass = this.togglePostListClass.bind(this)
  }

  state = {
    posts: [],
    postListClass: "card",
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

  togglePostListClass(event){
    event.preventDefault()
    let currentListClass = this.state.postListClass
    if (currentListClass === ""){
      this.setState({
        postListClass: "card"
      })
    } else {
      this.setState({
        postListClass: "",
      })
    }
  }

  componentDidMount(){
    this.setState({ // Cuando se carga el componente se establece Post como vacio
      posts: [],
      postListClass: "card",
    })
    this.loadPosts()
  }

  render() {
    const {posts} = this.state
    const {postListClass} = this.state
    const csrfToken = cookie.load('csrftoken')
    return (
      <div>
        <h1>Another Brick on the wall...</h1>
        <button onClick={this.togglePostListClass}>Toggle Class</button>
        {posts.length > 0 ? posts.map((postItem, index) => {
          return(
            <PostInline post={postItem} elClass={postListClass}/>
          )
        }) : <p> No Post Found </p>}

        {(csrfToken !== undefined && csrfToken !== null) ?
          <div className='my-5'>
            <PostCreate />
          </div>
        : <p>Necesitas loguearte para dejar un post.</p>}
      </div>
    );
  }
}

export default Posts;
