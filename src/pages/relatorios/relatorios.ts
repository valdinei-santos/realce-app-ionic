import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { ExpImpDbProvider } from '../../providers/exp-imp-db/exp-imp-db';
import { ListaPedidoHistPage } from '../lista-pedido-hist/lista-pedido-hist';
import { ListaFolhacargaHistPage } from '../lista-folhacarga-hist/lista-folhacarga-hist';
import { PedidoProvider, Pedido2 } from '../../providers/pedido/pedido';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DecimalPipe } from '@angular/common';
import { FormatDatePipe } from '../../pipes/format-date/format-date';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@IonicPage()
@Component({
  selector: 'page-relatorios',
  templateUrl: 'relatorios.html',
  providers: [ /* FormatCurrencyPipe,  */ FormatDatePipe ]
})
export class RelatoriosPage {

  dataAtual: Date;
  horaAtual: string;
  nameFile: string;
  pagePdf = { 
    'pedido_id': null, 
    'cliente_nome': null,
    'cliente_endereco': null,
    'cliente_celular': null, 
    'data': null, 
    'status': null, 
    'pago': null,
    'total': null 
  };
  pdfObj = null;
  pedidos: Pedido2[] = [];
  itens: any[] = [];
  itens2: any[] = [];
  content: any[] = [];
  docDefinition: any;
  pagoString: string;
  hasBreak: boolean = false;
  rowPage: number = 40;
  rowNow: number = 0;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public exp_imp_db: ExpImpDbProvider,
              public pedidoProvider: PedidoProvider,
              public toast: ToastController,
              private formatDate: FormatDatePipe,
              private decimalPipe: DecimalPipe,
              private plt: Platform,
              private file: File,
              private fileOpener: FileOpener,
              private loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    this.pedidoProvider.getAll_alocado()
        .then((result: any) => {
            this.pedidos = result;
        })
        .catch(() => {
            this.toast.create({ message: 'Erro ao carregar pedidos.', duration: 3000, position: 'botton' }).present();
      });
  }

  hist_pedidos(){
    this.navCtrl.push(ListaPedidoHistPage);
  }
  
  hist_folhasCarga(){
    this.navCtrl.push(ListaFolhacargaHistPage);
  }

  exportDB(){
    let loading = this.loadingController.create({
      content: 'Aguarde o carregamento...'
    });
    loading.present(); // Inicia LOADING
    this.exp_imp_db.export();
    loading.dismiss(); // Finaliza LOADING
  }

  alteraTabela(){
    this.exp_imp_db.alterTable();
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

  getNameFile() {
    let now = new Date();
    let year = "" + now.getFullYear();
    let month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    let day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    return year + month + day;
  }

  gerarPdfPedidos() {
    let loading = this.loadingController.create({
      content: 'Aguarde o carregamento...'
    });
    loading.present(); // Inicia LOADING

    if (this.pedidos.length === 0) {
      this.toast.create({ message: 'Não existe pedido Alocado.', duration: 3000, position: 'botton' }).present();
      loading.dismiss(); // Filaliza LOADING
      return;
    }
    let num = 0;
    for (let el1 of this.pedidos) {
      this.pedidoProvider.getItens(el1.id)
        .then((result: any) => {
          this.itens = result;
          console.log(this.itens);
          this.itens2 = [];
          for (let el2 of this.itens) {
            let item = {id: null, nome_produto:null, quantidade: null, valor_unitario: null, valor_total: null};
            item.id = el2.id;
            item.nome_produto = el2.nome_produto;
            item.quantidade = el2.quantidade;
            item.valor_unitario = this.decimalPipe.transform(el2.valor_unitario, '1.2-2');
            item.valor_total = this.decimalPipe.transform(el2.valor_total, '1.2-2');
            this.itens2.push(item);
          }
          console.log(this.itens2);
          this.pagePdf = {
            'pedido_id': el1.id,
            'cliente_nome': el1.cliente_nome,
            'cliente_endereco': el1.cliente_endereco,
            'cliente_celular': el1.cliente_celular,
            'data': this.formatDate.transform(el1.data),
            'status': el1.status,
            'pago': el1.pago,
            'total': this.decimalPipe.transform(el1.total, '1.2-2'),
          }
          el1.pago ? this.pagoString = 'Pago' : this.pagoString = '';
          console.log('inicio linhas');
          let l1;
          let l2;
          num++;
          console.log(num);
          if (num === 1) {
            l1 = { text: 'DISTRIBUIDORA REALCE - PEDIDO', style: 'header' };
            l2 = { text: this.horaAtual, alignment: 'right' };
            this.rowNow = this.rowNow + 2;
          }
          let l3 = { text: 'PEDIDO: ' + this.pagePdf.pedido_id + 
                           ' -- DATA: ' + this.pagePdf.data +
                           ' -- STATUS: ' + this.pagePdf.status, style: 'subheader' };
          let l4 = { text: 'CLIENTE: ' + this.pagePdf.cliente_nome + 
                           ' -- CEL: ' + this.pagePdf.cliente_celular, style: 'subheader' };
          let l5 = { text: 'ENDEREÇO: ' + this.pagePdf.cliente_endereco, style: 'subheader' };
          let l6 = table(this.itens2, ['nome_produto', 'quantidade', 'valor_unitario', 'valor_total']);
          let l7 = { text: 'TOTAL: ' + this.pagePdf.total + '  ' + this.pagoString, style: 'subheader' };
          let l8 = ' ';
          let l9 = '-------------------------------------------------------------------------------------------------------';
          let l10 = { text: ' ', pageBreak: 'after'};
          this.rowNow = this.rowNow + 7 + this.itens2.length + 1;
          console.log(this.rowNow);
          this.rowNow >= this.rowPage ? this.hasBreak = true : this.hasBreak = false;
          // calcBreakPage(this.rowNow, this.rowPage);
          if (this.hasBreak){
            console.log('hasBreak');
            this.content.push(l10);
            this.rowNow = 7 + this.itens2.length;
            console.log('hasBreak lin: ' + this.rowNow);
          }
          
          console.log('fim linhas');
          if (num === 1) {
            this.content.push(l1);
            this.content.push(l2);
          }
          this.content.push(l3);
          this.content.push(l4);
          this.content.push(l5);
          this.content.push(l6);
          this.content.push(l7);
          this.content.push(l8);
          this.content.push(l8);
          this.content.push(l9);
          //console.log(this.content);

        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar Itens do pedido.', duration: 3000, position: 'botton' }).present();
      });
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
    console.log(this.docDefinition);
    this.horaAtual = this.getTimestamp();
    
    function table(data, columns) {
      return {
        table: {
            headerRows: 1,
            body: buildTableBody(data, columns)
        }
      };
    }

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

    this.pdfObj = pdfMake.createPdf(this.docDefinition);
    loading.dismiss(); // Filaliza LOADING
  } // Fim createPdf()

  viewPdfPedidos() {
    let loading = this.loadingController.create({
      content: 'Aguarde o carregamento...'
    });
    loading.present(); // Inicia LOADING
    this.nameFile = this.getNameFile();
    this.pdfObj.getBuffer((buffer) => {
      var blob = new Blob([buffer], { type: 'application/pdf' });
      // Gera em /data/data/br.com.valdinei.realceapp/files
      this.file.writeFile(this.file.externalDataDirectory, 'pedidos_'+this.nameFile+'.pdf', blob, { replace: true })
        .then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.externalDataDirectory + 'pedidos_'+this.nameFile+'.pdf', 'application/pdf');
        })
        .catch((e) => console.log(e));
    }); 
    loading.dismiss(); // Filaliza LOADING
  }




}
