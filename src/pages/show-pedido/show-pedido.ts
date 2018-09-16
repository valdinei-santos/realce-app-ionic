import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { PedidoProvider, Pedido, Pedido2, Item_pedido } from '../../providers/pedido/pedido';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { ToastController } from 'ionic-angular';
//import { FormatCurrencyPipe } from '../../pipes/format-currency/format-currency';
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
  pagePdf = { 
    'pedido_id': null, 
    'cliente_nome': null,
    'cliente_endereco': null,
    'cliente_celular': null, 
    'data': null, 
    'status': null, 
    'total': null 
  };
  pdfObj = null;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pedidoProvider: PedidoProvider,
              public toast: ToastController,
              private formatDate: FormatDatePipe,
              private decimalPipe: DecimalPipe,
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
    this.total_geral = Number(this.total) + Number(this.model.valor_adicional);
    console.log(this.itens[0].valor_unitario);
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
    console.log('Entrou createPdf');
    for (let el of this.itens) {
      //this.total = this.total + parseFloat(el.valor_total);
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
      'total': this.decimalPipe.transform(this.model.total, '1.2-2'),
    }
    this.horaAtual = this.getTimestamp();

    function buildTableBody(data, columns) {
      var body = [];
      //body.push(columns);
      body.push(['Produto', 'Quantidade', 'Valor', 'Total']);
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

    //function (row) {
    //      return (row + 1) * 25;

    var docDefinition = {
      content: [
        { text: 'DISTRIBUIDORA REALCE - PEDIDO', style: 'header' },
        { text: this.horaAtual, alignment: 'right' },

        { text: 'PEDIDO: ' + this.pagePdf.pedido_id, style: 'subheader' },

        { text: 'CLIENTE: ' + this.pagePdf.cliente_nome, style: 'subheader' },

        { text: 'ENDEREÇO: ' + this.pagePdf.cliente_endereco, style: 'subheader' },
        
        { text: 'CELULAR: ' + this.pagePdf.cliente_celular, style: 'subheader' },

        { text: 'DATA: ' + this.pagePdf.data, style: 'subheader' },

        { text: 'STATUS: ' + this.pagePdf.status, style: 'subheader' },
        ' ',
        table(this.itens2, ['nome_produto', 'quantidade', 'valor_unitario', 'valor_total']),

        { text: 'TOTAL: ' + this.pagePdf.total, style: 'subheader' },
//        {
//          style: 'tableExample',
//          table: {
            //widths: [200, '*', '*', 'auto'],
            //heights: 40,  // Valor para altura de todas as linhas
            //heights: [20, 30, 40, 20],  --> Com altura distinta para cada linha
            //layout: 'noBorders',   ou   layout: 'lightHorizontalLines'   ou    layout: 'headerLineOnly',  ou  
            //layout: {
            //  fillColor: function (i, node) {
            //      return (i % 2 === 0) ? '#CCCCCC' : null;
            //  }
            //}
//            body: this.itens 
              //[
              //['Produto', 'Quantidade', 'Valor', 'Total'],
              //['One value goes here', 'Another one here', 'OK?', 'dadada']
              //]
//          }
//        },

        //{ text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },
        //{ text: corpo, style: 'story', margin: [0, 20, 0, 20] },

        //{
        //  ul: [
        //    'Bacon',
        //    'Rips',
        //  ]
        //}
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
    console.log(docDefinition);
    this.pdfObj = pdfMake.createPdf(docDefinition);
  } // Fim createPdf()

  viewPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
 
        // Save the PDF to the data Directory of our App 
        // Gera em /data/data/br.com.valdinei.realceapp/files
        this.file.writeFile(this.file.dataDirectory, 'pedido_'+this.model.id+'.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'pedido_'+this.model.id+'.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

  

}
