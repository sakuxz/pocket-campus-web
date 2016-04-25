const React = require('react');
const ReactDOM = require('react-dom');
const host = require('setting').host;
const token = require('setting').token;
const colors = require('setting').colorPattern;
import Post from 'post.jsx';
import Loader from 'loader.jsx';

// userInfo: {
//   name:'陳湧淵',
//   dpt:'資訊工程系',
//   avatar:'./image/hamesome.jpg',
//   friendNum:50,
//   postNum:12,
//   punchNum:2,
//   isYour:true,
//   isFriend:false
// }

function setAvatar() {
  if(this.refs.avatar.files.length>0){
    var fd = new FormData();
    fd.append('avatar',this.refs.avatar.files[0]);
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
      if(JSON.parse(xhr.responseText).status){
        console.log('ok');
        getUserInfo.call(this);
      }
    }.bind(this);
    xhr.open('POST', host+'ajax/setAvatar');
    xhr.setRequestHeader("x-access-token",token);
    xhr.send(fd);
  }
}

function checkFriendStatus(uid){
  $.ajax({url: host+'ajax/checkFriendStatus',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       uid: uid
     }
  }).done(function(msg) {
    console.log(msg);
    this.setState({
      friendStatus: msg.result.friendStatus
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

function getUserInfo(uid){
  $.ajax({url: host+'ajax/getUserInfo',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       uid:uid
     }
  }).done(function(msg) {
    console.log(msg);
    this.setState({
      userInfo: msg.result
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

function getPost(uid){
  $.ajax({url: host+'ajax/getPost',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       id:uid
     }
  }).done(function(msg) {
    console.log(msg);
    this.setState({
      post: msg.result || []
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

function inviteFriend(uid){
  $.ajax({url: host+'ajax/inviteFriend',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       otheruid:uid
     }
  }).done(function(msg) {
    console.log('ok');
  }.bind(this)).fail(function() {
    try{
      PlugIn.toast("無網路連線");
    }catch(e){}
    console.log("error");
  });
}

var Profile = React.createClass({
  getInitialState: function() {
    checkFriendStatus.call(this,this.props.uid);
    return {
      userInfo:null,
      bg: 'url(./css/image/bbg'+Math.floor(Math.random()*4)+'.jpg)',
      friendStatus: null
    };
  },
  render: function() {
    if (this.state.userInfo === null) {
      getUserInfo.call(this,this.props.uid);
      return (
        <div className="profile-card" style={{backgroundImage:this.state.bg}} ref="card">
          <div className='header'>
            <button/>
            <img style={{background:"black"}}/>
            <p>name</p>
            <p>depart</p>
          </div>
          <div className='content'>
            <p><i className="material-icons">people</i>0</p>
            <p><i className="material-icons">chat_bubble</i>0</p>
            <p><i className="material-icons">place</i>0</p>
          </div>
        </div>
      );
    }else{
      var addFriend = (!this.state.friendStatus || this.state.userInfo.isFriend)?<div/>:(this.state.friendStatus === 'not_send')?
        <button onClick={this.addFriend} className="circle"><i className="material-icons circle">person_add</i></button>:<span className="label">等候回應</span>;
      return (
        <div className="profile-card" style={{backgroundImage:this.state.bg}} ref="card">
          <div className='header'>
            {(this.state.userInfo.isYour)?
              <button onClick={this.setAvatar} ><i className="material-icons">cloud_upload</i>頭貼</button>:
              addFriend}
            {(this.state.userInfo.avatar !== '')?<img src={host+"uploads/"+this.state.userInfo.avatar+'.jpg'} />:<div className='avatar'><i className="material-icons">person</i></div>}
            <p>{this.state.userInfo.name}</p>
            <p>{this.state.userInfo.dpt}</p>
            <div/>
          </div>
          <input onChange={this.upload} ref='avatar' type='file' accept="image/*" className="upload" />
          <div className='content'>
            <p><i className="material-icons">people</i>{this.state.userInfo.friendNum}</p>
            <p><i className="material-icons">chat_bubble</i>{this.state.userInfo.postNum}</p>
            <p><i className="material-icons">place</i>{this.state.userInfo.punchNum}</p>
          </div>
        </div>
      );
    }
  },
  setAvatar :function() {
    this.refs.avatar.click();
  },
  upload: function() {
    setAvatar.call(this);
  },
  isEnter: false,
  addFriend: function(e){
    inviteFriend(this.props.uid);
     $(e.currentTarget).addClass('done');
     setTimeout(function() {
       this.setState({
         friendStatus: 'waiting_for_reply'
       });
     }.bind(this),600);
  },
  componentDidUpdate: function(){
    if(this.state.userInfo !== null && this.isEnter === false){
      this.refs.card.style.cssText += "animation: blurin 0.8s forwards;"
      this.isEnter = true;
    }
  }
});

// post:[
//   {
//     name:"陳湧淵",
//     avatar:"./image/hamesome.jpg",
//     time:1453569078927,
//     content:"hgfhgfhgfhfghgfhfghfg",
//     isLike:true,
//     likeNum:6,
//     replyNum:1
//   }
// ]

var Posts = React.createClass({
  getInitialState: function() {
    return {
      post:null
    }
  },
  render: function(){
    var nodes;
    if(this.state.post === null){
      getPost.call(this,this.props.uid);
      return <Loader/>;
    }else{
      nodes = this.state.post.map(function(e,i) {
        return <Post data={e} addLikeNum={this.addLikeNum} decreaseLikeNum={this.decreaseLikeNum} idx={i} key={i} />
      }.bind(this));
    }
    return <div>{nodes}</div>;
  },
  componentDidMount: function() {
    window.addEventListener("hashchange",function(){
      if(location.hash.search("refresh") !== -1 ){
        location.hash = location.hash.replace("refresh","");
        getPost.call(this);
      }
    }.bind(this));

    var h = document.querySelector(".profile-card .header").offsetHeight-35;
    window.addEventListener("scroll",function(e) {
      var sc = $(window).scrollTop();
      //document.querySelector(".profile-card .header p").style.cssText = "transform:translate3d(0%,"+sc+"px,0);";
      //document.querySelector(".profile-card .header img").style.cssText = "transform:translate3d(0%,"+sc+"px,0);";
      //document.querySelector(".profile-card .header p:nth-child(4)").style.cssText = "transform:translate3d(0%,"+sc+"px,0);";
      document.querySelector(".profile-card .header div").style.cssText = "opacity:" + sc/h;
      //document.querySelector(".profile-card").style.cssText += "background-position-y:"+sc*0.65+"px;";
    });

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

export default React.createClass({
  render: function () {
    return (
      <div>
        <Profile uid={this.props.params.uid} />
        <Posts uid={this.props.params.uid} />
      </div>
    );
  }
});
