import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
//import { ICliente } from '../../interfaces/ICliente';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { CadastroClientePage } from '../cadastro-cliente/cadastro-cliente';
import { ToastController } from 'ionic-angular';
import { CadastroPedidoPage } from '../cadastro-pedido/cadastro-pedido';


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
	  console.log('lista-cliente - constructor');
  }


  ionViewDidLoad() {
    this.getClientes();
  }

  ionViewWillEnter() {
    console.log('lista-cliente - ionViewWillEnter');
    if (this.navParams.get('editBack')) {
      this.getClientes();
    }
  }
  

  addCliente(){
    console.log('lista-cliente - addCliente');
    this.navCtrl.push(CadastroClientePage);
  }


  editCliente(id: number){
    console.log('lista-cliente - editCliente');
    this.navCtrl.push(CadastroClientePage, { id: id, isEdit: true });
  }


  removeCliente(cliente: Cliente) {
    console.log('lista-cliente - removeCliente');
    this.clienteProvider.remove(cliente.id) 
      .then(() => {
        var index = this.clientes.indexOf(cliente);
        this.clientes.splice(index, 1);
        this.toast.create({ message: 'Cliente removido.', duration: 3000, position: 'botton' }).present();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao remover cliente.', duration: 3000, position: 'botton' }).present();
    });
  }
  
  cancelar(){
    this.navCtrl.setRoot(HomePage);
    //this.navCtrl.pop();
  }

  getClientes() {
    this.clienteProvider.getAll()
      .then((results: any[]) => {
        this.clientes = results;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar os clientes.', duration: 3000, position: 'botton' }).present();
    });
  }

  getItems(ev: any) {
    this.clienteProvider.getAll()
      .then((results: any[]) => {
        this.clientes = results;
        // Lógica para povoar o array só com os produtos que atendem o filtro.
        const val = ev.target.value;
        if (val && val.trim() != '') {
          this.clientes = this.clientes.filter((item) => {
            return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar os clientes.', duration: 3000, position: 'botton' }).present();
    });
  }

  pedidoCliente(cliente: Cliente) {
    this.navCtrl.push(CadastroPedidoPage, {cliente: cliente});
  }

}
