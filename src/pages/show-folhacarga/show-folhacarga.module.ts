import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowFolhacargaPage } from './show-folhacarga';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ShowFolhacargaPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowFolhacargaPage),
    PipesModule
  ],
})
export class ShowFolhacargaPageModule {}
