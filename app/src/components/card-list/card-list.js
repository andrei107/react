import React from 'react';
import CardListItem from '../card-list-item';

const CardList = ({data, onDeletePlayer, options, transaction, clazz}) => {
  if(data){
    const elements = data.map((item) => {
      return(
        <CardListItem key={item.id} 
                      transaction={(from, to, value) => transaction(from, to, value)} 
                      playerData={item} 
                      options={options} 
                      onDeletePlayer={() => onDeletePlayer(item.id, item.name)}/>
      )
    })

    return(
      <div className="card-list ">
          {elements}
      </div>  
    )
  }
};

export default CardList;
