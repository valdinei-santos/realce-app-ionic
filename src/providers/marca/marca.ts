import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
//import { ProdutoProvider } from '../produto/produto';


@Injectable()
export class MarcaProvider {


  constructor(private dbProvider: DatabaseProvider) {
  }


  public insert(marca: Marca) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into produtos_marca (nome) values (?)';
        let data = [marca.nome];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public update(marca: Marca) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update produtos_marca set nome = ? where id = ?';
        let data = [marca.nome, marca.id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from produtos_marca where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from produtos_marca where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let marca = new Marca();
              marca.id = item.id;
              marca.nome = item.nome;
              return marca;
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
        let sql = 'SELECT * FROM produtos_marca order by nome';
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let marcas: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var marca = data.rows.item(i);
                marcas.push(marca);
              }
              return marcas;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

}


export class Marca{
  id: number;
  nome: string;
}

