import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroPedidoItemPage } from './cadastro-pedido-item';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    CadastroPedidoItemPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroPedidoItemPage),
    BrMaskerModule
  ],
})
export class CadastroPedidoItemPageModule {}
