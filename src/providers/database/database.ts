import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

const DATABASES_TABLES = [
  //`DROP TABLE produtos`,
  //`DROP TABLE produtos_categoria`,
  //`DROP TABLE produtos_marca`,
  //`DROP TABLE produtos_tipo`,
  //`DROP TABLE produtos_unidade_venda`,
  //`DROP TABLE pedidos`,
  //`DROP TABLE pedidos_itens`,
  `CREATE TABLE IF NOT EXISTS produtos_categoria (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_marca (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_tipo (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_unidade_venda (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(10) )`,
  `CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        categoria_id INTEGER,
                                        marca_id INTEGER,
                                        tipo_id INTEGER,
                                        unidade_venda_id INTEGER,
                                        preco NUMERIC(10,2),
                                        ativo INTEGER,
                                        observacao VARCHAR(50),
                                        FOREIGN KEY(categoria_id) REFERENCES produtos_categoria(id),
                                        FOREIGN KEY(marca_id) REFERENCES produtos_marca(id),
                                        FOREIGN KEY(tipo_id) REFERENCES produtos_tipo(id),
                                        FOREIGN KEY(unidade_venda_id) REFERENCES produtos_unidade_venda(id)
                                       )`,
  /* `CREATE TABLE IF NOT EXISTS produtos_unidade (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(10))`,
  `CREATE TABLE IF NOT EXISTS produtos_categoria (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50))`,
  `CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         descricao VARCHAR(50),
                                         unidade_id INTEGER,
                                         preco NUMERIC(10,2),
                                         ativo INTEGER,
                                         categoria_id INTEGER,
                                         FOREIGN KEY(unidade_id) REFERENCES produtos_unidade(id),
                                         FOREIGN KEY(categoria_id) REFERENCES produtos_categoria(id)
                                        )`, */
  `CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         nome VARCHAR(50),
                                         codigo INTEGER,
                                         fone VARCHAR(20),
                                         celular VARCHAR(20),
                                         endereco VARCHAR(70),
                                         bairro VARCHAR(50),
                                         cidade VARCHAR(50),
                                         cnpj VARCHAR(20),
                                         inscricao_est VARCHAR(20)
                                        )`,
  `CREATE TABLE IF NOT EXISTS pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        cliente_id INTEGER,
                                        data TEXT,
                                        status VARCHAR(30)
                                        )`,
  `CREATE TABLE IF NOT EXISTS pedidos_itens (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              pedido_id INTEGER,
                                              produto_id INTEGER,
                                              quantidade INTEGER,
                                              valor_unitario NUMERIC(10,2),
                                              valor_total NUMERIC(10,2),
                                              FOREIGN KEY(pedido_id) REFERENCES pedidos(id),
                                              FOREIGN KEY(produto_id) REFERENCES produtos(id)
                                              )`,
  `CREATE TABLE IF NOT EXISTS folhas_carga (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             data TEXT,
                                             status VARCHAR(30)
                                            )`,
  `CREATE TABLE IF NOT EXISTS folhas_carga_itens (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                   pedido_id INTEGER,
                                                   folha_carga_id INTEGER,
                                                   FOREIGN KEY(pedido_id) REFERENCES pedidos(id),
                                                   FOREIGN KEY(folha_carga_id) REFERENCES folhas_carga(id)
                                                  )`
];

/* const UNIDADES = [
    ['insert into produtos_unidade (nome) values (?)', ['CX']],
    ['insert into produtos_unidade (nome) values (?)', ['DZ']],
    ['insert into produtos_unidade (nome) values (?)', ['PC']],
    ['insert into produtos_unidade (nome) values (?)', ['UN']]
]; */

