import React, {Component} from "react";

export default class Logout extends React.Component {
  constructor(props){
		super(props);
    }

    logout = () => {
        console.log('z1')
        console.log(this.props);
        this.setCookie("jwt", "", 1);
        this.props.changeLoginStatus(false);
    }

    setCookie(cname, cvalue, exdays ){
        let d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }

    render(){
        return(
            
                <a href="#" className="nav-link" onClick={this.logout}>Выход</a>
           
        );
    }
}