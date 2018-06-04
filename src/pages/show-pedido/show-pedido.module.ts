import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowPedidoPage } from './show-pedido';

@NgModule({
  declarations: [
    ShowPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowPedidoPage),
  ],
})
export class ShowPedidoPageModule {}
