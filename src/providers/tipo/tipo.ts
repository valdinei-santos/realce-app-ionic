import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
//import { ProdutoProvider } from '../produto/produto';


@Injectable()
export class TipoProvider {


  constructor(private dbProvider: DatabaseProvider) {
  }


  public insert(tipo: Tipo) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into produtos_tipo (nome) values (?)';
        let data = [tipo.nome];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public update(tipo: Tipo) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update produtos_tipo set nome = ? where id = ?';
        let data = [tipo.nome, tipo.id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from produtos_tipo where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from produtos_tipo where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let tipo = new Tipo();
              tipo.id = item.id;
              tipo.nome = item.nome;
              return tipo;
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
        let sql = 'SELECT * FROM produtos_tipo order by nome';
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let tipos: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var tipo = data.rows.item(i);
                tipos.push(tipo);
              }
              return tipos;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

}


export class Tipo{
  id: number;
  nome: string;
}

