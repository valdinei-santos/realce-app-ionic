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
        let sql = 'insert into pedidos (id, cliente_id, data, status) values (?, ?, ?, ?)';
        let data = [pedido.id, pedido.cliente_id, pedido.data, pedido.status];
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
        //let id_ultimo_insert = db.executeSql('SELECT last_insert_rowid()', []) ;
        for (let item of itens){
          let sql = 'insert into pedidos_itens (pedido_id, produto_id, quantidade, valor_unitario, valor_total) values (?, ?, ?, ?, ?)';
          let data = [item.pedido_id, item.produto_id, item.quantidade, item.valor_unitario, item.valor_total];
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
    this.remove_itens(itens[0].pedido_id);
    this.insert_itens(itens);
    return true;
    /* return this.dbProvider.getDB()
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
      .catch((e) => console.error(e)); */
  }


  public remove(id: number) {
    this.remove_itens(id);
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from pedidos where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public remove_itens(pedido_id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from pedidos_itens where pedido_id = ?';
        let data = [pedido_id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public getNewId() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select coalesce(max(id),0) + 1 as id from pedidos';
        return db.executeSql(sql, [])
          .then((data: any) => {
            return data.rows.item(0).id;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        //let sql = "select id, cliente_id, strftime('%d/%m/%Y', data) as data, status from pedidos where id = ?";
        let sql = "select id, cliente_id, data, status from pedidos where id = ?";
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let pedido = new Pedido();
              pedido.id = item.id;
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
        //let sql = "SELECT id, cliente_id, strftime('%d/%m/%Y', data) as data, status FROM pedidos order by data desc";
        let sql = "SELECT id, cliente_id, data, status FROM pedidos order by data desc";
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
        //let sql = `SELECT p.id, strftime('%d/%m/%Y', p.data) as data, p.status, p.cliente_id, c.nome as cliente_nome,
        let sql = `SELECT p.id, p.data, p.status, p.cliente_id, c.nome as cliente_nome,
                         (select printf("%.2f",sum(valor_total)) as total from pedidos_itens where pedido_id = p.id) as total
                     FROM pedidos p 
                     JOIN clientes c 
                       ON p.cliente_id = c.id`;              
        //"SELECT p.id, strftime('%d/%m/%Y', p.data) as data, p.status, p.cliente_id, c.nome as cliente_nome FROM pedidos p join clientes c on p.cliente_id = c.id";
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

  public getItens(pedido_id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        //let sql = "SELECT * FROM pedidos_itens WHERE pedido_id = ?";
        let sql =`SELECT i.id, i.pedido_id, i.produto_id, i.quantidade, printf("%.2f",i.valor_unitario) as valor_unitario, printf("%.2f",i.valor_total) as valor_total, 
                         case when c.nome is null then '' else c.nome||' ' end ||
                         case when m.nome is null then '' else m.nome||' ' end ||
                         case when t.nome is null then '' else t.nome||' ' end ||
                         case when v.nome is null then '' else v.nome||' ' end ||
                         case when u.nome is null then '' else u.nome end  as nome_produto
                    FROM pedidos_itens i 
                    JOIN produtos p
                      ON i.produto_id = p.id
                    JOIN produtos_categoria c 
                      on p.categoria_id = c.id 
                    LEFT JOIN produtos_marca m 
                      on p.marca_id = m.id 
                    LEFT JOIN produtos_tipo t 
                      on p.tipo_id = t.id 
                    LEFT JOIN produtos_vasilhame v
                      on p.vasilhame_id = v.id
                    LEFT JOIN produtos_unidade_venda u
                      on p.unidade_venda_id = u.id
                  WHERE pedido_id = ?`;
        let data = [pedido_id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let itens: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var item = data.rows.item(i);
                itens.push(item);
              }
              return itens;
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
  id: number;
  cliente_id: number;
  data: Date;
  status: string;
  //itens: Produto[];
}

export class Pedido2{
  id?: number;
  cliente_id: number;
  cliente_nome: string;
  data: Date;
  total?: number;
  status: string;
}

export class Item_pedido{
  id?: number;
  pedido_id: number;
  produto_id: number;
  nome_produto: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

