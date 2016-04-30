const React = require('react');
const ReactDOM = require('react-dom');
const host = require('setting').host;
const token = require('setting').token;
const colors = require('setting').colorPattern;
import Post from 'post.jsx';
import Loader from 'loader.jsx';

// officeInfo: {
//   name:'教務處',
//   memberNum:12,
//   postNum:63,
//   activityNum:5
// }

function getOfficeInfo(adid){
  $.ajax({url: host+'ajax/getOfficeInfo',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       adid: adid
     }
  }).done(function(msg) {
    this.setState({
      OffInfo: msg.result[0]
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
  // setTimeout(function() {
  //   this.setState({
  //     clubInfo: {
  //       name:'教務處',
  //       memberNum:12,
  //       postNum:63,
  //       activityNum:5
  //     }
  //   });
  // }.bind(this),300);
}

function getPost(adid){
  $.ajax({url: host+'ajax/getPost',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       id: adid
     }
  }).done(function(msg) {
    console.log(msg);
    var tdata = msg.result || [];
    var data = tdata.map(function (e,i) {
      e.name = "公告";
      e.avatar = "";
      return e;
    });
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
  // setTimeout(function() {
  //   this.setState({
  //     post: [
  //       {
  //         name:"教務處",
  //         avatar:"",
  //         time:14535679078927,
  //         content:" 期中退選 可以開始申請了",
  //         isLike:false,
  //         likeNum:6,
  //         replyNum:0
  //       },
  //       {
  //         name:"教務處",
  //         avatar:"",
  //         time:1453569078927,
  //         content:"菸害防制宣導系列活動開始報名搂",
  //         isLike:false,
  //         likeNum:6,
  //         replyNum:0
  //       },
  //       {
  //         name:"教務處",
  //         avatar:"",
  //         time:1453565078927,
  //         content:"今晚7點服務隊成果發表歡迎大家來參加",
  //         isLike:true,
  //         likeNum:12,
  //         replyNum:6
  //       },
  //       {
  //         name:"教務處",
  //         avatar:"",
  //         time:1453562078927,
  //         content:"汽機車校園停車證開放申請摟",
  //         isLike:false,
  //         likeNum:3,
  //         replyNum:1
  //       },
  //       {
  //         name:"教務處",
  //         avatar:"",
  //         time:1453561078927,
  //         content:"3/19全國校園評鑑  社團記得準備好相關文件喔!!!",
  //         isLike:true,
  //         likeNum:6,
  //         replyNum:0
  //       },
  //       {
  //         name:"教務處",
  //         avatar:"",
  //         time:1453560078927,
  //         content:"今晚9點社團場地協調",
  //         isLike:false,
  //         likeNum:2,
  //         replyNum:0
  //       }
  //     ]
  //   });
  // }.bind(this),500);
}

var OfficePage = React.createClass({
  getInitialState: function() {
    getOfficeInfo.call(this,this.props.adid);
    return {
      OffInfo:null,
      bg: 'url(./css/image/bbg'+Math.floor(Math.random()*4)+'.jpg)'
    };
  },
  render: function() {
    if (this.state.OffInfo === null) {
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
            <p className='title'>{this.state.OffInfo.name[0]}<div/></p>
            <p>{this.state.OffInfo.name.slice(1)}</p>
          </div>
          <div className='club content'>
            <p><i className="material-icons">person</i>{this.state.OffInfo.memberNum}</p>
            <p><i className="material-icons">chat_bubble</i>{this.state.OffInfo.postNum}</p>
            <p><i className="material-icons">event_note</i>{this.state.OffInfo.activityNum}</p>
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
      getPost.call(this,this.props.adid);
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
        <OfficePage adid={this.props.params.ADID} />
        <Posts adid={this.props.params.ADID} />
      </div>
    );
  }
});
