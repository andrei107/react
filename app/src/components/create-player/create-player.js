import React, {Component} from "react";
import axios from 'axios';

export default class CreatePlayerModal extends Component {
  constructor(props){
	super();
	this.state = {
		name: '',   //имя игрока
        nik: '',    //ник игрока
        bank: '',   //банка
        code: '',   //game_code
        image: '', //профиля фото
	}
  }

  onInputChange(e){ //запись значений формы в стейт
    this.setState({ [e.target.name] : e.target.value})
  }

  cancelCreate = () => { //закрыть модалку
    this.props.onCancelPlayerSave();
  }

  onPlayerSave = () => { //сохранить игрока
    var img = document.getElementById('image');
    let formData = new FormData();
		formData.append("image", img.files[0])

    axios.post('./api/uploadImage.php', formData, {
      headers:{
        "Content-Type": "multipart/form-data"
      }
    }).then((res) => {
      axios.post("./api/createPlayer.php", {
        headers:{
          'Content-type': 'application/json; charset=UTF-8',
        },
        data: {
          name: this.state.name,
          nik: this.state.nik,
          code: this.state.code,
          bank: this.state.bank,
          image: img.files[0]['name']
        }
      }).then((res) => {
         this.props.onCancelPlayerSave();
         this.props.openInfoModal(true, 'Игрок создан!', true);
      })
    }).catch((err) => {
      this.props.openInfoModal(true, 'Ошибка создания!!', false);
    });
  }

  componentWillUnmount() { //закрытие модалки - обновление игроков
    axios.get('./api/loadAllPlayesrs.php')
    .then((response) => {
      this.props.onCreatePlayerData(response.data)
    })
  }

  render(){
    return(
      <>
        <div className="createPlayer">
          <h2>Создание игрока</h2>
            <form method="post" encType="multipart/form-data" >
              <label htmlFor="name">Имя</label>
              <input id="name" onChange={(e) => this.onInputChange(e)} name="name" type="text" className="form-control" />
              <label htmlFor="nik">Ник</label>
              <input id="nik" onChange={(e) => this.onInputChange(e)} name="nik" type="text" className="form-control" />
              <label htmlFor="code">Код</label>
              <input id="code" onChange={(e) => this.onInputChange(e)} name="code" type="text" className="form-control" />
              <label htmlFor="bank">Банк</label>
              <input id="bank" onChange={(e) => this.onInputChange(e)} name="bank" type="text" className="form-control" />
              <label htmlFor="image">Фотография</label>
              <input id="image" name="image" type="file" className="form-control"/>
              <button type="button" className="btn btn-success" onClick={this.onPlayerSave}> Добавить игрока </button>
              <button type="button" className="btn btn-danger" onClick={this.cancelCreate}> Отмена </button>
            </form>
        </div>
      </>
    )
  }
};