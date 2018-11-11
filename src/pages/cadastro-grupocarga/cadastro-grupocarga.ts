import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Grupocarga, GrupocargaProvider } from '../../providers/grupocarga/grupocarga';

@IonicPage()
@Component({
  selector: 'page-cadastro-grupocarga',
  templateUrl: 'cadastro-grupocarga.html',
})
export class CadastroGrupocargaPage {

  model: Grupocarga;
  grupos: Grupocarga[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public grupocargaProvider: GrupocargaProvider,
              public toast: ToastController) {
      this.model = new Grupocarga();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroGrupocargaPage');
  }

  ionViewWillEnter() {
    this.getGrupocarga();
  }

  getGrupocarga() {
    this.grupocargaProvider.getAll()
      .then((result: any[]) => {
        this.grupos = result;
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar os Grupos de Carga!', duration: 3000, position: 'center' }).present();
      })
  }

  remove(grupo: Grupocarga) {
    this.grupocargaProvider.remove(grupo.id)
      .then(() => { 
        this.toast.create({ message: 'Grupo de Carga excluído!', duration: 3000, position: 'center' }).present();
        this.getGrupocarga();
        // this.navCtrl.pop();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao excluir Grupo Carga!', duration: 3000, position: 'center' }).present();
      });
  }

  save() {
    this.grupocargaProvider.insert(this.model)
      .then(() => {
        this.toast.create({ message: 'Grupo de Carga salvo!', duration: 3000, position: 'center' }).present();
        this.navCtrl.pop();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao salvar Grupo de Carga!', duration: 3000, position: 'center' }).present();
      });
  }

}
