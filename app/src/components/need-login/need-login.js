import React from 'react';

const NeedLogin = ({message}) => {
    return(
      <div className='need-login'>
            <h2>{message}</h2>
      </div>  
    )
}

export default NeedLogin;