import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowPedidoPage } from './show-pedido';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ShowPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowPedidoPage),
    PipesModule
  ],
})
export class ShowPedidoPageModule {}
