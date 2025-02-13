import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { DatabaseProvider } from '../database/database';
import { Platform, ToastController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
//import { FilePath } from '@ionic-native/file-path';


const PRODUTOS = [
  ["CREATE TABLE IF NOT EXISTS versao (nr_versao INTEGER)"],
  ["INSERT OR REPLACE INTO versao (nr_versao) VALUES (5)"],
  ["CREATE TABLE IF NOT EXISTS produtos_bkp as select * from produtos"],
  ["DROP TABLE IF EXISTS produtos"],
  ["CREATE TABLE IF NOT EXISTS produtos_grupo_carga (id INTEGER PRIMARY KEY AUTOINCREMENT, numero INTEGER default 0, nome VARCHAR(30) )"],
  [`CREATE TABLE IF NOT EXISTS produtos (id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_produto VARCHAR(60),
    categoria_id INTEGER,
    vasilhame_id INTEGER,
    unidade_venda_id INTEGER,
    preco NUMERIC(10,2),
    ativo INTEGER,
    observacao VARCHAR(50),
    grupo_carga_id INTEGER,
    FOREIGN KEY(categoria_id) REFERENCES produtos_categoria(id),
    FOREIGN KEY(vasilhame_id) REFERENCES produtos_vasilhame(id),
    FOREIGN KEY(unidade_venda_id) REFERENCES produtos_unidade_venda(id),
    FOREIGN KEY(grupo_carga_id) REFERENCES produtos_grupo_carga(id)
   )`],
  //["insert into produtos select * from produtos_bkp "]
  //["ALTER TABLE produtos ADD grupo_carga_id INTEGER default 1"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (1,0,'Sem grupo')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (2,10,'Garrafa 600ml')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (3,11,'Garrafa KS')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (4,12,'Garrafinhas')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (5,20,'Cerveja Lata')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (6,30,'Refri Lata')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (7,40,'Long Neck')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (8,50,'Aguas')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (9,60,'Pets 600ml')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (10,70,'Pets 1, 1.5 e 2LT')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (11,80,'Juninho, Suco, Gatorade')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (12,90,'Destilados')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (13,91,'Descartáveis')"],
  ["INSERT OR REPLACE INTO `produtos_grupo_carga`(id,numero,nome) VALUES (14,99,'Agua Bombona')"],

  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('1','Cerveja garrafa Brahma','1','11','2','145.8','1',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('2','Cerveja garrafa Skol','1','11','2','142.8','1',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('3','Cerveja garrafa Antártica','1','11','2','142.8','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('4','Cerveja garrafa Antartica Sub Zero','1','11','2','128.8','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('5','Cerveja garrafa Original','1','11','2','169.8','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('6','Cerveja garrafa Brahma Extra','1','11','2','169.8','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('7','Cerveja garrafa Bohemia','1','11','2','169.8','false',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('8','Cerveja garrafa Heineken','1','11','2','172.8','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('9','Cerveja garrafa Budweiser','1','11','2','169.8','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('10','Cerveja garrafa Nova Schin','1','11','2','81.8','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('11','Cerveja garrafa Eisembahn','1','11','2','169.8','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('12','Cerveja garrafa Pilsen','1','11','2','70','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('13','Cerveja garrafa Burguesa','1','11','2','90','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('14','Cerveja garrafa Brahma Malzebier','1','11','2','172.8','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('15','Cerveja garrafa Nova Schin Malzebier','1','11','2','99.8','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('16','Cerveja garrafa Pilsen Malzebier','1','11','2','86.9','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('17','Cerveja Litrão Schin','1','12','1','57.5','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('18','Cerveja Litrão Brahma','1','12','1','86.5','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('19','Cerveja Litrão Skol','1','12','1','86.5','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('20','Cerveja long neck Skol','1','9','2','86.8','true',NULL,7)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('21','Cerveja long neck Brahma','1','9','2','86.8','true',NULL,7)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('22','Cerveja long neck Eisembahn','1','9','2','96.9','true',NULL,7)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('23','Cerveja long neck Bohemia','1','9','2','96.9','true',NULL,7)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('24','Cerveja long neck Heineken','1','9','2','99.8','true',NULL,7)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('25','Cerveja long neck Stella','1','9','2','96.9','true',NULL,7)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('26','Cerveja long neck Budweiser','1','9','10','96.9','true',NULL,7)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('27','Cerveja long neck Corona','1','9','2','144','true',NULL,7)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('28','Cerveja long neck Schin Malzebier','1','9','1','35','true',NULL,7)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('29','Cerveja long neck Brahma Malzebier','1','9','2','99.8','true',NULL,7)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('30','Cerveja long neck Skol Beats','1','9','2','119','true',NULL,7)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('31','Cerveja Skol Profissa','1','7','8','45.7','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('32','Cerveja Brahma Profissa','1','7','8','45.7','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('33','Cerveja lata Skol','1','3','3','28.9','true',NULL,5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('34','Cerveja lata Brahma','1','3','3','28.9','true',NULL,5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('35','Cerveja lata Antartica','1','3','3','26.9','true',NULL,5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('36','Cerveja lata Antartica Sub Zero','1','3','3','24.9','true',NULL,5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('37','Cerveja lata Schin','1','3','3','23.9','true',NULL,5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('38','Cerveja lata Bohemia','1','3','3','39.8','true',NULL,5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('39','Cerveja lata Budweiser','1','3','3','39.8','true',NULL,5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('40','Cerveja lata Heineken','1','3','3','44.9','true',NULL,5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('42','Cerveja lata Brahma S/ Alcool','1','3','3','35.9','true',NULL,5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('43','Cerveja lata Schin sem Alcool','1','3','3','33.8','true',NULL,5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('45','Cerveja lata Amstel','1','3','3','31.8','true',NULL,5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('46','Skol Beats Lata','1','25','5','31','true',NULL,5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('47','Refri Pureza Garrafa','2','11','2','47.5','true',NULL,2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('48','Refri KS Coca Cola','2','15','2','42.9','true',NULL,3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('49','Refri KS Guarana','2','15','2','42.9','true',NULL,3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('50','Refri KS Pureza','2','15','2','37.5','true',NULL,3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('51','Refri laranjinha água da serra','2','18','9','39.8','true',NULL,4)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('52','Refri Purezinha','2','18','9','39.8','true',NULL,4)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('53','Refri Coca Cola','2','14','5','48.7','true',NULL,10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('54','Refri Guarana','2','14','4','33.5','true',NULL,10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('55','Refri Pureza','2','14','4','28.9','true',NULL,10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('56','Refri lata Coca Cola zero','2','3','3','27.9','true',NULL,6)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('57','Refri Max Wilheln guarana ','2','14','5','29.8','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('58','Refri Agua da Serra laranjinha','2','14','4','27.8','true',NULL,10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('60','Refri Coca Cola','2','13','5','38.9','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('63','Refri Pureza','2','12','3','39.8','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('64','Refri Agua da Serra laranjinha ','2','12','3','39.8','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('65','Refri Coca Cola','2','11','3','41.9','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('66','Refri Guarana','2','11','3','41.9','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('67','Refri Pureza','2','11','3','32.8','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('68','Refri Pureza','2','3','3','29.8','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('69','Refri lata Coca Cola','2','3','3','27.9','true',NULL,6)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('70','Refri lata Guarana','2','3','3','27.9','true',NULL,6)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('71','Refri Schweppes Citrus Lata','2','3','3','33.9','true',NULL,6)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('73','Suco Skinka Pet','2','16','3','29.8','true',NULL,10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('74','Suco Tily cítrico ','2','16','3','12.9','true',NULL,10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('77','Refri Coca Cola juninho','2','18','3','16.9','true',NULL,11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('78','Mate Leão copo limão','2','18','3','26.9','true',NULL,11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('80','Chocoleite','2','18','10','79.8','true',NULL,4)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('81','Chocoleite','2','27','1','46.8','true',NULL,11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('82','Chocoleite','2','20','11','31.9','true',NULL,11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('83','Chocoleite','2','28','2','59.8','true',NULL,11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('84','Chocoleite Oni Way','2',NULL,'2','62.8','true',NULL,11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('86','Agua Sem Gás Sta Catarina','2','19','3','12.9','true',NULL,8)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('87','Agua Com Gás Sta Catarina','2','19','3','13.9','true',NULL,8)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('88','Agua fonte life Sem Gás','2','19','3','11.9','true',NULL,8)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('89','Agua fonte life Com Gás','2','19','3','12.9','true',NULL,8)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('91','Agua fonte Life ','2','13','3','23.8','true',NULL,8)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('92','Agua 5lts ','2','21','12','14.9','true',NULL,8)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('93','Agua Bombona','2','22','6','8.5','true',NULL,14)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('94','Agua H2o limão ','2','19','3','33.9','true',NULL,8)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('96','Agua de côco caixinha ','2','18','2','50.9','true',NULL,8)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('97','Gatorade laranja','2','19','4','25.9','true',NULL,11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('98','Energetico Red Horse','2','6','3','38.4','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('99','Energetico Red Horse','2','12','4','43.8','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('100','Energetico Red Horse','2','14','4','51','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('101','Energetico Red Horse Lata','2','9','3','46.8','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('102','Energetico Baly','2','12','4','47.4','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('103','Energetico Baly','2','17','3','45','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('104','Energetico Baly','2','14','4','57','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('105','Energetico Baly lata','2','9','3','49.8','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('106','Energetico Red Bull Lata','2','9','6','7.5','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('107','Energetico Safadao','2','14','4','37.8','true',NULL,0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('110','Vinho Vô Luiz garrafão tinto suave','3','21','6','39.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('111','Cana Garrafao','3','21','6','19.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('113','Vinho Campo Largo Tinto seco','3','12','6','9.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('114','Vinho Campo Largo Pessego','3','12','6','14.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('115','Vinho salton tinto suave ','3','12','6','29.6','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('116','Vinho Vô Luiz Tinto suave ','3','12','6','11.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('117','Vinho sangue da Uva tinto suave ','3','12','6','8.5','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('118','Vinho Randon Tinto suave ','3','12','6','8.5','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('119','Espumante Lunnar','3','23','6','21.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('121','Espumante Salton moscatel ','3','23','6','33.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('122','Espumante Terra Nova moscatel ','3','23','6','33.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('123','Espumante Sem Alcool','3','23','6','18.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('124','Sidra','3','23','6','6.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('125','Abcinto','3',NULL,'6','43.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('126','Amarula','3','12','6','92.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('127','Marula','3',NULL,'6','39.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('129','Bacardi Big Apple','3','12','6','35.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('130','Bacardi Limao','3','12','6','35.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('132','Bitter Pingo de Ouro','3','12','6','6.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('133','Butia Litro','3',NULL,'6','7.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('136','Campari','3','12','6','39.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('137','Cana 51','3',NULL,'6','7.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('138','Cana 51 Ouro','3','12','6','11.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('139','Cana Ypioca Prata','3','12','6','15.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('140','Cana Ypioca palha','3','12','6','16.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('141','Cana Ypioca Lemon','3','12','6','27.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('142','Cana Ypioca Organica','3','12','6','15.9','false',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('143','Cana Ypioca Ouro','3','12','6','15.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('145','Cana Velho Barreiro','3','12','6','7.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('146','Cana Velho Barreiro Gold','3','12','6','11.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('147','Cana Velho Barreiro Limão','3','12','6','12.9','false',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('149','Canelinha Pingo de Ouro','3','12','6','6.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('150','Catuaba Pingo de Ouro','3','12','6','6.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('151','Catuaba Selvagem','3','12','6','13.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('152','Catuaba Açai Pingo de Ouro','3','12','6','7.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('153','Conhaque Alcatrão ','3','12','6','16.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('154','Conhaque Delber','3','12','6','5.5','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('155','Conhaque Domecq','3','12','6','35.6','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('156','Conhaque Dreher','3','12','6','13.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('157','Gin Rock''s','3','12','6','28.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('159','Licor de Cacau','3',NULL,'6','30.75','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('160','Malibu','3','12','6','54.6','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('161','Batida de maracujá Joinville','3','12','6','10.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('162','Batida de maracujá Pingo de Ouro','3','12','6','7.5','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('163','Martine','3','12','6','26.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('164','Menta Vidro','3','12','6','6.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('165','Montila','3','12','6','28.6','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('166','Montila Limao','3','12','6','28.6','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('169','Undemberger','3','12','6','42.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('171','Jagermeister','3',NULL,'6','89','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('173','Vermuth Urú','3','12','6','7.2','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('174','Tequila José Cuervo Ouro','3','12','6','96','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('175','Tequila José Cuervo Prata','3','12','6','96','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('176','Tequileiro Ouro ','3','12','6','56','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('177','Júrupinga','3','12','6','21.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('178','Júrodrinks','3','12','6','8.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('179','Cana 3 Pipas','3','12','3','49.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('180','Cana Serra Azul','3','12','3','53.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('181','Cana Kreff','3','12','3','34.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('182','Vodka Absolut','3','12','6','89.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('183','Vodka Natasha','3','12','6','16.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('184','Vodka Orloff','3','12','6','26.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('186','Vodka Valessa','3','12','6','11.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('187','Vodka Raiska','3','12','6','16.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('188','Vodka Raiska Limao','3','12','6','18.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('189','Vodka Raiska Apple','3','12','6','19.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('190','Vodka Sky','3','12','6','36.5','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('191','Vodka Smirnoff','3','12','6','34.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('192','Vodka Belkoff Vidro','3','12','6','6.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('193','Vodka Kisla','3','12','6','9.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('195','Vodka Smirnoff Ice','3','3','6','5.6','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('196','Vodka Kisla Ice','3','3','4','3.2','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('197','Whisky Cavalo Branco','3','12','6','89.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('198','Whisky Johnnie Walker Black','3','12','6','155','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('199','Whisky Johnnie Walker Red','3','12','6','93.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('200','Whisky Jack Danils','3','12','6','139.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('201','Whisky Ballantines','3','12','6','89.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('202','Whisky Drurys','3','12','6','29.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('203','Whisky Nattu Nobilis','3','12','6','32.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('204','Whisky Bells','3','12','6','46.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('205','Whisky Old Eight','3','12','6','38.5','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('206','Whisky Passport','3','12','6','46.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('207','Whisky Black Stone','3','12','6','16.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('208','Quentao Litro','3',NULL,'6','9.8','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('209','Saque','3',NULL,'6','38.9','true',NULL,12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('210','Copo PVC 180ml','4',NULL,'13','4.9','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('211','Copo PVC 300ml','4',NULL,'13','6.25','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('212','Copo PVC 400ml','4',NULL,'14','7.9','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('213','Copo PVC 500ml','4',NULL,'14','7.9','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('214','Copo PVC 700ml','4',NULL,'14','8.9','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('215','Copo Isopor','4',NULL,'15','3.9','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('216','Copo Acrilico','4',NULL,'16','7.9','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('217','Copo Cerveja Grosso','4',NULL,'2','29.8','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('218','Copo Buteco','4',NULL,'2','39.8','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('219','Copo Cerveja Peq.Fino','4',NULL,'2','84.8','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('220','Copo de Pinga fundo Grosso ','4',NULL,'6','2.95','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('221','Copo Americano Grande','4',NULL,'6','2.75','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('222','Copo Americano Pequeno','4',NULL,'2','29.8','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('223','Copo Liso Suco','4','2','6','4.75','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('224','Copo Whisky','4',NULL,'6','4.5','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('226','Canudo Embalado C/100','4',NULL,'6','4.5','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('227','Prato PVC 21','4',NULL,'17','2.9','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('228','Prato PVC 23','4',NULL,'17','3.9','false',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('229','Prato PVC 26','4',NULL,'17','4.5','true',NULL,13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('231','Batida de limão pingo de ouro','3','12','6','6.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('232','Batida de limão pingo de ouro c/ mel','3','12','6','6.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('233','Chocoleite','2','18','1','19.8','true','',4)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('235','Raiz amarga pingo de ouro','3','12','6','7.2','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('236','Raiz amarga urú','3','12','6','7.2','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('237','Vinho Randon garrafão tinto suave','3','21','6','31.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('238','Vinho Randon garrafão tinto seco','3','21','6','31.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('239','Vinho Randon garrafão branco suave','3','21','6','31.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('240','Vinho Randon garrafão branco seco','3','21','6','31.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('241','Cerveja garrafa Heineken ','1','11','1','85.9','true','',2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('242','Vermuth c/ selo','3','12','6','7.6','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('243','Bitter pingo de ouro c/ selo','3','12','6','7.6','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('245','Refri lata Fanta laranja','2','3','3','27.9','true','',6)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('246','Refri lata Fanta uva','2','3','3','27.9','true','',6)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('248','Gatorade Uva','2','19','4','25.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('249','Fanta laranja 2 LT','2','14','5','44.7','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('250','Vinho Campo Largo Tinto Suave','3','12','6','9.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('251','Vinho Campo Largo branco suave','3','12','6','9.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('252','Vinho Campo Largo branco seco','3','12','6','9.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('253','Vinho Vô Luiz garrafão tinto seco','3','21','6','39.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('254','Vinho Vô Luiz garrafão branco suave ','3','21','6','39.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('255','Vinho Vô Luiz garrafão branco seco','3','21','6','39.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('256','Refri lata tônica','2','3','3','27.9','true','',6)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('258','Refri Juninho água da Serra laranjinha','2','17','3','18.9','true','',0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('260','Refri KS Fanta laranja','2','15','2','42.9','true','',3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('261','Refri KS Sprite','2','15','2','42.9','true','',3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('262','Refri KS Coca cola zero','2','15','2','42.9','true','',3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('263','Refri KS Tônica','2','15','2','42.9','true','',3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('264','Cerveja long neck Brahma malzebier','1','9','1','49.9','true','',7)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('265','Cerveja Brahma S/ Álcool profissa','1','7','8','45.7','true','',2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('266','Cerveja lata Eisembahn','1','3','3','40.9','true','',5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('267','Suco  Sufresh lata uva','2','3','4','18.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('268','Suco Sufresh lata morango','2','3','3','36.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('269','Suco Sufresh lata morango','2','3','4','18.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('270','Suco Sufresh lata laranja','2','3','3','36.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('271','Suco Sufresh lata laranja','2','3','4','18.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('273','Suco Sufresh lata maracujá','2','3','3','36.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('274','Suco Sufresh lata maracujá','2','3','4','18.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('275','Suco Sufresh lata goiaba','2','3','3','36.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('276','Suco Sufresh lata goiaba','2','3','4','18.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('277','Suco Sufresh lata pêssego','2','3','3','36.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('278','Suco Sufresh lata pêssego ','2','3','4','18.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('279','Suco Sufresh lata manga','2','3','3','36.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('280','Suco Sufresh lata manga','2','3','4','18.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('281','Suco Sufresh lata caju','2','3','3','36.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('282','Suco Sufresh lata caju','2','3','4','18.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('283','Suco Sufresh LT uva','2','12','4','28.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('284','Suco Sufresh LT morango','2','12','3','56.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('285','Suco Sufresh LT morango','2','12','4','28.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('286','Suco Sufresh LT maracujá','2','12','3','56.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('287','Suco Sufresh LT maracujá','2','12','4','28.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('288','Suco Sufresh lata abacaxi','2','3','3','36.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('290','Suco Sufresh LT pessego','2','12','3','56.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('291','Suco Sufresh LT pessego','2','12','4','28.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('292','Suco Sufresh LT caju','2','12','3','56.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('293','Suco Sufresh LT caju','2','12','4','28.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('294','Suco Sufresh LT abacaxi','2','12','3','56.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('295','Suco Sufresh LT abacaxi','2','12','4','28.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('296','Suco Sufresh LT uva','2','12','3','56.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('297','Suco Sufresh LT laranja','2','12','3','56.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('298','Suco Sufresh LT laranja','2','12','4','28.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('299','Suco Sufresh LT goiaba','2','12','3','56.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('300','Suco Sufresh LT goiaba','2','12','4','28.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('302','Refri lata Guarana zero','2','3','3','27.9','true','',6)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('303','Refri água da serra limão','2','14','4','26.8','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('304','Refri água da serra limão','2','12','3','39.8','true','',0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('306','Refri juninho água da serra uva','2','17','3','18.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('307','Refri juninho água da serra framboesa ','2','17','3','18.9','true','',08)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('308','Refri juninho água da serra cola','2','17','3','18.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('309','Refri juninho água da serra guaraná','2','17','3','18.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('310','Refri Coca Cola zero','2','11','3','41.9','true','',9)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('311','Refri Fanta laranja ','2','11','3','41.9','true','',9)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('312','Refri Sprite','2','11','3','39.9','true','',9)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('313','Refri Guarana zero','2','11','3','41.9','true','',9)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('314','Refri fanta laranja ','2','14','5','42.9','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('315','Refri sprite ','2','14','5','44.7','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('316','Refri Coca Cola zero ','2','14','5','48.9','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('317','Refri fanta uva ','2','14','5','44.7','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('318','Refri guarana zero ','2','14','4','31.9','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('319','Refri Max Willian laranjinha ','2','14','5','29.8','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('320','Refri Max Willian laranja','2','14','5','29.8','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('321','Refri Max Willian limao','2','14','5','29.8','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('322','Refri Max Willian uva ','2','14','5','29.8','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('323','Refri Max Willian cola','2','14','5','29.8','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('324','Refri Max Willian framboesa ','2','14','5','29.8','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('325','Refri agua da serra garrafa laranjinha','2','11','2','47.5','true','',4)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('326','Refri agua da serra garrafa limao','2','11','2','47.5','true','',4)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('328','Refri agua da serra garrafa abacaxi','2','11','2','47.5','true','',4)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('329','Refri juninho água da serra limao ','2','17','1','18.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('330','Mate Leão copo natural','2','18','3','26.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('331','Mate Leão copo pawer','2','18','3','26.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('332','Mate Leão copo açaí','2','18','3','26.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('333','Suco Tily maracujá','2','16','3','12.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('334','Suco Tily abacaxi ','2','16','3','12.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('335','Suco Tily abacaxi com hortelã ','2','27','3','12.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('336','Suco Tily uva ','2','16','3','12.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('337','Suco Tily morango','2','16','3','12.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('338','Vinho garrafão Sangue da Uva branco suave','2','21','6','31.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('340','Vinho garrafão Sangue da Uva branco seco','3','21','6','31.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('341','Vinho garrafão Sangue da Uva tinto suave','3','21','6','31.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('342','Vinho garrafão Sangue da Uva tinto seco ','3','21','6','31.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('343','Vinho Randon Tinto seco','3','12','6','8.5','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('345','Vinho Randon branco seco ','3','12','6','8.5','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('349','Vinho sangue da Uva tinto seco ','3','12','6','8.5','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('350','Vinho sangue da Uva branco suave ','3','12','6','8.5','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('351','Vinho sangue da Uva branco seco ','3','12','6','8.5','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('352','Gatorade morango ','2','19','4','25.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('353','Gatorade maracujá ','2','19','4','25.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('354','Gatorade limão ','2','19','4','25.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('355','Gatorade frutas cítricas ','2','19','4','25.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('356','Gatorade tangerina ','2','19','4','25.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('357','Refri Purezinha','2','18','1','16.2','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('358','Chocoleite','2','18','20','24.8','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('359','Refri laranjinha água da serra','2','18','1','16.2','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('360','Refri laranjinha água da serra','2','18','20','19.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('361','Refri Purezinha','2','18','20','19.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('362','Vinho salton tinto seco ','3','12','6','29.6','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('363','Vinho salton branco suave ','3','12','6','29.6','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('364','Vinho salton branco seco ','3','12','6','29.6','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('365','Vinho Randon branco suave ','3','12','6','8.5','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('366','Vinho Vô Luiz Tinto seco ','3','12','6','11.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('367','Vinho Vô Luiz branco suave ','3','12','6','11.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('368','Vinho Vô Luiz branco seco ','3','12','6','11.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('369','Espumante Salton brutt','3','23','6','33.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('370','Espumante Terra Nova brutt','3','23','6','33.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('371','Batida de côco','3','12','6','6.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('372','Batida de Amendoim ','3','12','6','6.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('373','Batida de Amendoim c/selo','3','12','6','7.6','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('374','Batida de côco c/selo ','3','12','6','7.6','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('375','Batida de limão pingo de ouro c/selo','3','12','6','7.6','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('376','Batida de maracujá pingo de ouro c/selo','3','12','6','7.6','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('377','Catuaba Pingo de Ouro c/selo','3','12','6','7.6','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('378','Menta Vidro c/selo','3','12','6','7.6','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('379','Raiz Amarga c/selo','3','12','6','7.6','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('380','Steinhager','3','12','6','31.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('381','Tequileiro Prata ','3','12','6','56','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('382','51 ice','3','3','4','3.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('383','Agua de copo ','2','18','2','24.8','true','',8)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('384','Copo de Pinga Pequeno ','4','','6','2.95','true','',13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('386','Cerveja lata Malzebier Pilsen','1','3','3','29.8','true','',5)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('395','Refri KS Coca Cola','2','15','1','21.45','true','',3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('396','Cana Serra azul c/ selo','3','12','1','59.8','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('398','Refri KS Fanta laranja','2','15','1','21.45','true','',3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('401','Copo Americano pequeno','2','18','3','14.9','true','',13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('402','Refri KS Pureza','2','15','1','18.75','true','',3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('403','Refri ks coca cola zero','2','15','1','21.45','true','',3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('404','Refri ks sprite','2','15','1','21.45','true','',3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('405','Refri lata sprite ','2','9','3','27.9','true','',6)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('406','Chocoleite ','2','18','2','39.9','true','',4)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('407','Gin Gordon''s','3','12','6','57.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('408','Cerveja garrafa Brahma','1','11','1','72.9','true','',2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('409','Cerveja garrafa original ','1','11','1','84.9','true','',2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('410','Chocoleite ','2','18','9','49.5','true','',4)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('411','Refri KS Guarana','2','15','1','21.45','true','',3)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('412','Bacardi','3','12','6','35','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('413','Cerveja garrafa Eisembahn','1','11','1','84.9','true','',2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('414','Cana Serra azul','3','12','19','26.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('416','Refri Pureza garrafa','2','11','1','23.75','true','',2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('417','Copo liso ','2','31','6','5.75','true','',13)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('418','Cerveja garrafa skol','1','11','1','71.4','true','',2)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('419','Refri Coca Cola ','2','14','12','24.35','true','',0)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('420','Fanta laranja 2 lt','2','14','12','22.35','true','',10)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('421','Cana 3 Pipas c/ selo','3','12','3','56.9','true','',12)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('422','Suco Sufresh lata abacaxi ','2','9','4','28.4','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('423','Suco Sufresh lata uva','2','9','3','36.9','true','',11)"],
  ["INSERT OR REPLACE INTO produtos(id,`nome_produto`,`categoria_id`,`vasilhame_id`,`unidade_venda_id`,preco,ativo,observacao,grupo_carga_id) VALUES ('424','Gelo para uma térmica ','2','','6','35','true','',14)"],
];



@Injectable()
export class ExpImpDbProvider {

  constructor(private dbProvider: DatabaseProvider,
              private sqlitePorter: SQLitePorter,
              private platform: Platform,
              private file: File, 
              private filePath: FilePath,
              private fileChooser: FileChooser,
              private toast: ToastController,
              ) { }

  public import() {
    //let sqlFile;
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        this.fileChooser.open()
          .then(uri => {
            console.log('URI: ', uri);
            this.filePath.resolveNativePath(uri)
              .then((arq) => { 
                //var blob = new Blob([arq.substr(7)], { type: 'text/plain' });
                //this.file.readAsText(arq.substr(7,arq.lastIndexOf('/')), arq.substr(arq.lastIndexOf('/')) )
                  this.file.readAsText(
                    arq.substr(0,arq.lastIndexOf('/')), 
                    arq.substr(arq.lastIndexOf('/') + 1) 
                  )
                  .then((res: string) => { 
                    console.log('OK');
                    this.sqlitePorter.importSqlToDb(db, res)
                    .then((data) => {
                      console.log(data);
                      this.toast.create({ message: 'Banco de Dados restaurado com Sucesso!!!', duration: 3000, position: 'botton' }).present();
                      //var blob = new Blob([data], { type: 'text/plain' });
                      //return this.file.readAsText(this.file.externalDataDirectory, sqlFile)
                    })
                    .catch((e) => {
                      console.log(e);
                      this.toast.create({ message: 'Erro ao restaurar o Banco de Dados.', duration: 3000, position: 'botton' }).present();
                    }); 
                  })
                  .catch((e) => { 
                    this.toast.create({ message: 'Erro ao resolver Nome Arquivo.', duration: 3000, position: 'botton' }).present(); 
                  })
              })
              .catch((error) => { 
                this.toast.create({ message: 'Erro ao resolver PATH.', duration: 3000, position: 'botton' }).present(); 
              })
          })
          .catch(e => {
            this.toast.create({ message: 'Erro ao escolher arquivo.', duration: 3000, position: 'botton' }).present();
          });
      })
      .catch((e) => {
        this.toast.create({ message: 'Erro ao abrir o Banco de Dados.', duration: 3000, position: 'botton' }).present();
      });
  }


  public export() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        return this.sqlitePorter.exportDbToSql(db)
          .then((data) => {
            // let fileName : any 		= Date.now() + '.sql';
            // console.log(data);
            this.writeFile(data);
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }


  private writeFile(data) {
    if (this.platform.is('cordova')) {
      // this.pdfObj.getBuffer((buffer) => {
      //  var blob = new Blob([buffer], { type: 'application/pdf' });
 
        var blob = new Blob([data], { type: 'text/plain' });
        var dt_atual = this.getDateHourNow();
        // Gera em /Android/data/br.com.valdinei.realceapp/files
        // return this.file.writeFile(this.file.externalDataDirectory, 'export_sql.txt', JSON.stringify(data), { replace: true })
        return this.file.writeFile(this.file.externalDataDirectory, 'backup_'+dt_atual+'.txt', blob, { replace: true })
    }
  }


  private getDateHourNow() {
    let now = new Date();
    let year = "" + now.getFullYear();
    let month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    let day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    let hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    let minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    //let second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return year + month + day + hour + minute;
  }


  public alterTable(){
    // console.log('alterTable');
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        /* db.executeSql('ALTER TABLE produtos ADD grupo_carga INTEGER default 0', {})
          .then((data) => {
            console.log(data);
          })
          .catch((e) => console.error(e)); */
        return db.executeSql('ALTER TABLE produtos ADD grupo_carga INTEGER default 0', {})
          .then((data) => {
            console.log(data);
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public insertProdutos() {
    // console.log('insertProdutos');
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        db.sqlBatch(PRODUTOS)
          .then(() => console.log('Dados produtos atualizados ou incluídos'))
          .catch(e => console.error('Erro ao incluir dados produtos', e));
      })
      .catch((e) => console.error(e));
  }

  correctPath(fileUri: string): Promise<string> {
    if (this.platform.is('android')) {
      return this.filePath.resolveNativePath(fileUri);
        /* .then(res => {
          console.log(res);
          return res;
        })
        .catch(err => console.log(err)); */
    } else {
      return Promise.resolve('nok');
    }
  }

  
  // Desativado por que teria que voltar um promise.
  /* getFileSql(arq: string): string {
    console.log('SUB1: ', arq.substr(0, arq.lastIndexOf('/')));
    console.log('SUB2: ', arq.substr(arq.lastIndexOf('/') + 1))
    console.log('Numero: ', arq.lastIndexOf('\/'), arq.lastIndexOf('/') );
    this.file.readAsText(
      arq.substr(0,arq.lastIndexOf('/')), 
      arq.substr(arq.lastIndexOf('/') + 1) 
    )
    .then((res: string) => { 
      console.log('OK');
      return res;
    }).catch((e) => { 
      console.log('NOK');
      console.log(e)
      //return 'NOK'
    })
    console.log('NADA');
    return '';
  } */


}
