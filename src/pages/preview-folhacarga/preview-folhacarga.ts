import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';

import { PedidoProvider, PedidoAllItens, PedidoAllItens2, Pedido } from '../../providers/pedido/pedido';
import { ToastController } from 'ionic-angular';
import { Folhacarga, FolhacargaProvider, Folhacarga3 } from '../../providers/folhacarga/folhacarga';
import { FormatDatePipe } from '../../pipes/format-date/format-date';
import { DecimalPipe } from '@angular/common';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { timestamp } from 'rxjs/operator/timestamp';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-preview-folhacarga',
  templateUrl: 'preview-folhacarga.html',
  providers: [ FormatDatePipe ]
})
export class PreviewFolhacargaPage {

  model: Folhacarga;
  pedidos2: Pedido[];
  itens: PedidoAllItens[] = [];
  itens2: PedidoAllItens2[] = [];
  lista_pedidos: any[] = [];
  lista_pedidos_str: string;
  pedidos: string = '';
  data_atual: any = new Date();
  data_atual_aux: any = new Date();
  total_geral: number = 0;
  total_geral_padrao: number = 0;
  editando: boolean = false;
  isShow: boolean = false;
  horaAtual: string;
  pagePdf: Folhacarga3;
  pdfObj = null;
  content: any[] = [];
  docDefinition: any;


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public pedidoProvider: PedidoProvider,
              public folhacargaProvider: FolhacargaProvider,
              public toast: ToastController,
              private formatDate: FormatDatePipe,
              private decimalPipe: DecimalPipe,
              private plt: Platform,
              private file: File,
              private fileOpener: FileOpener,
              private loadingController: LoadingController) {
    this.model = new Folhacarga;  
  }

  ionViewDidLoad() {
    if (!this.navParams.data.isEdit && !this.navParams.data.isShow) { // Eh CADASTRO
      this.model.status = 'Pendente';
      this.model.data = this.data_atual.toISOString();
      this.loadNewId();
    } else {
      this.folhacargaProvider.get(this.navParams.data.id)
         .then((result: Folhacarga) => {
          this.model = result;
          if (this.navParams.data.isEdit) {
            this.model.status = this.navParams.data.status;
          }
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar uma folhacarga.', duration: 3000, position: 'botton' }).present();
      });
    }
    this.lista_pedidos = this.navParams.data.lista_pedidos;
    this.lista_pedidos_str = this.navParams.data.lista_pedidos_str;
    for (let i = 0; i < this.lista_pedidos.length; i++) {
      if (i == 0){
        this.pedidos = this.lista_pedidos[i];  
      } else {
        this.pedidos = this.pedidos + ' - ' + this.lista_pedidos[i];
      }
    }
    this.pedidoProvider.getAllItens(this.navParams.data.lista_pedidos)
      .then((result: PedidoAllItens[]) => {
        this.itens = result;
        for (let i=0; i < this.itens.length; i++){
          this.total_geral = Number(this.total_geral) + Number(this.itens[i].valor);
          this.total_geral_padrao = Number(this.total_geral_padrao) + Number(this.itens[i].valor_padrao);
        }
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar Itens do pedido.', duration: 3000, position: 'botton' }).present();
    });
    console.log('Antes getListaPedidos');
    this.pedidoProvider.getListaPedidos(this.lista_pedidos)
      .then((result: Pedido[]) => {
        let itens: Pedido[] = [];
        result.forEach(function(el) {
          if (el.observacao !== null) {
            itens.push(el);
          }
        });
        itens.sort;
        this.pedidos2 = itens;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos.', duration: 3000, position: 'botton' }).present();
      })
  }

  ionViewWillEnter(){
    if (this.navParams.data.isShow) {
      this.isShow = this.navParams.data.isShow;
    }
  }

  ionViewDidEnter(){
    this.editando = this.navParams.data.isEdit;
  }
  ionViewWillLeave(){
    console.log('preview-folhacarga - ionViewWillLeave');
  }
  ionViewDidLeave(){
    console.log('preview-folhacarga - ionViewDidLeave');
  }
  ionViewWillUnload(){
    console.log('preview-folhacarga - ionViewWillUnload');
  }
  ionViewCanEnter(){
    console.log('preview-folhacarga - ionViewCanEnter');
  }
  ionViewCanLeave(){
    console.log('preview-folhacarga - ionViewCanLeave');
  }

  loadNewId(){
    this.folhacargaProvider.getNewId()
    .then((result: any) => {
        this.model.id = result;
    })
    .catch(() => {
      this.toast.create({ message: 'Erro ao carregar New ID!!!', duration: 3000, position: 'botton' }).present();
    });
  }

  save() {
    if (this.editando) {
      console.log('passo11');
      this.folhacargaProvider.remove(this.model.id)
        .then(() => {
          this.pedidoProvider.update_status(this.lista_pedidos, 'Alocado')
            .then(()=> {
              this.folhacargaProvider.insert(this.model)
                .then(() => {
                  this.folhacargaProvider.insert_itens(this.lista_pedidos, this.model.id);
                  this.toast.create({ message: 'Folha de Carga alterada!', duration: 3000, position: 'center' }).present();
                  this.navCtrl.pop();
                });
            });
        })
        .catch(() => {
          console.log('Erro ao alterar Folha de Carga!');
        });
      
    } else { // Eh Cadastro
      this.data_atual_aux = this.model.data;
      this.model.data = this.data_atual_aux.substring(0,10);
      this.model.status = 'Pendente';
      this.pedidoProvider.update_status(this.lista_pedidos, 'Alocado');
      this.folhacargaProvider.insert(this.model)
        .then(() => {
          this.folhacargaProvider.insert_itens(this.lista_pedidos, this.model.id)
            .then(() => {
              this.toast.create({ message: 'Folha de Carga salva!', duration: 3000, position: 'center' }).present();
              this.navCtrl.getPrevious().data.vem_preview = true;
              this.navCtrl.pop();
            });
        });
    }





/*     if (!this.navParams.data.isEdit) { // eh cadastro
      if (this.saveFolhacarga()) {
        this.toast.create({ message: 'Folha de Carga salva!', duration: 3000, position: 'center' }).present();
        this.navCtrl.getPrevious().data.vem_preview = true;
        this.navCtrl.pop();
      } else {
        this.toast.create({ message: 'Erro ao salvar a Folha de Carga!', duration: 3000, position: 'center' }).present();
      }
    } else { // eh Edit
      console.log('passo21');
      if (this.saveFolhacarga()) {
        console.log('passo22');
        this.toast.create({ message: 'Folha de Carga alterada!', duration: 3000, position: 'center' }).present();
        this.navCtrl.pop();
      } else {
        console.log('passo23');
        this.toast.create({ message: 'Erro ao alterar a Folha de Carga!', duration: 3000, position: 'center' }).present();
      }
    } */
  }

  // PENDENTE CORRIGIR PARA SAVEFOLHACARGA esperar promisse terminar.
