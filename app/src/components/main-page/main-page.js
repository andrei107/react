import React from 'react';
import CreatePlayerModal from '../create-player';
import InfoModal from '../info-modal';
import CardList from '../card-list';
import DeleteSuccess from '../deleteSuccess';
import TransactionSuccess from '../transactionSuccess';
import axios from 'axios';

export default class MainPage extends React.Component{
    constructor(){
        super();
        this.state = {
            modalCreate: false,         //статус модального окна создания
            status: '',                 //статус окна информационного
            message: '',                //сообщение в модальном окне информационного
            modal: '',                  //флаг открытия модального информационного
            dataPlayers: [],            //массив с данными игроков
            forDelId: '',               //айди удаляемого игрока
            nameDel: '',                //имя удаляемого
            needDeletePlayer: '',       //подтверждающее удаление либо запуск процедуры уделения
            checkDelete: false,         //подтверждающее удаление либо запуск процедуры уделения
        }
    }

    componentDidMount(){ //при открытии страницы загрузить элементы
        this.loadData()
      }

    loadData = () => { //загрузка игроков
        axios.get('./api/loadAllPlayesrs.php')
        .then((res) =>{
            this.setState({dataPlayers: res.data.data})
        })
        .catch((err) => {
            this.openInfoModal(true, 'Ошибка загрузки игроков', false)
        });
    }

    openInfoModal = (modal, message, status) => {   //открыть модалку info
        this.setState({
            modal: modal,
            message: message,
            status: status
        })
      }
    onCloseInfoModal = () => {   //закрыть модалку info
        this.setState({
            modal: false,
            message: '',
            status: ''
        })
    }

    showCreateModal = () => { //по нажатию создать игрока изменить стейт и открыть модалку создания игрока
        this.setState({
            modalCreate: true
        })
    }
    onCancelPlayerSave = () => {   //закрыть модалку создания игрока по нажатию на отмена
        this.setState({
            modalCreate: false,
        })
    }

    onCreatePlayerData = (value) => { //при успешном создании перезагружаем данные игроков
        this.loadData()
    }

    confirmDeletePlayer = (id, name) => { //запуск удаления из модалки подтвержедения удаления
        axios.post("./api/deletePlayer.php", {
            headers:{
            'Content-type': 'application/json; charset=UTF-8',
            },
            data: {
             name: name
            }
        }).then((res) => {
            this.loadData();
            this.setState({
               checkDelete: false,
               needDeletePlayer: false
            })
            this.openInfoModal(true, res.data.message, res.data.status)
      }).catch((err) => {
            this.openInfoModal(true, err.data.message, err.data.status)
      })
    }

    deletePlayers = (id, name) => {  //первое после нажатия на удалить
       console.log(name)
        this.setState({
            needDeletePlayer: true, //вызвать подверждение удаления
            forDelId: id,
            nameDel: name
        })
    }
    onCloseModalDelete = () => { //закрыть модалку удаления
        this.setState({
            needDeletePlayer: false
        })
    }

    onCloseModaltransaction = () => {
        this.setState({
          transaction: false
        })
      }

    transaction = (from, to, value) => { //денежный превод
        axios.post("./api/transfer.php", {
          headers:{
            'Content-type': 'application/json; charset=UTF-8',
          },
          data: {
            from: from,
            to: to,
            value: value
          }
        }).then((res) => {
            console.log(res)
          this.loadData();
          this.setState({
                transaction: true,
                transactionFrom: from,
                transactionTo: to,
                transactionValue: value
          })
          //this.openInfoModal(true, res.data.message, res.data.status);
        }).catch((err) => {
            console.log(err)
          //this.openInfoModal(true, err.data.message, err.data.status);
        })
    }

    render(){
      const clazz = (this.state.modal || this.state.needDeletePlayer || this.state.modalCreate || this.state.checkDelete || this.state.transaction) ? 'opacity' : '';
      const playersNameList = this.state.dataPlayers ?  //список игроков для селекта
            this.state.dataPlayers.map((item) => {
                return(
                    <option key={item.id} value={item.name}> {item.name} </option>
                )}) : '';

      const createPlayerModal = this.state.modalCreate ?
            <CreatePlayerModal onCancelPlayerSave={this.onCancelPlayerSave}   //само окно создания игрока
                               onCreatePlayerData={this.onCreatePlayerData}
                               openInfoModal={this.openInfoModal}/> : null;

      const infoModal = this.state.modal ?  //модалка информационная
            <InfoModal  onCloseModal={this.onCloseInfoModal}
                        message={this.state.message}
                        status={this.state.status}/> : null;

      const cards = this.state.dataPlayers ?   //список карточек
            <CardList transaction={this.transaction}
                      data ={this.state.dataPlayers}
                      options={playersNameList}
                      onDeletePlayer={this.deletePlayers}/> : null;

      const modalDeleteSucces = this.state.needDeletePlayer ?   //модалка удаления
            <DeleteSuccess onCloseModalDelete={this.onCloseModalDelete}
                           confirmDeletePlayer={this.confirmDeletePlayer}
                           delId={this.state.forDelId}
                           delName={this.state.nameDel}
                           onCloseModal={this.onCloseModal}/> : null;

      const transactionSuccess = this.state.transaction ?  //модалка транзакции
            <TransactionSuccess from={this.state.transactionFrom}
                                to={this.state.transactionTo}
                                value={this.state.transactionValue}
                                onCloseModaltransaction={this.onCloseModaltransaction}/> :null;
                        
      return(
            <>
                {createPlayerModal}
                {infoModal}
                {modalDeleteSucces}
                {transactionSuccess}

                <div className={clazz + ' general'}>
                    <div className='general-img'></div>
                    <div className='general-right'>
                        <div className='general-data'>
                            <ul><li>Количество игроков: {this.state.dataPlayers.length - 1}</li></ul>
                        </div>
                        <div className='general-button'>
                            <button type='button' className="btn btn-success" onClick={this.showCreateModal}>Создать игрока</button>
                        </div>
                    </div>
                </div>
                {cards}
            </>
          )
    }
}