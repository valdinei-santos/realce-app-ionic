import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { FolhacargaProvider, Folhacarga } from '../../providers/folhacarga/folhacarga';
import { PedidoProvider } from '../../providers/pedido/pedido';
import { PreviewFolhacargaPage } from '../preview-folhacarga/preview-folhacarga';


@IonicPage()
@Component({
  selector: 'page-lista-folhacarga-hist',
  templateUrl: 'lista-folhacarga-hist.html',
})
export class ListaFolhacargaHistPage {

  folhas: any[];
  pedidos: any[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public folhacargaProvider: FolhacargaProvider,
              public pedidoProvider: PedidoProvider,
              public toast: ToastController) {
  }

  ionViewDidEnter() {
    this.folhacargaProvider.getAll2_hist()
      .then((result: any[]) => {
        this.folhas = result; 
        this.loadPedidos(); 
    })
    .catch(() => {
      this.toast.create({ message: 'Erro ao carregar folhas de carga!!!', duration: 3000, position: 'botton' }).present();
    });
    
  }

  loadPedidos(){
    let itens: any[] = [];
    for (let el of this.folhas) {
      this.folhacargaProvider.getPedidos(el.id)
        .then((result: any[]) => {
          itens.push(result);
          return;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos!!!', duration: 3000, position: 'botton' }).present();
      });
    }
    this.pedidos = itens;
  }

  removeFolha(folha: Folhacarga){
    this.folhacargaProvider.remove(folha.id)
      .then(() => {
        var index = this.folhas.indexOf(folha);
        this.folhas.splice(index, 1);
        this.toast.create({ message: 'Folha Carga removida!', duration: 3000, position: 'botton' }).present();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao remover a Folha de Carga!', duration: 3000, position: 'center' }).present();
    });
  }


  showFolha(id: number){
    let lista_p: number[] = [];
    for (let el1 of this.pedidos){
      for (let el2 of el1){
        if (el2.id === id) {
          lista_p.push(el2.pedido_id);
        }
      }
    }
    lista_p.sort;
    let str_lista_p: string = lista_p.toString();
    this.navCtrl.push(PreviewFolhacargaPage, 
      { id: id, 
        lista_pedidos: lista_p,
        isShow: true,
        isEdit: false,
        fromCadastro: false,
        fromLista: true,
        lista_pedidos_str: str_lista_p
      }
    );
  }


}
