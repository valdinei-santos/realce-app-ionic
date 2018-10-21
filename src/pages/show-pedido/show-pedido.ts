import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';

import { PedidoProvider, Pedido2 } from '../../providers/pedido/pedido';
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
  selector: 'page-show-pedido',
  templateUrl: 'show-pedido.html',
  providers: [ /* FormatCurrencyPipe,  */ FormatDatePipe ]
})
export class ShowPedidoPage {

  model: Pedido2;
  itens: any[] = [];
  itens2: any[] = [];
  total: number = 0;
  total_geral: number = 0;
  dataAtual: Date;
  horaAtual: string;
  //pagoString: string;
  pagePdf = { 
    'pedido_id': null, 
    'cliente_nome': null,
    'cliente_endereco': null,
    'cliente_celular': null, 
    'data': null, 
    'status': null, 
    'pago': null,
    'avista': null,
    'observacao': null,
    'total': null
  };
  pdfObj = null;
  content: any[] = [];
  docDefinition: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pedidoProvider: PedidoProvider,
              public toast: ToastController,
              private formatDate: FormatDatePipe,
              private decimalPipe: DecimalPipe,
              private plt: Platform,
              private file: File,
              private fileOpener: FileOpener,
              private loadingController: LoadingController) { 

      this.model = new Pedido2();
  }


  ionViewDidLoad() {
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
    for (let el of this.itens) {
      this.total = this.total + parseFloat(el.valor_total);
    }
    this.total_geral = Number(this.total) + Number(this.model.valor_adicional);
  }

  getTimestamp() {
    let now = new Date();
    let year = "" + now.getFullYear();
    let month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    let day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    let hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    let second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return day + "/" + month + "/" + year + " " + hour + ":" + minute + ":" + second;
  }

  createPdf() {
    let loading = this.loadingController.create({
      content: 'Aguarde o carregamento...'
    });
    loading.present(); // Inicia LOADING

    // this.model.pago ? this.pagoString = 'Pago' : this.pagoString = '';
    for (let el of this.itens) {
      let item = {id: null, nome_produto:null, quantidade: null, valor_unitario: null, valor_total: null};
      item.id = el.id;
      item.nome_produto = el.nome_produto;
      item.quantidade = el.quantidade;
      item.valor_unitario = this.decimalPipe.transform(el.valor_unitario, '1.2-2');
      item.valor_total = this.decimalPipe.transform(el.valor_total, '1.2-2');
      this.itens2.push(item);
    }
    this.pagePdf = {
      'pedido_id': this.model.id,
      'cliente_nome': this.model.cliente_nome,
      'cliente_endereco': this.model.cliente_endereco,
      'cliente_celular': this.model.cliente_celular,
      'data': this.formatDate.transform(this.model.data),
      'status': this.model.status,
      'pago': this.model.pago,
      'avista': this.model.avista,
      'observacao': this.model.observacao,
      'total': this.decimalPipe.transform(this.model.total, '1.2-2'),
    }
    this.horaAtual = this.getTimestamp();

    let l1 = { text: 'DISTRIBUIDORA REALCE - PEDIDO', style: 'header' };
    let l2 = { text: this.horaAtual, alignment: 'right' };
    let l3 = { text: 'PEDIDO: ' + this.pagePdf.pedido_id + 
                     ' -- DATA: ' + this.pagePdf.data +
                     ' -- STATUS: ' + this.pagePdf.status, style: 'subheader' };
    let l4 = { text: 'CLIENTE: ' + this.pagePdf.cliente_nome + 
                     ' -- CEL: ' + this.pagePdf.cliente_celular, style: 'subheader' };
    let l5 = { text: 'ENDEREÇO: ' + this.pagePdf.cliente_endereco, style: 'subheader' };
    let l6 = table(this.itens2, ['nome_produto', 'quantidade', 'valor_unitario', 'valor_total']);
    let l7 = { text: 'Observação: ' + this.pagePdf.observacao, style: 'subheader' };
    let l8;
    if (this.model.pago) {
      l8 = { text: 'TOTAL: ' + this.pagePdf.total + '  Pago', style: 'subheader' };
    } else if (this.model.avista) {
      l8 = { text: 'TOTAL: ' + this.pagePdf.total + '  Cobrar na Entrega', style: 'subheader' };
    } else {
      l8 = { text: 'TOTAL: ' + this.pagePdf.total, style: 'subheader' };
    }
    this.content.push(l1);
    this.content.push(l2);
    this.content.push(l3);
    this.content.push(l4);
    this.content.push(l5);
    this.content.push(l6);
    if (this.pagePdf.observacao !== '' && this.pagePdf.observacao !== undefined) {
      this.content.push(l7);
    }
    this.content.push(l8);

    function buildTableBody(data, columns) {
      var body = [];
      body.push(['Produto', 'Quant.', 'Valor', 'Total']);
      data.forEach(function(row) {
          var dataRow = [];
          columns.forEach(function(column) {
              dataRow.push(row[column].toString());
          })
          body.push(dataRow);
      });
      return body;
    }

    function table(data, columns) {
      return {
        table: {
            headerRows: 1,
            body: buildTableBody(data, columns)
        }
      };
    }

    this.docDefinition = {
      content: [this.content],
      styles: {
        header: {
          fontSize: 17,
          bold: true,  
        },
        subheader: {
          fontSize: 13,
          bold: true,
          margin: [0, 5, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'left',
          width: '50%',
        },
        tableExample: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }

      }
    }
    this.pdfObj = pdfMake.createPdf(this.docDefinition);
    loading.dismiss(); // Filaliza LOADING
  } // Fim createPdf()

  viewPdf() {
    let loading = this.loadingController.create({
      content: 'Aguarde o carregamento...'
    });
    loading.present(); // Inicia LOADING
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
 
        // Save the PDF to the data Directory of our App 
        // Gera em /data/data/br.com.valdinei.realceapp/files
        this.file.writeFile(this.file.externalDataDirectory, 'pedido_'+this.model.id+'.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.externalDataDirectory + 'pedido_'+this.model.id+'.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
    loading.dismiss(); // Filaliza LOADING
  }

  

}
