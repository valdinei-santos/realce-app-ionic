import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
import { ProdutoProvider } from '../produto/produto';


@Injectable()
export class UnidadeVendaProvider {


  constructor(private dbProvider: DatabaseProvider) {
  }


  public insert(unidade_venda: UnidadeVenda) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into produtos_unidade_venda (nome) values (?)';
        let data = [unidade_venda.nome];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public update(unidade_venda: UnidadeVenda) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update produtos_unidade_venda set nome = ? where id = ?';
        let data = [unidade_venda.nome, unidade_venda.id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from produtos_unidade_venda where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from produtos_unidade_venda where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let unidade_venda = new UnidadeVenda();
              unidade_venda.id = item.id;
              unidade_venda.nome = item.nome;
              return unidade_venda;
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
        let sql = 'SELECT * FROM produtos_unidade_venda';
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let unidades: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var unidade_venda = data.rows.item(i);
                unidades.push(unidade_venda);
              }
              return unidades;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

}


export class UnidadeVenda{
  id: number;
  nome: string;
}

