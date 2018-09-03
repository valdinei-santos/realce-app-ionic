import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroPedidoItemPage } from './cadastro-pedido-item';

@NgModule({
  declarations: [
    CadastroPedidoItemPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroPedidoItemPage),
  ],
})
export class CadastroPedidoItemPageModule {}
