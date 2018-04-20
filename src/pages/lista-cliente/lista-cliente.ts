import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
//import { ICliente } from '../../interfaces/ICliente';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { CadastroClientePage } from '../cadastro-cliente/cadastro-cliente';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the ListaClientePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-cliente',
  templateUrl: 'lista-cliente.html',
})
export class ListaClientePage {

  cliente: Cliente = {nome:'', codigo:null, fone:'', celular:'', endereco:'', bairro:'', cidade:'', cnpj:'', inscricao_est:''};
  clientes: any[];
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
			        public clienteProvider: ClienteProvider,
              public toast: ToastController) {
	  console.log('constructor ListaClientePage');
  }


  ionViewDidEnter() {
    this.clienteProvider.getAll()
      .then((results: any[]) => {
        this.clientes = results;
      });
  }

  addCliente(){
    console.log('addCliente');
    this.navCtrl.push(CadastroClientePage);
  }


  editCliente(id: number){
    console.log('editCliente');
    //console.log(cliente);
    this.navCtrl.push(CadastroClientePage, { id: id });
  }


  removeCliente(cliente: Cliente) {
    console.log('removeCliente');
    this.clienteProvider.remove(cliente.id) 
      .then(() => {
        var index = this.clientes.indexOf(cliente);
        this.clientes.splice(index, 1);
        this.toast.create({ message: 'Cliente removido.', duration: 3000, position: 'botton' }).present();
      })
  }
  
  cancelar(){
    this.navCtrl.setRoot(HomePage);
    //this.navCtrl.pop();
  }


}
