import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import App from './routes/App'
import About from './routes/About'
import Repos from './routes/Repos'
import Repo from './routes/Repo'
import Login from './routes/Login'
import NewsFeed from './routes/NewsFeed'
import Comment from './routes/Comment'
import FriendList from './routes/FriendList'
import Profile from './routes/Profile'
import { browserHistory } from 'react-router'
const host = require('setting').host;

require('index.scss');

function isLogin(token) {
  return new Promise(function(resolve, reject) {
    $.ajax({url: host+'admin/isLogin',
       type: 'GET',
       headers:{
         'x-access-token':token
       }
    }).done(function(msg) {
      resolve(msg)
    }.bind(this)).fail(function(e) {
      reject(e)
    });

  });
}

function checkLogin() {
  if(!localStorage.token){
    location.hash = "login";
  }else{
    isLogin(localStorage.token).then(function(e) {
      if(e !== 'true'){
        location.hash = "login";
      }
    }, function (e) {
      console.log(e);
      Materialize.toast('Network Error', 4000);
    });
  }
}

function toggleNewsfeedBg() {
  $('body').toggleClass('newsfeed');
}
function toggleLoginBg() {
  $('body').toggleClass('login');
}
function toggleBackBtn() {
  setTimeout(function () {
    $('#backbtn').toggleClass('vis');
  },100);
}

render((
  <Router history={hashHistory}>
    <Route onEnter={toggleLoginBg} onLeave={toggleLoginBg} path="/login" component={Login}/>
    <Route path="/" onEnter={checkLogin} component={App}>
      <IndexRoute component={NewsFeed}/>
      <Route path="/repos" component={Repos}/>
      <Route path="/repos/:userName/:repoName" component={Repo}/>
      <Route path="/about" component={About}/>
      <Route path="/profile/:uid" component={Profile}/>
      <Route onEnter={toggleNewsfeedBg} onLeave={toggleNewsfeedBg} path="/newsfeed" component={NewsFeed}/>
      <Route onEnter={toggleBackBtn} onLeave={toggleBackBtn} path="/comment/:PID" component={Comment}/>
      <Route onEnter={toggleNewsfeedBg} onLeave={toggleNewsfeedBg} path="/friendlist" component={FriendList}/>
    </Route>
  </Router>
), document.getElementById('app'))
