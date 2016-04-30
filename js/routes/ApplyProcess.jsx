const React = require('react');
const ReactDOM = require('react-dom');
const host = require('setting').host;
const token = require('setting').token;


var example_data = {
  flow:["申請人","資工系","輔諮系","學務處"],
  flow_at:"輔諮系",
  status:[13215113]
};

export default React.createClass({
  render: function() {
    if(this.state.data.flow === undefined){
      // setTimeout(function(){
      //   this.setState({data:example_data});
      // }.bind(this),1000);
      $.ajax({
        url: host+'admin/getApplyProcess',
        type: 'GET',
        data: {apply_id: this.props.params.APID},
        headers:{
          'x-access-token':token
        }
      })
      .done(function(msg) {
        console.log(msg);
        this.setState({data : JSON.parse(msg.result) })
        PlugIn.stopRefresh();
      }.bind(this))
      .fail(function() {
        PlugIn.toast("無網路連線");
        console.log("error");
      })
      return (<div></div>);

      return <div/>;
    }
    var nodes = this.state.data.flow.map(function(e,i){
      if(i == 0) return;
      var time = "尚未抵達";
      try{
        if(this.state.data.status[i-1]!==undefined){
          time = (new Date(this.state.data.status[i-1]) ).toLocaleDateString()+" 審核通過";
        }else if(e === this.state.data.flow_at){
          time = "審核中";
        }
      }catch(err){
        if(e === this.state.data.flow_at){
          time = "審核中";
        }
      }

      return (
        <div className="cd-timeline-block" key={i}>
          <div style={{animationDelay:i*0.2+'s'}} className={(e === this.state.data.flow_at)?"cd-timeline-img cd-picture act":"cd-timeline-img cd-picture"}>
          </div>
          <div className="cd-timeline-content">
            <h2>{e}</h2>
            <span className="cd-date">{time}</span>
          </div>
        </div>
      );
    }.bind(this));
    return (
      <div>
        <section id="cd-timeline" className="cd-container">
          {nodes}
        </section>
        <div className="cd-timeline-block final">
          <div className={(this.state.data.flow_at==="finished")? "cd-timeline-img cd-picture act" : "cd-timeline-img cd-picture" } >
            <i className="material-icons">done</i>
          </div>
          <div className="cd-timeline-content">
            <h2>完成申請</h2>
          </div>
        </div>
      </div>
    );
  },
  getInitialState: function() {
    return {data:{}};
  }
});
