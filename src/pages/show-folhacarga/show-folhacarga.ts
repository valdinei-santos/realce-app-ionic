import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { FolhacargaProvider, Folhacarga2, Item_folhacarga } from '../../providers/folhacarga/folhacarga';
import { ToastController } from 'ionic-angular';
import { FormatDatePipe } from '../../pipes/format-date/format-date';
import { DecimalPipe } from '@angular/common';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-show-folhacarga',
  templateUrl: 'show-folhacarga.html',
  providers: [ FormatDatePipe ]
})
export class ShowFolhacargaPage {

  model: Folhacarga2;
  itens: any[] = [];
  itens2: any[] = [];
  lista_pedidos: any[] = [];
  pedidos2: any[];
  pedidos: string;
  total: number = 0;
  dataAtual: Date;
  horaAtual: string;
  pagePdf = { 'pedido_id': null, 'cliente_nome': null, 'data': null, 'status': null, 'total': null };
  pdfObj = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public folhacargaProvider: FolhacargaProvider,
              public toast: ToastController,
              private formatDate: FormatDatePipe,
              private decimalPipe: DecimalPipe,
              private plt: Platform,
              private file: File,
              private fileOpener: FileOpener
             ) {
    console.log('constructor ShowFolhacargaPage');
    console.log('ID: ' + this.navParams.data.id);
    this.model = new Folhacarga2();
    this.folhacargaProvider.get2(this.navParams.data.id)
      .then((result: any) => {
          this.model = result;
          console.log('Passou get2');
      })
      .catch(() => {
          this.toast.create({ message: 'Erro ao carregar um folhacarga.', duration: 3000, position: 'botton' }).present();
    });

    this.folhacargaProvider.getItens(this.navParams.data.id)
      .then((result: any) => {
        this.itens = result;
        console.log('Passou getItens')
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar Itens do folhacarga.', duration: 3000, position: 'botton' }).present();
    });

    this.loadPedidosDaFolhacarga(this.navParams.data.id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowFolhacargaPage');
  }

  loadPedidosDaFolhacarga(folha_id: number){
    this.folhacargaProvider.getPedidos(folha_id)
      .then((result: any[]) => {
        this.pedidos2 = result;
        for (let i = 0; i < this.pedidos2.length; i++) {
          if (i == 0){
            this.pedidos = this.pedidos2[i].pedido_id;  
          } else {
            this.pedidos = this.pedidos + ' - ' + this.pedidos2[i].pedido_id;
          }
        }  
        console.log('Pedidos2 loadPedidosDaFolhacarga: ' + this.pedidos2); 
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos!!!', duration: 3000, position: 'botton' }).present();
      });
  }

/*   loadPedidosDaFolhacarga2(folha_id: number){
    this.folhacargaProvider.getPedidosDaFolhacarga(folha_id)
      .then( (data) => {
        this.pedidos2 = data;
        for (let i = 0; i < this.pedidos2.length; i++) {
          if (i == 0){
            this.pedidos = this.pedidos2[i].pedido_id;  
          } else {
            this.pedidos = this.pedidos + ' - ' + this.pedidos2[i].pedido_id;
          }
        }
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos da Folhacarga!!!', duration: 3000, position: 'botton' }).present();
      });
    console.log('loadPedidosDaFolhacarga em show-fohacarga');
  } */

}
