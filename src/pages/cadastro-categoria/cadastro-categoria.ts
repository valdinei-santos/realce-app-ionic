import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { CategoriaProvider, Categoria } from '../../providers/categoria/categoria';

@IonicPage()
@Component({
  selector: 'page-cadastro-categoria',
  templateUrl: 'cadastro-categoria.html',
})
export class CadastroCategoriaPage {

  //categoria: Categoria = {id:null, nome:null };
  model: Categoria;
  categorias: Categoria[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public categoriaProvider: CategoriaProvider,
              public toast: ToastController) {
      this.model = new Categoria();

      /* if (this.navParams.data.id) {
        this.categoriaProvider.get(this.navParams.data.id)
          .then((result: any) => {
            this.model = result;
          })
          .catch(() => {
            this.toast.create({ message: 'Erro ao carregar uma categoria.', duration: 3000, position: 'botton' }).present();
        });
      } */
  }

  ionViewDidLoad() { }

  ionViewWillEnter() {
    this.getCategorias();
  }

  getCategorias() {
    this.categoriaProvider.getAll()
      .then((result: any[]) => {
        this.categorias = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar as Categorias!', duration: 3000, position: 'center' }).present();
      })
  }

  remove(unidade: Categoria) {
    this.categoriaProvider.remove(unidade.id)
      .then(() => { 
        this.toast.create({ message: 'Categoria excluída!', duration: 3000, position: 'center' }).present();
        this.getCategorias();
        // this.navCtrl.pop();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao excluir Categoria!', duration: 3000, position: 'center' }).present();
      });
  }

  save() {
    this.categoriaProvider.insert(this.model)
      .then(() => {
        this.toast.create({ message: 'Categoria salva!', duration: 3000, position: 'center' }).present();
        this.navCtrl.pop();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao salvar Categoria!', duration: 3000, position: 'center' }).present();
      });
  }

}
