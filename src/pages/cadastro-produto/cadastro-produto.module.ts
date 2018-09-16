import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroProdutoPage } from './cadastro-produto';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    CadastroProdutoPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroProdutoPage),
    BrMaskerModule
  ],
})
export class CadastroProdutoPageModule {}
