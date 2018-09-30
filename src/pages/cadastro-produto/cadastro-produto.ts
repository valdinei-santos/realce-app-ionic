import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BrMaskerIonic3, BrMaskModel } from 'brmasker-ionic-3';

import { ProdutoProvider, Produto } from '../../providers/produto/produto';
import { VasilhameProvider } from '../../providers/vasilhame/vasilhame';
import { UnidadeVendaProvider } from '../../providers/unidade-venda/unidade-venda';
import { CadastroVasilhamePage } from '../cadastro-vasilhame/cadastro-vasilhame';
import { CadastroUnidadeVendaPage } from '../cadastro-unidade-venda/cadastro-unidade-venda';
import { CategoriaProvider } from '../../providers/categoria/categoria';
import { CadastroCategoriaPage } from '../cadastro-categoria/cadastro-categoria';

@IonicPage()
@Component({
  selector: 'page-cadastro-produto',
  templateUrl: 'cadastro-produto.html',
  providers: [BrMaskerIonic3]
})
export class CadastroProdutoPage {

  myForm: FormGroup;
  editando:boolean = false;	
  //model: Produto;
  vasilhames: any[];
  unidades_venda: any[];
  categorias: any[];

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
              public produtoProvider: ProdutoProvider,
              public vasilhameProvider: VasilhameProvider,
              public unidadeVendaProvider: UnidadeVendaProvider,
              public categoriaProvider: CategoriaProvider,
              public toast: ToastController,
              public brMaskerIonic3: BrMaskerIonic3) { 

      //this.model = new Produto();
      this.myForm = this.createForm();    
  }

  ionViewDidLoad() {
    if (this.navParams.data.id) { // Edit
      this.editando = true;
      this.produtoProvider.get(this.navParams.data.id)
        .then((result: Produto) => {
          //this.model = result;
          console.log(result);
          this.myForm.patchValue(result);
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar um produto.', duration: 3000, position: 'botton' }).present();
      });
    } else {
      this.editando = false;
    }
  }

  ionViewDidEnter() {  
    this.loadVasilhame();
    this.loadUnidadeVenda();
    this.loadCategoria();
  }

  private loadVasilhame(){
    this.vasilhameProvider.getAll()
      .then((result: any[]) => {
        this.vasilhames = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar os vasilhames.', duration: 3000, position: 'botton' }).present();
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

  private loadCategoria(){
    this.categoriaProvider.getAll()
      .then((result: any[]) => {
        this.categorias = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar as categorias.', duration: 3000, position: 'botton' }).present();
    });
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(""),
      nome_produto: new FormControl(""),
      vasilhame_id: new FormControl(""),
      unidade_venda_id: new FormControl(""),
      categoria_id: new FormControl(""),
      preco: new FormControl(this.createMaskPreco(), Validators.required),
      ativo: new FormControl({value:'1'}),
      observacao: new FormControl(""),
    });
  }

  private createMaskPreco(): string {
    const config: BrMaskModel = new BrMaskModel();
    config.money = true;
    config.thousand = '.';
    config.decimal = 2;
    config.type = 'num';
    return this.brMaskerIonic3.writeCreateValue('', config);
  }

  save() {
    if (this.saveProduto()) {
      this.toast.create({ message: 'Produto salvo!', duration: 3000, position: 'center' }).present();
      if (this.navParams.data.isEdit) {
        this.navCtrl.getPrevious().data.editBack = true;
      }
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar o Produto!', duration: 3000, position: 'center' }).present();
    }
  }

  private saveProduto() {
    const newProduto: Produto = this.myForm.getRawValue();
    newProduto.ativo = newProduto.ativo['value'];
    newProduto.preco = Number(newProduto.preco.toString().replace(',', '.'));
    console.log(newProduto);
    if (newProduto.id) {
      return this.produtoProvider.update(newProduto);
    } else {
      return this.produtoProvider.insert(newProduto);
    }
  }

/*   private addCategoria() {
    this.navCtrl.push(CadastroCategoriaPage);
  }

  private addMarca() {
    this.navCtrl.push(CadastroMarcaPage);
  }

  private addTipo() {
    this.navCtrl.push(CadastroTipoPage);
  } */

  private addVasilhame() {
    this.navCtrl.push(CadastroVasilhamePage);
  }

  private addUnidade() {
    this.navCtrl.push(CadastroUnidadeVendaPage);
  }

  private addCategoria() {
    this.navCtrl.push(CadastroCategoriaPage);
  }

  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }


}
