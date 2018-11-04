import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';

@Injectable()
export class PedidoProvider {

constructor(private dbProvider: DatabaseProvider) { }

public insert(pedido: Pedido) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `insert into pedidos (id, cliente_id, data, status, valor_adicional, valor_pago, pago, avista, observacao) 
                     values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let data = [pedido.id, pedido.cliente_id, pedido.data, pedido.status, pedido.valor_adicional, 
                    pedido.valor_pago, pedido.pago, pedido.avista, pedido.observacao];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));

  }


  public insert_itens(itens: any[]) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        for (let item of itens){
          let sql = `insert into pedidos_itens (pedido_id, produto_id, quantidade, valor_unitario, valor_padrao, 
                                                valor_total, valor_total_padrao) 
                          values (?, ?, ?, ?, ?, ?, ?)`;
          let data = [item.pedido_id, item.produto_id, item.quantidade, item.valor_unitario, item.valor_padrao, 
                      item.valor_total, item.valor_total_padrao];
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
        let sql = `update pedidos set cliente_id = ?, data = ?, status = ?, valor_adicional = ?, 
                    valor_pago = ?, pago = ?, avista = ?, observacao = ? where id = ?`;
        let data = [pedido.cliente_id, pedido.data, pedido.status, pedido.valor_adicional, 
                    pedido.valor_pago, pedido.pago, pedido.avista, pedido.observacao, pedido.id];
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

  public update_status(lista_pedidos: number[], status: string) {
    let lista: string = '0';
    for (let el of lista_pedidos) {
      lista = lista +','+el;
    }
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `update pedidos set status = '${status}' where id in (${lista})`;
        let data = [];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public update_pago(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `update pedidos set pago = 1 where id = ?`;
        let data = [id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
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
        let sql = `select id, cliente_id, data, status, 
                          printf("%.2f",valor_adicional) as valor_adicional, 
                          printf("%.2f",valor_pago) as valor_pago,
                          pago, avista, observacao
                     from pedidos where id = ?`;
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let pedido = new Pedido();
              pedido = data.rows.item(0);
              return pedido;
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
        let sql = `SELECT p.id, p.data, p.status, p.cliente_id, c.nome as cliente_nome, c.endereco as cliente_endereco,
                          c.celular as cliente_celular, 
                          printf("%.2f",p.valor_adicional) as valor_adicional, 
                          printf("%.2f",p.valor_pago) as valor_pago,
                          p.pago, p.avista, p.observacao,
                          (select printf("%.2f",sum(valor_total)) as total from pedidos_itens where pedido_id = p.id) as total,
                          (select printf("%.2f",sum(valor_total_padrao)) as total_padrao from pedidos_itens where pedido_id = p.id) as total_padrao
                     FROM pedidos p 
                     JOIN clientes c 
                       ON p.cliente_id = c.id
                    WHERE p.id = ?`;
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let pedido = new Pedido2();
/*               pedido.id = item.id;
              pedido.cliente_id = item.cliente_id;
              pedido.cliente_nome = item.cliente_nome;
              pedido.cliente_endereco = item.cliente_endereco;
              pedido.cliente_celular = item.cliente_celular;
              pedido.data = item.data;
              pedido.status = item.status;
              pedido.total = item.total;
              pedido.valor_adicional = item.valor_adicional;
              pedido.total_padrao = item.total_padrao;
              pedido.pago = item.pago;
              pedido.avista = item.avista;
              pedido.observacao = item.observacao; */
              pedido = item;
              return pedido;
            }
            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getListaPedidos(lista_pedidos: any[]) {
    let lista: string = '0';
    for (let el of lista_pedidos) {
      lista = lista +','+el;
    }
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql =`SELECT * 
                    FROM pedidos 
                   WHERE id in (${lista})
                   ORDER BY id`;
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
  }
 
  public getAll() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT id, cliente_id, data, status, 
                          printf("%.2f",valor_adicional) as valor_adicional, 
                          printf("%.2f",valor_pago) as valor_pago,
                          pago, avista, observacao
                     FROM pedidos order by data desc`;
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
        let sql = `SELECT p.id, p.data, p.status, p.cliente_id, c.nome as cliente_nome, 
                          printf("%.2f",p.valor_adicional) as valor_adicional, 
                          printf("%.2f",p.valor_pago) as valor_pago,
                          p.pago, p.avista, p.observacao,
                          (select printf("%.2f",sum(valor_total)) as total from pedidos_itens where pedido_id = p.id) as total,
                          (select printf("%.2f",sum(valor_total_padrao)) as total_padrao from pedidos_itens where pedido_id = p.id) as total_padrao
                     FROM pedidos p 
                     JOIN clientes c 
                       ON p.cliente_id = c.id
                    WHERE upper(p.status) <> 'ENTREGUE'
                    ORDER BY p.id desc`;              
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

