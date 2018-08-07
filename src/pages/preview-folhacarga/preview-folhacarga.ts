import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PedidoProvider, Pedido, Pedido2, Item_pedido } from '../../providers/pedido/pedido';
import { ToastController } from 'ionic-angular';
import { Folhacarga, FolhacargaProvider } from '../../providers/folhacarga/folhacarga';

@IonicPage()
@Component({
  selector: 'page-preview-folhacarga',
  templateUrl: 'preview-folhacarga.html',
})
export class PreviewFolhacargaPage {

  model: Folhacarga;
  //pedido: Pedido2;
  itens: any[] = [];
  lista_pedidos: any[] = [];
  //lista_pedidos: string = '';
  pedidos: string = '';
  //itens2: any[] = [];
  data_atual: any = new Date();
  data_atual_aux: any = new Date();
  total_geral: number = 0;
  editando: boolean = false;
  isShow: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pedidoProvider: PedidoProvider,
              public folhacargaProvider: FolhacargaProvider,
              public toast: ToastController
             ) {
    console.log('preview-folhacarga - constructor');
    this.model = new Folhacarga;
    
  }

  ionViewDidLoad() {
    console.log('preview-folhacarga - ionViewDidLoad');
    if (!this.navParams.data.isEdit) {
      console.log('preview-folhacarga - isEdit: ' + this.navParams.data.isEdit);
      this.model.status = 'Inexistente';
      this.model.data = this.data_atual.toISOString();
      this.loadNewId();
    } else {
      console.log('preview-folhacarga - Não é isEdit: ' + this.navParams.data.isEdit);
      this.folhacargaProvider.get(this.navParams.data.id)
         .then((result: any) => {
          this.model = result;
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar uma folhacarga.', duration: 3000, position: 'botton' }).present();
      });
    }
    this.lista_pedidos = this.navParams.data.lista_pedidos;
    console.log(this.lista_pedidos);
    for (let i = 0; i < this.lista_pedidos.length; i++) {
      if (i == 0){
        this.pedidos = this.lista_pedidos[i];  
      } else {
        this.pedidos = this.pedidos + ' - ' + this.lista_pedidos[i];
      }
    }
    this.pedidoProvider.getAllItens(this.navParams.data.lista_pedidos)
      .then((result: any[]) => {
        this.itens = result;
        //console.log('Itenss: ' + this.itens);
        console.log('A:' + this.itens.length);
        console.log('B:' + this.itens);
        for (let i=0; i < this.itens.length; i++){
          this.total_geral = this.total_geral + this.itens[i].valor;
        }
        console.log(this.total_geral);
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar Itens do pedido.', duration: 3000, position: 'botton' }).present();
    });
  }

  ionViewWillEnter(){
    console.log('preview-folhacarga - ionViewWillEnter');
    if (this.navParams.data.isShow) {
      this.isShow = this.navParams.data.isShow;
    }
  }

  ionViewDidEnter(){
    console.log('preview-folhacarga - ionViewWDidEnter');
    this.editando = this.navParams.data.isEdit;
  }
  ionViewWillLeave(){
    console.log('preview-folhacarga - ionViewWillLeave');
  }
  ionViewDidLeave(){
    console.log('preview-folhacarga - ionViewDidLeave');
  }
  ionViewWillUnload(){
    console.log('preview-folhacarga - ionViewWillUnload');
  }
  ionViewCanEnter(){
    console.log('preview-folhacarga - ionViewCanEnter');
  }
  ionViewCanLeave(){
    console.log('preview-folhacarga - ionViewCanLeave');
  }

  loadNewId(){
    this.folhacargaProvider.getNewId()
    .then((result: any) => {
        this.model.id = result;
    })
    .catch(() => {
      this.toast.create({ message: 'Erro ao carregar New ID!!!', duration: 3000, position: 'botton' }).present();
    });
  }

  save() {
    if (!this.navParams.data.isEdit) { // eh cadastro
      if (this.saveFolhacarga()) {
        this.toast.create({ message: 'Folha de Carga salva!', duration: 3000, position: 'center' }).present();
        this.navCtrl.getPrevious().data.vem_preview = true;
        this.navCtrl.pop();
      } else {
        this.toast.create({ message: 'Erro ao salvar a Folha de Carga!', duration: 3000, position: 'center' }).present();
      }
    } else { // eh Edit
      if (this.saveFolhacarga()) {
        this.toast.create({ message: 'Folha de Carga alterada!', duration: 3000, position: 'center' }).present();
        this.navCtrl.pop();
      } else {
        this.toast.create({ message: 'Erro ao alterar a Folha de Carga!', duration: 3000, position: 'center' }).present();
      }
    }
  }

  private saveFolhacarga() {
    //if (this.model.status != 'Inexistente') {
    if (this.editando) {
      console.log('Entrou UPDATE Folha - ' + this.model.status);
      //this.folhacargaProvider.remove(this.model.id);
      this.folhacargaProvider.remove(this.model.id)
        .then(() => {
          console.log('Folha carga removida para UPDATE1');
          this.pedidoProvider.update_status(this.lista_pedidos, 'Alocado');
          console.log('Folha carga removida para UPDATE2');
          let insert_folha = this.folhacargaProvider.insert(this.model);
          console.log('Folha carga removida para UPDATE3');  
          return this.folhacargaProvider.insert_itens(this.lista_pedidos, this.model.id);
          //   .then((res) => {
          //    console.log('RES: ' + res);
          //  })
          //  .catch(() => {
          //    console.log('RES - ERRO: ');
          //  });
          //return true; 
        })
        .catch(() => {
          console.log('Erro ao remover a Folha de Carga para UPDATE!');
        });
/*         console.log('Folha carga removida para UPDATE1');
        this.pedidoProvider.update_status(this.lista_pedidos, 'Alocado');
        console.log('Folha carga removida para UPDATE2');
        let insert_folha = this.folhacargaProvider.insert(this.model);
        console.log('Folha carga removida para UPDATE3');  
        return this.folhacargaProvider.insert_itens(this.lista_pedidos, this.model.id); */
        //return true;
    } else {
      console.log('Entrou INSERT Folha - ' + this.model.status);
      this.data_atual_aux = this.model.data;
      this.model.data = this.data_atual_aux.substring(0,10);
      this.model.status = 'Pendente';
      this.pedidoProvider.update_status(this.lista_pedidos, 'Alocado');
      let insert_folha = this.folhacargaProvider.insert(this.model);  
      return this.folhacargaProvider.insert_itens(this.lista_pedidos, this.model.id);
    } 
/*     this.pedidoProvider.update_status(this.lista_pedidos, 'Alocado');
    let insert_folha = this.folhacargaProvider.insert(this.model);  
    return this.folhacargaProvider.insert_itens(this.lista_pedidos, this.model.id); */
  }

/*   private updateFolhacarga() {
    this.data_atual_aux = this.model.data;
    this.model.data = this.data_atual_aux.substring(0,10);
    if (this.model.status != 'Inexistente') {
      console.log('Entrou UPDATE Folha - ' + this.model.status);
      //this.editando = false;
      this.folhacargaProvider.update(this.model);
      return this.folhacargaProvider.update_itens(this.lista_pedidos, this.model.id);
    } else {
      console.log('Entrou INSERT Folha - ' + this.model.status);
      //this.editando = true;
      this.model.status = 'Pendente';
      console.log(this.model);
      let insert_folha = this.folhacargaProvider.insert(this.model);
      console.log(insert_folha);
      this.pedidoProvider.update_status(this.lista_pedidos, 'Alocado');
      return this.folhacargaProvider.insert_itens(this.lista_pedidos, this.model.id);
    } 
  } */

  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }

}
