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
                   (/* categoria_id, marca_id, tipo_id, */ nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                   values (/*?, ?, ?, */ ?, ?, ?, ?, ?, ?)`;
        let data = [produto.nome_produto, produto.vasilhame_id, 
                    produto.unidade_venda_id, produto.preco, produto.ativo, produto.observacao];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public update(produto: Produto) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `UPDATE produtos 
                      SET /* categoria_id = ?, marca_id = ?, tipo_id = ?, */ nome_produto = ?, vasilhame_id = ?, unidade_venda_id = ?, 
                          preco = ?, ativo = ?, observacao = ? 
                    WHERE id = ?`;
        let data = [produto.nome_produto, produto.vasilhame_id, produto.unidade_venda_id, 
                    produto.preco, produto.ativo, produto.observacao, produto.id];
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
                          p.vasilhame_id, p.unidade_venda_id, 
                          printf("%.2f",p.preco) as preco,
                          p.ativo, p.observacao,
                          v.nome as vasilhame_nome, u.nome as unidade_venda_nome,
                          p.nome_produto || ' ' || v.nome || ' ' || u.nome as nome_completo
                    FROM produtos p
                    LEFT JOIN produtos_vasilhame v
                      on p.vasilhame_id = v.id
                    LEFT JOIN produtos_unidade_venda u 
                      on p.unidade_venda_id = u.id 
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
              produto.nome_produto = item.nome_produto;
              produto.nome_completo = item.nome_completo;
              produto.preco = item.preco;
              produto.ativo = item.ativo;  
              produto.observacao = item.observacao;
              return produto;      
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
         let sql = `SELECT p.id, p.nome_produto,
                           p.vasilhame_id, p.unidade_venda_id, 
                           printf("%.2f",p.preco) as preco,
                           p.ativo, p.observacao,
                           v.nome as vasilhame_nome, u.nome as unidade_venda_nome,
                           p.nome_produto || ' ' || v.nome || ' ' || u.nome as nome_completo
                    FROM produtos p
                    LEFT JOIN produtos_vasilhame v
                      on p.vasilhame_id = v.id
                    LEFT JOIN produtos_unidade_venda u 
                      on p.unidade_venda_id = u.id 
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

}


export class Produto{
  id: number;
  nome_produto: string;
  unidade_venda_id: number;
  vasilhame_id: number;
  nome_completo: string;
  preco: number;
  ativo: number;
  observacao?: string;
}
