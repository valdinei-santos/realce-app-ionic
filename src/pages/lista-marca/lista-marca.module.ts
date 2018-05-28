import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaMarcaPage } from './lista-marca';

@NgModule({
  declarations: [
    ListaMarcaPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaMarcaPage),
  ],
})
export class ListaMarcaPageModule {}
