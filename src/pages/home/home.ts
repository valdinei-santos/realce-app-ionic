import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ListaPedidoPage} from '../lista-pedido/lista-pedido';
import { ListaProdutoPage} from '../lista-produto/lista-produto';
import { ListaClientePage} from '../lista-cliente/lista-cliente';
import { ListaFolhacargaPage} from '../lista-folhacarga/lista-folhacarga';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  constructor(public navCtrl: NavController) {

  }

  pedidos(){
    this.navCtrl.push(ListaPedidoPage);
  }

  produtos(){
    this.navCtrl.push(ListaProdutoPage);
  }

  clientes(){
    this.navCtrl.push(ListaClientePage);
  }

  folhasCarga(){
    this.navCtrl.push(ListaFolhacargaPage);
  }

}
