import React from 'react';
import Registration from '../registration';
import MainMenu from '../main-menu';
import Hello from '../hello';
import Login from '../login';
import MainPage from '../main-page';
import Logout from '../logout';
import NeedLogin from '../need-login';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Routes
  } from "react-router-dom";

class Application extends React.Component {
    constructor(){
        super();
        this.state = {
            isLogin: false
        }
    }

    isLogin = (status) => {
        this.setState({
            isLogin: status
        })
    }

    changeLoginStatus = (status) => {
        console.log('zz')
        this.setState({
            isLogin: status
        })
    }


    render(){
        const loginPage = this.state.isLogin ? <NeedLogin message={"Вы уже авторизованы!"}/> : <Login changeLoginStatus={ () => this.isLogin(true)}/>;
        const gamePage = this.state.isLogin ?  <MainPage/> : <NeedLogin message={"Нужна авторизация!"}/>
        return(
            <Router>
                <div className="theMainBlock">
                    <div className="menuBlock">
                        <MainMenu changeLoginStatus={(status) => this.changeLoginStatus(false)}/>
                    </div> 
                    <div className="contentBlock">
                        <Routes>
                            <Route path="/admin/" element={<Hello/>} />
                        </Routes>
                        <Routes>
                            <Route path="/admin/registration" element={<Registration/>} />
                        </Routes>
                        <Routes>
                            <Route path="/admin/login" element={loginPage} />
                        </Routes>
                        <Routes>
                            <Route path="/admin/game" element={gamePage} />
                        </Routes>
                    </div>
                </div>
            </Router>
        )
    }
};

export default Application;