const UNIDADES = [
  ['insert into produtos_categoria (nome) values (?)', ['Cerveja']],
  ['insert into produtos_categoria (nome) values (?)', ['Refri']],
  ['insert into produtos_categoria (nome) values (?)', ['Vinho']],
  ['insert into produtos_categoria (nome) values (?)', ['Whisky']],
  ['insert into produtos_categoria (nome) values (?)', ['Vodka']],
  ['insert into produtos_categoria (nome) values (?)', ['Água']],
  ['insert into produtos_marca (nome) values (?)', ['Brahma']],
  ['insert into produtos_marca (nome) values (?)', ['Skol']],
  ['insert into produtos_marca (nome) values (?)', ['Antártica']],
  ['insert into produtos_marca (nome) values (?)', ['Schin']],
  ['insert into produtos_marca (nome) values (?)', ['Original']],
  ['insert into produtos_marca (nome) values (?)', ['Coca']],
  ['insert into produtos_marca (nome) values (?)', ['Água da Serra']],
  ['insert into produtos_marca (nome) values (?)', ['Max Willian']],
  ['insert into produtos_marca (nome) values (?)', ['Pureza']],
  ['insert into produtos_marca (nome) values (?)', ['Imperatriz']],
  ['insert into produtos_marca (nome) values (?)', ['Santa Rita']],
  ['insert into produtos_tipo (nome) values (?)', ['Coca-cola lata 355ml']],
  ['insert into produtos_tipo (nome) values (?)', ['Coca-cola Zero lata 355ml']],
  ['insert into produtos_tipo (nome) values (?)', ['Coca-cola garrafa 1LT']],
  ['insert into produtos_tipo (nome) values (?)', ['Coca-cola garrafa 1,5LT']],
  ['insert into produtos_tipo (nome) values (?)', ['Coca-cola garrafa 2LT']],
  ['insert into produtos_tipo (nome) values (?)', ['Coca-cola Zero garrafa 2LT']],
  ['insert into produtos_tipo (nome) values (?)', ['Guaraná lata 355ml' ]],
  ['insert into produtos_tipo (nome) values (?)', ['Guaraná garrafa 2LT' ]],
  ['insert into produtos_tipo (nome) values (?)', ['Sprite lata 355ml']],
  ['insert into produtos_tipo (nome) values (?)', ['Sprite garrafa 2LT']],
  ['insert into produtos_tipo (nome) values (?)', ['Fanta lata 355ml']],
  ['insert into produtos_tipo (nome) values (?)', ['Fanta garrafa 2LT']],
  ['insert into produtos_tipo (nome) values (?)', ['Garrafa 600ml']],
  ['insert into produtos_tipo (nome) values (?)', ['Lata 355ml']],
  ['insert into produtos_tipo (nome) values (?)', ['Longneck']],
  ['insert into produtos_tipo (nome) values (?)', ['Profissa']],
  ['insert into produtos_tipo (nome) values (?)', ['Longneck2']],
  ['insert into produtos_tipo (nome) values (?)', ['Profissa2']]    
];

/* const PRODUTOS = [
    ['insert into produtos_categoria (nome) values (?)', ['Cerveja garrafa 600ml']],
    ['insert into produtos_categoria (nome) values (?)', ['Cerveja Lata 355ml']],
    ['insert into produtos_categoria (nome) values (?)', ['Cerveja Longneck 350ml']]
]; */
const PRODUTOS = [
  ['insert into produtos_unidade_venda (nome) values (?)', ['CX']],
  ['insert into produtos_unidade_venda (nome) values (?)', ['DZ']],
  ['insert into produtos_unidade_venda (nome) values (?)', ['PC']],
  ['insert into produtos_unidade_venda (nome) values (?)', ['UN']]
];

@Injectable()
export class DatabaseProvider {

  constructor(private sqlite: SQLite) { }

  /**
   * Cria um banco caso não exista ou pega um banco existente com o nome no parametro
   */
  public getDB() {
    return this.sqlite.create({
      name: 'realce.db',
      location: 'default'
    });
  }

  /**
   * Cria a estrutura inicial do banco de dados
   */
  public createDatabase() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        // Criando as tabelas
        this.createTables(db);
        // Inserindo dados padrão
        this.insertDefaultItems(db);;
      })
      .catch(e => console.log(e));
  }

  /**
   * Criando as tabelas no banco de dados
   * @param db
   */
  private createTables(db: SQLiteObject) {
    // Criando as tabelas
    db.sqlBatch(DATABASES_TABLES)
      .then(() => console.log('Tabelas criadas'))
      .catch(e => console.error('Erro ao criar as tabelas', e));
  }

  /**
   * Incluindo os dados padrões
   * @param db
   */
  private insertDefaultItems(db: SQLiteObject) {
    db.executeSql('select COUNT(id) as qtd from produtos_categoria', {})
    .then((data: any) => {
      //Se não existe nenhum registro
      if (data.rows.item(0).qtd == 0) {
        // Povoando as tabelas
        db.sqlBatch(UNIDADES)
          .then(() => {
            return db.sqlBatch(PRODUTOS)
          })
          .then(() => console.log('Dados padrões incluídos'))
          .catch(e => console.error('Erro ao incluir dados padrões', e));

      }
    })
    .catch(e => console.error('Erro ao consultar a qtd de categorias', e));
  }


}