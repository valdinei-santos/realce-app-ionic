import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

//import { ICliente } from '../../interfaces/ICliente';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  clientes: Cliente[];
  
  constructor(public navCtrl: NavController, public clienteProvider:ClienteProvider) {
    //this.clientes = this.clienteProvider.listar();
  }

}
