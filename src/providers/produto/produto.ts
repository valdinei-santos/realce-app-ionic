import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';


@Injectable()
export class ProdutoProvider {

  constructor(private dbProvider: DatabaseProvider) { }

  public insert(produto: Produto) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `INSERT INTO produtos 
                   (/* marca_id, tipo_id, */ nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao, grupo_carga_id) 
                   values (/*?, ?, */ ?,  ?, ?, ?, ?, ?, ?, ?)`;
        let data = [produto.nome_produto, produto.categoria_id, produto.vasilhame_id, 
                    produto.unidade_venda_id, produto.preco, produto.ativo, produto.observacao, produto.grupo_carga_id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public update(produto: Produto) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `UPDATE produtos 
                      SET categoria_id = ?, /* marca_id = ?, tipo_id = ?, */ nome_produto = ?, vasilhame_id = ?, unidade_venda_id = ?, 
                          preco = ?, ativo = ?, observacao = ?, grupo_carga_id = ?
                    WHERE id = ?`;
        let data = [produto.categoria_id, produto.nome_produto, produto.vasilhame_id, produto.unidade_venda_id, 
                    produto.preco, produto.ativo, produto.observacao, produto.grupo_carga_id, produto.id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'delete from produtos where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `SELECT p.id, p.nome_produto,
                          p.vasilhame_id, p.unidade_venda_id, p.categoria_id,
                          printf("%.2f",p.preco) as preco,
                          p.ativo, p.observacao, p.grupo_carga_id,
                          v.nome as vasilhame_nome, 
                          u.nome as unidade_venda_nome,
                          c.nome as categoria_nome,
                          g.numero as grupo_carga_numero,
                          p.nome_produto || ' ' 
                                         || case when v.nome is null then '' else v.nome || ' ' end 
                                         || case when u.nome is null then '' else u.nome end as nome_completo
                    FROM produtos p
                    LEFT JOIN produtos_vasilhame v
                      on p.vasilhame_id = v.id
                    LEFT JOIN produtos_unidade_venda u 
                      on p.unidade_venda_id = u.id 
                    LEFT JOIN produtos_categoria c
                      on p.categoria_id = c.id
                    LEFT JOIN produtos_grupo_carga g
                      on p.grupo_carga_id = g.id
                      WHERE p.id = ?`;
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let produto = new Produto();
              produto.id = item.id;
              produto.vasilhame_id = item.vasilhame_id;
              produto.unidade_venda_id = item.unidade_venda_id;
              produto.categoria_id = item.categoria_id;
              produto.nome_produto = item.nome_produto;
              produto.nome_completo = item.nome_completo;
              produto.preco = item.preco;
              produto.ativo = item.ativo;  
              produto.observacao = item.observacao;
              produto.grupo_carga_id = item.grupo_carga_id;
              return produto;      
            }
            return null;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public count_produtos() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select count(*) as qtd_produtos from produtos';
        return db.executeSql(sql, [])
          .then((data: any) => {
            return data.rows.item(0);
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getAll() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
         let sql = `SELECT p.id, p.nome_produto,
                           p.vasilhame_id, p.unidade_venda_id, p.categoria_id,
                           printf("%.2f",p.preco) as preco,
                           p.ativo, p.observacao, p.grupo_carga_id,
                           v.nome as vasilhame_nome, 
                           u.nome as unidade_venda_nome,
                           c.nome as categoria_nome,
                           g.numero as grupo_carga_numero,
                           p.nome_produto || ' ' 
                                          || case when v.nome is null then '' else v.nome || ' ' end  
                                          || case when u.nome is null then '' else u.nome end as nome_completo
                    FROM produtos p
                    LEFT JOIN produtos_vasilhame v
                      on p.vasilhame_id = v.id
                    LEFT JOIN produtos_unidade_venda u 
                      on p.unidade_venda_id = u.id 
                    LEFT JOIN produtos_categoria c
                      on p.categoria_id = c.id
                    LEFT JOIN produtos_grupo_carga g
                      on p.grupo_carga_id = g.id
                    ORDER BY p.nome_produto`;  
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let produtos: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var produto = data.rows.item(i);
                produtos.push(produto);
              }
              return produtos;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  // VER DEPOIS - NAO DEU POR CAUSA DA BUSCA NA PAGINA DE LISTAR PRODUTOS
  public getAll_page(inicio: number, fim: number) {
    console.log('getAll_page');
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
         let sql = `SELECT p.id, p.nome_produto,
                           p.vasilhame_id, p.unidade_venda_id, p.categoria_id,
                           printf("%.2f",p.preco) as preco,
                           p.ativo, p.observacao, p.grupo_carga_id,
                           v.nome as vasilhame_nome, 
                           u.nome as unidade_venda_nome,
                           c.nome as categoria_nome,
                           g.numero as grupo_carga_numero,
                           p.nome_produto || ' ' 
                                          || case when v.nome is null then '' else v.nome || ' ' end  
                                          || case when u.nome is null then '' else u.nome end as nome_completo
                     FROM produtos p
                     LEFT JOIN produtos_vasilhame v
                       on p.vasilhame_id = v.id
                     LEFT JOIN produtos_unidade_venda u 
                       on p.unidade_venda_id = u.id 
                     LEFT JOIN produtos_categoria c
                       on p.categoria_id = c.id
                     LEFT JOIN produtos_grupo_carga g
                       on p.grupo_carga_id = g.id
                     ORDER BY p.nome_produto
                     LIMIT ?, ?`;  
        return db.executeSql(sql, [inicio, fim])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let produtos: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var produto = data.rows.item(i);
                produtos.push(produto);
              }
              return produtos;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }


  public getAllCerveja() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
         let sql = `SELECT p.id, p.nome_produto,
                           p.vasilhame_id, p.unidade_venda_id, p.categoria_id,
                           printf("%.2f",p.preco) as preco,
                           p.ativo, p.observacao, p.grupo_carga_id,
                           v.nome as vasilhame_nome, 
                           u.nome as unidade_venda_nome,
                           c.nome as categoria_nome,
                           g.numero as grupo_carga_numero,
                           p.nome_produto || ' ' 
                                          || case when v.nome is null then '' else v.nome || ' ' end  
                                          || case when u.nome is null then '' else u.nome end as nome_completo
                    FROM produtos p
                    LEFT JOIN produtos_vasilhame v
                      on p.vasilhame_id = v.id
                    LEFT JOIN produtos_unidade_venda u 
                      on p.unidade_venda_id = u.id 
                    LEFT JOIN produtos_categoria c
                      on p.categoria_id = c.id
                    LEFT JOIN produtos_grupo_carga g
                      on p.grupo_carga_id = g.id
                    WHERE c.id = 1  -- Cervejas
                    ORDER BY p.nome_produto`;  
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let produtos: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var produto = data.rows.item(i);
                produtos.push(produto);
              }
              return produtos;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getAllRefri() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
         let sql = `SELECT p.id, p.nome_produto,
                           p.vasilhame_id, p.unidade_venda_id, p.categoria_id,
                           printf("%.2f",p.preco) as preco,
                           p.ativo, p.observacao, p.grupo_carga_id,
                           v.nome as vasilhame_nome, 
                           u.nome as unidade_venda_nome,
                           c.nome as categoria_nome,
                           g.numero as grupo_carga_numero,
                           p.nome_produto || ' ' 
                                          || case when v.nome is null then '' else v.nome || ' ' end  
                                          || case when u.nome is null then '' else u.nome end as nome_completo
                      FROM produtos p
                      LEFT JOIN produtos_vasilhame v
                        on p.vasilhame_id = v.id
                      LEFT JOIN produtos_unidade_venda u 
                        on p.unidade_venda_id = u.id
                      LEFT JOIN produtos_categoria c
                        on p.categoria_id = c.id 
                      LEFT JOIN produtos_grupo_carga g
                        on p.grupo_carga_id = g.id
                     WHERE c.id not in (1,3) -- Refri e Similares, Descartaveis e Outros cadastrados
                    ORDER BY p.nome_produto`;  
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let produtos: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var produto = data.rows.item(i);
                produtos.push(produto);
              }
              return produtos;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getAllDestilados() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
         let sql = `SELECT p.id, p.nome_produto,
                           p.vasilhame_id, p.unidade_venda_id, p.categoria_id,
                           printf("%.2f",p.preco) as preco,
                           p.ativo, p.observacao, p.grupo_carga_id,
                           v.nome as vasilhame_nome, 
                           u.nome as unidade_venda_nome,
                           c.nome as categoria_nome,
                           g.numero as grupo_carga_numero,
                           p.nome_produto || ' ' 
                                        || case when v.nome is null then '' else v.nome || ' ' end  
                                        || case when u.nome is null then '' else u.nome end as nome_completo
                    FROM produtos p
                    LEFT JOIN produtos_vasilhame v
                      on p.vasilhame_id = v.id
                    LEFT JOIN produtos_unidade_venda u 
                      on p.unidade_venda_id = u.id 
                    LEFT JOIN produtos_categoria c
                      on p.categoria_id = c.id
                    LEFT JOIN produtos_grupo_carga g
                      on p.grupo_carga_id = g.id
                    WHERE c.id = 3 -- Destilados 
                    ORDER BY p.nome_produto`;  
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let produtos: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var produto = data.rows.item(i);
                produtos.push(produto);
              }
              return produtos;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public countForeignKey(id: number, tipo: string) {
    let sql: string; 
    if (tipo == 'vasilhame') {
      sql = 'select count(*) as qtd from produtos where vasilhame_id = ?';
    } else if (tipo == 'unidade_venda'){
      sql = 'select count(*) as qtd from produtos where unidade_venda_id = ?';
    } else if (tipo == 'categoria') {
      sql = 'select count(*) as qtd from produtos where categoria_id = ?';
    } else if (tipo == 'grupo_carga') {
      sql = 'select count(*) as qtd from produtos where grupo_carga_id = ?';
    }
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        //let sql = 'select count(*) as qtd from produtos where unidade_venda_id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .then((result: any) => {
            console.log(result.rows.item(0).qtd);
              if (result.rows.item(0).qtd == 0) {
                return true;
              } else {
                return false;
              }
              //console.log(result.rows.item(0).qtd);
              //return Promise.resolve(result.rows.item(0).qtd);

          });
      });



/*               return this.dbProvider.getDB()
                .then((db: SQLiteObject) => {
                  let sql2 = 'delete from produtos_unidade_venda where id = ?';
                  let data2 = [id];
                  return db.executeSql(sql2, data2)
                    .catch((e) => console.error(e));
                })
                .catch((e) => console.error(e));
            }
          })
          .catch((e) => console.error(e));
      }) */
  }



}


export class Produto{
  id: number;
  nome_produto: string;
  categoria_id: number;
  unidade_venda_id: number;
  vasilhame_id?: number;
  nome_completo: string;
  preco: number;
  ativo: number;
  observacao?: string;
  grupo_carga_id: number;
}
