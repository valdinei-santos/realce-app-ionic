import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ProdutoProvider, Produto } from '../../providers/produto/produto';
import { CadastroProdutoPage } from '../cadastro-produto/cadastro-produto';


@IonicPage()
@Component({
  selector: 'page-lista-produto',
  templateUrl: 'lista-produto.html',
})
export class ListaProdutoPage {

  produto: Produto;
  produtos: any[];
  isPedido: boolean;

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public produtoProvider: ProdutoProvider,
  	          public toast: ToastController) { }

  ionViewDidLoad() {
    this.produto = new Produto();
    this.getProdutos();
  }

  ionViewWillEnter() {
    this.getProdutos();
    if (this.navParams.data.isPedido) {
      this.isPedido = true;
    } else {
      this.isPedido = false;
    }
  }

  addProduto(){
	  this.navCtrl.push(CadastroProdutoPage);
  }

  editProduto(id: number){
    this.navCtrl.push(CadastroProdutoPage, { id: id, isEdit: true });
  }


  removeProduto(produto: Produto) {
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
