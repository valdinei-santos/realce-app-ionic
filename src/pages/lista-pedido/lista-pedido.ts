import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PedidoProvider, Pedido, Pedido2 } from '../../providers/pedido/pedido';
import { CadastroPedidoPage } from '../cadastro-pedido/cadastro-pedido';
import { ShowPedidoPage } from '../show-pedido/show-pedido';
import { ToastController } from 'ionic-angular';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { EmailProvider } from '../../providers/email/email';


@IonicPage()
@Component({
  selector: 'page-lista-pedido',
  templateUrl: 'lista-pedido.html',
})
export class ListaPedidoPage {

  pedido: Pedido = {id:null, cliente_id:null, data:null, status:''};
  pedido2: Pedido2 = {id:null, cliente_id:null, cliente_nome:'', total:null, data:null, status:''};
  pedidos: any[];
  pedidos2: any[];
  cliente: Cliente = {nome:'', codigo:null, fone:'', celular:'', endereco:'', bairro:'', cidade:'', cnpj:'', inscricao_est:''};

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public pedidoProvider: PedidoProvider,
              public clienteProvider: ClienteProvider,
              public toast: ToastController,
              private emailProvider: EmailProvider) {
  }


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
    console.log('addPedido');
	  this.navCtrl.push(CadastroPedidoPage);
  }


  removePedido(pedido: Pedido2){
    console.log('removePedido');
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

  editPedido(id: number){
    console.log('editPedido: ' + id );
    this.navCtrl.push(CadastroPedidoPage, { id: id });
  }

  showPedido(id: number){
    console.log('showPedido: ' + id );
    this.navCtrl.push(ShowPedidoPage, { id: id });
  }

  enviaPedido(id: number){
    console.log('enviaPedido: ' + id );
    this.emailProvider.enviaEmail();
    alert('Sera que foi...');
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


}
