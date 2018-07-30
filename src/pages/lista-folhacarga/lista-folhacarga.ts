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
  pedidos: any[];
  pedidos2: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public folhacargaProvider: FolhacargaProvider,
              public toast: ToastController
             ){
    this.folhacargaProvider.getAll2()
      .then((result: any[]) => {
        this.folhas = result; 
    })
    .catch(() => {
      this.toast.create({ message: 'Erro ao carregar folhas de carga!!!', duration: 3000, position: 'botton' }).present();
    });
    //console.log(this.folhas);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListaFolhacargaPage');
  }

  ionViewDidEnter() {
    let itens: any[] = [];
    for (let el of this.folhas) {
      console.log('folha_id: ' + el.id);
      //this.total = this.total + parseFloat(el.valor_total);
      this.folhacargaProvider.getPedidos(el.id)
        .then((result: any[]) => {
          //this.pedidos = result; 
          itens.push(result);
          
          /*let pedidos_aux = '';
          for (let p of this.pedidos) {
            pedidos_aux = pedidos_aux + ', ' + p.pedido_id;
          }
          this.pedidos2 = pedidos_aux; */
          console.log('Retorno getPedidos: ' + result);
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos!!!', duration: 3000, position: 'botton' }).present();
      });
    }
    this.pedidos = itens;
    //console.log(this.folhas);
    console.log(this.pedidos);
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
