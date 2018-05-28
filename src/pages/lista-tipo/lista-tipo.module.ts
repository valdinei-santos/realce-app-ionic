import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaTipoPage } from './lista-tipo';

@NgModule({
  declarations: [
    ListaTipoPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaTipoPage),
  ],
})
export class ListaTipoPageModule {}
