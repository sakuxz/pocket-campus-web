const React = require('react');
const ReactDOM = require('react-dom');
const host = require('setting').host;
var token = require('setting').token;
const colors = require('setting').colorPattern;
import Loader from 'loader';

// comments:[
//   {
//     name:"古G8",
//     time:1452269079999,
//     content:'我要打桌球',
//     avatar:"./image/hamesome.jpg",
//   }
// ]

function getComment(){
  $.ajax({url: host+'ajax/getComments',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       pid: this.props.params.PID
     }
  }).done(function(msg) {
    console.log(msg);
    this.setState({
      comments: msg.result || []
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

function addComment(content,PID){
  return new Promise(function(resolve, reject) {
    $.ajax({url: host+'ajax/comment',
       type: 'POST',
       headers:{
         'x-access-token':token
       },
       data:{
         pid: PID,
         content: content
       }
    }).done(function(msg) {
      console.log(msg);
      resolve(msg);
    }.bind(this)).fail(function() {
      reject();
      try{
        PlugIn.toast("無網路連線");
      }catch(e){}
      console.log("error");
    });
  });
}

var Comment = React.createClass({
  render: function(){
    return (
      <div className="comment">
        {(this.props.data.avatar !== '')?<img style={{animationDelay:0.1*this.props.idx+"s"}}  src={host+"uploads/"+this.props.data.avatar+'.jpg'} />:<div style={{animationDelay:0.1*this.props.idx+"s"}} className='avatar'><i className="material-icons">person</i></div>}
        <div style={{animationDelay:0.1*this.props.idx+0.05+"s"}}>
          <p className="name">{this.props.data.name}</p>
          <p className="content">{this.props.data.content}</p>
          <p className="time">{new Date(this.props.data.time).toLocaleString()}</p>
        </div>

      </div>
    );
  }
});

export default React.createClass({
  getInitialState: function() {
    getComment.call(this);
    this.intervalID = setInterval(function() {
      getComment.call(this);
    }.bind(this),800);
    return {
      comments:null
    };
  },
  intervalID: null,
  render: function(){
    if(this.state.comments === null){
      return <Loader/>;
    }else{
      var nodes = this.state.comments.map(function(e,i) {
        return <Comment data={e} idx={i} key={i} />
      }.bind(this));
      return (
        <div className="comments">
          <div className="reply">
            <input type="text" ref='msg' />
            <button onClick={this.addComment} className="btn waves-effect waves-light" type="submit" name="action">
              <i className="material-icons">send</i>
            </button>
          </div>
          {nodes}
        </div>
      );
    }
  },
  addComment: function() {
    // this.state.comments.push({
    //   name:"古G8",
    //   time:1452269079999,
    //   content:this.refs.msg.value,
    //   avatar:"./image/hamesome.jpg",
    // });
    // this.setState({
    //   comments: this.state.comments
    // });
    addComment.call(this,this.refs.msg.value,this.props.params.PID).then(function() {
      getComment.call(this);
    }.bind(this));
    this.refs.msg.value = "";
  },
  componentWillUnmount: function () {
    clearInterval(this.intervalID);
  }
});
