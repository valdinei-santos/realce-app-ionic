import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroPedidoPage } from './cadastro-pedido';
import { SelectSearchableModule } from 'ionic-select-searchable';

@NgModule({
  declarations: [
    CadastroPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroPedidoPage),
    SelectSearchableModule
  ],
})
export class CadastroPedidoPageModule {}
