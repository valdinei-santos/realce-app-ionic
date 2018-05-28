import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroTipoPage } from './cadastro-tipo';

@NgModule({
  declarations: [
    CadastroTipoPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroTipoPage),
  ],
})
export class CadastroTipoPageModule {}
