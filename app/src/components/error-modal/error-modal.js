import React from 'react';

const ErrorModal = ({message}) => {
    return(
      <div className='modal-success'>
         <p>{message}</p>
         <div>
            <button className='btn btn-success' onClick={this.props.onCloseModal}>Супер!</button>
         </div>
      </div>  
    )
}


export default ErrorModal;