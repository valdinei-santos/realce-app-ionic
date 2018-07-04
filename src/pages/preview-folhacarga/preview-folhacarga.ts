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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pedidoProvider: PedidoProvider,
              public folhacargaProvider: FolhacargaProvider,
              public toast: ToastController
             ) {
    console.log('Entrou preview-folhacarga...');
    this.model = new Folhacarga;
    this.model.status = 'Inexistente';
    this.model.data = this.data_atual.toISOString();
    this.pedidoProvider.getNewId()
      .then((result: any) => {
          this.model.id = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
      });
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
        /* this.itens.forEach((el) => {
          console.log(el.valor);
          //this.total_geral = this.total_geral + el.valor;
        }); */
        /* for (let el of this.itens){
          this.total_geral = this.total_geral + (el.valor as number);
          console.log(el.valor as number);
        } */
        console.log(this.total_geral);
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar Itens do pedido.', duration: 3000, position: 'botton' }).present();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreviewFolhacargaPage');
  }
  ionViewWillEnter(){
    console.log('ionViewWillEnter PreviewFolhacargaPage');
  }

  ionViewWDidEnter(){
    console.log('ionViewWDidEnter PreviewFolhacargaPage');
    this.pedidoProvider.getNewId()
      .then((result: any) => {
          this.model.id = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
      });
      //console.log('A:' + this.itens.length);
      //console.log('B:' + this.itens);

      /* for (let i=0; i < this.itens.length; i++){
        this.total_geral = this.total_geral + this.itens[i].valor;
      } */
  }
  ionViewWillLeave(){
    console.log('ionViewWillLeave PreviewFolhacargaPage');
  }
  ionViewDidLeave(){
    console.log('ionViewDidLeave PreviewFolhacargaPage');
  }
  ionViewWillUnload(){
    console.log('ionViewWillUnload PreviewFolhacargaPage');
  }
  ionViewCanEnter(){
    console.log('ionViewCanEnter PreviewFolhacargaPage');
  }
  ionViewCanLeave(){
    console.log('ionViewCanLeave PreviewFolhacargaPage');
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
  }

  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }

}
