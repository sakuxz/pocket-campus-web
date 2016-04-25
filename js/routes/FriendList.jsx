const React = require('react');
const ReactDOM = require('react-dom');
const host = require('setting').host;
var token = require('setting').token;
import Loader from 'loader';

// recommend:{
//   name:"陳湧淵",dpt:"資工系",avatar:'./image/hamesome.jpg',sameNum:64,
//   avatars: ['./image/hamesome.jpg','./image/hamesome.jpg','./image/hamesome.jpg']
// }
// friends: [
//   {name:"陳湧淵",dpt:"資工系",avatar:'./image/hamesome.jpg'},
//   {name:"陳湧淵",dpt:"資工系",avatar:'./image/hamesome.jpg'}
// ]
// invited:[
//   {name:"陳湧淵",dpt:"資工系",avatar:'./image/hamesome.jpg',sameNum:64,
//     avatars: ['./image/hamesome.jpg','./image/hamesome.jpg','./image/hamesome.jpg']
//   },
//   {name:"陳湧淵",dpt:"資工系",avatar:'./image/hamesome.jpg',sameNum:64,
//     avatars: ['./image/hamesome.jpg','./image/hamesome.jpg','./image/hamesome.jpg']
//   }
// ]

function acceptInvitation(fiid,callback){
  $.ajax({url: host+'ajax/acceptInvitation',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       fiid: fiid
     }
  }).done(function(msg) {
    console.log(msg);
    callback();
    console.log("ok");
  }.bind(this)).fail(function() {
    try{
      PlugIn.toast("無網路連線");
    }catch(e){}
    console.log("error");
  });
}

function rejectInvitation(fiid,callback){
  $.ajax({url: host+'ajax/rejectInvitation',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       fiid: fiid
     }
  }).done(function(msg) {
    console.log(msg);
    callback();
    console.log("ok");
  }.bind(this)).fail(function() {
    try{
      PlugIn.toast("無網路連線");
    }catch(e){}
    console.log("error");
  });
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
  }.bind(this)).fail(function() {
    try{
      PlugIn.toast("無網路連線");
    }catch(e){}
    console.log("error");
  });
}

function inviteFriend(uid,callback){
  $.ajax({url: host+'ajax/inviteFriend',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       otheruid: uid
     }
  }).done(function(msg) {
    console.log('ok');
    callback();
  }.bind(this)).fail(function() {
    try{
      PlugIn.toast("無網路連線");
    }catch(e){}
    console.log("error");
  });
}

var Friend = React.createClass({
  getInitialState: function() {
    checkFriendStatus.call(this,this.props.data.UID);
    return {
      friendStatus: null
    };
  },
  render: function() {
    if(this.props.noData){
      return (
        <div className="friend no-data" >
           <div>
             <i className="material-icons">people</i>
             <p>沒有好友</p>
             <span>看看我們為您推薦的好友吧</span>
           </div>
        </div>
      );
    }
    if(this.props.data.avatars){
      var avatars = this.props.data.avatars.map(function(e, i) {
        if(e !== "")
          return <img src={host+"uploads/"+e+'.jpg'} />;
      })
    }
    var accept = (
      <div>
        <button onClick={this.accept} className="accept">接受</button>
        <button onClick={this.reject} >拒絕</button>
      </div>
    );
    var invite = (this.state.friendStatus === null)?<div/>:(this.state.friendStatus==="not_send")?<button onClick={this.addFriend} >加好友</button>:<span className="label">等候回應</span>;
    return (
      <div onClick={this.openUser} style={{animationDelay:0.1*this.props.idx+"s"}} ref='wrapper' className='waves-effect friend' >
         {(this.props.data.avatar !== '')?<img src={host+"uploads/"+this.props.data.avatar+'.jpg'} />:<div className='avatar'><i className="material-icons">person</i></div>}
         <div>
           {(!this.props.data.sameNum)?null:(this.props.type)?accept:invite}
           <p>{this.props.data.name}</p>
           <span>{this.props.data.dpt}</span>
           {avatars}
           {(this.props.data.sameNum)?
             <span className="Badge">{this.props.data.sameNum+"+"}</span>:null}
         </div>
      </div>
    );
  },
  accept:function(e) {
    e.stopPropagation();
    acceptInvitation(this.props.data.FIID,function() {
      this.props.refreshInvited();
    }.bind(this));
  },
  reject:function(e) {
    e.stopPropagation();
    rejectInvitation(this.props.data.FIID,function() {
      this.props.refreshInvited();
    }.bind(this));
  },
  addFriend:function(e) {
    e.stopPropagation();
    inviteFriend(this.props.data.UID,function() {
      checkFriendStatus.call(this,this.props.data.UID);
    }.bind(this));
  },
  openUser: function() {
    try {
      PlugIn.openUser(this.props.data.UID);
    } catch (e) {}
  },
  componentDidMount:function(){
    window.addEventListener("hashchange",function(){
      if(location.hash === "#refresh"){
        checkFriendStatus.call(this,this.props.data.UID);
      }
    }.bind(this));

  }
});

