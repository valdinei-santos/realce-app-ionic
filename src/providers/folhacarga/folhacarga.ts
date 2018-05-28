import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Storage } from '@ionic/storage';
import { Pedido } from '../pedido/pedido';

/*
  Generated class for the FolhacargaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FolhacargaProvider {

  constructor(public http: HttpClient) {
    console.log('Hello FolhacargaProvider Provider');
  }

}



export class Folhacarga{
  id?: number;
  date: string;
  pedidos: Pedido[];
}

export class FolhacargaList {
  key: string;
  folhacarga: Folhacarga;
}

