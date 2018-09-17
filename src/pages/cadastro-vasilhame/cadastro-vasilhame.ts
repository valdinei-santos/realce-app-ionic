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

  vasilhame: Vasilhame = {id:null, nome:null };
  model: Vasilhame;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public vasilhameProvider:VasilhameProvider,
              public toast: ToastController) {

      this.model = new Vasilhame();
  }

  ionViewDidLoad() {
    if (this.navParams.data.id) {
      this.vasilhameProvider.get(this.navParams.data.id)
        .then((result: any) => {
          this.model = result;
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar um vasilhame.', duration: 3000, position: 'botton' }).present();
      });
    }
  }

  save() {
    if (this.saveVasilhame()) {
      this.toast.create({ message: 'Vasilhame salvo!', duration: 3000, position: 'center' }).present();
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar o Vasilhame!', duration: 3000, position: 'center' }).present();
    }
  }

  private saveVasilhame() {
    if (this.model.id) {
      return this.vasilhameProvider.update(this.model);
    } else {
      return this.vasilhameProvider.insert(this.model);
    }
  }

  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }


}
