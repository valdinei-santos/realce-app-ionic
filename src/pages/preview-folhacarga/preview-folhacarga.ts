import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PedidoProvider, Pedido, Pedido2, Item_pedido } from '../../providers/pedido/pedido';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-preview-folhacarga',
  templateUrl: 'preview-folhacarga.html',
})
export class PreviewFolhacargaPage {

  //pedido: Pedido2;
  itens: any[] = [];
  lista_pedidos: any[] = [];
  //lista_pedidos: string = '';
  pedidos: string = '';
  //itens2: any[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pedidoProvider: PedidoProvider,
              public toast: ToastController
             ) {
    this.lista_pedidos = this.navParams.data.lista_pedidos;
    console.log(this.lista_pedidos);
    for (let i = 0; i < this.lista_pedidos.length; i++) {
      if (i == 0){
        this.pedidos = this.lista_pedidos[i].id;  
      } else {
        this.pedidos = this.pedidos + ' - ' + this.lista_pedidos[i].id;
      }
    }
    this.pedidoProvider.getAllItens(this.navParams.data.lista_pedidos)
      .then((result: any[]) => {
        this.itens = result;
        //console.log('Itenss: ' + this.itens);
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar Itens do pedido.', duration: 3000, position: 'botton' }).present();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreviewFolhacargaPage');
  }

  save() {
    if (this.saveFolhacarga()) {
      this.toast.create({ message: 'Folha de Carga salva!', duration: 3000, position: 'center' }).present();
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar a Folha de Carga!', duration: 3000, position: 'center' }).present();
    }
  }

  private saveFolhacarga() {
    
    /* this.data_atual_aux = this.model.data;
    this.model.data = this.data_atual_aux.substring(0,10);

    if (this.model.status != 'Inexistente') {
      console.log('Entrou UPDATE - ' + this.model.status);
      //this.editando = false;
      this.pedidoProvider.update(this.model);
      return this.pedidoProvider.update_itens(this.itens);
    } else {
      console.log('Entrou INSERT');
      //this.editando = true;
      this.model.status = 'Pendente';
      this.pedidoProvider.insert(this.model);
      return this.pedidoProvider.insert_itens(this.itens);
    } */
  }

  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }

}
