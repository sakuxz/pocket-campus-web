const React = require('react');
const ReactDOM = require('react-dom');
const host = require('./setting').host;
const token = require('./setting').token;
const colors = require('./setting').colorPattern;

// {
//   name:"陳湧淵",
//   avatar:"./image/hamesome.jpg",
//   time:1453569078927,
//   content:"hgfhgfhgfhfghgfhfghfg",
//   isLike:true,
//   likeNum:6,
//   replyNum:1,
//   pid: 1,
//   hasPunch: true,
//   place: "喝喝茶",
//   score: 4
// }

function like(PID) {
  $.ajax({url: host+'ajax/likePost',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       pid:PID
     }
  }).done(function(msg) {
    console.log(msg);
  }.bind(this)).fail(function() {
    try{
      PlugIn.toast("無網路連線");
    }catch(e){}
    console.log("error");
  });
}

function dislike(PID) {
  $.ajax({url: host+'ajax/cancelLike',
     type: 'POST',
     headers:{
       'x-access-token':token
     },
     data:{
       pid:PID
     }
  }).done(function(msg) {
    console.log(msg);
  }.bind(this)).fail(function() {
    try{
      PlugIn.toast("無網路連線");
    }catch(e){}
    console.log("error");
  });
}

export default React.createClass({
  displayName: 'Post',
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    return (
      <div className="post-card" ref="card" onClick={this.openComment}>
        <div className="header">
          {(this.props.data.avatar !== '')?<img src={host+"uploads/"+this.props.data.avatar+'.jpg'} />:<div className='avatar'><i className="material-icons">person</i></div>}
          <div>
            <p>{this.props.data.name} {(this.props.data.atClub)?<span><i className="material-icons">chevron_right</i>{this.props.data.club}</span>:null}</p>
            <span>{new Date(this.props.data.time).toLocaleString()}</span>
          </div>
        </div>
        <div className="content">
          {(this.props.data.hasPunch)?<div className="rating">
            <div className="ui mini star rating" ref='rating'></div>
            <span> <i className="material-icons place-icon" >place</i>{this.props.data.place}</span>
          </div>:null}
          <div>{this.props.data.content}</div>
          <span style={{marginLeft:0}} className={(this.props.data.isLike)?"like done":"like"} onClick={this.like} >
            {
              (this.props.data.isLike)?
                <i className="material-icons" style={{transform: 'translateY(1.5px)'}}>favorite</i>:
                <i className="material-icons" style={{transform: 'translateY(1.5px)'}}>favorite_border</i>
            }
            {this.props.data.likeNum}
          </span>
          <span>
            <i className="material-icons">chat_bubble_outline</i>
            {this.props.data.replyNum}
          </span>
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    if(this.props.data.hasPunch){
      $(this.refs.rating).rating({
        initialRating: this.props.data.score,
        maxRating: 5
      });
      $(this.refs.rating).rating('disable');
    }
  },
  openComment: function(){
    //PlugIn.openComment(this.props.data.PID);
    location.hash = "/comment/"+this.props.data.PID;
  },
  like: function(e) {
    e.stopPropagation();
    if($(e.currentTarget).hasClass('done')){
      this.dislike();
      return;
    }
    like(this.props.data.PID);
    const { props: { addLikeNum } } = this;
    addLikeNum(this.props.idx);
  },
  dislike: function() {
    dislike(this.props.data.PID);
    this.props.decreaseLikeNum(this.props.idx);
  }
});
