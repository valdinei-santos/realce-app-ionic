import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { Device } from '@ionic-native/device';

import { ListaPedidoPage} from '../lista-pedido/lista-pedido';
import { ListaProdutoPage} from '../lista-produto/lista-produto';
import { ListaClientePage} from '../lista-cliente/lista-cliente';
import { ListaFolhacargaPage} from '../lista-folhacarga/lista-folhacarga';
import { RelatoriosPage } from '../relatorios/relatorios';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  seriais = ['e98142f3e4f30e4e',  // Emulador
             '8e31f763c754e0ab',  // Moto G4 Valdinei
            ];
  uuid: string = '';
  
  constructor(public navCtrl: NavController,
              private device: Device,
              private platform: Platform,
              public alertCtrl: AlertController,) { }

  ionViewDidLoad() {
    this.uuid = this.device.uuid;
    console.log('Device UUID is: ' + this.uuid);
    /* if (this.device.uuid === 'e98142f3e4f30e4e' ||  // Emulador
        this.device.uuid === '8e31f763c754e0ab'     // Moto G4 Valdinei
       ) { */
    if (this.seriais.find(element => element == this.uuid)) {
      console.log('APP validado.');
    } else {
      //this.platform.exitApp();
      const alert = this.alertCtrl.create({
        title: 'RealceApp',
        message: 'Serial não permitido!!!',
        buttons: [{ text: 'OK',
                    role: 'cancel',
                    handler: () => {
                      this.platform.exitApp();
                    }
                  },
                  { text: 'Fechar',
                    handler: () => {
                      this.platform.exitApp();
                    }
                  }
                 ]
      });
      alert.present();
      console.log('Serial inválido.');
    }
  }

  pedidos(){
    this.navCtrl.push(ListaPedidoPage);
  }

  produtos(){
    this.navCtrl.push(ListaProdutoPage);
  }

  clientes(){
    this.navCtrl.push(ListaClientePage);
  }

  folhasCarga(){
    this.navCtrl.push(ListaFolhacargaPage);
  }

  relatorios(){
    this.navCtrl.push(RelatoriosPage);
  }

}
