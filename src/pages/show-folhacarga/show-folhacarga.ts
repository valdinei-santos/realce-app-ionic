import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PedidoProvider, Pedido, Pedido2, Item_pedido } from '../../providers/pedido/pedido';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-show-folhacarga',
  templateUrl: 'show-folhacarga.html',
})
export class ShowFolhacargaPage {

  pedido: Pedido2;
  itens: any[] = [];
  itens2: any[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public pedidoProvider: PedidoProvider,
              public toast: ToastController
             ) {
    this.pedido = new Pedido2();
    this.pedidoProvider.get2(this.navParams.data.id)
      .then((result: any) => {
          this.pedido = result;
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowFolhacargaPage');
  }

}
