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

  folhacarga: Folhacarga2;
  itens: any[] = [];
  itens2: any[] = [];
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
    this.folhacarga = new Folhacarga2();
    this.folhacargaProvider.get2(this.navParams.data.id)
      .then((result: any) => {
          this.folhacarga = result;
      })
      .catch(() => {
          this.toast.create({ message: 'Erro ao carregar um folhacarga.', duration: 3000, position: 'botton' }).present();
    });

    this.folhacargaProvider.getItens(this.navParams.data.id)
      .then((result: any) => {
        this.itens = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar Itens do folhacarga.', duration: 3000, position: 'botton' }).present();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowFolhacargaPage');
  }

}
