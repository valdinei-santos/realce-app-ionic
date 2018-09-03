import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
//import { forkJoin } from 'rxjs/add/observable/forkJoin';
//import { forkJoin } from 'rxjs/observable/forkJoin';

import { PedidoProvider, Pedido, Item_pedido } from '../../providers/pedido/pedido';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { ProdutoProvider, Produto } from '../../providers/produto/produto';
import { ToastController } from 'ionic-angular';
import { DecimalPipe } from '@angular/common';

import { SelectSearchableComponent } from 'ionic-select-searchable';
import { ListaClientePage } from '../lista-cliente/lista-cliente';
import { ListaProdutoPage } from '../lista-produto/lista-produto';
import { CadastroPedidoItemPage } from '../cadastro-pedido-item/cadastro-pedido-item';


@IonicPage()
@Component({
  selector: 'page-cadastro-pedido',
  templateUrl: 'cadastro-pedido.html',
})
export class CadastroPedidoPage {

  pedido: Pedido = new Pedido(); //{id:null, cliente_id:null, data:null, status:'Inexistente'};
  //Item_pedido: Item_pedido = {id:null, pedido_id:null, produto_id:null, nome_produto:null, quantidade:null, valor_unitario:null, valor_total:null};
  //produto: Produto = {id:null, }
  //pedidoEditando: Pedido;
  editando:boolean = false;	
  model: Pedido;
  model_item_pedido: Item_pedido;
  model_produto: Produto;
  model_cliente: Cliente;
  itens: Item_pedido[] = [];
  clientes: any[];
  produtos: any[];
  total: number = 0;
  total_geral: number = 0;
  //valor_adicional: number = 0;
  //unidades: any[]
  //data_atual: string = new Date().toISOString();
  data_atual: any = new Date();
  data_atual_aux: any = new Date();
  isHide: boolean = false;

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
              public pedidoProvider:PedidoProvider,
              public clienteProvider:ClienteProvider,
              public produtoProvider:ProdutoProvider,
              public toast: ToastController,
              public decimalPipe: DecimalPipe) {

    this.model = new Pedido();
    this.model.valor_adicional = 0;
    this.model_produto = new Produto();
    this.model_cliente = new Cliente();
    this.model_item_pedido = new Item_pedido(); 
  }

  ionViewDidLoad() {
  	console.log('ID Peeee:' + this.navParams.data.id);
    if (this.navParams.data.id) { // Edit
      this.editando = true;
      console.log('ID Pe:' + this.navParams.data.id);
      this.pedidoProvider.get(this.navParams.data.id)
        .then((result: Pedido) => {
          this.model = result;
          console.log('Pedido que veio dentro promise: ' + this.model);
          //this.model_cliente.id = this.model.cliente_id;
          this.clienteProvider.get(this.model.cliente_id)
            .then((result: Cliente) => {
            this.model_cliente = result;
          })
          .catch(() => {
            this.toast.create({ message: 'Erro ao carregar um cliente.', duration: 3000, position: 'botton' }).present();
          });
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar um pedido.', duration: 3000, position: 'botton' }).present();
      });
      this.pedidoProvider.getItens(this.navParams.data.id)
        .then((result: Item_pedido[]) => {
          this.itens = result;
          for (let el of this.itens){
            this.total += Number(el.valor_total);
            console.log(this.total);
          }
          console.log(this.total);
          this.setTotalGeral();
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar Itens do pedido.', duration: 3000, position: 'botton' }).present();
      });
      //this.model.data = this.model.data.toISOString();
    } else { // Cadastro
      this.editando = false;
      this.model.data = this.data_atual.toISOString();
      console.log('Data Val1: ' + this.data_atual.toLocaleDateString('pt-BR'));
      console.log('Data Val2: ' + new Date().toJSON().slice(0,10).replace(/-/g,'/'));
      this.model.status = 'Inexistente';
      
      this.pedidoProvider.getNewId()
          .then((result: any) => {
            this.model.id = result;
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
        });
    }

    /* this.clienteProvider.getAll()
      .then((result: any[]) => {
        this.clientes = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar clientes!!!', duration: 3000, position: 'botton' }).present();
      }); */

    /* this.produtoProvider.getAll()
      .then((result: any[]) => {
        this.produtos = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
      });	 */ 

  }


  ionViewWillEnter() {
    console.log('cadastro-pedido - ionViewWillEnter');
    if (this.navParams.get('cliente')) {
      // console.log('cadastro-pedido - navParams cliente');
      this.model_cliente = this.navParams.get('cliente');
    }
    if (this.navParams.get('produto')) {
      // console.log('cadastro-pedido - navParams produto');
      this.model_produto = this.navParams.get('produto');
      this.model_item_pedido.valor_unitario = this.model_produto.preco;
      //this.model_item_pedido.valor_unitario.toFixed(2);
      this.model_item_pedido.quantidade = 1;
    }
    if (this.navParams.get('lista_itens')) {
      // console.log('cadastro-pedido - navParams lista_itens');
      this.itens = this.navParams.get('lista_itens');
      this.total = Number(this.navParams.get('total'));
    }
    this.setTotalGeral();
  }

  setTotalGeral(){
    // console.log('Total: ' + this.total);
    this.total_geral = Number(this.total) + Number(this.model.valor_adicional);
  }

  getListCliente(){
    this.navCtrl.push(ListaClientePage, {isPedido: true});
  }

  /* getListProdutos(){
    this.navCtrl.push(ListaProdutoPage, {isPedido: true});
  } */

  hideList() {
    console.log('hideList()');
    this.isHide = this.isHide ? false : true;
  }

  addItens(){
    this.navCtrl.push(CadastroPedidoItemPage, { isPedido: true, 
                                                pedido_id: this.model.id,
                                                pedido_itens: this.itens,
                                                pedido_total: this.total
                                              }
                     );
  }

  addItem() {
  	  console.log(this.model_produto.id);
      Observable.forkJoin([
        Observable.fromPromise(
                this.produtoProvider.get(this.model_produto.id)
                  .then((result: any) => {
                    this.model_produto = result;
                    console.log("Promessa: " + this.model_produto);
                  })
                  .catch(() => {
                    this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
                  })
        )
      ])
      .subscribe(data => {
        let item = new Item_pedido();
        item.pedido_id = this.model.id; //item.;
        item.produto_id = this.model_produto.id;
        //item.nome_produto = this.model_produto.marca_id.toString();
        item.nome_produto = this.model_produto.nome_produto;
        item.quantidade = this.model_item_pedido.quantidade;
        item.valor_unitario = this.model_item_pedido.valor_unitario; //this.model_produto.preco;
        item.valor_total = item.quantidade * item.valor_unitario; //this.model_produto.preco;
        console.log(item);
        this.itens.push(item);
        this.model_produto.id = null;
        this.model_produto.nome_produto = null;
        this.model_item_pedido.quantidade = null;
        this.model_item_pedido.valor_unitario = null;
        this.total = this.total + (item.valor_total as number);
      });
  }

  /* onSelectChange(selectedValue: any) {
    console.log(selectedValue);
    console.log('passou onSelectChange');
    if (this.model_produto.id !== null) {
      Observable.forkJoin([
          Observable.fromPromise(
                  this.produtoProvider.get(this.model_produto.id)
                    .then((result: any) => {
                      this.model_produto = result;
                      console.log("Promessa: " + result);
                    })
                    .catch(() => {
                      this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
                    })
          )
        ])
        .subscribe(data => {
          console.log(data);
          //let valor_unitario = this.model_produto.preco;
          console.log("item_pedido: " + this.model_produto);
          this.model_item_pedido.valor_unitario = this.model_produto.preco;
          this.model_item_pedido.quantidade = 1;
        });
    }
  } */

  save() {
    console.log('AAAA ' + this.model_cliente.nome);
    if (this.model_cliente.nome === undefined) {
      this.toast.create({ message: 'Cliente é obrigatório!', duration: 3000, position: 'center' }).present();
      return null;
    }
    if (this.savePedido()) {
      this.toast.create({ message: 'Pedido salvo!', duration: 3000, position: 'center' }).present();
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar o Pedido!', duration: 3000, position: 'center' }).present();
    }
  }

  private savePedido() {
    this.data_atual_aux = this.model.data;
    this.model.data = this.data_atual_aux.substring(0,10);
    this.model.cliente_id = this.model_cliente.id; 

    //if (this.model.status != 'Inexistente') {
    if (this.editando) {
      console.log('Entrou UPDATE - ' + this.model.status);
      //this.editando = false;
      console.log(this.model);
      this.pedidoProvider.update(this.model);
      return this.pedidoProvider.update_itens(this.itens);
    } else {
      console.log('Entrou INSERT');
      //this.editando = true;
      this.model.status = 'Pendente';
      console.log(this.model);
      console.log(this.itens);
      this.pedidoProvider.insert(this.model);
      return this.pedidoProvider.insert_itens(this.itens);
    }
  }

  removeProduto(item: Item_pedido) {
    this.itens.splice(this.itens.indexOf(item), 1);
    this.total -= item.valor_total; 
    /* for (let el of this.itens){
      if (el.produto_id == item.produto_id) {

      } */
  }
