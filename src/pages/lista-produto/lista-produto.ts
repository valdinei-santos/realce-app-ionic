import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
//import { IProduto } from '../../interfaces/IProduto';
import { ProdutoProvider, Produto } from '../../providers/produto/produto';
import { CadastroProdutoPage } from '../cadastro-produto/cadastro-produto';
import { ToastController } from 'ionic-angular';
import { CadastroPedidoPage } from '../cadastro-pedido/cadastro-pedido';


@IonicPage()
@Component({
  selector: 'page-lista-produto',
  templateUrl: 'lista-produto.html',
})
export class ListaProdutoPage {

  produto: Produto = {id:null, categoria_id:null, marca_id:null, tipo_id:null, vasilhame_id:null, unidade_venda_id:null, 
                      nome_produto:null, preco:null, ativo:null, observacao:null};
  produtos: any[];
  //searchQuery: string = '';
  isPedido: boolean;

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public produtoProvider: ProdutoProvider,
  	          public toast: ToastController) {
	  console.log('lista-produto - constructor');
  }


  ionViewDidLoad() {
    console.log('lista-produto - ionViewDidLoad');
    this.getProdutos();
  }

  ionViewWillEnter() {
    console.log('lista-produto - ionViewWillEnter');
    this.getProdutos();
    //if (this.navParams.get('editBack')) {
    //}
    if (this.navParams.data.isPedido) {
      this.isPedido = true;
    } else {
      this.isPedido = false;
    }
  }


  addProduto(){
    console.log('lista-produto - addProduto');
	  this.navCtrl.push(CadastroProdutoPage);
  }


  editProduto(id: number){
    console.log('lista-produto - editProduto');
    this.navCtrl.push(CadastroProdutoPage, { id: id, isEdit: true });
  }


  removeProduto(produto: Produto) {
    console.log('lista-produto - removeProduto');
    this.produtoProvider.remove(produto.id) 
      .then(() => {
        var index = this.produtos.indexOf(produto);
        this.produtos.splice(index, 1);
        this.toast.create({ message: 'Produto removido.', duration: 3000, position: 'botton' }).present();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao remover produto.', duration: 3000, position: 'botton' }).present();
    });
  }


  cancelar(){
    this.navCtrl.setRoot(HomePage);
    //this.navCtrl.pop();
  }

  getProdutos(){
    this.produtoProvider.getAll()
      .then((result: any[]) => {
        this.produtos = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar produtos.', duration: 3000, position: 'botton' }).present();
    });
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    //this.getProdutos();
    this.produtoProvider.getAll()
      .then((result: any[]) => {
        this.produtos = result;
        // Lógica para povoar o array só com os produtos que atendem o filtro.
        const val = ev.target.value;
        if (val && val.trim() != '') {
          this.produtos = this.produtos.filter((item) => {
            return (item.nome_produto.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })
        }
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar produtos.', duration: 3000, position: 'botton' }).present();
    });
  }

  pedidoProduto(produto: Produto) {
    if (this.isPedido) {
      this.navCtrl.getPrevious().data.produto = produto;
      this.navCtrl.pop()
    } else {
      null;
    }
  }


}
