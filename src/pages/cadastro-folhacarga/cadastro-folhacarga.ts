import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ActionSheetController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { PedidoProvider} from '../../providers/pedido/pedido';
import { PreviewFolhacargaPage } from '../preview-folhacarga/preview-folhacarga';
import { FolhacargaProvider, Folhacarga } from '../../providers/folhacarga/folhacarga';


@IonicPage()
@Component({
  selector: 'page-cadastro-folhacarga',
  templateUrl: 'cadastro-folhacarga.html',
})
export class CadastroFolhacargaPage {

  model: Folhacarga;
  pedidos2: any[] = [];
  pedidos3: any[] = [];
  check: number[] = [];
  return_preview: boolean = false;
  folha_id: number;
  editando: boolean = false;
  listaPedidosExistentes: any[] = [];
  status: string = '';
  check_original: number[] = [];


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pedidoProvider: PedidoProvider,
              public toast: ToastController,
              public modalCtrl: ModalController,
              public folhacargaProvider: FolhacargaProvider,
              public platform: Platform,
              public actionsheetCtrl: ActionSheetController
             ) { }

  ionViewDidLoad() {
    this.model = new Folhacarga;
    this.return_preview = false;
    if (this.navParams.data.id) {  // eh Edit
      this.folha_id = this.navParams.data.id;
    }
    this.loadPedidos();
    if (this.navParams.data.id) { // eh Edit
      this.editando = true;
      this.folhacargaProvider.get(this.navParams.data.id)
        .then((result: Folhacarga) => {
          this.model = result;
          this.status = this.model.status;
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar Folhacarga!!!', duration: 3000, position: 'botton' }).present();
        })
      this.loadPedidosDaFolhacarga(this.navParams.data.id);
    } 
  }
  
  ionViewWillEnter(){
    this.status = this.model.status;
    if (this.navParams.get('vem_preview')){ // Esta voltando do Preview
      this.loadPedidos();
      this.return_preview = false;
      this.check = [];
      this.editando = false;
    }
  }

  ionViewWillLeave(){
    console.log('cadastro-folhacarga - ionViewWillLeave');
  }
  ionViewDidLeave(){
    console.log('cadastro-folhacarga - ionViewDidLeave');
  }
  ionViewWillUnload(){
    console.log('cadastro-folhacarga - ionViewWillUnload');
  }
  ionViewCanEnter(){
    console.log('cadastro-folhacarga - ionViewCanEnter');
  }
  ionViewCanLeave(){
    console.log('cadastro-folhacarga - ionViewCanLeave');
  }
  ionViewDidEnter() {
    console.log('cadastro-folhacarga - ionViewDidEnter');
  }

  onChange(id, isChecked) {
    if(isChecked) {
      this.check.push(id);
    } else {
      this.check.splice(this.check.indexOf(id), 1);
    }
  }

  loadPedidos(){
    this.pedidoProvider.getAll3()
      .then((result: any[]) => {
        this.pedidos2 = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos2!!!', duration: 3000, position: 'botton' }).present();
      });
  }

  loadPedidosDaFolhacarga(folha_id: number){
    this.folhacargaProvider.getPedidos(folha_id)
      .then((result: any[]) => {
        for (let res of result) {
          res.checked = true;
          this.pedidos3.push(res);
          this.check.push(res.pedido_id);
          this.check_original.push(res.pedido_id);
        }
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos3!!!', duration: 3000, position: 'botton' }).present();
      });
  }

  previewFolhacarga(){
    if (this.check.length === 0) {
      this.toast.create({message: 'Selecione algum pedido!!!', duration: 3000, position: 'middle'}).present();
    } else {
      this.return_preview = false;
      this.navCtrl.push(PreviewFolhacargaPage, {
        lista_pedidos: this.check, 
        fromCadastro: true,
        isEdit: this.editando,
        isShow: false,
        id: this.folha_id,
        status: this.model.status
      });
    } 
  }

  changeStatus() {
    console.log('Status: ' + this.model.status);
    if (this.model.status !== this.status) {
      console.log('Status diferente');
      this.folhacargaProvider.update_status(this.model.id, this.model.status);
      if (this.model.status === 'Entregue') {
        console.log('Status alterar pedido: ' + this.check_original );
        this.pedidoProvider.update_status(this.check_original, this.model.status);
      }
    }
  }

  // EXEMPLO BOTAO COM VARIAS OPCOES

  // .scss
  /* .action-sheets-basic-page {
    .ion-md-share {
      color: #ED4248;
    }
    .ion-md-arrow-dropright-circle {
      color: #508AE4;
    }
    .ion-md-heart-outline {
      color: #31D55F;
    }
    .action-sheet-cancel ion-icon,
    .action-sheet-destructive ion-icon {
      color: #757575;
    }
   }*/

   // .ts
  /* openMenu() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Albums',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
          }
        },
        {
          text: 'Share',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Play',
          icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
          handler: () => {
            console.log('Play clicked');
          }
        },
        {
          text: 'Favorite',
          icon: !this.platform.is('ios') ? 'heart-outline' : null,
          handler: () => {
            console.log('Favorite clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platform.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  } */

  // .html
  /*<ion-item class="action-sheets-basic-page"> 
      <button ion-button block (click)="openMenu()">
        Show Action Sheet
      </button>
    </ion-item> */


}
