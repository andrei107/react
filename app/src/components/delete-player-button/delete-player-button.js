import React, { Component } from 'react';

class DletePlayerButton extends Component {
  constructor(props){
        super(props)
   }

   render(){
        return( <button type="button" className="btn" onClick={this.props.onDeletePlayer}>Запустить процедуру банкротства</button>)
   }
}

export default DletePlayerButton;