/*
  	  this.produtoProvider.get(this.model_produto.id)
		  .then((result: any) => {
        this.itens.push(result);
        console.log(this.itens);
		  })
		  .catch(() => {
		    this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
		  });	
*/
      //this.itens.push(this.model_produto);


  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }

  produtoChange(event: { component: SelectSearchableComponent, value: any }) {
    console.log('port:', event.value);
    if (this.model_produto.id !== null) {
      Observable.forkJoin([
          Observable.fromPromise(
              this.produtoProvider.get(this.model_produto.id)
                .then((result: any) => {
                  this.model_produto = result;
                  console.log("Promessa: " + result);
                })
                .catch(() => {
                  this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
                })
          )
        ])
        .subscribe(data => {
          console.log(data);
          //let valor_unitario = this.model_produto.preco;
          console.log("item_pedido: " + this.model_produto);
          this.model_item_pedido.valor_unitario = this.model_produto.preco;
          //his.model_item_pedido.valor_unitario.toFixed(2);
          this.model_item_pedido.quantidade = 1;
        });
    }
  }

  clienteChange(event: { component: SelectSearchableComponent, value: any }) {
    console.log('clienteChange:', event.value);
    if (this.model_cliente.id !== null) {
      Observable.forkJoin([
          Observable.fromPromise(
              this.clienteProvider.get(this.model_cliente.id)
                .then((result: any) => {
                  this.model_cliente = result;
                })
                .catch(() => {
                  this.toast.create({ message: 'Erro ao carregar Cliente!!!', duration: 3000, position: 'botton' }).present();
                })
          )
        ])
        .subscribe(data => {
          console.log(data);
          this.model.cliente_id = this.model_cliente.id;
        });
    }
  }



}
