import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

const DATABASES_TABLES = [
  /* `DROP TABLE IF EXISTS folhas_carga_itens`,
  `DROP TABLE IF EXISTS folhas_carga`,
  `DROP TABLE IF EXISTS pedidos_itens`, 
  `DROP TABLE IF EXISTS pedidos`,
  `DROP TABLE IF EXISTS produtos`,
  `DROP TABLE IF EXISTS produtos_categoria`,
  `DROP TABLE IF EXISTS produtos_marca`,
  `DROP TABLE IF EXISTS produtos_tipo`,
  `DROP TABLE IF EXISTS produtos_vasilhame`,
  `DROP TABLE IF EXISTS produtos_unidade_venda`,
  `DROP TABLE IF EXISTS clientes`, */
  `CREATE TABLE IF NOT EXISTS produtos_categoria (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_marca (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_tipo (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_vasilhame (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_unidade_venda (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(10) )`,
  `CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        nome_produto VARCHAR(60),
                                        categoria_id INTEGER,
                                        vasilhame_id INTEGER,
                                        unidade_venda_id INTEGER,
                                        preco NUMERIC(10,2),
                                        ativo INTEGER,
                                        observacao VARCHAR(50),
                                        FOREIGN KEY(categoria_id) REFERENCES produtos_categoria(id),
                                        FOREIGN KEY(vasilhame_id) REFERENCES produtos_vasilhame(id),
                                        FOREIGN KEY(unidade_venda_id) REFERENCES produtos_unidade_venda(id)
                                       )`,
  `CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         nome VARCHAR(50),
                                         codigo INTEGER,
                                         fone VARCHAR(20),
                                         celular VARCHAR(20),
                                         endereco VARCHAR(70),
                                         bairro VARCHAR(50),
                                         cidade VARCHAR(50),
                                         cnpj VARCHAR(20),
                                         inscricao_est VARCHAR(20),
                                         ativo INTEGER default 1
                                        )`,
  //`CREATE TABLE IF NOT EXISTS pedidos (id INTEGER PRIMARY KEY AUTOINCREMENT,
  `CREATE TABLE IF NOT EXISTS pedidos (id NOT NULL,
                                       cliente_id INTEGER,
                                       data TEXT,
                                       status VARCHAR(30),
                                       valor_adicional NUMERIC(10,2),
                                       valor_pago NUMERIC(10,2),
                                       pago INTEGER default 0
                                      )`,
  `CREATE TABLE IF NOT EXISTS pedidos_itens (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              pedido_id INTEGER,
                                              produto_id INTEGER,
                                              quantidade INTEGER,
                                              valor_unitario NUMERIC(10,2),
                                              valor_padrao NUMERIC(10,2),
                                              valor_total NUMERIC(10,2),
                                              valor_total_padrao NUMERIC(10,2),
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
                                                 )`,
  //`PRAGMA foreign_keys = ON;`
];


