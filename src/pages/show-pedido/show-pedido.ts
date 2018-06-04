import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PedidoProvider, Pedido, Pedido2 } from '../../providers/pedido/pedido';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the ShowPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-pedido',
  templateUrl: 'show-pedido.html',
})
export class ShowPedidoPage {

  model: Pedido2;
  itens: any[] = [];
  total: number = 0;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pedidoProvider: PedidoProvider,
              public toast: ToastController) {

    this.model = new Pedido2();
    this.pedidoProvider.get2(this.navParams.data.id)
      .then((result: any) => {
          this.model = result;
      })
      .catch(() => {
          this.toast.create({ message: 'Erro ao carregar um pedido.', duration: 3000, position: 'botton' }).present();
      });

    this.pedidoProvider.getItens(this.navParams.data.id)
      .then((result: any) => {
        this.itens = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar Itens do pedido.', duration: 3000, position: 'botton' }).present();
    });
     
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ShowPedidoPage');
    for (let el of this.itens) {
      this.total = this.total + parseFloat(el.valor_total);
    }
  }

}
