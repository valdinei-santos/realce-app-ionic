import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaPedidoHistPage } from './lista-pedido-hist';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ListaPedidoHistPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaPedidoHistPage),
    PipesModule
  ],
})
export class ListaPedidoHistPageModule {}
