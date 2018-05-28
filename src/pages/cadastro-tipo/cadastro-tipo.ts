import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { TipoProvider, Tipo } from '../../providers/tipo/tipo';
/**
 * Generated class for the CadastroTipoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro-tipo',
  templateUrl: 'cadastro-tipo.html',
})
export class CadastroTipoPage {

  tipo: Tipo = {id:null, nome:null };
  model: Tipo;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public tipoProvider:TipoProvider,
              public toast: ToastController) {

      this.model = new Tipo();

      if (this.navParams.data.id) {
        this.tipoProvider.get(this.navParams.data.id)
          .then((result: any) => {
            this.model = result;
          })
          .catch(() => {
            this.toast.create({ message: 'Erro ao carregar um tipo.', duration: 3000, position: 'botton' }).present();
        });
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroTipoPage');
  }

  save() {
    if (this.saveTipo()) {
      this.toast.create({ message: 'Tipo salvo!', duration: 3000, position: 'center' }).present();
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar o Tipo!', duration: 3000, position: 'center' }).present();
    }
  }

  private saveTipo() {
    if (this.model.id) {
      //this.editando = false;
      return this.tipoProvider.update(this.model);
    } else {
      //this.editando = true;
      console.log(this.model);
      return this.tipoProvider.insert(this.model);
    }
  }

  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }


}
