const React = require('react');
const ReactDOM = require('react-dom');
const host = require('setting').host;
var token = require('setting').token;
const colors = require('setting').colorPattern;
import Post from 'post';
import Loader from 'loader';

function getNewsFeed(){
  $.ajax({url: host+'ajax/getNewsFeedAndPosts',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       offset:0,
       limit:20
     }
  }).done(function(msg) {
    console.log(msg);
    this.setState({
      post: msg.result
    });
    try{
      PlugIn.stopRefresh();
    }catch(e){}
  }.bind(this)).fail(function() {
    try{
      PlugIn.toast("無網路連線");
      PlugIn.stopRefresh();
    }catch(e){}
    console.log("error");
  });
}

export default React.createClass({
  getInitialState: function() {
    return {
      post:null
    }
  },
  render: function(){
    var nodes;
    if(this.state.post === null){
      getNewsFeed.call(this);
      return <Loader/>;
      //return <div/>;
    }else{
      nodes = this.state.post.map(function(e,i) {
        return <Post data={e} addLikeNum={this.addLikeNum} decreaseLikeNum={this.decreaseLikeNum} idx={i} key={i} />
      }.bind(this));
    }
    return <div>{nodes}</div>;
  },
  expend:false,
  componentDidMount: function() {
    // window.addEventListener("hashchange",function(){
    //   if(location.hash === "#refresh"){
    //     location.hash = "";
    //     getNewsFeed.call(this);
    //   }
    // }.bind(this));
    //
    // var h = document.querySelector(".profile-card .header").offsetHeight;
    // window.addEventListener("scroll",function(e) {
    //   var sc = $(window).scrollTop();
    //   if(sc/h > 0.3){
    //     document.querySelector(".profile-card .header.club p.title div").style.cssText = 'animation: cover 0.8s forwards cubic-bezier(0.33, 0.82, 0.54, 1)';
    //     this.expend = true;
    //   }else{
    //     if(this.expend)
    //       document.querySelector(".profile-card .header.club p.title div").style.cssText = 'animation: uncover 0.8s forwards cubic-bezier(0.33, 0.82, 0.54, 1)';
    //   }
    // });

  },
  addLikeNum: function(i) {
    this.state.post[i].likeNum++;
    this.state.post[i].isLike = true;
    this.setState({
      post: this.state.post
    });
  },
  decreaseLikeNum: function(i) {
    this.state.post[i].likeNum--;
    this.state.post[i].isLike = false;
    this.setState({
      post: this.state.post
    });
  }
});
