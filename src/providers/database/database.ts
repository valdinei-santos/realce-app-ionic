import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

const DATABASES_TABLES = [
  `DROP TABLE IF EXISTS folhas_carga_itens`,
  `DROP TABLE IF EXISTS folhas_carga`,
  `DROP TABLE IF EXISTS pedidos_itens`, 
  `DROP TABLE IF EXISTS pedidos`,
  `DROP TABLE IF EXISTS produtos`,
  `DROP TABLE IF EXISTS produtos_categoria`,
  `DROP TABLE IF EXISTS produtos_marca`,
  `DROP TABLE IF EXISTS produtos_tipo`,
  `DROP TABLE IF EXISTS produtos_vasilhame`,
  `DROP TABLE IF EXISTS produtos_unidade_venda`,
  `DROP TABLE IF EXISTS clientes`,
  `CREATE TABLE IF NOT EXISTS produtos_categoria (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_marca (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_tipo (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_vasilhame (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50) )`,
  `CREATE TABLE IF NOT EXISTS produtos_unidade_venda (id INTEGER PRIMARY KEY AUTOINCREMENT, nome VARCHAR(10) )`,
  `CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        nome_produto VARCHAR(60),
                                        vasilhame_id INTEGER,
                                        unidade_venda_id INTEGER,
                                        preco NUMERIC(10,2),
                                        ativo INTEGER,
                                        observacao VARCHAR(50),
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
                                       valor_pago NUMERIC(10,2)
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
                                                 )`
];


const UNIDADES = [
  /* ['insert into produtos_categoria (nome) values (?)', ['Refri']],  // 1
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
  ['insert into produtos_tipo (nome) values (?)', ['Sub Zero' ]],          // 6 */
  
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

];

