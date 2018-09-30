import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { UnidadeVendaProvider, UnidadeVenda } from '../../providers/unidade-venda/unidade-venda';

@IonicPage()
@Component({
  selector: 'page-cadastro-unidade-venda',
  templateUrl: 'cadastro-unidade-venda.html',
})
export class CadastroUnidadeVendaPage {

  // unidadeVenda: UnidadeVenda = {id:null, nome:null };
  model: UnidadeVenda;
  unidades: UnidadeVenda[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public unidadeVendaProvider:UnidadeVendaProvider,
              public toast: ToastController) {
      this.model = new UnidadeVenda();
  }

  ionViewDidLoad() { }

  ionViewWillEnter() {
    this.getUnidadesVenda();
  }

  getUnidadesVenda() {
    this.unidadeVendaProvider.getAll()
      .then((result: any[]) => {
        this.unidades = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar as Unidades!', duration: 3000, position: 'center' }).present();
      })
  }

  remove(unidade: UnidadeVenda) {
    this.unidadeVendaProvider.remove(unidade.id)
      .then(() => { 
        this.toast.create({ message: 'Unidade Venda excluída!', duration: 3000, position: 'center' }).present();
        this.getUnidadesVenda();
        // this.navCtrl.pop();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao excluir Unidade Venda!', duration: 3000, position: 'center' }).present();
      });
  }

  save() {
    this.unidadeVendaProvider.insert(this.model)
      .then(() => {
        this.toast.create({ message: 'Undade Venda salvo!', duration: 3000, position: 'center' }).present();
        this.navCtrl.pop();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao salvar Unidade Venda!', duration: 3000, position: 'center' }).present();
      });
  }

}
