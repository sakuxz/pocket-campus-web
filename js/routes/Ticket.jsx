const React = require('react');
const ReactDOM = require('react-dom');
const host = require('setting').host;
const token = require('setting').token;
const colors = require('setting').colorPattern;

//     data:{
//       name: "彰師纜車乘車券",
//       date: 1740053721000,
//       signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKwAAACsCAYAAADmMUfYAAAABmJLR0QA/wD/AP+gvaeTAAAEY0lEQVR4nO3d0W4sJxAFwDjK///y5vWKSIsQ3cBxql7tGdbeI9RiGubn8/l8/oIQf9/+ALBCYIkisEQRWKIILFEEligCSxSBJYrAEkVgiSKwRBFYoggsUQSWKAJLFIElisASRWCJIrBE+af6hj8/P9W3/GrckjYbf3cL2+rfd3q82fi3v59dZliiCCxRBJYo5TXsqLqG2a3BumvcWc3YXXOfrrF3x19lhiWKwBJFYInSXsOObtdYr99/tQbeHW/02vczMsMSRWCJIrBEOV7Ddttdt1ytEcfrV++3+nl2f57ODEsUgSWKwBLl19Wwo1lNN6vxXqsJb49/mxmWKAJLFIElyvEatrsGW30W3t0fOxuvel23up/3NWZYoggsUQSWKO017Ol98KPqPVa716/q7iW4/f2sMsMSRWCJIrBEKa9hX1vH6z7HYPfnq+Pv1syvfT+rzLBEEViiCCxR4s4luL0Hq3rP1qh6/Ooa93bNbIYlisASRWCJEveOg9PriLu9BaPumrx6vN37VzPDEkVgiSKwRPn5HC4Kb/eT7ur+/K+dk/DaWV5mWKIILFEElijP1bC7v796/Ws1c/X/p7rGvF3TmmGJIrBEEViitPcSVPdXdvdj7ta41c/eTz/L7+5N2GWGJYrAEkVgiXL9XILudcbT674zu+vCp/tbV6+3Dgt/EFiiCCxRju/pqn6WPXN7D1j3OvDt3oHTzLBEEViiCCxR2s/W6j7PtHtdsPrzdtec3e/xul3TmmGJIrBEEViiHN/T9Z8PcHlP1e3zXrs/z+nru5lhiSKwRBFYolzf03W6P7V6D9Xqz2fjVa9bd697O5cAvhBYoggsUZ5bh72956raa39f9fm1ziWALwSWKAJLlPIatntP12y80+uI3b0EM7fXsa3DwhcCSxSBJcrxPV2rTvfLVteEt3sTVp3+vKvMsEQRWKIILFHaa9jufffj/avfCVBd0+6eWzBz+3zY1futMsMSRWCJIrBEee5srfH3Tz+r3q0xq9eNZ+PP7O4ZO90bMmOGJYrAEkVgidLeD3v7PNLX3hEwG7/6+tX7ze5vHRYWCCxRBJYox2vY6mf9s+tHr9eEr/UPj26fA2GGJYrAEkVgiVLeS1C956f62fnus/Tuftbf9s4H67D8rwksUQSWKO3vOOi2W6Ouqu4vPb1O/dp7yVaZYYkisEQRWKI8f7bWqPvZ/ekafLS6Z6z6nIVVzoeFLwSWKAJLlPYadtS9J6j6fNPq91rN3O7XnV3vPV2wQGCJIrBEOV7Dnna7n7O7d2DWS7Fqt2a1Dgt/EFiiCCxRfn0N230ebfV7u1Z17wG7fZbWyAxLFIElisAS5XgN213jrNaQ1b0C1euk3eua1f223cywRBFYoggsUY6/a/Z13TX26X7X6nVj/bCwQGCJIrBEKX/HAXQywxJFYIkisEQRWKIILFEEligCSxSBJYrAEkVgiSKwRBFYoggsUQSWKAJLFIElisASRWCJIrBE+RfLbwFa3nNM6QAAAABJRU5ErkJggg=="
//     }

function getTicket(aid) {
  $.ajax({
    url: host+'ajax/getActivityTicket',
    type: 'POST',
    data: {
      aid: aid
    },
    headers:{
      'x-access-token':token
    }
  })
  .done(function(msg) {
    if(msg.status === true){
      this.setState({
        data: msg.result
      });
    }
  }.bind(this))
  .fail(function() {
    PlugIn.toast("無網路連線");
    console.log("error");
  }.bind(this));
}

export default React.createClass({
  getInitialState: function() {
    getTicket.call(this,this.props.params.AID);
    return {
      data: null
    };
  },
  render: function() {
    if(!this.state.data){
      return (
        <div className='ticket' style={{WebkitFilter: "blur(5px)"}}>
          <h5 className="title">你的票券</h5>
          <p>
            <span>2016</span>年
            <span>05</span>月
            <span>05</span>日
          </p>
          <h5 className="name">活動入場券</h5>
          <div id="qrcode"><div style={{width:135,height:135,margin:'1em auto',background:'#8E8E8E'}}/></div>
        </div>
      );
    }else{
      var d = this.state.data;
      return (
        <div className='ticket'>
          <h5 className="title">你的票券</h5>
          <p>
            <span>{new Date(d.date).toLocaleDateString().split('/')[0]}</span>年
            <span>{new Date(d.date).toLocaleDateString().split('/')[1]}</span>月
            <span>{new Date(d.date).toLocaleDateString().split('/')[2]}</span>日
          </p>
          <h5 className="name">{d.name}</h5>
          <div id="qrcode"><img src={d.signature}/></div>
        </div>
      );
    }
  }
});
