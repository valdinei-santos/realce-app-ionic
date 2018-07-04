import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaFolhacargaPage } from './lista-folhacarga';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ListaFolhacargaPage
  ],
  imports: [
    IonicPageModule.forChild(ListaFolhacargaPage),
    PipesModule
  ],
})
export class ListaFolhacargaPageModule {}
