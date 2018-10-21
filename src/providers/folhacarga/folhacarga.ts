import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
import { ToastController } from 'ionic-angular';
import { PedidoProvider } from '../pedido/pedido';

@Injectable()
export class FolhacargaProvider {

  constructor(private dbProvider: DatabaseProvider, 
              public toast: ToastController,
              public pedidoProvider: PedidoProvider) { }

  public getNewId() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select coalesce(max(id),0) + 1 as id from folhas_carga';
        return db.executeSql(sql, [])
          .then((data: any) => {
            return data.rows.item(0).id;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public insert(folhacarga: Folhacarga) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into folhas_carga (id, data, status) values (?, ?, ?)';
        let data = [folhacarga.id, folhacarga.data, folhacarga.status];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public insert_itens(lista_pedidos: any[], folhacarga_id) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        for (let i = 0; i < lista_pedidos.length; i++) {
          let sql = 'insert into folhas_carga_itens (pedido_id, folha_carga_id) values (?, ?)';
          let data = [lista_pedidos[i], folhacarga_id];
          db.executeSql(sql, data)
            .catch((e) => console.error(e));
        }
        return true;
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

  public update_itens(itens: any[], folhacarga_id) {
    this.remove_itens(itens[0].pedido_id);
    this.insert_itens(itens, folhacarga_id);
    return true;
  }

  public update_status(folha_carga_id: number, status: string) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update folhas_carga set status = ? where id = ?';
        let data = [status, folha_carga_id];
        return db.executeSql(sql, data)
      .catch((e) => console.error(e));
    })
    .catch((e) => console.error(e));
  }

  public remove(id: number) {
    let pedidos: any[] = [];
    let listaPedidosExistentes: any[] = [];
    this.getPedidos(id)
      .then((result: any[]) => {
        pedidos = result;
        for (let p of pedidos){
          listaPedidosExistentes.push(p.pedido_id);
        } 
        this.pedidoProvider.update_status(listaPedidosExistentes, 'Pendente');
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar lista de pedidos existentes!!!', duration: 3000, position: 'botton' }).present();
      });
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
        let sql = 'delete from folhas_carga_itens where folha_carga_id = ?';
        let data = [folhacarga_id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT id, data, status 
                     FROM folhas_carga
                    WHERE id = ?`;
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let folhacarga = new Folhacarga();
              folhacarga = data.rows.item(0);
              return folhacarga;
            }
            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public get2(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT p.id, p.data, p.status, p.cliente_id, c.nome as cliente_nome,
                          (select printf("%.2f",sum(valor_total)) as total from pedidos_itens where pedido_id = p.id) as total
                     FROM pedidos p 
                     JOIN clientes c 
                       ON p.cliente_id = c.id
                    WHERE p.id = ?`;
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let folhacarga = new Folhacarga2();
              folhacarga.id = item.id;
              folhacarga.data = item.data;
              folhacarga.status = item.status;
              folhacarga.total = item.total;
              return folhacarga;
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
        let sql = `SELECT id, data, status 
                     FROM folhas_carga
                     ORDER BY data desc`;
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let folhas: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var folha = data.rows.item(i);
                folhas.push(folha);
              }
              return folhas;
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
        let sql = `SELECT id, data, status, sum(total) as total
                    FROM (SELECT f.id, f.data, f.status, i.pedido_id,
                                 (SELECT printf("%.2f",sum(valor_total)) as total 
                                    FROM pedidos_itens 
                                   WHERE pedido_id = i.pedido_id) as total
                          FROM folhas_carga f
                          JOIN folhas_carga_itens i
                            ON f.id = i.folha_carga_id) tab
                    WHERE upper(tab.status) <> 'ENTREGUE'
                    GROUP BY id, data, status
                    ORDER BY data desc`;
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let folhas: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var folha = data.rows.item(i);
                folhas.push(folha);
              }
              return folhas;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getAll2_hist() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT id, data, status, sum(total) as total
                    FROM (SELECT f.id, f.data, f.status, i.pedido_id,
                                 (SELECT printf("%.2f",sum(valor_total)) as total 
                                    FROM pedidos_itens 
                                   WHERE pedido_id = i.pedido_id) as total
                          FROM folhas_carga f
                          JOIN folhas_carga_itens i
                            ON f.id = i.folha_carga_id) tab
                    WHERE upper(tab.status) = 'ENTREGUE'
                      AND data > date('now', '-90 days')
                    GROUP BY id, data, status
                    ORDER BY data desc`;
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let folhas: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var folha = data.rows.item(i);
                folhas.push(folha);
              }
              return folhas;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getAll3() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT f.id, f.data, f.status, i.pedido_id
                     FROM folhas_carga f
                     JOIN folhas_carga_itens i
                       ON f.id = i.folha_carga_id
                    WHERE upper(f.status) = 'PENDENTE' 
                    ORDER BY f.data DESC`;
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let folhas: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var folha = data.rows.item(i);
                folhas.push(folha);
              }
              return folhas;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getItens(folha_carga_id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT id, pedido_id, folha_carga_id 
                     FROM folhas_carga_itens
                    WHERE folha_carga_id = ?
                    ORDER BY pedido_id`;
        let data = [folha_carga_id];
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

  public getPedidos(folha_carga_id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT f.id, f.data, f.status, i.pedido_id, c.nome as cliente_nome
                     FROM folhas_carga f
                     JOIN folhas_carga_itens i
                       ON f.id = i.folha_carga_id
                     JOIN pedidos p
                       ON i.pedido_id = p.id 
                     JOIN clientes c
                       ON p.cliente_id = c.id
                    WHERE i.folha_carga_id = ?
                    ORDER BY i.pedido_id`; 
        let data = [folha_carga_id];
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


export class Folhacarga{
  id: number;
  data: Date;
  status: string;
}

export class Folhacarga2{
  id: number;
  data: Date;
  status: string;
  total: number;
  desconto: number;
}

export class Folhacarga3{
  id: number;
  data: Date;
  status: string;
  pedidos: string;
  total: string;
  desconto: string;
}

export class Item_folhacarga{
  id?: number;
  pedido_id: number;
  folhacarga_id: number;
}


