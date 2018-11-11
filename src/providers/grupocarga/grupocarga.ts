import { Injectable } from '@angular/core';
import { DatabaseProvider } from '../database/database';
import { ProdutoProvider } from '../produto/produto';
import { SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class GrupocargaProvider {

  constructor(private dbProvider: DatabaseProvider,
              private produtoProvider: ProdutoProvider) { }


  public insert(grupo_carga: Grupocarga) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into produtos_grupo_carga (numero, nome) values (?, ?)';
        let data = [grupo_carga.numero, grupo_carga.nome];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public update(grupo_carga: Grupocarga) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update produtos_grupo_carga set numero = ?, nome = ? where id = ?';
        let data = [grupo_carga.numero, grupo_carga.nome, grupo_carga.id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public remove(id: number) {
    return this.produtoProvider.countForeignKey(id, 'grupo_carga')
      .then((result: any) => {
        if (result) {
          return this.dbProvider.getDB()
            .then((db: SQLiteObject) => {
              let sql = 'delete from produtos_grupo_carga where id = ?';
              let data = [id];
              return db.executeSql(sql, data)
                .catch((e) => console.error(e));
            })
            .catch((e) => console.error(e));
         } else {
           return Promise.reject(new Error('fail')).then();
         }
    });
  }
 
  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from produtos_grupo_carga where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let grupo_carga = new Grupocarga();
              grupo_carga.id = item.id;
              grupo_carga.numero = item.numero;
              return grupo_carga;
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
        let sql = 'SELECT * FROM produtos_grupo_carga order by numero';
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let grupos: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var grupo_carga = data.rows.item(i);
                grupos.push(grupo_carga);
              }
              return grupos;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

}


export class Grupocarga{
  id: number;
  numero: number;
  nome: string;
}

