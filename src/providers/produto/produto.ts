import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';


@Injectable()
export class ProdutoProvider {

  constructor(private dbProvider: DatabaseProvider 
              //private sqlite: SQLite, 
              //private storage: Storage,
              //private datepipe: DatePipe
              ) {
    console.log('Hello ProdutoProvider Provider');
    //this.carregaLista();

  }


  public insert(produto: Produto) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into produtos (descricao, unidade_id, preco, categoria_id, ativo) values (?, ?, ?, ?, ?)';
        let data = [produto.descricao, produto.unidade_id, produto.preco, produto.categoria_id, produto.ativo];
 
        return db.executeSql(sql, data)
        
      })
      .catch((e) => console.error(e));
  }
 
  public update(produto: Produto) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update produtos set descricao = ?, unidade_id = ?, preco = ?, categoria_id = ? where id = ?';
        let data = [produto.descricao, produto.unidade_id, produto.preco, produto.categoria_id, produto.ativo, produto.id];
 
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from produtos where id = ?';
        let data = [id];
 
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from produtos where id = ?';
        let data = [id];
 
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let produto = new Produto();
              produto.id = item.id;
              produto.descricao = item.descricao;
              produto.unidade_id = item.unidade_id;
              produto.preco = item.preco;
              produto.categoria_id = item.categoria_id;
              produto.ativo = item.ativo;  
              return produto;      
            }
            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public getAll() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT p.*, c.nome as categoria_nome, u.nome as unidade_nome ' +
                    'FROM produtos p ' +
                    'JOIN produtos_categoria c ' +
                    '  on p.categoria_id = c.id ' +
                    'JOIN produtos_unidade u ' +
                    '  on u.id = p.unidade_id';
 
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let produtos: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var produto = data.rows.item(i);
                produtos.push(produto);
              }
              return produtos;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

}


export class Produto{
  id?: number;
  descricao: string;
  unidade_id: number;
  preco: number;
  categoria_id: number;
  ativo: number;
}


