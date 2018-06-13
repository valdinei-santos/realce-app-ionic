import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CadastroFolhacargaPage } from '../cadastro-folhacarga/cadastro-folhacarga';

@IonicPage()
@Component({
  selector: 'page-lista-folhacarga',
  templateUrl: 'lista-folhacarga.html',
})
export class ListaFolhacargaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaFolhacargaPage');
  }

  addFolhaCarga(){
    console.log('addFolhaCarga');
	  this.navCtrl.push(CadastroFolhacargaPage);
  }


}
