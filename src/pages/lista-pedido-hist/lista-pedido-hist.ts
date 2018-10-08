import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { PedidoProvider, Pedido2 } from '../../providers/pedido/pedido';
import { ShowPedidoPage } from '../show-pedido/show-pedido';


@IonicPage()
@Component({
  selector: 'page-lista-pedido-hist',
  templateUrl: 'lista-pedido-hist.html',
})
export class ListaPedidoHistPage {

  pedido2: Pedido2 = new Pedido2();
  pedidos2: any[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pedidoProvider: PedidoProvider,
              public toast: ToastController) {
  }

  ionViewDidEnter() {
  	this.pedidoProvider.getAll2_hist()
      .then((result: any[]) => {
        this.pedidos2 = result;  
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos!!!', duration: 3000, position: 'botton' }).present();
      });
  }

  removePedido(pedido: Pedido2){
    let status_pedido: string = '';
    for (let el of this.pedidos2) {
      if (el.id === pedido.id) {
        status_pedido = el.status;
      }
    }
    if (status_pedido !== 'Pendente'){
      this.toast.create({ message: 'Somente pedidos PENDENTE podem ser removidos!', duration: 3000, position: 'botton' }).present();
    } else {
      this.pedidoProvider.remove(pedido.id)
        .then(() => {
          var index = this.pedidos2.indexOf(pedido);
          this.pedidos2.splice(index, 1);
          this.toast.create({ message: 'Pedido removido!', duration: 3000, position: 'botton' }).present();
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao remover o Pedido!', duration: 3000, position: 'center' }).present();
      });
    }
  }

  showPedido(id: number){
    this.navCtrl.push(ShowPedidoPage, { id: id });
  }

  getPedidos(ev: any) {
    this.pedidoProvider.getAll2_hist()
      .then((result: any[]) => {
        this.pedidos2 = result;
        // Lógica para povoar o array só com os produtos que atendem o filtro.
        const val = ev.target.value;
        if (val && val.trim() != '') {
          this.pedidos2 = this.pedidos2.filter((item) => {
            return (item.cliente_nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos.', duration: 3000, position: 'botton' }).present();
    });
  }

  soma(value1: any, value2: any){
    return Number(value1) + Number(value2);
  }


}
