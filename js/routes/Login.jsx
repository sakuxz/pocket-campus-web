import React from 'react'
const host = require('setting').host;

function login(studno,password) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: host+'ajax/login',
      type: 'POST',
      data: {
        studno: studno,
        password: password
      }
    })
    .done(function(e) {
      console.log("success");
      resolve(e)
    })
    .fail(function(e) {
      console.log("error");
      reject(e)
    });
  });
}

export default React.createClass({
  render() {
    return (
      <div className="row login-ctn">
       <form className="col s12">
         <div className="row login">
           <div className="input-field col s12">
             <i className="material-icons prefix">account_circle</i>
             <input ref="stu" id="icon_prefix" type="text" class="validate"/>
             <label for="icon_prefix">Student Number</label>
           </div>
           <div className="input-field col s12">
             <i className="material-icons prefix">lock</i>
             <input ref="pass" id="icon_telephone" type="password" class="validate"/>
             <label for="icon_telephone">Password</label>
           </div>
           <button onClick={this.login} className="btn waves-effect waves-light" type="submit" name="action">登入
             <i className="material-icons right">send</i>
           </button>

         </div>
       </form>
     </div>
    )
  },
  login: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var studno = this.refs.stu.value.trim();
    var password = this.refs.pass.value.trim();
    if(studno !== "" && password !== ""){
      login(studno,password).then(function(e) {
        if(e.status){
          Materialize.toast('login success', 4000);
          localStorage.token = e.result.token;
          localStorage.uid = e.result.uid;
          //location.hash = "/newsfeed";
          open("#/newsfeed","_self");
          location.reload();
        }else{
          Materialize.toast('the infomation not correct', 4000);
        }
      }, function () {
        Materialize.toast('Network Error', 4000);
      });
    }else{
      Materialize.toast('has field not filled', 4000);
    }
  }
})
