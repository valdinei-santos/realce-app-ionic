import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroVasilhamePage } from './cadastro-vasilhame';

@NgModule({
  declarations: [
    CadastroVasilhamePage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroVasilhamePage),
  ],
})
export class CadastroVasilhamePageModule {}
