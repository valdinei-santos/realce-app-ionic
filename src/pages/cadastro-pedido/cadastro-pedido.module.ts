import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroPedidoPage } from './cadastro-pedido';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { PipesModule } from '../../pipes/pipes.module';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    CadastroPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroPedidoPage),
    SelectSearchableModule,
    PipesModule,
    BrMaskerModule
  ],
})
export class CadastroPedidoPageModule {}
