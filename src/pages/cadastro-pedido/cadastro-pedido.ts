import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
//import { forkJoin } from 'rxjs/add/observable/forkJoin';
//import { forkJoin } from 'rxjs/observable/forkJoin';

import { PedidoProvider, Pedido, Item_pedido } from '../../providers/pedido/pedido';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { ProdutoProvider, Produto } from '../../providers/produto/produto';
import { ToastController } from 'ionic-angular';

import { SelectSearchableComponent } from 'ionic-select-searchable';


@IonicPage()
@Component({
  selector: 'page-cadastro-pedido',
  templateUrl: 'cadastro-pedido.html',
})
export class CadastroPedidoPage {

  pedido: Pedido = {id:null, cliente_id:null, data:null, status:'Inexistente'};
  //Item_pedido: Item_pedido = {id:null, pedido_id:null, produto_id:null, nome_produto:null, quantidade:null, valor_unitario:null, valor_total:null};
  //produto: Produto = {id:null, }
  //pedidoEditando: Pedido;
  editando:boolean = false;	
  model: Pedido;
  model_item_pedido: Item_pedido;
  model_produto: Produto;
  model_cliente: Cliente;
  itens: any[] = [];
  clientes: any[];
  produtos: any[];
  //unidades: any[]
  //data_atual: string = new Date().toISOString();
  data_atual: any = new Date();
  data_atual_aux: any = new Date();

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
              public pedidoProvider:PedidoProvider,
              public clienteProvider:ClienteProvider,
              public produtoProvider:ProdutoProvider,
              public toast: ToastController) {

    this.model = new Pedido();
    this.model_produto = new Produto();
    this.model_cliente = new Cliente();
    this.model_item_pedido = new Item_pedido();

    console.log('ID Peeee:' + this.navParams.data.id);
    if (this.navParams.data.id) {
      this.editando = true;
      console.log('ID Pe:' + this.navParams.data.id);
      this.pedidoProvider.get(this.navParams.data.id)
        .then((result: any) => {
          this.model = result;
          console.log('Data que veio dentro promise: ' + this.model.data);
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
      //this.model.data = this.model.data.toISOString();
    } else {
      this.editando = false;
      this.model.data = this.data_atual.toISOString();
      console.log('Data Val1: ' + this.data_atual.toLocaleDateString('pt-BR'));
      console.log('Data Val2: ' + new Date().toJSON().slice(0,10).replace(/-/g,'/'));
      
      this.pedidoProvider.getNewId()
          .then((result: any) => {
            this.model.id = result;
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
        });
    }

    this.clienteProvider.getAll()
      .then((result: any[]) => {
        this.clientes = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar clientes!!!', duration: 3000, position: 'botton' }).present();
      });

    this.produtoProvider.getAll()
      .then((result: any[]) => {
        this.produtos = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
      });	 
    
    //if (this.model.data == null){
    //  this.model.data = this.data_atual; //this.data_atual.toISOString();
    //  console.log('Data Val2: ' + this.model.data);
   // }
   
    //this.model.data = this.data_atual.toString();
    this.model.status = 'Inexistente';
    
  }


/*
  ionViewDidLoad() {
  	if (this.editando) {
	    this.pedidoProvider.getAllItens()
	      .then((result: any[]) => {
	        this.itens = result;
	      })
	      .catch(() => {
	        this.toast.create({ message: 'Erro ao carregar itens!!!', duration: 3000, position: 'botton' }).present();
	      });
  	}

  }
*/

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

    if (this.model.status != 'Inexistente') {
      console.log('Entrou UPDATE - ' + this.model.status);
      //this.editando = false;
      this.pedidoProvider.update(this.model);
      return this.pedidoProvider.update_itens(this.itens);
    } else {
      console.log('Entrou INSERT');
      //this.editando = true;
      this.model.status = 'Pendente';
      this.pedidoProvider.insert(this.model);
      return this.pedidoProvider.insert_itens(this.itens);
    }
  }

  removeProduto(item: Item_pedido) {
    this.itens.splice(this.itens.indexOf(item), 1);
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
