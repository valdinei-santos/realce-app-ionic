import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ListaFolhacargaHistPage } from './lista-folhacarga-hist';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ListaFolhacargaHistPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaFolhacargaHistPage),
    PipesModule
  ],
})
export class ListaFolhacargaHistPageModule {}
