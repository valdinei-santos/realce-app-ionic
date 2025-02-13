import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { CadastroClientePage } from '../cadastro-cliente/cadastro-cliente';
import { ToastController } from 'ionic-angular';
import { ListaPedidoClientePage } from '../lista-pedido-cliente/lista-pedido-cliente';

@IonicPage()
@Component({
  selector: 'page-lista-cliente',
  templateUrl: 'lista-cliente.html',
})
export class ListaClientePage {

  cliente: Cliente = new Cliente(); //{nome:'', codigo:null, fone:'', celular:'', endereco:'', bairro:'', cidade:'', cnpj:'', inscricao_est:''};
  clientes: any[];
  isPedido: boolean;
  qtd_clientes: number = 0;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
			        public clienteProvider: ClienteProvider,
              public toast: ToastController) { }

  ionViewDidLoad() {
    this.getClientes();
  }

  ionViewWillEnter() {
    console.log('lista-cliente - ionViewWillEnter');
    this.getClientes();
    if (this.navParams.data.isPedido) {
      this.isPedido = true;
    } else {
      this.isPedido = false;
    }
  }
  
  addCliente(){
    this.navCtrl.push(CadastroClientePage);
  }

  editCliente(id: number){
    this.navCtrl.push(CadastroClientePage, { id: id, isEdit: true });
  }

  listaPedidos(client_id: number){
    this.navCtrl.push(ListaPedidoClientePage, { cliente_id: client_id });
  }

  removeCliente(cliente: Cliente) {
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

  getClientes() {
    this.clienteProvider.getAll()
      .then((results: any[]) => {
        this.clientes = results;
        this.qtd_clientes = this.clientes.length;
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
    if (this.isPedido) {
      this.navCtrl.getPrevious().data.cliente = cliente;
      this.navCtrl.pop()
    } else {
      null;
    }
  }

}
