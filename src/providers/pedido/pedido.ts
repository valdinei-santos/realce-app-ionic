import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
//import { DatePipe } from '@angular/common';

//import { Cliente } from '../cliente/cliente';


@Injectable()
export class PedidoProvider {

  constructor(private dbProvider: DatabaseProvider
              //private datepipe: DatePipe
            ) {
    console.log('Hello PedidoProvider Provider');
  }


public insert(pedido: Pedido) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into pedidos (cliente_id, data, status) values (?, ?, ?)';
        let data = [pedido.cliente_id, pedido.data, pedido.status];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
 
       /*
	   last_insert_rowid()  --> pegar o ID do autoincrement
	   
          .then((data: any) => {
            console.log("Inserted row 1: ", data);
            let sql = 'insert into pedidos_itens (pedido_id, produto_id, quantidade, valor_unitario, valor_total) values (?, ?, ?, ?, ?)';
            let data = [data.rows.id, pedido.data, pedido.status];
            return db.executeSql(sql, data)
          .catch((e) => console.error(e));
          })
        */

      })
      .catch((e) => console.error(e));

  }


  public insert_itens(itens: any[]) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let id_ultimo_insert = db.executeSql('SELECT last_insert_rowid()', []) ;
        for (let item of itens){
          let sql = 'insert into pedidos_itens (pedido_id, produto_id, quantidade, valor_unitario, valor_total) values (?, ?, ?, ?, ?)';
          let data = [id_ultimo_insert, item.produto_id, item.quantidade, item.valor_unitario, item.valor_total];
          db.executeSql(sql, data)
            .catch((e) => console.error(e));
        }
        return;
      })
      .catch((e) => console.error(e));

  }

 
  public update(pedido: Pedido) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update pedidos set cliente_id = ?, data = ?, status = ? where id = ?';
        let data = [pedido.cliente_id, pedido.data, pedido.status, pedido.id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 

 public update_itens(itens: any[]) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        for (let item of itens){
          let sql = 'update pedidos_itens set pedido_id = ?, produto_id = ?, quantidade = ?, valor_unitario = ?, valor_total = ? where id = ?';
          let data = [item.pedido_id, item.produto_id, item.quantidade, item.valor_unitario, item.valor_total, item.id];
          db.executeSql(sql, data)
            .catch((e) => console.error(e));
        //return db.executeSql(sql, data)  
        } 
        return;  
      })
      .catch((e) => console.error(e));
  }


  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from pedidos where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from pedidos where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let pedido = new Pedido();
              //pedido.id = item.id;
              pedido.cliente_id = item.cliente_id;
              pedido.data = item.data;
              pedido.status = item.status;
              return pedido;
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
        let sql = 'SELECT * FROM pedidos order by data desc';
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let pedidos: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var pedido = data.rows.item(i);
                pedidos.push(pedido);
              }
              return pedidos;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getAll2() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT p.id, p.data, p.status, p.cliente_id, c.nome as cliente_nome FROM pedidos p join clientes c on p.cliente_id = c.id';
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let pedidos: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var pedido = data.rows.item(i);
                pedidos.push(pedido);
              }
              return pedidos;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }



}




export class Pedido{
  id?: number;
  cliente_id: number;
  data: string;
  status: string;
  //itens: Produto[];
}

export class Pedido2{
  id?: number;
  cliente_id: number;
  cliente_nome: string;
  data: string;
  status: string;
}

export class Item_pedido{
  id?: number;
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

