import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaPedidoPage } from './lista-pedido';

@NgModule({
  declarations: [
    ListaPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaPedidoPage),
  ],
})
export class ListaPedidoPageModule {}
