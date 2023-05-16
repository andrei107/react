import React, { Component } from 'react';

class DeleteSuccess extends Component {
  constructor(props){
    super(props)
   }

   onDelete = () => {
     this.props.confirmDeletePlayer(this.props.delId, this.props.delName)
   }

   render(){
    return(
      <div className='createdPlayer'>
         <p>Вы хотите деклассировать игрока {this.props.delName}?</p>
         <div><button className='btn btn-success' onClick={this.onDelete}>Банкрот!</button>
		     <button className='btn btn-danger' onClick={this.props.onCloseModalDelete} >Отмена</button></div> 
      </div>  
    )
   }
}
export default DeleteSuccess;
