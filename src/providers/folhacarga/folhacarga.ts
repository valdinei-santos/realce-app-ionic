import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';
import { ToastController } from 'ionic-angular';
import { Pedido2, PedidoProvider } from '../pedido/pedido';
import { resolveDefinition } from '../../../node_modules/@angular/core/src/view/util';

@Injectable()
export class FolhacargaProvider {

  private pedidos2: Pedido2[] = [];

  constructor(private dbProvider: DatabaseProvider, 
              public toast: ToastController,
              public pedidoProvider: PedidoProvider) {
    console.log('Hello FolhacargaProvider Provider');
  }

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
        /* for (let item of itens){
          let sql = 'insert into folhas_carga_itens (pedido_id, folha_carga_id) values (?, ?)';
          let data = [item.pedido_id, folhacarga_id];
          db.executeSql(sql, data)
            .catch((e) => console.error(e));
        } */
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
        //let data = [];
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
        console.log('LISTA PEDIDOS EXISTENTES: ' + listaPedidosExistentes);
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
    console.log('fohacarga - get - ' + id);
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        //let sql = "select id, cliente_id, strftime('%d/%m/%Y', data) as data, status from pedidos where id = ?";
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
        //let sql = "select id, cliente_id, strftime('%d/%m/%Y', data) as data, status from pedidos where id = ?";
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

/*   getPedidosDaFolhacarga(folha_id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getPedidos(folha_id)
      .then((result: any[]) => {
        this.pedidos2 = result;    
        console.log('Pedidos2 loadPedidosDaFolhacarga da folhacarga.ts ' + this.pedidos2); 
        //return this.pedidos2;
        return resolve(this.pedidos2);
      })
      .catch(() => {
        console.log('Erro metodo getPedidosDaFolhacarga - folhacarga.ts');
      });
    })
  }   */
    /* this.getPedidos(folha_id)
      .then((result: any[]) => {
        this.pedidos2 = result;    
        console.log('Pedidos2 loadPedidosDaFolhacarga da folhacarga.ts ' + this.pedidos2); 
        //return this.pedidos2;
        return Promise.resolve(this.pedidos2);
      })
      .catch(() => {
        this.toast.create({ message: 'Erro ao carregar pedidos da Folhacarga!!!', duration: 3000, position: 'botton' }).present();
      }); */

 /*  login(): Promise<{ firstname: string}> {
    return new Promise((resolve, reject) => {
      this.getUsers().then(data => {
        this.films = data;
        resolve(this.films.customer_info);
      });
    });
  } */
  

  public getPedidos(folha_carga_id: number) {
    console.log(folha_carga_id);
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

        /* let sql = `SELECT f.id, f.data, f.status, i.pedido_id
                     FROM folhas_carga f
                     JOIN folhas_carga_itens i
                       ON f.id = i.folha_carga_id
                    WHERE i.folha_carga_id = ?`; */
/*                     `SELECT pedido_id, folha_carga_id 
                     FROM folhas_carga_itens
                    WHERE folha_carga_id = ?`; */  
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


  /* public getAllItens(lista_folhas: any[]) {
    let lista: string = '0';
    for (let el of lista_folhas) {
      //this.total = this.total + parseFloat(el.valor_total);
      lista = lista +','+el;
    }
    let lista2: number = 1;
    console.log('lista Folhas in AllItens: '+ lista);
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        //let sql = "SELECT * FROM pedidos_itens WHERE pedido_id = ?";
        let sql =`SELECT id, pedido_id, folha_carga_id 
                    FROM folhas_carga f
                    JOIN folhas_carga_itens i
                      ON f.id = i.folhas_carga_id
                   WHERE i.folha_carga_id = in (${lista})
                   GROUP BY i.folha_carga_id 
       
       SELECT case when c.nome is null then '' else c.nome||' ' end ||
                         case when m.nome is null then '' else m.nome||' ' end ||
                         case when t.nome is null then '' else t.nome||' ' end ||
                         case when v.nome is null then '' else v.nome||' ' end ||
                         case when u.nome is null then '' else u.nome end  as nome_produto,
                         i.produto_id, sum(i.quantidade) as quantidade, sum(i.valor_total) as valor
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
                   WHERE i.pedido_id in (${lista})
                   GROUP BY case when c.nome is null then '' else c.nome||' ' end ||
                            case when m.nome is null then '' else m.nome||' ' end ||
                            case when t.nome is null then '' else t.nome||' ' end ||
                            case when v.nome is null then '' else v.nome||' ' end ||
                            case when u.nome is null then '' else u.nome end,
                            i.produto_id`;
        //let data = [lista];
        //console.log(sql);
        return db.executeSql(sql, [])
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
  } */


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
}

export class Folhacarga3{
  id: number;
  data: Date;
  status: string;
  pedidos: string;
  total: string;
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

