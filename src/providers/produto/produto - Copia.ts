import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DatePipe } from '@angular/common';

//import { IProduto } from '../../interfaces/IProduto';
//import { Produto } from '../../models/Produto';


/*
  Generated class for the ProdutoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProdutoProvider {

  lista:any[];
  chave:string = "produto";

  constructor(public http: HttpClient, 
              private sqlite: SQLite, 
              private storage: Storage,
              private datepipe: DatePipe) {
    console.log('Hello ProdutoProvider Provider');
    //this.carregaLista();

  }


  ngOnInit() {
    console.log('ngOnInit ProdutoProvider')
    this.sqlite.create({
      name:'data.db',
      location: 'default'
    })
      .then((db:SQLiteObject)=> {
        db.executeSql('CREATE TABLE produtos(id INTEGER PRIMARY KEY AUTOINCREMENT ,' +
                                            'descricao VARCHAR(40),' + 
                                            'unidade VARCHAR(10), ' +
                                            'preco NUMBER, ' +
                                            'preco_txt VARCHAR(10), ' +
                                            'categoria VARCHAR(40)', {})
        .then(()=> console.log('table create'))
        .catch(e => console.log(e));
      });
  }

  insert(produto: Produto) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject)=> {
      return db.executeSql('insert into produtos (descricao, unidade, preco, preco_txt, categoria) values ' +
                           '('+ produto.descricao + ',' + produto.unidade + ',' + produto.preco + ',' 
                              + produto.preco_txt + ',' + produto.categoria + ')', {});
    })
    .catch(e => console.log(e));  
  }

  update(produto: Produto) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject)=> {
      return db.executeSql('update produtos set descricao = '+ produto.descricao + ',' +
                                               'unidade = '+ produto.unidade + ',' +
                                               'preco = '+ produto.preco + ',' +
                                               'preco_txt = '+ produto.preco_txt + ',' + 
                                               'categoria = '+ produto.categoria + 
                              ' where id = '+ produto.id + ')', {});
    })
    .catch(e => console.log(e));  
  }

  remove(produto: Produto) {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject)=> {
      return db.executeSql('delete from produtos where id = '+ produto.id + ')', {});
    })
    .catch(e => console.log(e));  
  }

  getAll() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject)=> {
      return db.executeSql('select * from produtos', {})
    })
    .then((result)=> {
      for (let i=0; i<result.rows.length; i++) {
        this.lista.push(result.rows.item(i));
      }
    })
    .catch(e => console.log(e));  
  }
 
 /* 

  carregaLista(){
  	this.storage.ready().then(()=>{
      console.log('ProdutoProvider - ready into constructor');
      this.storage.get(this.chave).then((registros) => {
        if(registros){
          this.lista = registros;
		      console.log('ProdutoProvider - registros do Storage');
        }else{
          this.lista = [];
		      console.log('ProdutoProvider - Lista vazia no Storage');
        }
      });
    });
  }

  listar(){
    //alert(this.lista);
    console.log('ProdutoProvider - listar()');
    return this.lista;
  }

  adicionar(registro:any){
    this.storage.ready().then(()=>{
      this.lista.push(registro);
      this.storage.set(this.chave, this.lista);
    });
  }
  
  atualizar(produto, dados){
    for(let chave in this.lista){
      if(this.lista[chave] == produto){
        this.lista[chave]= dados;
        this.storage.set(this.chave, this.lista);
      }
    }
  }
*/





/*
  public insert(produto: Produto) {
    let key = this.datepipe.transform(new Date(), 'ddMMyyyyHHmmss');
    return this.save(key, produto);
  }

  public update(key: string, produto: Produto) {
    return this.save(key, produto);
  }

  private save(key: string, produto: Produto) {
    return this.storage.set(key, produto);
  }

  public remove(key: string) {
    return this.storage.remove(key);
  }

  public getAll() {
    let produtos: ProdutoList[] = [];

    return this.storage.forEach((value: Produto, key: string, itrationNumber: Number) => {
      let produto = new ProdutoList();
      produto.key = key;
      produto.produto = value;
      produtos.push(produto);
    })
      .then(()=> {
        return Promise.resolve(produtos);
      })
      .catch((error)=> {
        return Promise.reject(error);
      });
  }
*/


}


export class Produto{
  id?: number;
  descricao: string;
  unidade: string;
  categoria: string;
  preco: number;
  preco_txt: string;
}

export class ProdutoList {
  key: string;
  produto: Produto;
}
