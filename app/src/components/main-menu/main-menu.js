import React from 'react';
import Logout from '../logout';
import {BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


class MainMenu extends React.Component {
  constructor(props){
    super(props);
  }
  
  render(){
    console.log('mainmenu');
    console.log(this.props);
    return(
      <header className="d-flex justify-content-center py-3">
        <div>
          <ul className="nav nav-pills">
            <li className="nav-item">
                <Link to="/admin/" className="nav-link">Главная</Link>
            </li>
            <li className="nav-item">
                <Link to="/admin/registration" className="nav-link">Регистрация</Link>
            </li>
            <li className="nav-item">
                <Link to="/admin/login" className="nav-link">Войти</Link>
            </li>
            <li className="nav-item">
                <Link to="/admin/game" className="nav-link">Игра</Link>
            </li>
            <li className="nav-item">
                <Logout changeLoginStatus={this.props.changeLoginStatus}/>
            </li>
          </ul>
        </div>
      </header>
    )
  }
};

export default MainMenu;