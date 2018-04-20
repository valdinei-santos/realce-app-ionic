import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
//import { forkJoin } from 'rxjs/add/observable/forkJoin';
import { forkJoin } from 'rxjs/observable/forkJoin';



import { PedidoProvider, Pedido, Item_pedido } from '../../providers/pedido/pedido';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { ProdutoProvider, Produto } from '../../providers/produto/produto';
import { ToastController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-cadastro-pedido',
  templateUrl: 'cadastro-pedido.html',
})
export class CadastroPedidoPage {

  pedido: Pedido = {id:null, cliente_id:null, data:'', status:'Pendente'};
  Item_pedido: Item_pedido = {id:null, pedido_id:null, produto_id:null, produto_descricao:'', quantidade:null, valor_unitario:null, valor_total:null};
  //produto: Produto = {id:null, }
  //pedidoEditando: Pedido;
  editando:boolean = false;	
  model: Pedido;
  model_item_pedido: Item_pedido;
  model_produto: Produto;
  itens: any[] = [];
  clientes: any[];
  produtos: any[];
  //unidades: any[]

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
              public pedidoProvider:PedidoProvider,
              public clienteProvider:ClienteProvider,
              public produtoProvider:ProdutoProvider,
              public toast: ToastController) {

    this.model = new Pedido();
    this.model_produto = new Produto();
    this.model_item_pedido = new Item_pedido();

    if (this.navParams.data.id) {
      this.pedidoProvider.get(this.navParams.data.id)
        .then((result: any) => {
          this.model = result;
        })
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
  	  console.log(this.model_item_pedido.produto_id);
      Observable.forkJoin([
        Observable.fromPromise(
                this.produtoProvider.get(this.model_item_pedido.produto_id)
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
        //console.log(data[1]);
        //console.log(data[2]);

        console.log(this.model_produto);
        let item = new Item_pedido();
        item.pedido_id = null; //item.;
        item.produto_id = this.model_produto.id;
        item.produto_descricao = this.model_produto.descricao;
        item.quantidade = this.model_item_pedido.quantidade;
        item.valor_unitario = this.model_produto.preco;
        item.valor_total = this.model_item_pedido.quantidade * this.model_produto.preco;
        this.itens.push(item);
        console.log(item);
        console.log(this.model_item_pedido);   
      });
  }

  save() {
    if (this.savePedido()) {
      this.toast.create({ message: 'Pedido salvo!', duration: 3000, position: 'center' }).present();
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar o Pedido!', duration: 3000, position: 'center' }).present();
    }
  }

  private savePedido() {
    if (this.model.id) {
      //this.editando = false;
      this.pedidoProvider.update(this.model);
      return this.pedidoProvider.update_itens(this.itens);
    } else {
      //this.editando = true;
      this.pedidoProvider.insert(this.model);
      return this.pedidoProvider.insert_itens(this.itens);
    }
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


}
