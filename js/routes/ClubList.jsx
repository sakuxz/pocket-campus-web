const React = require('react');
const ReactDOM = require('react-dom');
const host = require('setting').host;
const token = require('setting').token;
const colors = require('setting').colorPattern;

// clubs: [
//   {
//     name:"農村服務隊",
//     num:63
//   }
// ]

var ClubCard = React.createClass({
  render: function() {
    if(this.props.noData){
      return (
        <div className="friend no-data" >
           <div>
             <i className="material-icons">people</i>
             <p>沒有參加的社團</p>
             <span>找個有興趣的社團享受多采多姿的大學社團生活吧</span>
           </div>
        </div>
      );
    }
    var color = this.props.data.name[0].charCodeAt()%colors.length;
    return (
      <div onClick={this.openClub} style={{animationDelay:0.1*this.props.idx+"s"}} ref='wrapper' className='waves-effect club-card' >
        <div style={{background:colors[color]}}>
          {this.props.data.name[0]}
        </div>
        <p>{this.props.data.name}</p>
        <span><i className="material-icons">person</i>{this.props.data.num}</span>
      </div>
    );
  },
  openClub: function() {
      location.hash = "/clubpage/"+this.props.data.CID;
  }
});

function getClubs(){
  $.ajax({url: host+'ajax/getClub',
     type: 'GET',
     headers:{
       'x-access-token':token
     }
  }).done(function(msg) {
    console.log(msg);
    // msg.result = msg.result.concat([
    //     {
    //       name:"農村服務隊",
    //       num:63
    //     },
    //     {
    //       name:"熱音社",
    //       num:45
    //     },
    //     {
    //       name:"學生會",
    //       num:45
    //     }
    // ]);
    this.setState({
      clubs: msg.result || []
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
      clubs:null
    };
  },
  render: function() {
    if (this.state.clubs === null) {
      getClubs.call(this);
    }else{
      var nodes = this.state.clubs.map(function(e, i) {
        return <ClubCard data={e} key={i} idx={i} />;
      })
    }

    return (
      <div className="club-list">
        { (this.state.clubs)?
        <div>
          <h5 className="apply-list-title yellowT">你參加的社團</h5>
          { (nodes.length === 0)?<ClubCard noData={true} />:nodes }
        </div>:null
        }
      </div>
    );
  },
  componentDidMount:function(){
    window.addEventListener("hashchange",function(){
      if(location.hash === "#refresh"){
        location.hash = "";
        getClubs.call(this);
      }
    }.bind(this));

  }
});
