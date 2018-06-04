import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';


@Injectable()
export class ProdutoProvider {

  constructor(private dbProvider: DatabaseProvider 
              //private sqlite: SQLite, 
              //private storage: Storage,
              //private datepipe: DatePipe
              ) {
    console.log('Hello ProdutoProvider Provider');
    //this.carregaLista();

  }


  public insert(produto: Produto) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = `INSERT INTO produtos 
                   (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                   values (?, ?, ?, ?, ?, ?, ?, ?)`;
        let data = [produto.categoria_id, produto.marca_id, produto.tipo_id, produto.vasilhame_id, 
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
                      SET categoria_id = ?, marca_id = ?, tipo_id = ?, vasilhame_id = ?, unidade_venda_id = ?, 
                          preco = ?, ativo = ?, observacao = ? 
                    WHERE id = ?`;
        let data = [produto.categoria_id, produto.marca_id, produto.tipo_id, produto.vasilhame_id, 
                    produto.unidade_venda_id, produto.preco, produto.ativo, produto.observacao, produto.id];
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
        let sql = `SELECT p.id, p.categoria_id, p.marca_id, p.tipo_id, p.vasilhame_id, p.unidade_venda_id, 
                          printf("%.2f",sum(p.preco)) as preco,
                          p.ativo, p.observacao, 
                          c.nome as categoria_nome, m.nome as marca_nome, t.nome as tipo_nome, 
                          v.nome as vasilhame_nome, u.nome as unidade_venda_nome,
                          case when c.nome is null then '' else c.nome||' ' end ||
                          case when m.nome is null then '' else m.nome||' ' end ||
                          case when t.nome is null then '' else t.nome||' ' end ||
                          case when v.nome is null then '' else v.nome||' ' end ||
                          case when u.nome is null then '' else u.nome end  as nome_produto
                     FROM produtos p
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
                     WHERE p.id = ?`;
        //let sql2 = 'SELECT * FROM produtos WHERE id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              let item = data.rows.item(0);
              let produto = new Produto();
              produto.id = item.id;
              produto.categoria_id = item.categoria_id;
              produto.marca_id = item.marca_id;
              produto.tipo_id = item.tipo_id;
              produto.vasilhame_id = item.vasilhame_id;
              produto.unidade_venda_id = item.unidade_venda_id;
              produto.nome_produto = item.nome_produto;
              produto.preco = item.preco;
              produto.ativo = item.ativo;  
              produto.observacao = item.observacao;
              console.log('produto XX ' + item);
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
         let sql = `SELECT p.*, c.nome as categoria_nome, m.nome as marca_nome, t.nome as tipo_nome, 
                                v.nome as vasilhame_nome, u.nome as unidade_venda_nome,
                                case when c.nome is null then '' else c.nome||' ' end ||
                                case when m.nome is null then '' else m.nome||' ' end ||
                                case when t.nome is null then '' else t.nome||' ' end ||
                                case when v.nome is null then '' else v.nome||' ' end ||
                                case when u.nome is null then '' else u.nome end  as nome_produto
                    FROM produtos p
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
                    ORDER BY c.nome`;  
        //let sql = 'select * from produtos';
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
  categoria_id: number;
  marca_id: number;
  tipo_id: number;
  unidade_venda_id: number;
  vasilhame_id: number;
  nome_produto: string;
  preco: number;
  ativo: number;
  observacao?: string;
}

export class Produto2{
  id?: number;
  categoria_id: number;
  categoria_nome: string;
  marca_id: number;
  marca_nome: string;
  tipo_id: number;
  tipo_nome: string;
  unidade_venda_id: number;
  unidade_venda_nome: string;
  vasilhame_id: number;
  vasilhame_nome: string;
  preco: number;
  ativo: number;
  observacao?: string;
}


