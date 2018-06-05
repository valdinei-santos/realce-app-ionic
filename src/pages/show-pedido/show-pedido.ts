import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { PedidoProvider, Pedido, Pedido2 } from '../../providers/pedido/pedido';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { pdfMake } from 'pdfmake/build/pdfmake';
import { pdfFonts } from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * Generated class for the ShowPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-show-pedido',
  templateUrl: 'show-pedido.html',
})
export class ShowPedidoPage {

  model: Pedido2;
  itens: any[] = [];
  total: number = 0;

  letterObj = {
    from: 'Valdinei',
    to: 'Paul',
    text: 'Teste de emememasemaske aemas,emasmeas a asemasmeasmeasme asemase as '
  }
  pdfObj = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pedidoProvider: PedidoProvider,
              public toast: ToastController,
              private plt: Platform,
              private file: File,
              private fileOpener: FileOpener) {

    this.model = new Pedido2();
    this.pedidoProvider.get2(this.navParams.data.id)
      .then((result: any) => {
          this.model = result;
      })
      .catch(() => {
          this.toast.create({ message: 'Erro ao carregar um pedido.', duration: 3000, position: 'botton' }).present();
      });

    this.pedidoProvider.getItens(this.navParams.data.id)
      .then((result: any) => {
        this.itens = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar Itens do pedido.', duration: 3000, position: 'botton' }).present();
    });
     
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter ShowPedidoPage');
    for (let el of this.itens) {
      this.total = this.total + parseFloat(el.valor_total);
    }
  }

  createPDF() {
    var docDefinition = {
      content: [
        { text: 'REMINDER', style: 'header' },
        { text: new Date().toString(), alignment: 'right' },

        { text: 'From', style: 'subheader' },
        { text: this.letterObj.from },

        { text: 'To', style: 'subheader' },
        { text: this.letterObj.to },

        { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },

        {
          ul: [
            'Bacon',
            'Rips',
            'BBQ'
          ]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,  
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }
    this.pdfObj = pdfMake.createPDF(docDefinition);
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {

    } else {
      this.pdfObj.download();
    }
  }

  

}
