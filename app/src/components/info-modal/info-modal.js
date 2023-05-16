import React from 'react';

const InfoModal = ({message, status, onCloseModal}) => {
    const clazz = status ? 'modal-info success' : 'modal-info error';
    return(
      <div className={clazz}>
         <p>{message}</p>
         <div>
            <button className='btn btn-danger' onClick={onCloseModal}>Закрыть</button>
         </div>
      </div>  
    )
}

export default InfoModal;