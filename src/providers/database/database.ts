import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

const DATABASES_TABLES = [
  /* `DROP TABLE produtos`,
  `DROP TABLE produtos_categoria`,
  `DROP TABLE produtos_marca`,
  `DROP TABLE produtos_tipo`,
  `DROP TABLE produtos_vasilhame`,
  `DROP TABLE produtos_unidade_venda`,
  `DROP TABLE pedidos`,
  `DROP TABLE pedidos_itens`, 
  `DROP TABLE clientes`,  */
  `CREATE TABLE IF NOT EXISTS produtos_categoria (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_marca (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_tipo (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_vasilhame (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_unidade_venda (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(10) )`,
  `CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        categoria_id INTEGER,
                                        marca_id INTEGER,
                                        tipo_id INTEGER,
                                        vasilhame_id INTEGER,
                                        unidade_venda_id INTEGER,
                                        preco NUMERIC(10,2),
                                        ativo INTEGER,
                                        observacao VARCHAR(50),
                                        FOREIGN KEY(categoria_id) REFERENCES produtos_categoria(id),
                                        FOREIGN KEY(marca_id) REFERENCES produtos_marca(id),
                                        FOREIGN KEY(tipo_id) REFERENCES produtos_tipo(id),
                                        FOREIGN KEY(vasilhame_id) REFERENCES produtos_vasilhame(id),
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
  //`CREATE TABLE IF NOT EXISTS pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT,
  `CREATE TABLE IF NOT EXISTS pedidos (id NOT NULL,
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
  ['insert into produtos_categoria (nome) values (?)', ['Refri']],  // 1
  ['insert into produtos_categoria (nome) values (?)', ['Água']],   // 2
  ['insert into produtos_categoria (nome) values (?)', ['Suco']],   // 3
  ['insert into produtos_categoria (nome) values (?)', ['Chá']],    // 4
  ['insert into produtos_categoria (nome) values (?)', ['Água de Coco']],  // 5
  ['insert into produtos_categoria (nome) values (?)', ['Chocoleite']],    // 6
  ['insert into produtos_categoria (nome) values (?)', ['Isotônico']],     // 7
  ['insert into produtos_categoria (nome) values (?)', ['Energético']],    // 8
  ['insert into produtos_categoria (nome) values (?)', ['Cerveja']],       // 9
  ['insert into produtos_categoria (nome) values (?)', ['Vinho']],         // 10
  ['insert into produtos_categoria (nome) values (?)', ['Cana']],          // 11
  ['insert into produtos_categoria (nome) values (?)', ['Whisky']],        // 12
  ['insert into produtos_categoria (nome) values (?)', ['Vodka']],         // 13
  ['insert into produtos_categoria (nome) values (?)', ['Conhaque']],      // 14
  ['insert into produtos_categoria (nome) values (?)', ['Caipira']],       // 15
  ['insert into produtos_categoria (nome) values (?)', ['Vermuth']],       // 16
  ['insert into produtos_categoria (nome) values (?)', ['Maracuja']],      // 17
  ['insert into produtos_categoria (nome) values (?)', ['Batida']],        // 18
  ['insert into produtos_categoria (nome) values (?)', ['Canelinha']],     // 19
  ['insert into produtos_categoria (nome) values (?)', ['Raiz Amarga']],   // 20
  ['insert into produtos_categoria (nome) values (?)', ['Menta']],         // 21
  ['insert into produtos_categoria (nome) values (?)', ['Catuaba']],       // 22
  ['insert into produtos_categoria (nome) values (?)', ['Bitter']],        // 23
  ['insert into produtos_categoria (nome) values (?)', ['Underberg']],     // 24
  ['insert into produtos_categoria (nome) values (?)', ['Steinharcer']],   // 25
  ['insert into produtos_categoria (nome) values (?)', ['Martini']],       // 26
  ['insert into produtos_categoria (nome) values (?)', ['Camapari']],      // 27
  ['insert into produtos_categoria (nome) values (?)', ['Tequila']],       // 28
  ['insert into produtos_categoria (nome) values (?)', ['Montila']],       // 29
  ['insert into produtos_categoria (nome) values (?)', ['Bacardi']],       // 30
  ['insert into produtos_categoria (nome) values (?)', ['Copo']],          // 31
  
  ['insert into produtos_marca (nome) values (?)', ['Brahma']],        // 1
  ['insert into produtos_marca (nome) values (?)', ['Skol']],          // 2
  ['insert into produtos_marca (nome) values (?)', ['Antártica']],     // 3
  ['insert into produtos_marca (nome) values (?)', ['Original']],      // 4
  ['insert into produtos_marca (nome) values (?)', ['Bohemia']],       // 5
  ['insert into produtos_marca (nome) values (?)', ['Schin']],         // 6
  ['insert into produtos_marca (nome) values (?)', ['Heineken']],      // 7
  ['insert into produtos_marca (nome) values (?)', ['Stela Artois']],  // 8
  ['insert into produtos_marca (nome) values (?)', ['Budweiser']],     // 9
  ['insert into produtos_marca (nome) values (?)', ['Coca']],          // 10
  ['insert into produtos_marca (nome) values (?)', ['Água da Serra']], // 11
  ['insert into produtos_marca (nome) values (?)', ['Max Willian']],   // 12
  ['insert into produtos_marca (nome) values (?)', ['Pureza']],        // 13
  ['insert into produtos_marca (nome) values (?)', ['Imperatriz']],    // 14
  ['insert into produtos_marca (nome) values (?)', ['Santa Rita']],    // 15

  ['insert into produtos_tipo (nome) values (?)', ['Coca-cola']],          // 1
  ['insert into produtos_tipo (nome) values (?)', ['Coca-cola Zero']],     // 2
  ['insert into produtos_tipo (nome) values (?)', ['Fanta']],              // 3
  ['insert into produtos_tipo (nome) values (?)', ['Sprite']],             // 4
  ['insert into produtos_tipo (nome) values (?)', ['Guaraná Antártica' ]], // 5
  ['insert into produtos_tipo (nome) values (?)', ['Sub Zero' ]],          // 6
  
  ['insert into produtos_vasilhame (nome) values (?)', ['lata 220ml']],     // 1
  ['insert into produtos_vasilhame (nome) values (?)', ['lata 310ml']],     // 2 
  ['insert into produtos_vasilhame (nome) values (?)', ['lata 350ml']],     // 3
  ['insert into produtos_vasilhame (nome) values (?)', ['lata 473ml']],     // 4
  ['insert into produtos_vasilhame (nome) values (?)', ['garrafa 255ml']],  // 5
  ['insert into produtos_vasilhame (nome) values (?)', ['garrafa 275ml']],  // 6
  ['insert into produtos_vasilhame (nome) values (?)', ['garrafa 300ml']],  // 7
  ['insert into produtos_vasilhame (nome) values (?)', ['garrafa 330ml']],  // 8
  ['insert into produtos_vasilhame (nome) values (?)', ['garrafa 355ml']],  // 9
  ['insert into produtos_vasilhame (nome) values (?)', ['garrafa 550ml']],  // 10
  ['insert into produtos_vasilhame (nome) values (?)', ['garrafa 600ml']],  // 11
  ['insert into produtos_vasilhame (nome) values (?)', ['garrafa 1LT']],    // 12
  ['insert into produtos_vasilhame (nome) values (?)', ['garrafa 1,5LT']],  // 13
  ['insert into produtos_vasilhame (nome) values (?)', ['garrafa 2LT']],    // 14

  ['insert into produtos_unidade_venda (nome) values (?)', ['CX 12 un.']],  // 1
  ['insert into produtos_unidade_venda (nome) values (?)', ['CX 24 un.']],  // 2
  ['insert into produtos_unidade_venda (nome) values (?)', ['DZ']],         // 3
  ['insert into produtos_unidade_venda (nome) values (?)', ['PC 6 un.']],   // 4
  ['insert into produtos_unidade_venda (nome) values (?)', ['PC 8 un.']],   // 5
  ['insert into produtos_unidade_venda (nome) values (?)', ['UN']]          // 6
];

/* const PRODUTOS = [
    ['insert into produtos_categoria (nome) values (?)', ['Cerveja garrafa 600ml']],
    ['insert into produtos_categoria (nome) values (?)', ['Cerveja Lata 355ml']],
    ['insert into produtos_categoria (nome) values (?)', ['Cerveja Longneck 350ml']]
]; */
const PRODUTOS = [
  // Cerveja Garrafa 600ml
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 1, null, 11, 2, 28.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 2, null, 11, 2, 27.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 3, null, 11, 2, 30.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 3, 6, 11, 2, 30.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 4, null, 11, 2, 31.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 5, null, 11, 2, 40.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 6, null, 11, 2, 44.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 7, null, 11, 2, 48.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 8, null, 10, 2, 47.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 9, null, 11, 1, 45.00, true, null]],
  // Cerveja lata 350ml                
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 1, null, 3, 2, 28.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 2, null, 3, 2, 27.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 3, null, 3, 2, 30.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 3, 6, 3, 2, 30.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 5, null, 3, 2, 40.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 6, null, 3, 2, 44.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 7, null, 3, 2, 48.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [9, 9, null, 3, 1, 45.00, true, null]],
  // Refri Lata 355ml
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [1, null, 1, 3, 1, 17.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [1, null, 2, 3, 1, 17.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [1, null, 3, 3, 1, 17.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [1, null, 4, 3, 1, 17.00, true, null]],
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [1, null, 5, 3, 1, 17.00, true, null]],
  // Refri garrafa 600ml                 
  [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [1, 13, null, 11, 5, 17.00, true, null]],

  // Clientes
  [`insert into clientes (id, nome, codigo, fone, celular, endereco, bairro, cidade, cnpj, inscricao_est) 
                  values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [1, 'Bar do Passarinho', 1, '32324543', '999442121', 'Praia de Cima', null, null, null, null]],
  [`insert into clientes (id, nome, codigo, fone, celular, endereco, bairro, cidade, cnpj, inscricao_est) 
                  values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [2, 'Bar do Zeca', 2, '32324543', '999442121', 'Caminho Novo', null, null, null, null]],
  
  // Pedidos
  [`insert into pedidos (id, cliente_id, data, status) 
                  values (?, ?, ?, ?)`, [1, 1, '2018-06-07', 'Pendente']],
  [`insert into pedidos_itens (id, pedido_id, produto_id, quantidade, valor_unitario, valor_total) 
                  values (?, ?, ?, ?, ?, ?)`, [1, 1, 1, 2, 33.43, 66.86]],

 
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