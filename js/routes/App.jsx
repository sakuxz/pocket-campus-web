import React from 'react'
import NavLink from './NavLink'
import { browserHistory } from 'react-router'
const host = require('setting').host;
var token = require('setting').token;

export default React.createClass({
  render() {
    return (
      <div>

        <nav className='toolbar'>
            <main>
              <a href="#" data-activates="slide-out" className="button-collapse"><i className="mdi-navigation-menu"></i></a>
              <NavLink to="/newsfeed" className="nav-title" >Pocket Campus</NavLink>
              <ul className="right">
                <a id='backbtn' onClick={this.back} className="nav-title" ><i className="material-icons">reply</i></a>
              </ul>
            </main>
            <ul id="slide-out" className="side-nav fixed">
                <div className = "user-info">
                {
                  (!this.state.user)?<div/>:
                  (<div>
                    {(this.state.user.avatar !== '')?<img src={host+"uploads/"+this.state.user.avatar+'.jpg'} />:<div className='avatar'><i className="material-icons">person</i></div>}
                    <p>{this.state.user.name}</p>
                  </div>)
                }
                </div>
              { /* <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="/about">About</NavLink></li>
            <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="/repos">Repos</NavLink></li>*/}
                <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="/newsfeed">動態</NavLink></li>
                <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="/friendlist">好友</NavLink></li>
                <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="/clublist">我的社團</NavLink></li>
                <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="activitylist" >活動</NavLink></li>
                <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="applylist" >申請</NavLink></li>
                <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="/adminclublist">處室公告</NavLink></li>
                <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to={"/profile/"+localStorage.uid}>我的空間</NavLink></li>
                <li><NavLink onClick={()=>{localStorage.removeItem("token");$('.button-collapse').sideNav('hide');}} to="/login">登出</NavLink></li>
            </ul>
        </nav>

        <main className="container">
          {this.props.children}
        </main>

      </div>
    )
  },
  getInitialState: function() {
    return {
      user: null
    };
    getUserInfo.call(this);
  },
  back: function () {
    browserHistory.goBack();
  },
  componentDidMount: function () {
     $(".button-collapse").sideNav();
     getUserInfo.call(this);
  }
});

function getUserInfo() {
  $.ajax({url: host+'ajax/getUserInfo',
     type: 'POST',
     headers:{
       'x-access-token':token
     }
  }).done(function(msg) {
    console.log(msg);
    if(msg.status){
      this.setState({
        user: msg.result
      });
    }
  }.bind(this)).fail(function() {
    console.log("error");
  });
}
