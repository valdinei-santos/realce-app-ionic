import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaUnidadeVendaPage } from './lista-unidade-venda';

@NgModule({
  declarations: [
    ListaUnidadeVendaPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaUnidadeVendaPage),
  ],
})
export class ListaUnidadeVendaPageModule {}
