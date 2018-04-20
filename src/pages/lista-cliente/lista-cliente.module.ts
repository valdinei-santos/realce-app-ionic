import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaClientePage } from './lista-cliente';

@NgModule({
  declarations: [
    ListaClientePage,
  ],
  imports: [
    IonicPageModule.forChild(ListaClientePage),
  ],
})
export class ListaClientePageModule {}
