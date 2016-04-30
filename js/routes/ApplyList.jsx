const React = require('react');
const ReactDOM = require('react-dom');
const host = require('setting').host;
const token = require('setting').token;
const colors = require('setting').colorPattern;

var NoDataInfo = React.createClass({
  render: function() {
    return (
      <div className="no-data-info">
         <i className="material-icons">info_outline</i> <span>尚無資料</span>
      </div>
    );
  }
});

// var colors = ['pink lighten-2', 'purple lighten-2', 'light-blue lighten-1', 'teal', 'green darken-1', "yellow accent-3", "orange lighten-1"];
// var lastColor = 0;
// var llastColor = 1;

var ApplyList = React.createClass({
  render: function() {
    var unit = this.props.data.flow[this.props.data.flow.length - 1];
    var badge = (this.props.data.lastest === true)
      ? (
        <span className="new badge">{this.props.data.lastest}</span>
      )
      : null;
    var applyed = (this.props.data.hasApplyed !== true)
      ?  null :
      (this.props.data.finished)? <div className="list-applyed-mes done"><i className="material-icons">done</i></div> :
       <div className="list-applyed-mes"><i className="material-icons">history</i></div> ;

    var color = 0;
    this.props.data.icon.split('').forEach(function(e){
      color += e.charCodeAt();
    });
    color += 7;
    color = color%colors.length;
    return (
      <div ref='item' className={(applyed)?"apply-list waves-effect applyed":"apply-list waves-effect"} onClick={this.startApply} data-id={this.props.data._id} data-title={this.props.data.title} data-detail={this.props.data.description} >
        {applyed}
        <i style={{background:colors[color]}} className="material-icons">{(this.props.data.icon)
            ? this.props.data.icon
            : 'school'}</i>
        <h3>{this.props.data.title}</h3>
        <p>{unit}</p>
        {badge}
      </div>
    );
  },
  startApply:function(){
    if(this.props.data.hasApplyed){
      location.hash = "/applyprocess/"+$(this.refs.item).data('id');
    }else location.hash = "/applyform/"+$(this.refs.item).data('id');
  },
  getInitialState: function() {
    // var color;
    // while ((color = Math.floor(Math.random() * 7)) == lastColor || color == llastColor) ;
    // llastColor = lastColor;
    // lastColor = color;
    // var iconClass = 'material-icons ' + colors[color];
    // return {iconClass: iconClass};
    return {};
  }
});

export default React.createClass({
  getInitialState: function() {
    return {
      data: null
    };
  },
  render: function() {
    if (this.state.data === null) {
      $.ajax({url: host+'admin/getCustomForm',
         type: 'GET',
         headers:{
           'x-access-token':token
         }
      }).done(function(msg) {
        console.log(msg);
        this.setState({data: JSON.parse(msg)});
        try{
          PlugIn.stopRefresh();
        }catch(e){}
      }.bind(this)).fail(function() {
        PlugIn.toast("無網路連線");
        PlugIn.stopRefresh();
        console.log("error");
      });
    }
    var io = false;
    if(this.state.data !== null){
      var nodes = this.state.data.map(function(e, i) {
        if(e.hasApplyed){
          io = true;
          return (
            <ApplyList data={e} key={i}/>
          );
        }
      });
      var nodes2 = this.state.data.map(function(e, i) {
        if(!e.hasApplyed){
          return (
            <ApplyList data={e} key={i}/>
          );
        }
      });
    }
    return (
      <div>
        { (io)?<h5 className="apply-list-title">已申請服務</h5>:<div/> }
        {nodes}
        <h5 className="apply-list-title blueT" style={{marginTop: '1.6em'}}>可申請列表</h5>
        { (!this.state.data)?<div/>:(nodes2.length === 0)?<NoDataInfo />:nodes2 }
      </div>
    );
  },
  componentDidMount:function(){
    window.addEventListener("hashchange",function(){
      if(location.hash === "#refresh"){
        $.ajax({url: host+'admin/getCustomForm',
           type: 'GET',
           headers:{
             'x-access-token':token
           }
        }).done(function(msg) {
          console.log(msg);
          this.setState({data: JSON.parse(msg)});
          try{
            PlugIn.stopRefresh();
          }catch(e){}
          location.hash = ""
        }.bind(this)).fail(function() {
          PlugIn.toast("無網路連線");
          PlugIn.stopRefresh();
          location.hash = ""
          console.log("error");
        });
      }
    }.bind(this));

  }/*,
  componentDidUpdate:function(){
    // $(".list-applyed-mes").each(function(index, el) {
    //   $(this).removeClass('list-applyed-mes');
    //   setTimeout(function(){
    //     $(this).addClass('list-applyed-mes');
    //   }.bind(this),10);
    // });
  }*/
});
