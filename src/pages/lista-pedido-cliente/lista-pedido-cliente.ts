import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { PedidoProvider, Pedido2 } from '../../providers/pedido/pedido';
import { ShowPedidoPage } from '../show-pedido/show-pedido';
import { CadastroPedidoPage } from '../cadastro-pedido/cadastro-pedido';
import { Cliente, ClienteProvider } from '../../providers/cliente/cliente';

@IonicPage()
@Component({
  selector: 'page-lista-pedido-cliente',
  templateUrl: 'lista-pedido-cliente.html',
})
export class ListaPedidoClientePage {

  cliente: Cliente;
  pedidos: any[];
  qtd_pedidos: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public toast: ToastController,
              public pedidoProvider: PedidoProvider,
              public clienteProvider: ClienteProvider) {
    this.cliente = new Cliente();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ListaPedidoClientePage'); 
  }

  ionViewDidEnter() {
    if (this.navParams.data.cliente_id) {
      this.pedidoProvider.getAll2_cliente(this.navParams.data.cliente_id)
        .then((result: any[]) => {
          this.pedidos = result;
          this.qtd_pedidos = this.pedidos.length;
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar pedidos!!!', duration: 3000, position: 'botton' }).present();
        });
      this.clienteProvider.get(this.navParams.data.cliente_id)
        .then((result: Cliente) => {
          this.cliente = result;
        })
    }
  }

  showPedido(id: number){
    this.navCtrl.push(ShowPedidoPage, { id: id });
  }

  removePedido(pedido: Pedido2){
    let status_pedido: string = '';
    for (let el of this.pedidos) {
      if (el.id === pedido.id) {
        status_pedido = el.status;
      }
    }
    if (status_pedido !== 'Pendente'){
      this.toast.create({ message: 'Somente pedidos PENDENTE podem ser removidos!', duration: 3000, position: 'botton' }).present();
    } else {
      this.pedidoProvider.remove(pedido.id)
        .then(() => {
          var index = this.pedidos.indexOf(pedido);
          this.pedidos.splice(index, 1);
          this.toast.create({ message: 'Pedido removido!', duration: 3000, position: 'botton' }).present();
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao remover o Pedido!', duration: 3000, position: 'center' }).present();
      });
    }
  }

  editPedido(id: number){
    let status_pedido: string = '';
    for (let el of this.pedidos) {
      if (el.id === id) {
        status_pedido = el.status;
      }
    }
    if (status_pedido !== 'Pendente'){
      this.toast.create({ message: 'Somente pedidos PENDENTE podem ser alterados!', duration: 3000, position: 'botton' }).present();
    } else {
      this.navCtrl.push(CadastroPedidoPage, { id: id });
    }
  }

  soma(value1: any, value2: any){
    return Number(value1) + Number(value2);
  }
  
}
