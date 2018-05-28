import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroMarcaPage } from './cadastro-marca';

@NgModule({
  declarations: [
    CadastroMarcaPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroMarcaPage),
  ],
})
export class CadastroMarcaPageModule {}
