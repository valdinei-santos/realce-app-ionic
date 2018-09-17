import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BrMaskerIonic3, BrMaskModel } from 'brmasker-ionic-3';

import { ProdutoProvider, Produto } from '../../providers/produto/produto';
import { Item_pedido } from '../../providers/pedido/pedido';
import { ListaProdutoPage } from '../lista-produto/lista-produto';


@IonicPage()
@Component({
  selector: 'page-cadastro-pedido-item',
  templateUrl: 'cadastro-pedido-item.html',
  providers: [BrMaskerIonic3]
})
export class CadastroPedidoItemPage {

  myForm: FormGroup;
  itens: any[] = [];
  model_item_pedido: Item_pedido;
  model_produto: Produto;
  total: number = 0;
  pedido_id: number = 0;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public produtoProvider: ProdutoProvider,
              public toast: ToastController,
              public brMaskerIonic3: BrMaskerIonic3) {
    this.myForm = this.createForm();
    this.model_item_pedido = new Item_pedido();
    this.model_produto = new Produto();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroPedidoItemPage');
    if (this.navParams.data.pedido_id) {
      this.pedido_id = this.navParams.data.pedido_id;
      this.itens = (this.navParams.data.pedido_itens) ? this.navParams.data.pedido_itens : [];
      this.total = this.navParams.data.pedido_total;
    }
  }

  ionViewWillEnter() {
    console.log('cadastro-pedido-item - ionViewWillEnter');
    if (this.navParams.get('produto')) {
      this.model_produto = this.navParams.get('produto');
      this.model_item_pedido.valor_unitario = Number(this.model_produto.preco); //this.decimalPipe.transmyForm(this.model_produto.preco, '1.2-2'); 
      this.model_item_pedido.valor_padrao = Number(this.model_produto.preco);
      this.model_item_pedido.quantidade = 1;
      this.myForm.get('nome_produto').setValue(this.model_produto.nome_completo);
      this.myForm.get('quantidade').setValue(1);
      this.myForm.get('preco').setValue(this.model_produto.preco.toString().replace('.', ','));
    }
  }

  /* ionViewWillUnload() {
    this.setBackPedido();
  } */

  protected createForm(): FormGroup {
    return new FormGroup({
      nome_produto: new FormControl( {value: '', disabled: true}, Validators.required ), 
      quantidade: new FormControl( {value: 1}, Validators.required ),
      preco: new FormControl(this.createMaskPreco(), Validators.required),
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

  changeNomeProduto(){
    this.model_produto.nome_completo = this.myForm.get('nome_produto').value;
  }
  
  changeQuantidade(){
    this.model_item_pedido.quantidade = Number(this.myForm.get('quantidade').value);
  }
  
  changePreco(){
    this.model_item_pedido.valor_unitario = Number(this.myForm.get('preco').value.replace(',', '.'));
  }

  getListProdutos(){
    this.navCtrl.push(ListaProdutoPage, {isPedido: true});
  }

  addItem() {
    if (this.model_produto.nome_produto === undefined || this.model_produto.nome_produto === null) {
      this.toast.create({ message: 'Escolha um produto!', duration: 3000, position: 'center' }).present();
      return null;
    }
    if (this.itens.some(e => e.produto_id === this.model_produto.id)) {
      this.toast.create({ message: 'Produto já existe na listagem!', duration: 3000, position: 'center' }).present();
      return null;
    }
    Observable.forkJoin([
      Observable.fromPromise(
              this.produtoProvider.get(this.model_produto.id)
                .then((result: Produto) => {
                  this.model_produto = result;
                })
                .catch(() => {
                  this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
                })
      )
    ])
    .subscribe(data => {
      let item = new Item_pedido();
      item.pedido_id = this.pedido_id;
      item.produto_id = this.model_produto.id;
      item.nome_produto = this.model_produto.nome_completo;
      item.quantidade = this.model_item_pedido.quantidade;
      item.valor_unitario = this.model_item_pedido.valor_unitario; 
      item.valor_padrao = this.model_item_pedido.valor_padrao;
      item.valor_total = item.quantidade * item.valor_unitario; 
      item.valor_total_padrao = item.quantidade * item.valor_padrao;
      this.itens.push(item);
      this.model_produto.id = null;
      this.model_produto.nome_produto = null;
      this.model_item_pedido.quantidade = null;
      this.model_item_pedido.valor_unitario = null;
      this.myForm.get('nome_produto').setValue(null);
      this.myForm.get('quantidade').setValue(null);
      this.myForm.get('preco').setValue(null);
      this.model_item_pedido.valor_padrao = null;
      this.total = this.total + item.valor_total;
      this.setBackPedido();
    });
  }

  setBackPedido() {
    this.navCtrl.getPrevious().data.lista_itens = this.itens;
    this.navCtrl.getPrevious().data.total = this.total;
  }

  removeProduto(item: Item_pedido) {
    this.itens.splice(this.itens.indexOf(item), 1);
    this.total -= Number(item.valor_total); 
    this.setBackPedido();
  }

  backPedido() {
    this.navCtrl.pop();
  }

}
