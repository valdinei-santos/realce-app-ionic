import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatabaseProvider } from '../providers/database/database';

//import { HomePage } from '../pages/home/home';
//import { CadastroClientePage } from '../pages/cadastro-cliente/cadastro-cliente';
import { ListaClientePage } from '../pages/lista-cliente/lista-cliente';

import { ListaProdutoPage } from '../pages/lista-produto/lista-produto';
import { ListaPedidoPage } from '../pages/lista-pedido/lista-pedido';
import { ListaFolhacargaPage } from '../pages/lista-folhacarga/lista-folhacarga';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = ListaPedidoPage;
  rootPage: any = null;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public dbProvider: DatabaseProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Clientes', component: ListaClientePage },
      { title: 'Folha de Carga', component: ListaFolhacargaPage },     
      { title: 'Pedidos', component: ListaPedidoPage },
      { title: 'Produtos', component: ListaProdutoPage },

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      //this.splashScreen.hide();

      //Criando o banco de dados
      this.dbProvider.createDatabase()
        .then(() => {
          // fechando a SplashScreen somente quando o banco for criado
          this.openHomePage(this.splashScreen);
        })
        .catch(() => {
          // ou se houver erro na criação do banco
          this.openHomePage(this.splashScreen);
        });

    });
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  

  private openHomePage(splashScreen: SplashScreen) {
    splashScreen.hide();
    this.rootPage = ListaPedidoPage;
  }
}
