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

  unidadeVenda: UnidadeVenda = {id:null, nome:null };
  model: UnidadeVenda;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public unidadeVendaProvider:UnidadeVendaProvider,
              public toast: ToastController) {

      this.model = new UnidadeVenda();
  }

  ionViewDidLoad() {
    if (this.navParams.data.id) {
      this.unidadeVendaProvider.get(this.navParams.data.id)
        .then((result: any) => {
          this.model = result;
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar uma Unidade.', duration: 3000, position: 'botton' }).present();
      });
    }
  }

  save() {
    if (this.saveUnidadeVenda()) {
      this.toast.create({ message: 'Unidade salva!', duration: 3000, position: 'center' }).present();
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar a Unidade!', duration: 3000, position: 'center' }).present();
    }
  }

  private saveUnidadeVenda() {
    if (this.model.id) {
      return this.unidadeVendaProvider.update(this.model);
    } else {
      return this.unidadeVendaProvider.insert(this.model);
    }
  }

  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }

}