const UNIDADES = [
  ['insert into produtos_categoria (nome) values (?)', ['Cervejas']],  // 1
  ['insert into produtos_categoria (nome) values (?)', ['Refri e Similares']],   // 2
  ['insert into produtos_categoria (nome) values (?)', ['Destilados']],   // 3
  ['insert into produtos_categoria (nome) values (?)', ['Descartáveis']],   // 4
  /*
  ['insert into produtos_categoria (nome) values (?)', ['Chá']],    // 4
  ['insert into produtos_categoria (nome) values (?)', ['Agua de Coco']],  // 5
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
  
*/
  
  ['insert into produtos_vasilhame (nome) values (?)', ['220ml']],  // 1
  ['insert into produtos_vasilhame (nome) values (?)', ['310ml']],  // 2 
  ['insert into produtos_vasilhame (nome) values (?)', ['350ml']],  // 3
  ['insert into produtos_vasilhame (nome) values (?)', ['473ml']],  // 4
  ['insert into produtos_vasilhame (nome) values (?)', ['255ml']],  // 5
  ['insert into produtos_vasilhame (nome) values (?)', ['275ml']],  // 6
  ['insert into produtos_vasilhame (nome) values (?)', ['300ml']],  // 7
  ['insert into produtos_vasilhame (nome) values (?)', ['330ml']],  // 8
  ['insert into produtos_vasilhame (nome) values (?)', ['355ml']],  // 9
  ['insert into produtos_vasilhame (nome) values (?)', ['550ml']],  // 10
  ['insert into produtos_vasilhame (nome) values (?)', ['600ml']],  // 11
  ['insert into produtos_vasilhame (nome) values (?)', ['1LT']],    // 12
  ['insert into produtos_vasilhame (nome) values (?)', ['1,5LT']],  // 13
  ['insert into produtos_vasilhame (nome) values (?)', ['2LT']],    // 14
  ['insert into produtos_vasilhame (nome) values (?)', ['290ml']],  // 15
  ['insert into produtos_vasilhame (nome) values (?)', ['450ml']],  // 16
  ['insert into produtos_vasilhame (nome) values (?)', ['250ml']],  // 17
  ['insert into produtos_vasilhame (nome) values (?)', ['200ml']],  // 18
  ['insert into produtos_vasilhame (nome) values (?)', ['500ml']],  // 19
  ['insert into produtos_vasilhame (nome) values (?)', ['Caixinha']],  // 20
  ['insert into produtos_vasilhame (nome) values (?)', ['5LT']],    // 21
  ['insert into produtos_vasilhame (nome) values (?)', ['20LT']],   // 22
  ['insert into produtos_vasilhame (nome) values (?)', ['750ml']],   // 23
  ['insert into produtos_vasilhame (nome) values (?)', ['313ml']],   // 24
  ['insert into produtos_vasilhame (nome) values (?)', ['269ml']],   // 25


  ['insert into produtos_unidade_venda (nome) values (?)', ['CX 12 un.']],  // 1
  ['insert into produtos_unidade_venda (nome) values (?)', ['CX 24 un.']],  // 2
  ['insert into produtos_unidade_venda (nome) values (?)', ['DZ']],         // 3
  ['insert into produtos_unidade_venda (nome) values (?)', ['PC 6 un.']],   // 4
  ['insert into produtos_unidade_venda (nome) values (?)', ['PC 8 un.']],   // 5
  ['insert into produtos_unidade_venda (nome) values (?)', ['UN']],         // 6
  ['insert into produtos_unidade_venda (nome) values (?)', ['CX 25 un.']],  // 7
  ['insert into produtos_unidade_venda (nome) values (?)', ['CX 23 un.']],  // 8
  ['insert into produtos_unidade_venda (nome) values (?)', ['CX 30 un.']],  // 9
  ['insert into produtos_unidade_venda (nome) values (?)', ['CX 48 un.']],  // 10
  ['insert into produtos_unidade_venda (nome) values (?)', ['CX 27 un.']],  // 11
  ['insert into produtos_unidade_venda (nome) values (?)', ['PC 4 un.']],   // 12
  ['insert into produtos_unidade_venda (nome) values (?)', ['TIRA C/100 un.']],  // 13
  ['insert into produtos_unidade_venda (nome) values (?)', ['TIRA C/50 un.']],   // 14
  ['insert into produtos_unidade_venda (nome) values (?)', ['TIRA C/25 un.']],   // 15
  ['insert into produtos_unidade_venda (nome) values (?)', ['TIRA C/10 un.']],   // 16
  ['insert into produtos_unidade_venda (nome) values (?)', ['PC']],   // 17


];

