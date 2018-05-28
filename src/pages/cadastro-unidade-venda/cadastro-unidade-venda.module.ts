import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroUnidadeVendaPage } from './cadastro-unidade-venda';

@NgModule({
  declarations: [
    CadastroUnidadeVendaPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroUnidadeVendaPage),
  ],
})
export class CadastroUnidadeVendaPageModule {}
