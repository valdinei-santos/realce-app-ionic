import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaCategoriaPage } from './lista-categoria';

@NgModule({
  declarations: [
    ListaCategoriaPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaCategoriaPage),
  ],
})
export class ListaCategoriaPageModule {}
