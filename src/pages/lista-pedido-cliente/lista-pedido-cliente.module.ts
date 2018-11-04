import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaPedidoClientePage } from './lista-pedido-cliente';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ListaPedidoClientePage,
  ],
  imports: [
    IonicPageModule.forChild(ListaPedidoClientePage),
    PipesModule
  ],
})
export class ListaPedidoClientePageModule {}
