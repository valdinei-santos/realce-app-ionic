import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../database/database';


@Injectable()
export class ClienteProvider {


  constructor(private dbProvider: DatabaseProvider) {
    console.log('Hello ClienteProvider Provider');

  }


  public insert(cliente: Cliente) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 
          `insert into clientes (codigo, nome, fone, celular, endereco, bairro, cidade, cnpj, inscricao_est) 
             values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let data = [cliente.codigo, cliente.nome, cliente.fone, cliente.celular, cliente.endereco, 
                    cliente.bairro, cliente.cidade, cliente.cnpj, cliente.inscricao_est];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public update(cliente: Cliente) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 
          `update clientes set codigo = ?, nome = ?, fone = ?, celular = ?, endereco = ?, bairro = ?, cidade = ?, 
            cnpj = ?, inscricao_est = ? where id = ?`;
        let data = [cliente.codigo, cliente.nome, cliente.fone, cliente.celular, cliente.endereco, cliente.bairro, 
                    cliente.cidade, cliente.cnpj, cliente.inscricao_est, cliente.id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public remove(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'update clientes set ativo = 0 where id = ?';
        let data = [id];
        return db.executeSql(sql, data)
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
 
  public get(id: number) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'select * from clientes where id = ? and ativo = 1';
        let data = [id];
        return db.executeSql(sql, data)
          .then((data: any) => {
            if (data.rows.length > 0) {
              //let item = data.rows.item(0);
              let cliente = new Cliente();
              cliente = data.rows.item(0);
              /* cliente.id = item.id;
              cliente.codigo = item.codigo;
              cliente.nome = item.nome;
              cliente.fone = item.fone;
              cliente.celular = item.celular;
              cliente.endereco = item.endereco;
              cliente.bairro = item.bairro;
              cliente.cidade = item.cidade;
              cliente.cnpj = item.cnpj;
              cliente.inscricao_est = item.inscricao_est; */
              return cliente;
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
        let sql = 'SELECT * FROM clientes where ativo = 1 order by nome';
        return db.executeSql(sql, [])
          .then((data: any) => {
            if (data.rows.length > 0) {
              let clientes: any[] = [];
              for (var i = 0; i < data.rows.length; i++) {
                var cliente = data.rows.item(i);
                clientes.push(cliente);
              }
              return clientes;
            } else {
              return [];
            }
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

}


export class Cliente{
  id?: number;
  codigo: number;
  nome: string;
  fone?: string;
  celular?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  cnpj?: string;
  inscricao_est?: string;
  ativo?: number;
}


