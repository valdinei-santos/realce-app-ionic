import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { CadastroFolhacargaPage } from '../cadastro-folhacarga/cadastro-folhacarga';
import { ShowFolhacargaPage } from '../show-folhacarga/show-folhacarga';
import { FolhacargaProvider, Folhacarga  } from '../../providers/folhacarga/folhacarga';

@IonicPage()
@Component({
  selector: 'page-lista-folhacarga',
  templateUrl: 'lista-folhacarga.html',
})
export class ListaFolhacargaPage {

  folhacarga: Folhacarga = { id:null, data:null, status:null };
  folhas: any[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public folhacargaProvider: FolhacargaProvider,
              public toast: ToastController
             ){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaFolhacargaPage');
  }

  ionViewDidEnter() {
  	this.folhacargaProvider.getAll2()
      .then((result: any[]) => {
        this.folhas = result; 
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos!!!', duration: 3000, position: 'botton' }).present();
      });
    console.log(this.folhas)
  }

  addFolha(){
    console.log('addFolha');
	  this.navCtrl.push(CadastroFolhacargaPage);
  }

  removeFolha(folha: Folhacarga){
    console.log('removePedido');
    this.folhacargaProvider.remove(folha.id)
      .then(() => {
        var index = this.folhas.indexOf(folha);
        this.folhas.splice(index, 1);
        this.toast.create({ message: 'Folha Carga removida!', duration: 3000, position: 'botton' }).present();
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao remover a Folha de Carga!', duration: 3000, position: 'center' }).present();
    });
  }

  editFolha(id: number){
    console.log('editFolha: ' + id );
    this.navCtrl.push(CadastroFolhacargaPage, { id: id });
  }

  showFolha(id: number){
    console.log('showFolha: ' + id );
    this.navCtrl.push(ShowFolhacargaPage, { id: id });
  }

}
