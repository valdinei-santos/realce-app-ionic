import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
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
    'avista': null,
    'observacao': null,
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
  maxRowPage: number = 40;
  maxRowPedido: number = 20;
  rowPageNow: number = 0;
  rowPedidoNow: number = 0;
  qtdRowPedido: number = 0;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public exp_imp_db: ExpImpDbProvider,
              public pedidoProvider: PedidoProvider,
              public toast: ToastController,
              private formatDate: FormatDatePipe,
              private decimalPipe: DecimalPipe,
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

  insertProdutos(){
    this.exp_imp_db.insertProdutos();
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

    // Iniciando variaveis.
    this.docDefinition = null;
    this.itens2 = [];
    this.content = [];
    this.rowPageNow = 0;
    this.rowPedidoNow = 0;
    this.qtdRowPedido = 0;

    let num = 0;
    for (let el1 of this.pedidos) {
      // console.log('Pedido: ' + el1.id);
      this.pedidoProvider.getItens(el1.id)
        .then((result: any) => {
          this.itens = result;
          this.itens2 = [];
          for (let el2 of this.itens) {
            let item = {id: null, nome_produto:null, quantidade: null, nome_unidade: null, valor_unitario: null, valor_total: null};
            item.id = el2.id;
            item.nome_produto = el2.nome_produto;
            item.quantidade = el2.quantidade;
            item.nome_unidade = el2.nome_unidade;
            item.valor_unitario = this.decimalPipe.transform(el2.valor_unitario, '1.2-2');
            item.valor_total = this.decimalPipe.transform(el2.valor_total, '1.2-2');
            this.itens2.push(item);
          }
          // console.log(this.itens2);
          this.pagePdf = {
            'pedido_id': el1.id,
            'cliente_nome': el1.cliente_nome,
            'cliente_endereco': el1.cliente_endereco,
            'cliente_celular': el1.cliente_celular,
            'data': this.formatDate.transform(el1.data),
            'status': el1.status,
            'pago': el1.pago,
            'avista': el1.avista,
            'observacao': el1.observacao,
            'total': this.decimalPipe.transform(el1.total, '1.2-2'),
          }
          //el1.pago ? this.pagoString = 'Pago' : this.pagoString = '';
          //let l1;
          //let l2;
          num++;
          // console.log(num);
          /* if (num === 1) {
            l1 = { text: 'DISTRIBUIDORA REALCE - PEDIDO', style: 'header' };
            l2 = { text: this.horaAtual, alignment: 'right' };
            this.rowPageNow = this.rowPageNow + 2;
          } */
          let l1 = { text: 'PEDIDO: ' + this.pagePdf.pedido_id + 
                           ' -- DATA: ' + this.pagePdf.data +
                           ' -- STATUS: ' + this.pagePdf.status, style: 'subheader' };
          let l2 = { text: 'CLIENTE: ' + this.pagePdf.cliente_nome + 
                           ' -- CEL: ' + this.pagePdf.cliente_celular, style: 'subheader' };
          let l3 = { text: 'ENDEREÇO: ' + this.pagePdf.cliente_endereco, style: 'subheader' };
          let l4 = table(this.itens2, ['quantidade', 'nome_unidade', 'nome_produto', 'valor_unitario', 'valor_total']);
          let l5 = { text: 'Observação: ' + this.pagePdf.observacao, style: 'subheader' };
          let l6;
          if (el1.pago) {
            l6 = { text: 'TOTAL: ' + this.pagePdf.total + '  Pago', style: 'subheader' };
          } else if (el1.avista) {
            l6 = { text: 'TOTAL: ' + this.pagePdf.total + '  Cobrar na Entrega', style: 'subheader' };
          } else {
            l6 = { text: 'TOTAL: ' + this.pagePdf.total, style: 'subheader' };
          }
          let l7 = ' ';
          let l8 = ' ';
          //let l7 = { text: 'TOTAL: ' + this.pagePdf.total + '  ' + this.pagoString, style: 'subheader' };
          
          //let l8 = ' ';
          //let l9 = '-------------------------------------------------------------------------------------------------------';
          let l9 = { text: ' ', pageBreak: 'after'};
          // console.log('rowPedidoNow ANTES: '+ this.rowPedidoNow);
          if (this.pagePdf.observacao !== null) 
            this.qtdRowPedido = 7 + this.itens2.length + 1;
          else
            this.qtdRowPedido = 7 + this.itens2.length;
          this.rowPedidoNow = this.qtdRowPedido;
          // console.log('rowPedidoNow DEPOIS: '+ this.rowPedidoNow);
          // console.log('this.rowPageNow ANTES: '+ this.rowPageNow);
          this.rowPageNow = this.rowPageNow + this.rowPedidoNow; //this.rowPageNow + 7 + this.itens2.length + 1;
          // console.log('this.rowPageNow DEPOIS: '+ this.rowPageNow);
          let rowAdd = 0;
          // console.log('Folha antes: '+ this.rowPageNow);
          if (this.rowPedidoNow < this.maxRowPedido) {
            rowAdd = this.maxRowPedido - this.rowPedidoNow;
            this.rowPageNow = this.rowPageNow + rowAdd;
            this.rowPedidoNow = this.rowPedidoNow + rowAdd;
          } else {
            rowAdd = this.maxRowPage - this.rowPageNow;
            this.rowPageNow = this.rowPageNow + rowAdd;
          }
          /* console.log('rowAdd: '+ rowAdd);
          console.log('Folha: '+ this.rowPageNow);
          console.log('Pedido: '+ this.rowPedidoNow);
          this.rowPageNow > this.maxRowPage ? this.hasBreak = true : this.hasBreak = false;
          // calcBreakPage(this.rowPageNow, this.maxRowPage);
          if (this.hasBreak){
            console.log('hasBreak');
            this.content.push(l9);
            // this.rowPageNow = this.qtdRowPedido;
            console.log('hasBreak lin: ' + this.rowPageNow);
            this.rowPageNow = 0;
          } */
          
          // console.log('fim linhas');
          /* if (num === 1) {
            this.content.push(l1);
            this.content.push(l2);
          } */
          this.content.push(l1);
          this.content.push(l2);
          this.content.push(l3);
          this.content.push(l4);
          if (this.pagePdf.observacao !== null) {
            this.content.push(l5);
          }
          this.content.push(l6);
          for (let i=0; i<rowAdd; i++){
            this.content.push(' ');
          }
          this.content.push(l7);
          this.content.push(l8);
          // console.log('rowAdd: '+ rowAdd);
          // console.log('Folha: '+ this.rowPageNow);
          // console.log('Pedido: '+ this.rowPedidoNow);
          this.rowPageNow >= this.maxRowPage ? this.hasBreak = true : this.hasBreak = false;
          // calcBreakPage(this.rowPageNow, this.maxRowPage);
          if (this.hasBreak){
            // console.log('hasBreak');
            this.content.push(l9);
            // this.rowPageNow = this.qtdRowPedido;
            // console.log('hasBreak lin: ' + this.rowPageNow);
            this.rowPageNow = 0;
          }
          this.rowPedidoNow = 0;
          //this.content.push(l9);
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
    // console.log(this.docDefinition);
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
      body.push(['Quant.', 'Unid.', 'Produto', 'Valor', 'Total']);
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
