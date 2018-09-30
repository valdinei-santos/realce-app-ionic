import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { VasilhameProvider, Vasilhame } from '../../providers/vasilhame/vasilhame';

@IonicPage()
@Component({
  selector: 'page-cadastro-vasilhame',
  templateUrl: 'cadastro-vasilhame.html',
})
export class CadastroVasilhamePage {

  // vasilhame: Vasilhame;
  model: Vasilhame;
  vasilhames: any[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public vasilhameProvider:VasilhameProvider,
              public toast: ToastController) { 
    this.model = new Vasilhame();
  }

  ionViewDidLoad() { }

  ionViewWillEnter() {
    this.getVasilhames();
  }

  getVasilhames() {
    this.vasilhameProvider.getAll()
      .then((result: any[]) => {
        this.vasilhames = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar os Vasilhames!', duration: 3000, position: 'center' }).present();
      })
  }

  remove(vasilhame: Vasilhame) {
    this.vasilhameProvider.remove(vasilhame.id)
      .then(() => {
        this.toast.create({ message: 'Vasilhame excluído!', duration: 3000, position: 'center' }).present();
        this.getVasilhames();
        // this.navCtrl.pop();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao excluir o Vasilhame!', duration: 3000, position: 'center' }).present();
      });
  }

  save() {
    this.vasilhameProvider.insert(this.model)
      .then(() => {
        this.toast.create({ message: 'Vasilhame salvo!', duration: 3000, position: 'center' }).present();
        this.navCtrl.pop();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao salvar o Vasilhame!', duration: 3000, position: 'center' }).present();
      });
  }


}
