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
  qtd_produtos: number = 0;
  isPedido: boolean;
  tipo: string;
  tipo_titulo: string;

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
  	          public produtoProvider: ProdutoProvider,
  	          public toast: ToastController) { }

  ionViewDidLoad() {
    this.produto = new Produto();
  }

  ionViewWillEnter() {
    if (this.navParams.data.isPedido) {
      this.isPedido = true;
    } else {
      this.isPedido = false;
    }
    if (this.navParams.data.tipo) {
      if (this.navParams.data.tipo == 'cerveja') {
        this.tipo_titulo = 'Cervejas';
        this.tipo = 'cerveja';
        this.getProdutosCerveja();
      } else if (this.navParams.data.tipo == 'refri') {
        this.tipo_titulo = 'Refri e Similares';
        this.tipo = 'refri';
        this.getProdutosRefri();
      } else {
        this.tipo_titulo = 'Destilados';
        this.tipo = 'outros'
        this.getProdutosDestilados();
      }
    } else {
      this.tipo_titulo = 'Produtos';
      this.tipo = 'produto';
      this.getProdutos();
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
        this.qtd_produtos = this.produtos.length;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar produtos.', duration: 3000, position: 'botton' }).present();
    });
  }

  getProdutosCerveja(){
    this.produtoProvider.getAllCerveja()
      .then((result: any[]) => {
        this.produtos = result;
        this.qtd_produtos = this.produtos.length;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar produtos.', duration: 3000, position: 'botton' }).present();
    });
  }

  getProdutosRefri(){
    this.produtoProvider.getAllRefri()
      .then((result: any[]) => {
        this.produtos = result;
        this.qtd_produtos = this.produtos.length;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar produtos.', duration: 3000, position: 'botton' }).present();
    });
  }

  getProdutosDestilados(){
    this.produtoProvider.getAllDestilados()
      .then((result: any[]) => {
        this.produtos = result;
        this.qtd_produtos = this.produtos.length;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar produtos.', duration: 3000, position: 'botton' }).present();
    });
  }

  getItems(ev: any) {
    if (this.tipo == 'cerveja') {
      this.produtoProvider.getAllCerveja()
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
    } else if (this.tipo == 'refri') {
      this.produtoProvider.getAllRefri()
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
    } else if (this.tipo == 'outros') {
      this.produtoProvider.getAllDestilados()
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
    } else {
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
