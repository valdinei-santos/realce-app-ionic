import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { HomePage } from '../home/home';
//import { ICliente } from '../../interfaces/ICliente';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { ToastController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-cadastro-cliente',
  templateUrl: 'cadastro-cliente.html',
})
export class CadastroClientePage {
	
  cliente: Cliente = {nome:'', codigo:null, fone:'', celular:'', endereco:'', bairro:'', cidade:'', cnpj:'', inscricao_est:''};
  //clienteEditando: Cliente;
  editando:boolean = false;
  model: Cliente;
  key: string;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
			        public clienteProvider:ClienteProvider,
			        public toast: ToastController) {

    this.model = new Cliente();

    if (this.navParams.data.id) {
      this.clienteProvider.get(this.navParams.data.id)
        .then((result: any) => {
          this.model = result;
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar um cliente.', duration: 3000, position: 'botton' }).present();
      });
    }  
  }


  save() {
    if (this.saveCliente()) {
      this.toast.create({ message: 'Cliente salvo!', duration: 3000, position: 'center' }).present();
      if (this.navParams.data.isEdit) {
        this.navCtrl.getPrevious().data.editBack = true;
      }
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar o Cliente!', duration: 3000, position: 'center' }).present();
    }
  }

  private saveCliente() {
    if (this.model.id) {
      return this.clienteProvider.update(this.model);
    } else {
      return this.clienteProvider.insert(this.model);
    }
  }
  
  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }
  

}