  public getAll2_cliente(cliente_id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT p.id, p.data, p.status, p.cliente_id, c.nome as cliente_nome, 
                          printf("%.2f",p.valor_adicional) as valor_adicional, 
                          printf("%.2f",p.valor_pago) as valor_pago,
                          p.pago, p.avista, p.observacao,
                          (select printf("%.2f",sum(valor_total)) as total from pedidos_itens where pedido_id = p.id) as total,
                          (select printf("%.2f",sum(valor_total_padrao)) as total_padrao from pedidos_itens where pedido_id = p.id) as total_padrao
                     FROM pedidos p 
                     JOIN clientes c 
                       ON p.cliente_id = c.id
                    WHERE p.cliente_id = ?
                      --and upper(p.status) <> 'ENTREGUE'
                    ORDER BY p.id desc`;              
        return db.executeSql(sql, [cliente_id])
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

  public getAll2_hist() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT p.id, p.data, p.status, p.cliente_id, c.nome as cliente_nome, 
                          printf("%.2f",p.valor_adicional) as valor_adicional, 
                          printf("%.2f",p.valor_pago) as valor_pago,
                          p.pago, p.avista, p.observacao,
                          (select printf("%.2f",sum(valor_total)) as total from pedidos_itens where pedido_id = p.id) as total,
                          (select printf("%.2f",sum(valor_total_padrao)) as total_padrao from pedidos_itens where pedido_id = p.id) as total_padrao
                     FROM pedidos p 
                     JOIN clientes c 
                       ON p.cliente_id = c.id
                    WHERE upper(p.status) = 'ENTREGUE'
                      AND p.data > date('now', '-90 days')
                    ORDER BY p.id desc`;              
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

  public getAll_alocado() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT p.id, p.data, p.status, p.cliente_id, c.nome as cliente_nome, 
                          c.endereco as cliente_endereco, c.celular as cliente_celular,
                          printf("%.2f",p.valor_adicional) as valor_adicional, 
                          printf("%.2f",p.valor_pago) as valor_pago, p.pago, p.avista, p.observacao,
                          (select printf("%.2f",sum(valor_total)) as total from pedidos_itens where pedido_id = p.id) as total,
                          (select printf("%.2f",sum(valor_total_padrao)) as total_padrao from pedidos_itens where pedido_id = p.id) as total_padrao
                     FROM pedidos p 
                     JOIN clientes c 
                       ON p.cliente_id = c.id
                    WHERE upper(p.status) = 'ALOCADO'
                    ORDER BY p.id desc`;              
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

  public getAll3() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT p.id, p.data, p.status, p.cliente_id, c.nome as cliente_nome, 
                          printf("%.2f",p.valor_adicional) as valor_adicional, 
                          printf("%.2f",p.valor_pago) as valor_pago, p.pago, p.avista, p.observacao,
                         (select printf("%.2f",sum(valor_total)) as total from pedidos_itens where pedido_id = p.id) as total,
                         ((select printf("%.2f",sum(valor_total)) as total from pedidos_itens where pedido_id = p.id) +
                           p.valor_adicional) as total_geral,
                         (select printf("%.2f",sum(valor_total_padrao)) as total_padrao from pedidos_itens where pedido_id = p.id) as total_padrao
                     FROM pedidos p 
                     JOIN clientes c 
                       ON p.cliente_id = c.id
                    WHERE upper(p.status) = 'PENDENTE' 
                    ORDER BY p.data DESC`;              
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
        let sql =`SELECT i.id, i.pedido_id, i.produto_id, i.quantidade, printf("%.2f",i.valor_unitario) as valor_unitario, 
                         printf("%.2f",i.valor_total) as valor_total, 
                         printf("%.2f",i.valor_total_padrao) as valor_total_padrao, 
                         p.nome_produto || ' ' 
                                        || case when v.nome is null then '' else v.nome || ' ' end  
                                        || case when u.nome is null then '' else u.nome end as nome_produto,
                         c.id as categoria_id,
                         v.nome as nome_vasilhame
                    FROM pedidos_itens i 
                    JOIN produtos p
                      ON i.produto_id = p.id
                    JOIN produtos_categoria c 
                      on p.categoria_id = c.id 
                    LEFT JOIN produtos_vasilhame v
                      on p.vasilhame_id = v.id
                    LEFT JOIN produtos_unidade_venda u
                      on p.unidade_venda_id = u.id
                  WHERE pedido_id = ?
                  ORDER BY c.id, p.nome_produto, v.nome`;
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

  public getAllItens(lista_pedidos: any[]) {
    let lista: string = '0';
    for (let el of lista_pedidos) {
      lista = lista +','+el;
    }
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql =`SELECT p.nome_produto || ' ' 
                                        || case when v.nome is null then '' else v.nome || ' ' end  
                                        || case when u.nome is null then '' else u.nome end as nome_produto,
                         i.produto_id, 
                         sum(i.quantidade) as quantidade, 
                         sum(i.valor_total) as valor, 
                         sum(i.valor_total_padrao) as valor_padrao 
                    FROM pedidos_itens i 
                    JOIN produtos p
                      ON i.produto_id = p.id
                    JOIN produtos_categoria c 
                      on p.categoria_id = c.id
                    LEFT JOIN produtos_vasilhame v
                      on p.vasilhame_id = v.id
                    LEFT JOIN produtos_unidade_venda u
                      on p.unidade_venda_id = u.id
                   WHERE i.pedido_id in (${lista})
                   GROUP BY p.nome_produto || ' ' 
                            || case when v.nome is null then '' else v.nome || ' ' end  
                            || case when u.nome is null then '' else u.nome end,
                            i.produto_id
                   ORDER BY c.id, p.nome_produto, v.nome`;
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
  }

  public getTotalPedido(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT printf("%.2f",sum(valor_total)) as total 
                     FROM pedidos_itens 
                    WHERE pedido_id = ?`;
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              return item.total;
            }
            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getTotalPadraoPedido(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT printf("%.2f",sum(valor_total_padrao) as total 
                     FROM pedidos_itens 
                    WHERE pedido_id = ?`;
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              return item.total;
            }
            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getUltimoValorProduto(cliente_id: number, produto_id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT printf("%.2f",valor_unitario) as valor_unitario 
                     FROM pedidos_itens
                    WHERE pedido_id = (SELECT max(id) FROM pedidos WHERE cliente_id = ?)
                      AND produto_id = ?`;
        let data = [cliente_id, produto_id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let valor = data.rows.item(0) as number;
              return valor;
            }
            return null;
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
  valor_adicional: number;
  valor_pago: number;
  pago: number;
  avista: number;
  observacao: string;
}

export class Pedido2{
  id?: number;
  cliente_id: number;
  cliente_nome: string;
  cliente_endereco: string;
  cliente_celular: string;
  data: Date;
  total?: number;
  total_padrao?: number;
  status: string;
  valor_adicional: number;
  valor_pago: number;
  pago: number;
  avista: number;
  observacao: string;
}

export class Item_pedido{
  id?: number;
  pedido_id: number;
  produto_id: number;
  nome_produto: string;
  quantidade: number;
  valor_unitario: number;
  valor_padrao: number;
  valor_total: number;
  valor_total_padrao: number;
}

export class PedidoAllItens {
  produto_id: number;
  nome_produto: string;
  quantidade: number;
  valor: number;
  valor_padrao: number;
}

export class PedidoAllItens2 {
  produto_id: number;
  nome_produto: string;
  quantidade: number;
  valor: string;
  valor_padrao: string;
}

