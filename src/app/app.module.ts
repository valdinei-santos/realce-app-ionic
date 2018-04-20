import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { DatePipe } from '@angular/common';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CadastroClientePageModule } from '../pages/cadastro-cliente/cadastro-cliente.module';
import { ListaClientePageModule } from '../pages/lista-cliente/lista-cliente.module';
//import { EditClientePageModule } from '../pages/edit-cliente/edit-cliente.module';
import { CadastroProdutoPageModule } from '../pages/cadastro-produto/cadastro-produto.module';
import { ListaProdutoPageModule } from '../pages/lista-produto/lista-produto.module';
import { CadastroPedidoPageModule } from '../pages/cadastro-pedido/cadastro-pedido.module';
import { ListaPedidoPageModule } from '../pages/lista-pedido/lista-pedido.module';
import { CadastroFolhacargaPageModule } from '../pages/cadastro-folhacarga/cadastro-folhacarga.module';
import { ListaFolhacargaPageModule } from '../pages/lista-folhacarga/lista-folhacarga.module';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import { ClienteProvider } from '../providers/cliente/cliente';
import { ProdutoProvider } from '../providers/produto/produto';
import { PedidoProvider } from '../providers/pedido/pedido';
import { FolhacargaProvider } from '../providers/folhacarga/folhacarga';
import { DatabaseProvider } from '../providers/database/database';
import { CategoriaProvider } from '../providers/categoria/categoria';
import { UnidadeProvider } from '../providers/unidade/unidade';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
	  IonicStorageModule.forRoot(),
	  HttpClientModule,
	  CadastroClientePageModule,
	  ListaClientePageModule,
    //EditClientePageModule,
    CadastroProdutoPageModule,
    ListaProdutoPageModule,
    CadastroPedidoPageModule,
    ListaPedidoPageModule,
    CadastroFolhacargaPageModule,
    ListaFolhacargaPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: LOCALE_ID, useValue: 'pt-BR'},
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    DatePipe,
    ClienteProvider,
    ProdutoProvider,
    PedidoProvider,
    FolhacargaProvider,
    DatabaseProvider,
    CategoriaProvider,
    UnidadeProvider
  ]
})
export class AppModule {}
