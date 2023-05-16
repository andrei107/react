import React, { Component } from 'react';

class TransactionSuccess extends Component {
  constructor(props){
    super(props)
   }

   render(){
    return(
      <div className='createdPlayer'>
         <p>Транзакция на сумму {this.props.value} от игрока {this.props.from} игроку {this.props.to} завершена успешно!</p>
         <div>
            <button className='btn btn-success' onClick={this.props.onCloseModaltransaction}>Ok</button>
          </div>
      </div>  
    )
   }
  }

export default TransactionSuccess;
