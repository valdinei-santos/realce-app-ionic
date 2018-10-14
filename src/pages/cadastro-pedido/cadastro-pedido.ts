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
import { CadastroPedidoItemPage } from '../cadastro-pedido-item/cadastro-pedido-item';
import { BrMaskerIonic3, BrMaskModel } from 'brmasker-ionic-3';
import { FormGroup, FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-cadastro-pedido',
  templateUrl: 'cadastro-pedido.html',
  providers: [BrMaskerIonic3]
})
export class CadastroPedidoPage {

  form: FormGroup;

  pedido: Pedido = new Pedido(); 
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

  ad: string = '0,00';
  valor_pago: string = '0,00';

  constructor(public navCtrl: NavController, 
  	          public navParams: NavParams,
              public pedidoProvider:PedidoProvider,
              public clienteProvider:ClienteProvider,
              public produtoProvider:ProdutoProvider,
              public toast: ToastController,
              public decimalPipe: DecimalPipe,
              public brMaskerIonic3: BrMaskerIonic3) {

    this.form = this.createForm();
    this.model = new Pedido();
    this.model.valor_adicional = 0;
    this.model.valor_pago = 0;
    this.model.pago = 0;
    this.model.avista = 0;
    this.model_produto = new Produto();
    this.model_cliente = new Cliente();
    this.model_item_pedido = new Item_pedido(); 
  }

  ionViewDidLoad() {
    if (this.navParams.data.id) { // Edit
      this.editando = true;
      console.log('ID Pe:' + this.navParams.data.id);
      this.pedidoProvider.get(this.navParams.data.id)
        .then((result: Pedido) => {
          this.model = result;
          this.form.get('ad').setValue(this.model.valor_adicional.toString().replace('.', ',') );
          this.ad = this.form.get('ad').value;
          this.form.get('valor_pago').setValue(this.model.valor_pago.toString().replace('.', ','));
          this.form.get('pago').setValue(this.model.pago);
          this.form.get('avista').setValue(this.model.avista);
          this.form.get('observacao').setValue(this.model.observacao);
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
          }
          this.setTotalGeral();
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar Itens do pedido.', duration: 3000, position: 'botton' }).present();
        });
    } else { // Cadastro
      this.editando = false;
      this.model.data = this.data_atual.toISOString();
      this.model.status = 'Inexistente';
      
      this.pedidoProvider.getNewId()
          .then((result: any) => {
            this.model.id = result;
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
        });
    }
  }


  ionViewWillEnter() {
    console.log('cadastro-pedido - ionViewWillEnter');
    if (this.navParams.get('cliente')) {
      this.model_cliente = this.navParams.get('cliente');
    }
    if (this.navParams.get('produto')) {
      this.model_produto = this.navParams.get('produto');
      this.model_item_pedido.valor_unitario = this.model_produto.preco;
      this.model_item_pedido.quantidade = 1;
    }
    if (this.navParams.get('lista_itens')) {
      this.itens = this.navParams.get('lista_itens');
      this.total = Number(this.navParams.get('total'));
    }
    this.setTotalGeral();
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      ad: new FormControl(this.createMaskAd()),
      valor_pago : new FormControl(this.createMaskValorPago()),
      pago: new FormControl(null),
      avista: new FormControl(null),
      observacao: new FormControl(null)
    });
  }
   
  private createMaskAd(): string {
    const config: BrMaskModel = new BrMaskModel();
    config.money = true;
    config.thousand = '.';
    config.decimal = 2;
    config.type = 'num';
    return this.brMaskerIonic3.writeCreateValue('', config);
  }

  private createMaskValorPago(): string {
    const config: BrMaskModel = new BrMaskModel();
    config.money = true;
    config.thousand = '.';
    config.decimal = 2;
    config.type = 'num';
    return this.brMaskerIonic3.writeCreateValue('', config);
  }

  setTotalGeral(){
    this.total_geral = Number(this.total) + Number(this.form.get('ad').value.replace(',', '.'));
  }

  changeAd(){
    this.ad = this.form.get('ad').value;
    this.setTotalGeral();
  }

  changeValorPago(){
    this.valor_pago = this.form.get('valor_pago').value;
  }

  getListCliente(){
    this.navCtrl.push(ListaClientePage, {isPedido: true});
  }

  hideList() {
    this.isHide = this.isHide ? false : true;
  }

  addItens(){
    if (!this.model_cliente.id) {
      this.toast.create({ message: 'Selecione o Cliente!!!', duration: 3000, position: 'botton' }).present();
    } else {
      this.navCtrl.push(CadastroPedidoItemPage, { isPedido: true, 
                                                  pedido_id: this.model.id,
                                                  pedido_itens: this.itens,
                                                  pedido_total: this.total,
                                                  cliente_id: this.model_cliente.id
                                                }
                       );
    }
  }

  addItem() {
      Observable.forkJoin([
        Observable.fromPromise(
                this.produtoProvider.get(this.model_produto.id)
                  .then((result: any) => {
                    this.model_produto = result;
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
        item.nome_produto = this.model_produto.nome_produto;
        item.quantidade = this.model_item_pedido.quantidade;
        item.valor_unitario = this.model_item_pedido.valor_unitario; //this.model_produto.preco;
        item.valor_total = item.quantidade * item.valor_unitario; //this.model_produto.preco;
        this.itens.push(item);
        this.model_produto.id = null;
        this.model_produto.nome_produto = null;
        this.model_item_pedido.quantidade = null;
        this.model_item_pedido.valor_unitario = null;
        this.total = this.total + (item.valor_total as number);
      });
  }

  save() {
    if (this.model_cliente.nome === undefined) {
      this.toast.create({ message: 'Cliente é obrigatório!', duration: 3000, position: 'center' }).present();
      return null;
    }
    if (this.itens === undefined || this.itens.length === 0) {
      this.toast.create({ message: 'Nenhum produto adicionado!', duration: 3000, position: 'center' }).present();
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
    this.model.valor_pago = Number(this.form.get('valor_pago').value.replace(',','.'));
    this.model.valor_adicional = Number(this.form.get('ad').value.replace(',','.'));
    this.model.pago = Number(this.form.get('pago').value);
    this.model.avista = Number(this.form.get('avista').value);
    this.model.observacao = this.form.get('observacao').value;

    if (this.editando) {
      this.pedidoProvider.update(this.model);
      return this.pedidoProvider.update_itens(this.itens);
    } else {
      this.model.status = 'Pendente';
      this.pedidoProvider.insert(this.model);
      return this.pedidoProvider.insert_itens(this.itens);
    }
  }

  removeProduto(item: Item_pedido) {
    this.itens.splice(this.itens.indexOf(item), 1);
    this.total -= item.valor_total; 
  }

  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }

  produtoChange(event: { component: SelectSearchableComponent, value: any }) {
    if (this.model_produto.id !== null) {
      Observable.forkJoin([
          Observable.fromPromise(
              this.produtoProvider.get(this.model_produto.id)
                .then((result: any) => {
                  this.model_produto = result;
                })
                .catch(() => {
                  this.toast.create({ message: 'Erro ao carregar produtos!!!', duration: 3000, position: 'botton' }).present();
                })
          )
        ])
        .subscribe(data => {
          this.model_item_pedido.valor_unitario = this.model_produto.preco;
          this.model_item_pedido.quantidade = 1;
        });
    }
  }

  clienteChange(event: { component: SelectSearchableComponent, value: any }) {
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
          this.model.cliente_id = this.model_cliente.id;
        });
    }
  }
  

}