function getFriends(){
  $.ajax({url: host+'ajax/getFriend',
     type: 'POST',
     headers:{
       'x-access-token':token
     }
  }).done(function(msg) {
    console.log(msg);
    this.setState({
      friends: msg.result || []
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

function getRecommend(){
  $.ajax({url: host+'ajax/getRecommendFriend',
     type: 'POST',
     headers:{
       'x-access-token':token
     }
  }).done(function(msg) {
    console.log(msg);

    // msg.result = msg.result.concat([
    //   {
    //       name:"昱安",dpt:"資工系",avatar:'ani',sameNum:20,
    //       avatars: ['','','']
    //   },
    //   {
    //       name:"古球中",dpt:"資工系",avatar:'bage',sameNum:2,
    //       avatars: ['','','']
    //   }
    // ]);

    this.setState({
      //recommend: msg.result[0] || {status:'no_data'}
      recommend: msg.result || []
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

function getInvited(){
  $.ajax({url: host+'ajax/getInvitedFriend',
     type: 'POST',
     headers:{
       'x-access-token':token
     }
  }).done(function(msg) {
    console.log(msg);
    this.setState({
      invited: msg.result || []
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
      friends: null,
      recommend: null,
      invited: null
    };
  },
  render: function() {
    if (this.state.friends === null) {
      getFriends.call(this);
    }else{
      var nodes = this.state.friends.map(function(e, i) {
        return <Friend data={e} key={i} idx={i} />;
      })
    }

    if(this.state.recommend === null){
      getRecommend.call(this);
    }else{
      if(this.state.recommend.status !== 'no_data')
        //var nodes2 = <Friend data={this.state.recommend} idx='0' />;
        var nodes2 = this.state.recommend.map(function(e, i) {
          return <Friend data={e} key={i} idx={i} />;
        });
    }

    if(this.state.invited === null){
      getInvited.call(this);
    }else{
      var nodes3 = this.state.invited.map(function(e, i) {
        return <Friend refreshInvited={this.refreshInvited} data={e} key={i} idx={i} type='1' />;
      }.bind(this));
    }

    return (
      <div className="friend-list">
        { (this.state.invited && nodes3.length > 0)?
          <div>
            <h5 className="apply-list-title">好友邀請</h5>
            {nodes3}
          </div>:null
        }
        { (this.state.recommend)?
          <div className="recommend">
            <h5 className="apply-list-title blueT">{/*你可能認識*/}推薦好友排序</h5>
            {nodes2}
          </div>:null
        }
        { (this.state.friends)?
        <div>
          <h5 className="apply-list-title yellowT">你的好友們</h5>
          { (nodes.length === 0)?<Friend noData={true} />:nodes }
        </div>:<Loader />
        }
      </div>
    );
  },
  refreshInvited: function() {
    getFriends.call(this);
    getRecommend.call(this);
    getInvited.call(this);
  },
  componentDidMount:function(){
    window.addEventListener("hashchange",function(){
      if(location.hash === "#refresh"){
        location.hash = "";
        getFriends.call(this);
        getRecommend.call(this);
        getInvited.call(this);
      }
    }.bind(this));

  }
});
