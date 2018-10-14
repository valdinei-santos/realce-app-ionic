import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { DatabaseProvider } from '../database/database';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';


@Injectable()
export class ExpImpDbProvider {

  constructor(private dbProvider: DatabaseProvider,
              private sqlitePorter: SQLitePorter,
              private platform: Platform,
              private file: File) { }

  public export() {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        return this.sqlitePorter.exportDbToSql(db)
          .then((data) => {
            // let fileName : any 		= Date.now() + '.sql';
            console.log(data);
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
        // Gera em /Android/data/br.com.valdinei.realceapp/files
        // return this.file.writeFile(this.file.externalDataDirectory, 'export_sql.txt', JSON.stringify(data), { replace: true })
        return this.file.writeFile(this.file.externalDataDirectory, 'export_sql.txt', blob, { replace: true })
    }
  }

  public alterTable(){
    console.log('alterTable');
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        db.executeSql('ALTER TABLE pedidos ADD avista INTEGER default 0', {})
          .then((data) => {
            console.log(data);
          })
          .catch((e) => console.error(e));
        return db.executeSql('ALTER TABLE pedidos ADD observacao varchar(80)', {})
          .then((data) => {
            console.log(data);
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

}
