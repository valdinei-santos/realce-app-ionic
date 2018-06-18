import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { PedidoProvider, Pedido, Pedido2 } from '../../providers/pedido/pedido';
import { ToastController } from 'ionic-angular';
import { PreviewFolhacargaPage } from '../preview-folhacarga/preview-folhacarga';


@IonicPage()
@Component({
  selector: 'page-cadastro-folhacarga',
  templateUrl: 'cadastro-folhacarga.html',
})
export class CadastroFolhacargaPage {

  pedidos2: any[];
  check: number[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pedidoProvider: PedidoProvider,
              public toast: ToastController,
              public modalCtrl: ModalController
             ) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroFolhacargaPage');
    this.pedidoProvider.getAll3()
      .then((result: any[]) => {
        this.pedidos2 = result;    
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos!!!', duration: 3000, position: 'botton' }).present();
      });
  }

  onChange(id, isChecked) {
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
    this.navCtrl.push(PreviewFolhacargaPage, { lista_pedidos: this.check });
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
