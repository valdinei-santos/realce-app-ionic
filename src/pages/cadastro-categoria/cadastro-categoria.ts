import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { CategoriaProvider, Categoria } from '../../providers/categoria/categoria';
//import { CadastroProdutoPage } from '../cadastro-produto/cadastro-produto';

/**
 * Generated class for the CadastroCategoriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cadastro-categoria',
  templateUrl: 'cadastro-categoria.html',
})
export class CadastroCategoriaPage {

  categoria: Categoria = {id:null, nome:null };
  model: Categoria;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public categoriaProvider: CategoriaProvider,
              //public cadastroProdutoPage: CadastroProdutoPage,
              public toast: ToastController) {

      this.model = new Categoria();

      if (this.navParams.data.id) {
        this.categoriaProvider.get(this.navParams.data.id)
          .then((result: any) => {
            this.model = result;
          })
          .catch(() => {
            this.toast.create({ message: 'Erro ao carregar uma categoria.', duration: 3000, position: 'botton' }).present();
        });
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroCategoriaPage');
  }

  save() {
    if (this.saveCategoria()) {
      this.toast.create({ message: 'Categoria salvo!', duration: 3000, position: 'center' }).present();
      //this.cadastroProdutoPage.loadCategoria();
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar o Categoria!', duration: 3000, position: 'center' }).present();
    }
  }

  private saveCategoria() {
    if (this.model.id) {
      //this.editando = false;
      return this.categoriaProvider.update(this.model);
    } else {
      //this.editando = true;
      console.log(this.model);
      return this.categoriaProvider.insert(this.model);
    }
  }

  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }

}
