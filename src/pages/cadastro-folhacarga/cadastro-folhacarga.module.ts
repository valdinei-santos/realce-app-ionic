import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroFolhacargaPage } from './cadastro-folhacarga';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CadastroFolhacargaPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroFolhacargaPage),
    PipesModule
  ],
})
export class CadastroFolhacargaPageModule {}
