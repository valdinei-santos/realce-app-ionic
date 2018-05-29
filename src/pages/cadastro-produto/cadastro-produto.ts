import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { ProdutoProvider, Produto } from '../../providers/produto/produto';
import { CategoriaProvider } from '../../providers/categoria/categoria';
import { MarcaProvider } from '../../providers/marca/marca';
import { TipoProvider } from '../../providers/tipo/tipo';
import { UnidadeVendaProvider } from '../../providers/unidade-venda/unidade-venda';
import { CadastroCategoriaPage } from '../cadastro-categoria/cadastro-categoria';
import { CadastroMarcaPage } from '../cadastro-marca/cadastro-marca';
import { CadastroTipoPage } from '../cadastro-tipo/cadastro-tipo';
import { CadastroVasilhamePage } from '../cadastro-vasilhame/cadastro-vasilhame';
import { CadastroUnidadeVendaPage } from '../cadastro-unidade-venda/cadastro-unidade-venda';

@IonicPage()
@Component({
  selector: 'page-cadastro-produto',
  templateUrl: 'cadastro-produto.html',
})
export class CadastroProdutoPage {

  //produto: Produto = {descricao:'', unidade_venda_id:null, preco:null, categoria_id:null, ativo:null };
  produto: Produto = {categoria_id:null, marca_id:null, tipo_id:null, unidade_venda_id:null, preco:null, ativo:null, observacao:null };
  //produtoEditando: Produto;
  editando:boolean = false;	
  model: Produto;
  categorias: any[];
  marcas: any[];
  tipos: any[];
  unidades_venda: any[]

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
              public produtoProvider:ProdutoProvider,
              public categoriaProvider:CategoriaProvider,
              public marcaProvider:MarcaProvider,
              public tipoProvider:TipoProvider,
  	          public unidadeVendaProvider:UnidadeVendaProvider,
			        public toast: ToastController) {

    this.model = new Produto();

    if (this.navParams.data.id) {
      this.produtoProvider.get(this.navParams.data.id)
        .then((result: any) => {
          this.model = result;
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar um produto.', duration: 3000, position: 'botton' }).present();
      });
    }
  }

  //ionViewDidLoad() {
  ionViewDidEnter() {  
    this.loadCategoria();
    this.loadMarca();
    this.loadTipo();
    this.loadUnidadeVenda();
  }

  public loadCategoria(){
    this.categoriaProvider.getAll()
      .then((result: any[]) => {
        this.categorias = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar as categorias.', duration: 3000, position: 'botton' }).present();
    });
  }

  private loadMarca(){
    this.marcaProvider.getAll()
      .then((result: any[]) => {
        this.marcas = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar as marcas.', duration: 3000, position: 'botton' }).present();
    });
  }

  private loadTipo(){
    this.tipoProvider.getAll()
      .then((result: any[]) => {
        this.tipos = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar os tipos.', duration: 3000, position: 'botton' }).present();
    });
  }

  private loadUnidadeVenda(){
    this.unidadeVendaProvider.getAll()
      .then((result: any[]) => {
        this.unidades_venda = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar as unidades.', duration: 3000, position: 'botton' }).present();
    });
  }

  save() {
    if (this.saveProduto()) {
      this.toast.create({ message: 'Produto salvo!', duration: 3000, position: 'center' }).present();
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar o Produto!', duration: 3000, position: 'center' }).present();
    }
  }

  private saveProduto() {
    if (this.model.id) {
      //this.editando = false;
      return this.produtoProvider.update(this.model);
    } else {
      //this.editando = true;
      console.log(this.model);
      return this.produtoProvider.insert(this.model);
    }
  }

  private addCategoria() {
    this.navCtrl.push(CadastroCategoriaPage);
  }

  private addMarca() {
    this.navCtrl.push(CadastroMarcaPage);
  }

  private addTipo() {
    this.navCtrl.push(CadastroTipoPage);
  }

  private addVasilhame() {
    this.navCtrl.push(CadastroVasilhamePage);
  }

  private addUnidade() {
    this.navCtrl.push(CadastroUnidadeVendaPage);
  }

  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }


}
