const React = require('react');
const ReactDOM = require('react-dom');
import { browserHistory } from 'react-router'
const host = require('setting').host;
const token = require('setting').token;

function publish(content,uid){
  $.ajax({
    url: host+'ajax/publish',
    type: 'POST',
    data: {
      content:content,
      postAt: uid
    },
    headers:{
      'x-access-token':token
    }
  })
  .done(function(msg) {
    if(msg.status === true){
      Materialize.toast("完成分享", 4000);
      browserHistory.goBack();
    }
  }.bind(this))
  .fail(function() {
    this.isSend = false;
    Materialize.toast("無網路連線", 4000);
  }.bind(this));
}

export default React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    return (
      <div className="post-form">
        <textarea ref='ctn' placeholder='有甚麼新鮮事與大家分享' />
        <div className='post-ctl' ref='ctl' onContextmenu="return false">
          {/*<a className="waves-effect btn-flat tooltipped" data-position="top" data-delay="50" data-tooltip="打卡"><i className="material-icons">add_location</i></a>*/}
          <button onClick={this.send} style={{float:'right',padding:'0 1.8em',boxShadow:'none'}} className="btn blue lighten-1" type="submit">
            <i className="material-icons">send</i>
          </button>
        </div>
      </div>
    );

  },
  componentDidMount: function(){
    $('.tooltipped').tooltip({delay: 50});
    $('body').scrollTop(0);
    //this.refs.ctl.oncontextmenu = ()=>{return false;}
  },
  isSend: false,
  send: function(e) {
    if(this.isSend) return;
    console.log($(this.refs.ctn).val());
    if($(this.refs.ctn).val() == '') return;
    e.currentTarget.classList.add('loadstripes');
    e.currentTarget.style.cssText="animation: 1s progress-bar-stripes infinite";
    var target = this.props.params.UID || localStorage.uid;
    publish.call(this, this.refs.ctn.value, target);
    this.isSend = true;
  }
});
