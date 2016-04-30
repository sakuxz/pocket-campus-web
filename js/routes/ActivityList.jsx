const React = require('react');
const ReactDOM = require('react-dom');
const host = require('setting').host;
const token = require('setting').token;
const colors = require('setting').colorPattern;

// var data = [
//   {
//     name: "捐血",
//     time: 1231545132,
//     content: "捲起袖子捐血救人",
//     type: "服務性",
//     place: "活中",
//     aid: 1,
//     isJoin: false
//   },
//   {
//     name: "捐血",
//     time: 1231545180,
//     content: "捲起袖子捐血救人",
//     type: "康樂性",
//     place: "活中",
//     aid: 1,
//     isJoin: true
//   },
//   {
//     name: "捐血",
//     time: 5031545180,
//     content: "捲起袖子捐血救人",
//     type: "服務性",
//     place: "活中",
//     aid: 1,
//     isJoin: false
//   }
// ];
// this.setState({
//   data: refactorData(data)
// });

function refactorData(data) {
  var r = [];
  var cur = 0;
  data.forEach(function(e,i) {
    if(i == 0){
      r.push([]);
      e.date = new Date(e.time).toLocaleDateString();
      r[cur].push(e);
    }else{
      var currentDate = new Date(r[cur][0].time).toLocaleDateString();
      var targetDate = new Date(e.time).toLocaleDateString();
      if(currentDate === targetDate){
        e.date = targetDate;
        r[cur].push(e);
      }else{
        r.push([]);
        cur++;
        e.date = targetDate;
        r[cur].push(e);
      }
    }
  });
  console.log(r);
  return r;
}

function getActivity() {
  $.ajax({url: host+'ajax/getActivitys',
     type: 'POST',
     headers:{
       'x-access-token':token
     }
  }).done(function(msg) {
    console.log(msg);
    if(location.hash.search("user") !== -1 ){
      msg.result = msg.result.filter(function(e,i) {
        return e.isJoin;
      });
    }
    this.setState({
       data: refactorData(msg.result)
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

function joinActivity(AID) {
  return new Promise(function(resolve, reject) {
    $.ajax({url: host+'ajax/joinActivity',
       type: 'POST',
       headers:{
         'x-access-token':token
       },
       data: {
         aid: AID
       }
    }).done(function(msg) {
      console.log(msg);
      if(msg.status)
        resolve(msg);
      else reject();
    }.bind(this)).fail(function() {
      reject();
      try{
        PlugIn.toast("無網路連線");
      }catch(e){}
      console.log("error");
    });
  });
}

var activityType = [
  {name:'服務性',id:1},
  {name:'康樂性',id:2},
  {name:'學藝性',id:3},
  {name:'體育性',id:4},
  {name:'聯誼性',id:5},
  {name:'演講性',id:6}
];

function getActivityTypeId(act) {
  var id;
  activityType.forEach(function(e,i) {
    if(act === e.name){
      id = e.id;
    }
  });
  return id;
}

var Activity = React.createClass({
  getInitialState: function() {
    return {
      isJoin: false
    }
  },
  render: function() {
    return (
      <div style={{animationDelay:0.1*this.props.idx+"s"}} ref='wrapper' className={(this.props.data.isJoin||this.state.isJoin)?"activity join":"activity"} >
         <div onClick={this.toggleOpen} ref='activity'>
           <span className="type"><span className='dot' style={{background: colors[getActivityTypeId(this.props.data.type)]}}></span>{this.props.data.type}</span>
           <p>{this.props.data.name}</p>
           <span className='info'><i className="material-icons">event_note</i> {this.props.data.content}</span>
           <span className='info'><i className="material-icons">access_time</i> {new Date(this.props.data.time).toLocaleTimeString()}</span>
           <span className='info'><i className="material-icons">place</i> {this.props.data.place}</span>
           {(this.props.data.isJoin||this.state.isJoin)?<a onClick={this.openTicket} className="ticket-btn waves-effect btn-flat">取得入場票券</a>:<a onClick={this.joinActivity} className="join-btn waves-effect btn-flat">Join</a>}
         </div>
      </div>
    );
  },
  toggleOpen: function() {
    if(this.refs.activity.style.height === this.height+"px"){
      this.refs.activity.style.height = "3.2em";
      this.refs.activity.style.boxShadow = "none";
      this.refs.activity.style.transform = "none";
    }else{
      this.refs.activity.style.height = this.height+"px";
      this.refs.activity.style.boxShadow = "0 5px 10px -2px #B6B6B6"
      this.refs.activity.style.transform = "translateY(-3px)";
    }
  },
  joinActivity: function(e) {
    e.stopPropagation();
    joinActivity(this.props.data.AID).then(function() {
      this.setState({
        isJoin:true
      });
    }.bind(this));
  },
  openTicket: function(e) {
    e.stopPropagation();
    location.hash = "/ticket/"+this.props.data.AID;
  },
  height: null,
  componentDidMount: function() {
    this.height = this.refs.wrapper.offsetHeight;
    this.refs.activity.style.height = "3.2em";
    this.refs.activity.style.opacity = 1;
  }
});

var Activitys = React.createClass({
  render: function() {
    if(this.props.noData){
      if(location.hash.search("user") !== -1){
        return (
          <div className="no-data" >
             <div>
               <i className="material-icons">event_note</i>
               <p>沒有活動</p>
               <span>這裡會顯示你參加的活動</span>
             </div>
          </div>
        );
      }
      return (
        <div className="no-data" >
           <div>
             <i className="material-icons">event_note</i>
             <p>沒有活動</p>
             <span>這裡會顯示可參加的活動</span>
           </div>
        </div>
      );
    }
    var nodes = this.props.data.map(function(e,i) {
      return <Activity data={e} key={i} idx={i} />
    })
    return (
      <div className="activitys">
         <div className="date">
           <p>{this.props.data[0].date.split("/")[2]}</p>
           <p>{this.props.data[0].date.split("/")[1]+"  月"}</p>
         </div>
         {nodes}
      </div>
    );
  }
});

export default React.createClass({
  getInitialState: function() {
    getActivity.call(this);
    return {
      data: null
    };
  },
  render: function() {
    if (this.state.data !== null) {
      var nodes = this.state.data.map(function(e, i) {
        return <Activitys data={e} key={i} idx={i} />;
      });
    }
    return (
      <div className="activity-list-wrapper">
        { (!this.state.data)?<div/>:(nodes.length === 0)?<Activitys noData={true} />:nodes }
      </div>
    );
  },
  componentDidMount:function(){
    window.addEventListener("hashchange",function(){
      if(location.hash.search("refresh") !== -1 ){
        location.hash = location.hash.replace("refresh","");
        getActivity.call(this);
      }
    }.bind(this));

  }
});
