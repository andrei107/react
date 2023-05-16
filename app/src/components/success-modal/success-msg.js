import React from 'react';

const SuccessModal = ({message}) => {
    return(
      <div className='modal-success'>
         <p>{message}</p>
         <div>
            <button className='btn btn-success' onClick={this.props.onCloseModal}>Супер!</button>
         </div>
      </div>  
    )
}


export default SuccessModal;
