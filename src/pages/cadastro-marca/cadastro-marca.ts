import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { MarcaProvider, Marca } from '../../providers/marca/marca';

/**
 * Generated class for the CadastroMarcaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro-marca',
  templateUrl: 'cadastro-marca.html',
})
export class CadastroMarcaPage {

  marca: Marca = {id:null, nome:null };
  model: Marca;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public marcaProvider:MarcaProvider,
              public toast: ToastController) {

      this.model = new Marca();

      if (this.navParams.data.id) {
        this.marcaProvider.get(this.navParams.data.id)
          .then((result: any) => {
            this.model = result;
          })
          .catch(() => {
            this.toast.create({ message: 'Erro ao carregar uma marca.', duration: 3000, position: 'botton' }).present();
        });
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroMarcaPage');
  }

  save() {
    if (this.saveMarca()) {
      this.toast.create({ message: 'Marca salva!', duration: 3000, position: 'center' }).present();
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar a Marca!', duration: 3000, position: 'center' }).present();
    }
  }

  private saveMarca() {
    if (this.model.id) {
      //this.editando = false;
      return this.marcaProvider.update(this.model);
    } else {
      //this.editando = true;
      console.log(this.model);
      return this.marcaProvider.insert(this.model);
    }
  }

  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }


}
