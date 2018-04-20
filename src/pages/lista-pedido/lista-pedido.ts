import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PedidoProvider, Pedido } from '../../providers/pedido/pedido';
import { CadastroPedidoPage } from '../cadastro-pedido/cadastro-pedido';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the ListaPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-pedido',
  templateUrl: 'lista-pedido.html',
})
export class ListaPedidoPage {

  pedido: Pedido = {id:null, cliente_id:null, data:'', status:''};
  pedidos: any[];

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public pedidoProvider: PedidoProvider,
  	          public toast: ToastController) {
  }


  ionViewDidEnter() {
  	this.pedidoProvider.getAll()
      .then((result: any[]) => {
        this.pedidos = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos!!!', duration: 3000, position: 'botton' }).present();
      });
  }


  addPedido(){
    console.log('addPedido');
	  this.navCtrl.push(CadastroPedidoPage);
  }






}
