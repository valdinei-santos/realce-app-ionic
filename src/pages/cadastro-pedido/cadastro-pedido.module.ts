import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroPedidoPage } from './cadastro-pedido';

@NgModule({
  declarations: [
    CadastroPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroPedidoPage),
  ],
})
export class CadastroPedidoPageModule {}
