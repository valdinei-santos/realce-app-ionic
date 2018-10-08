import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { RelatoriosPage } from './relatorios';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    RelatoriosPage,
  ],
  imports: [
    IonicPageModule.forChild(RelatoriosPage),
    PipesModule
  ],
})
export class RelatoriosPageModule {}
