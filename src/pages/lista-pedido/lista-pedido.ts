import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PedidoProvider, Pedido, Pedido2 } from '../../providers/pedido/pedido';
import { CadastroPedidoPage } from '../cadastro-pedido/cadastro-pedido';
import { ShowPedidoPage } from '../show-pedido/show-pedido';
import { ToastController } from 'ionic-angular';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { EmailComposer } from '@ionic-native/email-composer';


@IonicPage()
@Component({
  selector: 'page-lista-pedido',
  templateUrl: 'lista-pedido.html',
})
export class ListaPedidoPage {

  pedido: Pedido = new Pedido(); 
  pedido2: Pedido2 = new Pedido2(); 
  pedidos: any[];
  pedidos2: any[];
  cliente: Cliente = new Cliente(); //{nome:'', codigo:null, fone:'', celular:'', endereco:'', bairro:'', cidade:'', cnpj:'', inscricao_est:''};

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public pedidoProvider: PedidoProvider,
              public clienteProvider: ClienteProvider,
              public toast: ToastController,
              public emailComposer: EmailComposer) { }

  ionViewDidEnter() {
  	this.pedidoProvider.getAll2()
      .then((result: any[]) => {
        this.pedidos2 = result;  
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos!!!', duration: 3000, position: 'botton' }).present();
      });
  }

  addPedido(){
	  this.navCtrl.push(CadastroPedidoPage);
  }

  removePedido(pedido: Pedido2){
    let status_pedido: string = '';
    for (let el of this.pedidos2) {
      if (el.id === pedido.id) {
        status_pedido = el.status;
      }
    }
    if (status_pedido !== 'Pendente'){
      this.toast.create({ message: 'Somente pedidos PENDENTE podem ser removidos!', duration: 3000, position: 'botton' }).present();
    } else {
      this.pedidoProvider.remove(pedido.id)
        .then(() => {
          var index = this.pedidos2.indexOf(pedido);
          this.pedidos2.splice(index, 1);
          this.toast.create({ message: 'Pedido removido!', duration: 3000, position: 'botton' }).present();
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao remover o Pedido!', duration: 3000, position: 'center' }).present();
      });
    }
  }

  editPedido(id: number){
    let status_pedido: string = '';
    for (let el of this.pedidos2) {
      if (el.id === id) {
        status_pedido = el.status;
      }
    }
    if (status_pedido !== 'Pendente'){
      this.toast.create({ message: 'Somente pedidos PENDENTE podem ser alterados!', duration: 3000, position: 'botton' }).present();
    } else {
      this.navCtrl.push(CadastroPedidoPage, { id: id });
    }
  }

  showPedido(id: number){
    this.navCtrl.push(ShowPedidoPage, { id: id });
  }

  enviaPedido(id: number){
    this.pedidoProvider.get2(id)
      .then((result: any) => {
        this.pedido2 = result;   
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedido!!!', duration: 3000, position: 'botton' }).present();
      });
    let email = {
          to: 'valdinei.vs@gmail.com',
          cc: [],
          bcc: [],
          attachments: [],
          /*attachments: null, [
            'file://img/logo.png',
            'res://icon.png',
            'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
            'file://README.pdf'
          ], */
          subject: 'Pedido ' + this.pedido2.id + ' Emerson',
          body: 'Segue em anexo o pedido ' + this.pedido2.id + ' do cliente ' + this.pedido2.cliente_nome,
          isHtml: true,
          //app: 'Gmail'
    };
    this.emailComposer.open(email);

    //this.emailProvider.enviaEmail();
    
    //alert('Sera que foi...');
    /* if (result == 'OK'){
      alert('Email enviado!!!');
    } */
    /* let to 		    : string  = 'valdinei.vs@gmail.com',
        cc 		    : string	= null,
        bcc 		  : string	= null,
        subject 	: string	= 'Teste e-mail ionic',
        message 	: string	= 'Teste de e-mail via Ionic';
    //this.emailProvider.sendEmail(to, cc, bcc, this._attachment, subject, message);
    this.emailProvider.sendEmail(to, cc, bcc, null, subject, message); */
  }

  getPedidos(ev: any) {
    this.pedidoProvider.getAll2()
      .then((result: any[]) => {
        this.pedidos2 = result;
        // Lógica para povoar o array só com os produtos que atendem o filtro.
        const val = ev.target.value;
        if (val && val.trim() != '') {
          this.pedidos2 = this.pedidos2.filter((item) => {
            return (item.cliente_nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos.', duration: 3000, position: 'botton' }).present();
    });
  }

  soma(value1: any, value2: any){
    return Number(value1) + Number(value2);
  }


}
