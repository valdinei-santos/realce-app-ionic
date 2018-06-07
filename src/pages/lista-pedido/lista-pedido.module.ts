import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaPedidoPage } from './lista-pedido';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ListaPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaPedidoPage),
    PipesModule
  ],
})
export class ListaPedidoPageModule {}
