const React = require('react');
const ReactDOM = require('react-dom');
import { browserHistory } from 'react-router'
const host = require('setting').host;
const token = require('setting').token;

var InputForm = React.createClass({render: function() {
    var node;
    switch (parseInt(this.props.type)) {
      case 0:
        node = (
          <div className="input-field"></div>
        );
        break;
      case 1:
        node = (
          <div className="input-field">
            <input name={this.props.index} type="text" className="validate" id={this.props.index} required />
            <label htmlFor={this.props.index}>
              {this.props.names}
            </label>
          </div>
        );
        break;
      case 2:
        node = (
          <div className="input-field">
            <input name={this.props.index} type="number" className="validate" id={this.props.index} required />
            <label htmlFor={this.props.index}>
              {this.props.names}
            </label>
          </div>
        );
        break;
      case 3:
        node = (
          <div className="input-field">
            <input name={this.props.index} type="email" className="validate" id={this.props.index} required />
            <label htmlFor={this.props.index} data-error="格式錯誤" data-success="">
              {this.props.names}
            </label>
          </div>
        );
        break;
      case 4:
        node = (
          <div className="input-field">
            <textarea name={this.props.index} className="materialize-textarea" id={this.props.index} required />
            <label htmlFor={this.props.index}>{this.props.names}</label>
          </div>
        );
        break;
      case 5:
        var radios = this
          .props
          .choice
          .map(function(e, i) {
            return (
              <div>
                <input name={this.props.index} type="radio" value={e} id={'radio' + i} />
                <label htmlFor={'radio' + i}>{e}</label>
              </div>
            );
          }.bind(this));
        node = (
          <div className="input-field" style={{'marginBottom': '1.3em'}} >
            <h6 style={{
              'marginLeft': '0.8em'
            }}>{this.props.names}</h6>
            {radios}
          </div>
        );
        break;
      case 6:
        var checks = this
          .props
          .choice
          .map(function(e, i) {
            return (
              <div>
                <input name={this.props.index} type="checkbox" value={e} id={'check' + i}/>
                <label htmlFor={'check' + i}>{e}</label>
              </div>
            );
          }.bind(this));
        node = (
          <div className="input-field" style={{'marginBottom': '1.3em'}} >
            <h6 style={{
              'marginLeft': '0.8em'
            }}>{this.props.names}</h6>
            {checks}
          </div>
        );
        break;
      default:
    }
    return (
      <div style={{
        padding: '0em 1.6em'
      }}>{node}</div>
    );
  }
});

var FormProcess = React.createClass({
  render:function(){
    var nodes = this.props.flow.map(function(e,i){
      return (
      <div className={(e == '申請人')?'step active':'step'} key={i} data-idx={i}
         onMouseDown={this.dn} onTouchStart={this.dn} >
        { (e == '申請人')?(<i className="material-icons">person</i>):(<i className="letter">{e[0]}</i>)}
        <div className="content">
          <div className="title">{e}</div>
        </div>
      </div>
      );
    }.bind(this));
    return (
      <div className="ui small steps">
          {nodes}
      </div>
    );
  }
});
//565d270a67ae6b080adf1d16
export default React.createClass({
  getInitialState:function(){
    return{ formFormat:null  };
  },
  render:function(){
    if(this.state.formFormat === null){
      $.ajax({
        url: host+'admin/getCustomForm',
        type: 'GET',
        data: {id: this.props.params.APID},
        headers:{
          'x-access-token':token
        }
      })
      .done(function(msg) {
        console.log(msg);
        this.setState({formFormat : JSON.parse(msg)[0] })
        PlugIn.stopRefresh();
      }.bind(this))
      .fail(function() {
        PlugIn.toast("無網路連線");
        console.log("error");
      })
      return (<div></div>);

    }
    var nodes = this.state.formFormat.format.map(function(e,i){
      return <InputForm index={i} type={e.type} key={i} names={e.name} choice={e.choice} />;
    }.bind(this));
    return (
      <div>
        <h5 style={{marginTop:'0.6em'}}>審核流程</h5>
        <div style={ {width:'100%',overflow:'auto'} } >
          <div ref='flow' className='flow' >
            <FormProcess flow={this.state.formFormat.flow} setFlow={this.setFlow} addStep={this.addStep} />
          </div>
        </div>
        <h5>需填資料</h5>
        <div className='forms'>
          <form method='POST' ref='form' >
            {nodes}
            <button style={{margin: '1.2em 1.6em'}} className="btn waves-effect waves-light" type="submit" name="action">提交申請
              <i className="material-icons right">send</i>
            </button>
          </form>
        </div>
      </div>
    );

  },
  componentDidUpdate:function(){
    $(this.refs.flow).css("width",$(this.refs.flow).find('.steps').width()+45+'px');

    this.refs.form.addEventListener("submit",function(e){
      e.preventDefault();
      var lastHandleName = '-1';
      var isSubmit = true;
      $('input[type="radio"],input[type="checkbox"]').each(function(){
          if(this.name !== lastHandleName){
            var io = false;
            $('input[name='+this.name+']').each(function(index, el) {
              if(this.checked) io = true;
            });
            if(!io){
              isSubmit = false;
            }
            lastHandleName = this.name;
          }
      })
      if(!isSubmit){
        try {
          PlugIn.toast("有選項尚未勾選");
        } catch (e) {}
        return false;
      }
      console.log($(this.refs.form).serializeArray()  );
      var d = {
        form:$(this.refs.form).serializeArray(),
        flow:this.state.formFormat.flow
      };
      $.ajax({
        url: host+'admin/addApply',
        type: 'POST',
        data: {
          id: this.props.params.APID,
          data:JSON.stringify(d)
        },
        headers:{
          'x-access-token':token
        }
      })
      .done(function(msg) {
        if(msg.status === 'success'){
          Materialize.toast("申請成功", 4000);
          browserHistory.goBack();
        }
      }.bind(this))
      .fail(function() {
        Materialize.toast("無網路連線", 4000);
      })

      return false;
    }.bind(this));
  }
});
