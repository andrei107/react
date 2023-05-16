import React, {Component} from 'react';
import DletePlayerButton from '../delete-player-button';

class CardListItem extends Component {
  constructor(props){
    super(props)
    this.state = {
      from: '',
      to: '',
      value: '',
    }
  }
     
  onTransaction(e){
    this.props.transaction(this.state.from, this.state.to, this.state.value)
  }

  onSelectSumm(e){
    let idFrom = e.target.name;
    let cash = e.target.value;
    this.setState({from: idFrom, value: cash});
  }

  onSelectPlayer(e){
    this.setState({to: e.target.value});
  }

  render(){
       const error = this.props.playerData.error? 'error' : 'ok';
       const button = this.props.playerData.name!=='Bank'? <DletePlayerButton  onDeletePlayer={this.props.onDeletePlayer}/> : null

       return(
          <div className="card-list-item">
              <div className="top">
                <div className="profile-img"style={{backgroundImage:`url(../img/${this.props.playerData.image})`}}></div>
                <div className="profile-data">
                  <ul>
                    <li className={error}>Имя: {this.props.playerData.name}</li>
                    <li className={error}>Ник: {this.props.playerData.nik}</li>
                    <li className={error}>Банк: {this.props.playerData.bank}</li>
                  </ul>
                </div>
              </div>
              <div className='bottom'>
                <div className='bottom-item'>
                  <select class="form-select" onChange={(e) => this.onSelectPlayer(e)}>
                    <option>Кому:</option>
                    {this.props.options}
                  </select>  
                </div>
                <div className='bottom-item ' >
                  <input type="text" value={this.state.value} name={this.props.playerData.name} id={this.props.playerData.id} className="form-control summ" onChange={(e) => this.onSelectSumm(e)} placeholder='Сколько :'/>
                </div>
                <div className='bottom-item'>
                  <button type="button" className="btn btn-success" onClick={(e) => this.onTransaction(e)}>Перевести</button>
                </div>
              </div>
              <div className='deletePlayer'>
                {button}
              </div>
          </div>  
       )
  }
};

export default CardListItem;