/*   private saveFolhacarga() {
    if (this.editando) {
      console.log('passo11');
      this.folhacargaProvider.remove(this.model.id)
        .then(() => {
          console.log('passo12');
          this.pedidoProvider.update_status(this.lista_pedidos, 'Alocado');
          console.log('passo13');
          let insert_folha = this.folhacargaProvider.insert(this.model);
          console.log('passo14');
          return this.folhacargaProvider.insert_itens(this.lista_pedidos, this.model.id);
        })
        .catch(() => {
          console.log('Erro ao remover a Folha de Carga para UPDATE!');
        });
    } else {
      this.data_atual_aux = this.model.data;
      this.model.data = this.data_atual_aux.substring(0,10);
      this.model.status = 'Pendente';
      this.pedidoProvider.update_status(this.lista_pedidos, 'Alocado');
      let insert_folha = this.folhacargaProvider.insert(this.model);  
      return this.folhacargaProvider.insert_itens(this.lista_pedidos, this.model.id);
    } 
  } */

  private getTimestamp() {
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

    for (let el of this.itens) {
      let item: PedidoAllItens2 = new PedidoAllItens2;
      item.produto_id = el.produto_id;
      item.nome_produto = el.nome_produto;
      item.quantidade = el.quantidade;
      item.valor = this.decimalPipe.transform(el.valor, '1.2-2'); //el.valor;
      this.itens2.push(item);
    }
    this.pagePdf = {
      'id': this.model.id,
      'data': this.formatDate.transform(this.model.data),
      'status': this.model.status,
      'pedidos': this.lista_pedidos_str,
      'total': this.decimalPipe.transform(this.total_geral, '1.2-2'), //this.total_geral
      'desconto': this.decimalPipe.transform(Number(this.total_geral) - Number(this.total_geral_padrao), '1.2-2'),
    }
    this.horaAtual = this.getTimestamp();

    let l1 = { text: 'DISTRIBUIDORA REALCE - FOLHA DE CARGA', style: 'header' };
    let l2 = { text: this.horaAtual, alignment: 'right' };
    let l3 = { text: 'FOLHA CARGA: ' + this.pagePdf.id +
                     ' -- ' + 'DATA: ' + this.pagePdf.data +
                     ' -- ' + 'STATUS: ' + this.pagePdf.status, style: 'subheader' };
    let l4 = { text: 'PEDIDOS: ' + this.pagePdf.pedidos, style: 'subheader' };
    let l5 = ' ';
    let l6 = table(this.itens2, ['produto_id', 'nome_produto', 'quantidade', 'valor']);
    let l7 = { text: 'TOTAL: ' + this.pagePdf.total, style: 'subheader' };
    let l8 = { text: 'DESC: ' + this.pagePdf.desconto, style: 'subheader' };

    this.content.push(l1);
    this.content.push(l2);
    this.content.push(l3);
    this.content.push(l4);
    this.content.push(l5);
    this.content.push(l6);
    for (let el of this.pedidos2) {
      this.content.push({ text: 'Pedido ' + el.id + ': ' + el.observacao, style: 'subheader' });
    }
    /* this.pedidos2.forEach(function(el) {
      this.content.push({ text: 'Pedido ' + el.id + ': ' + el.observacao, style: 'subheader' });
    }); */
    this.content.push(l7);
    this.content.push(l8);

    function buildTableBody(data, columns) {
      var body = [];
      body.push(['ID', 'Produto', 'Quant.', 'Total']);
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
        this.file.writeFile(this.file.externalDataDirectory, 'folha_'+this.model.id+'.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.externalDataDirectory + 'folha_'+this.model.id+'.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
    loading.dismiss(); // Filaliza LOADING
  }



}
