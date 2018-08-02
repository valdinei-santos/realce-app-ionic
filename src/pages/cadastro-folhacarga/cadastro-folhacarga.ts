import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PedidoProvider, Pedido, Pedido2 } from '../../providers/pedido/pedido';
import { ToastController } from 'ionic-angular';
import { PreviewFolhacargaPage } from '../preview-folhacarga/preview-folhacarga';
import { FolhacargaProvider } from '../../providers/folhacarga/folhacarga';


@IonicPage()
@Component({
  selector: 'page-cadastro-folhacarga',
  templateUrl: 'cadastro-folhacarga.html',
})
export class CadastroFolhacargaPage {

  pedidos2: any[];
  check: number[] = [];
  return_preview: boolean = false;
  folha_id: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pedidoProvider: PedidoProvider,
              public toast: ToastController,
              public modalCtrl: ModalController,
              public folhacargaProvider: FolhacargaProvider
             ) {
    console.log('constructor CadastroFolhacargaPage');
    this.return_preview = false;
    this.folha_id = this.navParams.data.id;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroFolhacargaPage');
    //this.loadNewId();
    this.loadPedidos();
    if (this.navParams.data.id) {
      //this.loadPedidos();
      console.log('Veio parametro: ' + this.navParams.data.id);
      console.log('Array de pedidos: ' + this.pedidos2);
      this.loadPedidosDaFolhacarga(this.navParams.data.id);
    } 
  }
  ionViewWillEnter(){
    console.log('ionViewWillEnter CadastroFolhacargaPage');
    //console.log(this.return_preview);
    //this.return_preview = this.navParams.get('vem_preview');
    //console.log(this.return_preview);
    console.log('antes: ' + this.check.length);
    if (this.navParams.get('vem_preview')){
      this.loadPedidos();
      this.return_preview = false;
      this.check = [];
    }
    console.log('depois: ' + this.check.length);
  }

  ionViewWillLeave(){
    console.log('ionViewWillLeave CadastroFolhacargaPage');
  }
  ionViewDidLeave(){
    console.log('ionViewDidLeave CadastroFolhacargaPage');
  }
  ionViewWillUnload(){
    console.log('ionViewWillUnload CadastroFolhacargaPage');
  }
  ionViewCanEnter(){
    console.log('ionViewCanEnter CadastroFolhacargaPage');
  }
  ionViewCanLeave(){
    console.log('ionViewCanLeave CadastroFolhacargaPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter CadastroFolhacargaPage');
  }

  onChange(id, isChecked) {
    console.log("onChange");
    if(isChecked) {
      //let item = { "id": id };
      this.check.push(id);
      //console.log('Item checked: ' + id);
    } else {
      //let item = { "id": id };
      /* let index = this.check.findIndex(function(item) {
        return item.id == id
      }); */
      //console.log('quem remove: ' + this.check.indexOf(index));
      //console.log('quem remove: ' + this.check.indexOf(id));
      this.check.splice(this.check.indexOf(id), 1);
      //console.log('Item unchecked: ' + id);
    }
    console.log(this.check);
  }

  loadPedidos(){
    this.pedidoProvider.getAll3()
      .then((result: any[]) => {
        this.pedidos2 = result;
        console.log('Pedidos2 loadPedidos: ' + this.pedidos2);  
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos!!!', duration: 3000, position: 'botton' }).present();
      });
  }

  loadPedidosDaFolhacarga(folha_id: number){
    this.folhacargaProvider.getPedidos(folha_id)
      .then((result: any[]) => {
        this.pedidos2.push(result);    
        console.log('Pedidos2 loadPedidosDaFolhacarga: ' + this.pedidos2); 
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos!!!', duration: 3000, position: 'botton' }).present();
      });
  }


  /* createFolhaCarga() {
    //let profileModal = this.modalCtrl.create(Profile, { userId: 8675309 });
    let profileModal = this.modalCtrl.create(Profile, { userId: 8675309 });
    profileModal.present();

    profileModal.onDidDismiss(data => {
      console.log(data);
    });
  } */

  previewFolhacarga(){
    console.log('previewFolhacarga: ');
    if (this.check.length === 0) {
      this.toast.create({ 
        message: 'Selecione algum pedido!!!', 
        duration: 3000, 
        position: 'middle',
      }).present();
      //alert('Selecione um ou mais pedidos!!!');
    } else {
      this.return_preview = false;
      this.navCtrl.push(PreviewFolhacargaPage, { lista_pedidos: this.check });
    }
    
  }

  save() {
    if (this.saveFolhacarga()) {
      this.toast.create({ message: 'Pedido salvo!', duration: 3000, position: 'center' }).present();
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar o Pedido!', duration: 3000, position: 'center' }).present();
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
