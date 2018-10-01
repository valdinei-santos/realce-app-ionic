import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';  // Incluido para funcionar o LOCALE_ID 'pt-BR' e o PIPE de data.
import localePtBr from '@angular/common/locales/pt';     // Incluido para funcionar o LOCALE_ID 'pt-BR' e o PIPE de data.
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';

import { SelectSearchableModule } from 'ionic-select-searchable';
import { EmailComposer } from '@ionic-native/email-composer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicStorageModule } from '@ionic/storage';
import { ClienteProvider } from '../providers/cliente/cliente';
import { ProdutoProvider } from '../providers/produto/produto';
import { PedidoProvider } from '../providers/pedido/pedido';
import { FolhacargaProvider } from '../providers/folhacarga/folhacarga';
import { DatabaseProvider } from '../providers/database/database';
import { CategoriaProvider } from '../providers/categoria/categoria';
import { UnidadeVendaProvider } from '../providers/unidade-venda/unidade-venda';
import { VasilhameProvider } from '../providers/vasilhame/vasilhame';

import { CadastroClientePageModule } from '../pages/cadastro-cliente/cadastro-cliente.module';
import { ListaClientePageModule } from '../pages/lista-cliente/lista-cliente.module';
import { CadastroProdutoPageModule } from '../pages/cadastro-produto/cadastro-produto.module';
import { ListaProdutoPageModule } from '../pages/lista-produto/lista-produto.module';
import { CadastroPedidoPageModule } from '../pages/cadastro-pedido/cadastro-pedido.module';
import { ListaPedidoPageModule } from '../pages/lista-pedido/lista-pedido.module';
import { ShowPedidoPageModule } from '../pages/show-pedido/show-pedido.module';
import { CadastroFolhacargaPageModule } from '../pages/cadastro-folhacarga/cadastro-folhacarga.module';
import { ListaFolhacargaPageModule } from '../pages/lista-folhacarga/lista-folhacarga.module';
import { ShowFolhacargaPageModule } from '../pages/show-folhacarga/show-folhacarga.module';
import { PreviewFolhacargaPageModule } from '../pages/preview-folhacarga/preview-folhacarga.module';
import { CadastroCategoriaPageModule } from '../pages/cadastro-categoria/cadastro-categoria.module';
import { CadastroUnidadeVendaPageModule } from '../pages/cadastro-unidade-venda/cadastro-unidade-venda.module';
import { CadastroVasilhamePageModule } from '../pages/cadastro-vasilhame/cadastro-vasilhame.module';
import { CadastroPedidoItemPageModule } from '../pages/cadastro-pedido-item/cadastro-pedido-item.module';

registerLocaleData(localePtBr);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    BrMaskerModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
	  IonicStorageModule.forRoot(),
    HttpClientModule,
    SelectSearchableModule,
	  ListaClientePageModule,
    //EditClientePageModule,
    ListaProdutoPageModule,
    ListaPedidoPageModule,
    ListaFolhacargaPageModule,
    PreviewFolhacargaPageModule,
    ShowFolhacargaPageModule,
    ShowPedidoPageModule,
    CadastroProdutoPageModule,
    CadastroPedidoPageModule,
    CadastroFolhacargaPageModule,
    CadastroCategoriaPageModule,
    CadastroVasilhamePageModule,
    CadastroUnidadeVendaPageModule,
    CadastroClientePageModule,
    CadastroPedidoItemPageModule,
    // DirectivesModule,
    

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EmailComposer,
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    DatePipe,
    DecimalPipe,
    ClienteProvider,
    ProdutoProvider,
    PedidoProvider,
    FolhacargaProvider,
    DatabaseProvider,
    CategoriaProvider,
    UnidadeVendaProvider,
    VasilhameProvider,
    File,
    FileOpener,
  ]
})
export class AppModule {}
