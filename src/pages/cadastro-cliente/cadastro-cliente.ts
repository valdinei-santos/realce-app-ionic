import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { HomePage } from '../home/home';
//import { ICliente } from '../../interfaces/ICliente';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { ToastController } from 'ionic-angular';


/**
 * Generated class for the CadastroClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
      console.log('ID: ' + this.navParams.data.id);
      this.clienteProvider.get(this.navParams.data.id)
        .then((result: any) => {
          this.model = result;
        })
    }  
  }


  save() {
    if (this.saveCliente()) {
      this.toast.create({ message: 'Cliente salvo!', duration: 3000, position: 'center' }).present();
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar o Cliente!', duration: 3000, position: 'center' }).present();
    }
  }

  private saveCliente() {
    console.log('ID saveClientr: ' + this.model.id);
    if (this.model.id) {
      //this.editando = false;
      return this.clienteProvider.update(this.model);
    } else {
      //this.editando = true;
      return this.clienteProvider.insert(this.model);
    }
  }
  
  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }
  

}