/* const PRODUTOS = [
    ['insert into produtos_categoria (nome) values (?)', ['Cerveja garrafa 600ml']],
    ['insert into produtos_categoria (nome) values (?)', ['Cerveja Lata 355ml']],
    ['insert into produtos_categoria (nome) values (?)', ['Cerveja Longneck 350ml']]
]; */
const PRODUTOS = [
  // Cerveja 600ml
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Garrafa', 11, 2, 135.80, true, null]],  
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Skol Garrafa', 11, 2, 142.80, true, null]],  
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Antártica Garrafa', 11, 2, 135.80, true, null]],  
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Antártica Sub Zero Garrafa', 11, 2, 123.60, true, null]],  
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Original Garrafa', 11, 2, 171.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Extra Garrafa', 11, 2, 171.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Bohemia Garrafa', 11, 2, 171.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
  values (?, ?, ?, ?, ?, ?)`, ['Cerveja Heineken Garrafa', 11, 2, 171.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Budweiser Garrafa', 11, 2, 171.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
  values (?, ?, ?, ?, ?, ?)`, ['Cerveja Nova Schin Garrafa', 11, 2, 77.40, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
  values (?, ?, ?, ?, ?, ?)`, ['Cerveja Eisenbahn Garrafa', 11, 2, 158.00, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Pilsen Garrafa', 11, 2, 70.00, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Burguesa Garrafa', 11, 2, 90.00, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Malzebier Garrafa', 11, 2, 171.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Nova Schin Malzebier Garrafa', 11, 2, 96.00, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Pilsen Malzebier Garrafa', 11, 2, 144.00, true, null]],
  
  // Cerveja Litrao 1LT
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Schin Litrão', 12, 1, 56.00, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Litrão', 12, 1, 78.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Skol Litrão', 12, 1, 74.80, true, null]],

  //Long Neck 355ml com 24un
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Skol Long Neck', 9, 2, 66.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Long Neck', 9, 2, 66.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Eisenbahn Long Neck', 9, 2, 92.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Bohemia Long Neck', 9, 2, 92.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Heineken Long Neck', 9, 2, 92.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Stela Long Neck', 9, 2, 92.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Budweiser Long Neck', 9, 2, 92.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Corona Long Neck', 9, 2, 144.00, true, null]],

  //Long Neck 355ml com 12un
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Schin Long Neck Malzebier', 9, 1, 31.00, true, null]],
  //Long Neck 355ml com 25un
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Long Neck Malzebier', 9, 7, 96.80, true, null]],    

  //Profissa 300ml com 23un
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Skol Profissa', 7, 8, 41.20, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Profissa', 7, 8, 41.20, true, null]],
  
  //Lata 355ml com 12un
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Skol Lata', 3, 3, 28.60, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Lata', 3, 3, 28.60, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Antártica Lata', 3, 3, 25.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Antártica Sub Zero Lata', 3, 3, 24.90, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Schin Lata', 3, 3, 22.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Bohemia Lata', 3, 3, 39.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Budweiser Lata', 3, 3, 39.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Heineken Lata', 3, 3, 39.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Burguesa Lata', 3, 3, 23.00, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Brahma Zero Alcool Lata', 3, 3, 35.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Schin sem Alcool Lata', 3, 3, 32.00, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Cerveja Pilsen Preta Lata', 3, 3, 27.80, true, null]],

  // Refri garrafa 600 cx 24un
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Pureza Garrafa', 11, 2, 44.30, true, null]],
  
  // Refri garrafa 290 KS cx 24un
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Coca Cola KS', 15, 2, 41.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Coca Guarana KS', 15, 2, 41.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Pureza KS', 15, 2, 36.00, true, null]],

  // Refri garrafa 255ml Cx 30un
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Laranjinha', 5, 9, 37.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Purezinha', 5, 9, 37.80, true, null]],


  // Refri garrafa 2LT PC 8un
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Coca Cola', 14, 5, 46.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Guaraná', 14, 5, 31.60, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Pureza', 14, 5, 27.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Sabores Coca Cola', 14, 5, 40.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Max Wilheln', 14, 5, 29.60, true, null]],

  // Refri garrafa 2LT PC 6un
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Laranjinha Agua da Serra', 14, 4, 26.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Capricho', 14, 4, 18.50, true, null]],
  
  // Refri garrafa 1,5LT PC 8un
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Coca Cola', 13, 5, 46.80, true, null]],
  
  // Refri garrafa 1,5LT PC 6un
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Guaraná', 13, 4, 46.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Schweppes Citrus', 13, 4, 32.80, true, null]],

  // Refri garrafa 1LT DZ
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Pureza', 12, 3, 39.30, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Água da Serra', 12, 3, 39.80, true, null]],

  // Refri garrafa 600ml DZ
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Coca Cola', 11, 3, 39.60, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Guaraná', 11, 3, 39.60, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
    values (?, ?, ?, ?, ?, ?)`, ['Refri Pureza', 11, 3, 31.80, true, null]],

  // Refri garrafa 350ml DZ
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Refri Pureza', 11, 3, 26.80, true, null]],

  // Refri lata 350ml DZ
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Refri Coca Cola Lata', 3, 3, 25.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Refri Guaraná Lata', 3, 3, 25.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Refri Schweppes Citrus Lata', 3, 3, 32.80, true, null]],

  // Suco
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Suco Sufrech Lata', 8, 3, 36.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Suco Skinka Pet', 16, 3, 28.50, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Suco Tily Pet', 16, 3, 12.30, true, null]],
  // 1LT UN
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Suco Sufrech Tetra Pak', 12, 6, 36.80, true, null]],

  // Refri lata 250ml DZ
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Juninhu Água da Serra', 17, 3, 18.30, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Juninhu Coca Cola', 17, 3, 16.70, true, null]],
  
  // Mate Leão
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Mate Leão', null, 3, 26.80, true, null]],
  
  // Chocoleite
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Chocoleite', 18, 10, 76.00, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Chocoleite', 19, 2, 46.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Chocoleite', 20, 11, 29.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Chocoleite', 7, 2, 69.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Chocoleite Oni Way', null, 2, 62.80, true, null]],

  // Agua 
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Água Vidro', null, 2, 22.00, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Água Sem Gás Sta Catarina', 19, 3, 12.90, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Água Com Gás Sta Catarina', 19, 3, 13.90, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Água Sem Gás', 19, 3, 10.90, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Água Com Gás', 19, 3, 11.90, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Água Sta Catarina', 13, 4, 12.90, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Água', 13, 4, 10.90, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Água', 21, 12, 14.90, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Água Bombona', 22, 6, 8.20, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Água H2O', 19, 3, 32.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Água de Copo', null, 10, 20.50, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Água de Copo Tetra Pak', 18, 11, 49.80, true, null]],
  [`insert into produtos (nome_produto, vasilhame_id, unidade_venda_id, preco, ativo, observacao)
    values (?, ?, ?, ?, ?, ?)`, ['Gatorade', null, 4, 21.60, true, null]],
    

















    // Cerveja Garrafa 600ml
  /* [`insert into produtos (categoria_id, marca_id, tipo_id, vasilhame_id, unidade_venda_id, preco, ativo, observacao) 
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
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [1, 13, null, 11, 5, 17.00, true, null]], */

  // Clientes
  [`insert into clientes (id, nome, codigo, fone, celular, endereco, bairro, cidade, cnpj, inscricao_est, ativo) 
                  values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [1, 'Bar do Passarinho', 1, '32324543', '999442121', 'Praia de Cima', null, null, null, null, 1]],
  [`insert into clientes (id, nome, codigo, fone, celular, endereco, bairro, cidade, cnpj, inscricao_est, ativo) 
                  values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [2, 'Bar do Zeca', 2, '32324543', '999442121', 'Caminho Novo', null, null, null, null, 1]],
  
  // Pedidos
  [`insert into pedidos (id, cliente_id, data, status, valor_adicional, valor_pago) 
                  values (?, ?, ?, ?, ?, ?)`, [1, 1, '2018-06-07', 'Pendente', 0, 0]],
  [`insert into pedidos_itens (id, pedido_id, produto_id, quantidade, valor_unitario, valor_padrao, valor_total, valor_total_padrao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [1, 1, 1, 2, 33.43, 33.43, 66.86, 66.86]],
  [`insert into pedidos (id, cliente_id, data, status, valor_adicional, valor_pago) 
                  values (?, ?, ?, ?, ?, ?)`, [2, 2, '2018-06-07', 'Pendente', 0, 0]],
  [`insert into pedidos_itens (id, pedido_id, produto_id, quantidade, valor_unitario, valor_padrao, valor_total, valor_total_padrao) 
                  values (?, ?, ?, ?, ?, ?, ?, ?)`, [2, 2, 1, 2, 33.43, 33.43, 66.86, 66.86]],

 
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