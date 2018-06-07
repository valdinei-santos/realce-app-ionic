import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

import { PedidoProvider, Pedido, Pedido2 } from '../../providers/pedido/pedido';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-show-pedido',
  templateUrl: 'show-pedido.html',
})
export class ShowPedidoPage {

  model: Pedido2;
  itens: any[] = [];
  total: number = 0;

  pagePdf = {

  }

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

  createPdf() {
    console.log('Entrou createPdf');
   /*  var corpo = '';
    for (var item of this.itens){
      corpo = corpo + item.nome_produto;
      corpo = corpo + 'Quant.: ' + item.quantidade;
      corpo = corpo + 'Preço: ' + item.valor_unitario;
      corpo = corpo + 'Total: ' + item.valor_total;
      corpo = corpo + '\n';
    } */
    
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
        { text: new Date().toTimeString(), alignment: 'right' },

        { text: 'PEDIDO: ' + this.model.id, style: 'subheader' },
        //{ text: this.model.id },

        { text: 'CLIENTE: ' + this.model.cliente_nome, style: 'subheader' },
        //{ text: this.letterObj.from },
        //{ text: this.model.cliente_nome },

        { text: 'DATA: ' + (this.model.data), style: 'subheader' },
        //{ text: this.letterObj.to },
        //{ text: this.model.data },

        { text: 'STATUS: ' + this.model.status, style: 'subheader' },
        //{ text: this.model.status },
        ' ',
        table(this.itens, ['nome_produto', 'quantidade', 'valor_unitario', 'valor_total']),

        { text: 'TOTAL: ' + (this.model.total), style: 'subheader' },
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
  }

  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
 
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }

  

}
