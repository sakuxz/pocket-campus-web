import React from 'react'
import NavLink from './NavLink'
import { browserHistory } from 'react-router'

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
                <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="/about">About</NavLink></li>
                <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="/repos">Repos</NavLink></li>
                <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="/newsfeed">動態</NavLink></li>
                <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="/friendlist">好友</NavLink></li>
                <li><NavLink onClick={()=>{$('.button-collapse').sideNav('hide');}} to="/profile/5">我的空間</NavLink></li>
                <li><NavLink onClick={()=>{localStorage.removeItem("token");$('.button-collapse').sideNav('hide');}} to="/login">登出</NavLink></li>
            </ul>
        </nav>

        <main className="container">
          {this.props.children}
        </main>

      </div>
    )
  },
  back: function () {
    browserHistory.goBack();
  },
  componentDidMount: function () {
     $(".button-collapse").sideNav();
  }
})
