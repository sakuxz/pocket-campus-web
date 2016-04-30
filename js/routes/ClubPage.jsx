const React = require('react');
const ReactDOM = require('react-dom');
const host = require('setting').host;
const token = require('setting').token;
const colors = require('setting').colorPattern;
import Post from 'post.jsx';
import Loader from 'loader.jsx';
import Fab from 'fab';


// clubInfo: {
//   name:'資訊工程系學會',
//   memberNum:50,
//   postNum:12,
//   activityNum:2
// }

function getClubInfo(cid){
  $.ajax({url: host+'ajax/getClubInfo',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       cid: cid
     }
  }).done(function(msg) {
    console.log(msg);
    this.setState({
      clubInfo: msg.result[0]
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

function getPost(cid){
  $.ajax({url: host+'ajax/getPost',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       id: cid
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

var ClubPage = React.createClass({
  getInitialState: function() {
    getClubInfo.call(this,this.props.cid);
    return {
      clubInfo:null,
      bg: 'url(./css/image/bbg'+Math.floor(Math.random()*4)+'.jpg)'
    };
  },
  render: function() {
    if (this.state.clubInfo === null) {
      return (
        <div className="club profile-card" style={{backgroundImage:this.state.bg}} ref="card">
          <div className='club header'>
            <p className='title'>資</p>
            <p>訊工程系學會</p>
          </div>
          <div className='club content'>
            <p><i className="material-icons">person</i>0</p>
            <p><i className="material-icons">chat_bubble</i>0</p>
            <p><i className="material-icons">event_note</i>0</p>
          </div>
        </div>
      );
    }else{
      return (
        <div className="profile-card club" style={{backgroundImage:this.state.bg}} ref="card">
          <div className='club header'>
            <p className='title'>{this.state.clubInfo.name[0]}<div/></p>
            <p>{this.state.clubInfo.name.slice(1)}</p>
          </div>
          <div className='club content'>
            <p><i className="material-icons">person</i>{this.state.clubInfo.memberNum}</p>
            <p><i className="material-icons">chat_bubble</i>{this.state.clubInfo.postNum}</p>
            <p><i className="material-icons">event_note</i>{this.state.clubInfo.activityNum}</p>
          </div>
        </div>
      );
    }
  },
  isEnter: false,
  componentDidUpdate: function(){
    if(this.state.userInfo !== null && this.isEnter === false){
      this.refs.card.style.cssText += "animation: blurin 0.8s forwards;"
      this.isEnter = true;
    }
  }
});

var Posts = React.createClass({
  getInitialState: function() {
    return {
      post:null
    }
  },
  render: function(){
    var nodes;
    if(this.state.post === null){
      getPost.call(this,this.props.cid);
      return <Loader/>;
    }else{
      nodes = this.state.post.map(function(e,i) {
        return <Post data={e} addLikeNum={this.addLikeNum} decreaseLikeNum={this.decreaseLikeNum} idx={i} key={i} />
      }.bind(this));
    }
    return <div>{nodes}</div>;
  },
  expend:false,
  componentDidMount: function() {
      window.addEventListener("hashchange",function(){
        if(location.hash.search("refresh") !== -1 ){
          location.hash = location.hash.replace("refresh","");
          getPost.call(this);
        }
      }.bind(this));

    var h = document.querySelector(".profile-card .header").offsetHeight;
    window.addEventListener("scroll",function(e) {
      var sc = $(window).scrollTop();
      if(sc/h > 0.3){
        document.querySelector(".profile-card .header.club p.title div").style.cssText = 'animation: cover 1s forwards cubic-bezier(0.33, 0.82, 0.54, 1)';
        this.expend = true;
      }else{
        if(this.expend)
          document.querySelector(".profile-card .header.club p.title div").style.cssText = 'animation: uncover 1s forwards cubic-bezier(0.33, 0.82, 0.54, 1)';
      }
    }.bind(this));
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
        <ClubPage cid={this.props.params.CID} />
        <Posts cid={this.props.params.CID} />
        <Fab url={"/publish/"+this.props.params.CID} icon="mode_edit" />
      </div>
    );
  }
});
