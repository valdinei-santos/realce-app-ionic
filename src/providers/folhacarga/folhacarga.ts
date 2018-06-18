import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
//import { Pedido } from '../pedido/pedido';

@Injectable()
export class FolhacargaProvider {

  constructor(private dbProvider: DatabaseProvider) {
    console.log('Hello FolhacargaProvider Provider');
  }


  public insert(folhacarga: Folhacarga) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into folhas_carga (data, status) values (?, ?)';
        let data = [folhacarga.data, folhacarga.status];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public insert_itens(itens: any[]) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        for (let item of itens){
          let sql = 'insert into folhas_carga_itens (pedido_id, folhacarga_id) values (?, ?)';
          let data = [item.pedido_id, item.folhacarga_id];
          db.executeSql(sql, data)
            .catch((e) => console.error(e));
        }
        return;
      })
      .catch((e) => console.error(e));
  }

  public update(folhacarga: Folhacarga) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update folhas_carga set data = ?, status = ? where id = ?';
        let data = [folhacarga.data, folhacarga.status];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public update_itens(itens: any[]) {
    this.remove_itens(itens[0].pedido_id);
    this.insert_itens(itens);
    return true;
  }

  public remove(id: number) {
    this.remove_itens(id);
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from folhas_carga where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public remove_itens(folhacarga_id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from folhas_carga_itens where folhacarga_id = ?';
        let data = [folhacarga_id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }


}


export class Folhacarga{
  id: number;
  data: Date;
  status: string;
}

export class Item_folhacarga{
  id?: number;
  pedido_id: number;
  folhacarga_id: number;
}

/* export class Folhacarga{
  id?: number;
  date: string;
  pedidos: Pedido[];
} 

export class FolhacargaList {
  key: string;
  folhacarga: Folhacarga;
}
*/
