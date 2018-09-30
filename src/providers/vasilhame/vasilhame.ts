import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
import { ProdutoProvider } from '../produto/produto';


@Injectable()
export class VasilhameProvider {

  constructor(private dbProvider: DatabaseProvider,
              private produtoProvider: ProdutoProvider) { }


  public insert(vasilhame: Vasilhame) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into produtos_vasilhame (nome) values (?)';
        let data = [vasilhame.nome];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public update(vasilhame: Vasilhame) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update produtos_vasilhame set nome = ? where id = ?';
        let data = [vasilhame.nome, vasilhame.id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
/*   public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        console.log(id);
        let sql = 'delete from produtos_vasilhame where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  } */


  public remove(id: number) {
    return this.produtoProvider.countForeignKey(id, 'vasilhame')
      .then((result: any) => {
        if (result) {
          return this.dbProvider.getDB()
            .then((db: SQLiteObject) => {
              let sql = 'delete from produtos_vasilhame where id = ?';
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
        let sql = 'select * from produtos_vasilhame where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let vasilhame = new Vasilhame();
              vasilhame.id = item.id;
              vasilhame.nome = item.nome;
              return vasilhame;
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
        let sql = 'SELECT * FROM produtos_vasilhame order by nome';
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let vasilhames: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var vasilhame = data.rows.item(i);
                vasilhames.push(vasilhame);
              }
              return vasilhames;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

}


export class Vasilhame{
  id: number;
  nome: string;
}