/* const PRODUTOS = [
    ['insert into produtos_categoria (nome) values (?)', ['Cerveja garrafa 600ml']],
    ['insert into produtos_categoria (nome) values (?)', ['Cerveja Lata 355ml']],
    ['insert into produtos_categoria (nome) values (?)', ['Cerveja Longneck 350ml']]
]; */
const PRODUTOS = [

  // CERVEJAS

  // Cerveja 600ml
  [`insert OR IGNORE into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Garrafa', 1, 11, 2, 142.80, 1, null]],  
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Skol Garrafa', 1, 11, 2, 135.80, 1, null]],  
   [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Antartica Garrafa', 1, 11, 2, 135.80, true, null]],  
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Antartica Sub Zero Garrafa', 1, 11, 2, 123.60, true, null]],  
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Original Garrafa', 1, 11, 2, 171.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Extra Garrafa', 1, 11, 2, 171.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Bohemia Garrafa', 1, 11, 2, 171.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
  values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Heineken Garrafa', 1, 11, 2, 171.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Budweiser Garrafa', 1, 11, 2, 171.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
  values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Nova Schin Garrafa', 1, 11, 2, 77.40, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
  values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Eisenbahn Garrafa', 1, 11, 2, 158.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Pilsen Garrafa', 1, 11, 2, 70.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Burguesa Garrafa', 1, 11, 2, 90.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Malzebier Garrafa', 1, 11, 2, 171.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Nova Schin Malzebier Garrafa', 1, 11, 2, 96.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Pilsen Malzebier Garrafa', 1, 11, 2, 144.00, true, null]],
  
  // Cerveja Litrao 1LT
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Schin Litrão', 1, 12, 1, 56.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Litrão', 1, 12, 1, 78.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Skol Litrão', 1, 12, 1, 74.80, true, null]],

  //Long Neck 355ml com 24un
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Skol Long Neck', 1, 9, 2, 66.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Long Neck', 1, 9, 2, 66.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Eisenbahn Long Neck', 1, 9, 2, 92.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Bohemia Long Neck', 1, 9, 2, 92.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Heineken Long Neck', 1, 9, 2, 92.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Stela Long Neck', 1, 9, 2, 92.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Budweiser Long Neck', 1, 9, 2, 92.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Corona Long Neck', 1, 9, 2, 144.00, true, null]],

  //Long Neck 355ml com 12un
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Schin Long Neck Malzebier', 1, 9, 1, 31.00, true, null]],
  //Long Neck 355ml com 25un
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Long Neck Malzebier', 1, 9, 7, 96.80, true, null]],    

  //Long Neck 313ml
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Skol Beats Long Neck', 1, 24, 2, 119.00, true, null]],

  //Profissa 300ml com 23un
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Skol Profissa', 1, 7, 8, 41.20, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Profissa', 1, 7, 8, 41.20, true, null]],
  
  //Lata 355ml com 12un
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Skol Lata', 1, 3, 3, 28.60, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Lata', 1, 3, 3, 28.60, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Antartica Lata', 1, 3, 3, 25.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Antartica Sub Zero Lata', 1, 3, 3, 24.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Schin Lata', 1, 3, 3, 22.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Bohemia Lata', 1, 3, 3, 39.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Budweiser Lata', 1, 3, 3, 39.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Heineken Lata', 1, 3, 3, 39.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Burguesa Lata', 1, 3, 3, 23.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Zero Alcool Lata', 1, 3, 3, 35.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Schin sem Alcool Lata', 1, 3, 3, 32.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Pilsen Preta Lata', 1, 3, 3, 27.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cerveja Amstel Lata', 1, 3, 3, 31.60, true, null]],
  
  // Lata 269ml
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Skol Beats Lata', 1, 25, 5, 31.00, true, null]],


  // REFRIS E SIMILARES

  // Refri garrafa 600 cx 24un
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Pureza Garrafa', 2, 11, 2, 44.30, true, null]],
  
  // Refri garrafa 290 KS cx 24un
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Coca Cola KS', 2, 15, 2, 41.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Guarana KS', 2, 15, 2, 41.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Pureza KS', 2, 15, 2, 36.00, true, null]],

  // Refri garrafa 255ml Cx 30un
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Laranjinha', 2, 5, 9, 37.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Purezinha', 2, 5, 9, 37.80, true, null]],


  // Refri garrafa 2LT PC 8un
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Coca Cola', 2, 14, 5, 46.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Guaraná', 2, 14, 5, 31.60, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Pureza', 2, 14, 5, 27.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Sabores Coca Cola', 2, 14, 5, 40.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Max Wilheln', 2, 14, 5, 29.60, true, null]],

  // Refri garrafa 2LT PC 6un
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Laranjinha Agua da Serra', 2, 14, 4, 26.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Capricho', 2, 14, 4, 18.50, true, null]],
  
  // Refri garrafa 1,5LT PC 8un
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Coca Cola', 2, 13, 5, 46.80, true, null]],
  
  // Refri garrafa 1,5LT PC 6un
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Guaraná', 2, 13, 4, 46.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Schweppes Citrus', 2, 13, 4, 32.80, true, null]],

  // Refri garrafa 1LT DZ
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Pureza', 2, 12, 3, 39.30, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Agua da Serra', 2, 12, 3, 39.80, true, null]],

  // Refri garrafa 600ml DZ
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Coca Cola', 2, 11, 3, 39.60, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Guarana', 2, 11, 3, 39.60, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Pureza', 2, 11, 3, 31.80, true, null]],

  // Refri garrafa 350ml DZ
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Pureza', 2, 3, 3, 26.80, true, null]],

  // Refri lata 350ml DZ
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Coca Cola Lata', 2, 3, 3, 25.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Guarana Lata', 2, 3, 3, 25.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Refri Schweppes Citrus Lata', 2, 3, 3, 32.80, true, null]],

  // Suco
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Suco Sufrech Lata', 2, 8, 3, 36.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Suco Skinka Pet', 2, 16, 3, 28.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Suco Tily Pet', 2, 16, 3, 12.30, true, null]],
  // 1LT UN
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Suco Sufrech Tetra Pak', 2, 12, 6, 36.80, true, null]],

  // Refri lata 250ml DZ
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Juninhu Agua da Serra', 2, 17, 3, 18.30, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Juninhu Coca Cola', 2, 17, 3, 16.70, true, null]],
  
  // Mate Leão
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Mate Leao', 2, null, 3, 26.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Mate Leao Litrinho', 2, null, 3, 32.80, true, null]],
  
  // Chocoleite
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Chocoleite', 2, 18, 10, 76.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Chocoleite', 2, 19, 2, 46.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Chocoleite', 2, 20, 11, 29.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Chocoleite', 2, 7, 2, 69.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Chocoleite Oni Way', 2, null, 2, 62.80, true, null]],

  // Agua 
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Agua Vidro', 2, null, 2, 22.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Agua Sem Gás Sta Catarina', 2, 19, 3, 12.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Agua Com Gás Sta Catarina', 2, 19, 3, 13.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Agua Sem Gás', 2, 19, 3, 10.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Agua Com Gás', 2, 19, 3, 11.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Agua Sta Catarina', 2, 13, 4, 12.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Agua', 2, 13, 4, 10.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Agua', 2, 21, 12, 14.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Agua Bombona', 2, 22, 6, 8.20, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Agua H2O', 2, 19, 3, 32.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Agua de Copo', 2, null, 10, 20.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Agua de Copo Tetra Pak', 2, 18, 11, 49.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Gatorade', 2, null, 4, 21.60, true, null]],
  
  // Energetico
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Energetico Red Horse', 2, 6, 6, 2.95, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Energetico Red Horse', 2, 12, 6, 7.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Energetico Red Horse', 2, 14, 6, 8.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Energetico Red Horse Lata', 2, 9, 6, 3.80, true, null]],
    
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Energetico Baly', 2, 12, 6, 7.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Energetico Baly', 2, 17, 6, 3.20, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Energetico Baly', 2, 14, 6, 9.25, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Energetico Baly Lata', 2, 9, 6, 3.40, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Energetico Red Bull Lata', 2, 9, 6, 6.45, true, null]],

  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Energetico Safadao', 2, 14, 6, 5.20, true, null]],

  // DESTILADOS

  // Vinho 5LT
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vinho Garrafao Sangue da Uva', 3, 21, 6, 29.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vinho Garrafao Pinheirense', 3, 21, 6, 27.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vinho Garrafao Vo Luiz', 3, 21, 6, 36.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Garrafao', 3, 21, 6, 16.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vinho Coquetel', 3, 21, 6, 21.80, true, null]],

  // Vinho 1LT
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vinho Campo Largo', 3, 12, 6, 8.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vinho Campo Largo Pessego', 3, 12, 6, 14.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vinho Salton', 3, 12, 6, 23.40, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vinho Vo Luiz', 3, 12, 6, 9.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vinho Sangue da Uva', 3, 12, 6, 7.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vinho Randon', 3, 12, 6, 6.40, true, null]],

  // Espumante
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Espumante Lunnar', 3, 23, 6, 21.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Espumante Prestige', 3, 23, 6, 13.20, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Espumante Salton', 3, 23, 6, 32.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Espumante Terra Nova', 3, 23, 6, 30.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Espumante Sem Alcool', 3, 23, 6, 16.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Sidra', 3, 23, 6, 5.90, true, null]],

  // Destilados
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Abcinto', 3, null, 6, 39.20, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Amarula', 3, null, 6, 84.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Marula', 3, null, 6, 39.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Bacardi', 3, null, 6, 31.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Bacardi Big Apple', 3, null, 6, 31.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Bacardi Limao', 3, null, 6, 33.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Batidas de Vidro Pingo de Ouro', 3, null, 6, 5.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Bitter Pingo de Ouro', 3, null, 6, 5.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Butia Litro', 3, null, 6, 6.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Caipira PVC', 3, null, 6, 5.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Limao com Mel', 3, null, 6, 5.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Campari', 3, null, 6, 36.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana 51', 3, null, 6, 7.20, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana 51 Ouro', 3, null, 6, 11.35, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Ipioca Prata', 3, null, 6, 13.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Ipioca Empalhada', 3, null, 6, 15.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Ipioca Lemon', 3, null, 6, 26.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Ipioca Organica', 3, null, 6, 13.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Ipioca Ouro', 3, null, 6, 13.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Jamel', 3, null, 6, 5.70, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Velho Barreiro', 3, null, 6, 7.10, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Velho Barreiro Gold', 3, null, 6, 10.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Velho Barreiro Limao', 3, null, 6, 11.70, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Terra Brazilis', 3, null, 6, 24.40, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Canelinha Pingo de Ouro', 3, null, 6, 5.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Catuaba Pingo de Ouro', 3, null, 6, 5.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Catuaba Selvagem', 3, null, 6, 12.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Catuaba Açai Pingo de Ouro', 3, null, 6, 7.10, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Conhaque Alcatrao', 3, null, 6, 16.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Conhaque Delber', 3, null, 6, 4.30, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Conhaque Domeq', 3, null, 6, 32.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Conhaque Dreher', 3, null, 6, 13.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Gin', 3, null, 6, 21.40, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Jurubeba', 3, null, 6, 5.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Licor de Cacau', 3, null, 6, 30.75, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Malibu', 3, null, 6, 48.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Maracuja Joinville', 3, null, 6, 9.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Maracuja Pingo de Ouro', 3, null, 6, 6.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Martine', 3, null, 6, 24.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Menta Vidro', 3, null, 6, 5.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Montila', 3, null, 6, 24.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Montila Limao', 3, null, 6, 24.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Raiz Amarga Pingo Ouro', 3, null, 6, 6.60, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Steinhager', 3, null, 6, 29.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Underberger', 3, null, 6, 40.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Underberger', 3, null, 6, 40.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Jagermeister', 3, null, 6, 89.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Valverde', 3, null, 6, 17.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vermuth Uru Pingo Ouro', 3, null, 6, 6.60, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Tequila Jose Cuervo Ouro', 3, null, 6, 89.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Tequila Jose Cuervo Prata', 3, null, 6, 89.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Tequila o Tequileiro', 3, null, 6, 48.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Jurupinga', 3, null, 6, 19.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Jurudrinks', 3, null, 6, 8.40, true, null]],

    // DZ eh 3
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana 3 Pipa', 3, null, 3, 48.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Serra Negra', 3, null, 3, 46.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Cana Kreff', 3, null, 3, 31.00, true, null]],


  // VODKA
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Absolut', 3, null, 6, 86.70, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Natasha', 3, null, 6, 14.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Orloff', 3, null, 6, 26.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Intencion', 3, null, 6, 14.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Valessa', 3, null, 6, 10.75, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Raiska', 3, null, 6, 14.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Raiska Limao', 3, null, 6, 16.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Raiska Apple', 3, null, 6, 17.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Sky', 3, null, 6, 33.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Smirnoff', 3, null, 6, 34.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Belkoff Vidro', 3, null, 6, 5.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Kisla', 3, null, 6, 9.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Ice 51', 3, null, 6, 3.48, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Ice Smirnoff', 3, null, 6, 4.98, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Vodka Kisla Ice', 3, null, 6, 2.70, true, null]],
  // WHISKY
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Whisky Cavalo Branco', 3, null, 6, 86.70, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Whisky Johnnie Walker Black', 3, null, 6, 148.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Whisky Johnnie Walker Red', 3, null, 6, 89.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Whisky Johnnie Jack Deniels', 3, null, 6, 136.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Whisky Balantaimes', 3, null, 6, 85.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Whisky Drurys', 3, null, 6, 27.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Whisky Nattu Nobilis', 3, null, 6, 31.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Whisky Bells', 3, null, 6, 44.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Whisky Old Eight', 3, null, 6, 36.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Whisky Passaport', 3, null, 6, 46.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Whisky Black Stone', 3, null, 6, 16.80, true, null]],

  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Quentao Litro', 3, null, 6, 9.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Saque', 3, null, 6, 35.80, true, null]],

  // DESCARTAVEIS
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo PVC 200ml', 4, null, 13, 4.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo PVC 300ml', 4, null, 13, 5.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo PVC 400ml', 4, null, 14, 7.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo PVC 500ml', 4, null, 14, 7.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo PVC 700ml', 4, null, 14, 8.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo Isopor', 4, null, 15, 3.35, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo Acrilico', 4, null, 16, 7.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo Cerveja Grosso', 4, null, 2, 25.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo Buteco', 4, null, 2, 35.00, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo Cerveja Fino', 4, null, 2, 78.80, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo de Pinga', 4, null, 6, 2.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo Americano Grande', 4, null, 6, 2.20, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo Americano Pequeno', 4, null, 2, 23.90, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo Liso Suco', 4, null, 6, 4.45, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo Whisky', 4, null, 6, 3.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Copo Cuba', 4, null, 6, 3.75, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Canudo Embalado C/100', 4, null, 6, 3.20, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Prato PVC 21', 4, null, 17, 2.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Prato PVC 23', 4, null, 17, 3.50, true, null]],
  [`insert into produtos (nome_produto, categoria_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?, ?)`, ['Prato PVC 26', 4, null, 17, 4.00, true, null]],



  // Clientes
  [`insert into clientes (id, nome, codigo, fone, celular, endereco, bairro, cidade, cnpj, inscricao_est, ativo) 
                  values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [1, 'Bar do Passarinho', 1, '32324543', '999442121', 'Praia de Cima', null, null, null, null, 1]],
  [`insert into clientes (id, nome, codigo, fone, celular, endereco, bairro, cidade, cnpj, inscricao_est, ativo) 
                  values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [2, 'Bar do Zeca', 2, '32324543', '999442121', 'Caminho Novo', null, null, null, null, 1]],
  
  // Pedidos

  [`insert into pedidos (id, cliente_id, data, status, valor_adicional, valor_pago) 
                  values (?, ?, ?, ?, ?, ?)`, [1, 1, '2018-06-07', 'Pendente', 0, 0]],
  [`insert into pedidos_itens (id, pedido_id, produto_id, quantidade, valor_unitario, valor_padrao, valor_total, valor_total_padrao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [1, 1, 1, 2, 142.80, 142.80, 271.60, 271.60]],
  [`insert into pedidos (id, cliente_id, data, status, valor_adicional, valor_pago) 
                  values (?, ?, ?, ?, ?, ?)`, [2, 2, '2018-06-07', 'Pendente', 0, 0]],
  [`insert into pedidos_itens (id, pedido_id, produto_id, quantidade, valor_unitario, valor_padrao, valor_total, valor_total_padrao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [2, 2, 1, 2, 135.80, 135.80, 291.60, 291.60]],
  

 
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
    db.executeSql('select COUNT(id) as qtd from produtos', {})
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
    .catch(e => console.error('Erro ao consultar a qtd de produtos', e));
  }


}