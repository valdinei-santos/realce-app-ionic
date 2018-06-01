import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
//import { IProduto } from '../../interfaces/IProduto';
import { ProdutoProvider, Produto } from '../../providers/produto/produto';
import { CadastroProdutoPage } from '../cadastro-produto/cadastro-produto';
import { ToastController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-lista-produto',
  templateUrl: 'lista-produto.html',
})
export class ListaProdutoPage {

  produto: Produto = {id:null, categoria_id:null, marca_id:null, tipo_id:null, vasilhame_id:null, unidade_venda_id:null, 
                      nome_produto:null, preco:null, ativo:null, observacao:null};
  produtos: any[];

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public produtoProvider: ProdutoProvider,
  	          public toast: ToastController) {
	  console.log('constructor ListaProdutoPage');
  }


  ionViewDidEnter() {
  	this.produtoProvider.getAll()
      .then((result: any[]) => {
        this.produtos = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar produtos.', duration: 3000, position: 'botton' }).present();
    });
  }

 /*  ionViewWillEnter() {
    this.produtoProvider.getAll()
      .then((result: any[]) => {
        this.produtos = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar produtos.', duration: 3000, position: 'botton' }).present();
    });
  } */


  addProduto(){
    console.log('addProduto');
	  this.navCtrl.push(CadastroProdutoPage);
  }


  editProduto(id: number){
    console.log('editProduto');
    //console.log(produto);
    this.navCtrl.push(CadastroProdutoPage, { id: id });
  }


  removeProduto(produto: Produto) {
    console.log('removeProduto');
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


  filterProduto(ev: any) {
    //this.getAllProdutos();
  }


  cancelar(){
    this.navCtrl.setRoot(HomePage);
    //this.navCtrl.pop();
  }



}
