import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaProdutoPage } from './lista-produto';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    ListaProdutoPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaProdutoPage),
    PipesModule
  ],
})
export class ListaProdutoPageModule {}
