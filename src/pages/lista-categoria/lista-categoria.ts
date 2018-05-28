import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';
import { CategoriaProvider, Categoria } from '../../providers/categoria/categoria';
import { CadastroCategoriaPage } from '../cadastro-categoria/cadastro-categoria';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the ListaCategoriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-categoria',
  templateUrl: 'lista-categoria.html',
})
export class ListaCategoriaPage {

  categoria: Categoria = {id:null, nome:null};
  categorias: any[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public categoriaProvider: CategoriaProvider,
  	          public toast: ToastController) {
  }

  ionViewDidEnter() {
  	this.categoriaProvider.getAll()
      .then((result: any[]) => {
        this.categorias = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar categorias.', duration: 3000, position: 'botton' }).present();
    });
  }


  addCategoria(){
    console.log('addCategoria');
	  this.navCtrl.push(CadastroCategoriaPage);
  }


  editCategoria(id: number){
    console.log('editCategoria');
    //console.log(categoria);
    this.navCtrl.push(CadastroCategoriaPage, { id: id });
  }


  removeCategoria(categoria: Categoria) {
    console.log('removeCategoria');
    this.categoriaProvider.remove(categoria.id) 
      .then(() => {
        var index = this.categorias.indexOf(categoria);
        this.categorias.splice(index, 1);
        this.toast.create({ message: 'Categoria removido.', duration: 3000, position: 'botton' }).present();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao remover categoria.', duration: 3000, position: 'botton' }).present();
    });
  }

  cancelar(){
    this.navCtrl.setRoot(HomePage);
    //this.navCtrl.pop();
  }



}
