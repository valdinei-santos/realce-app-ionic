import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroPedidoPage } from './cadastro-pedido';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    CadastroPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroPedidoPage),
    SelectSearchableModule,
    PipesModule
  ],
})
export class CadastroPedidoPageModule {}
