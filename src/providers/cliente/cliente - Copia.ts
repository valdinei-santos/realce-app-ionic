//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';

//import { ICliente } from '../../interfaces/ICliente';

/*
  Generated class for the ClienteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClienteProvider {

  lista:any[];
  chave:string = "cliente";

  constructor(//public http: HttpClient, 
              private storage: Storage,
              private datepipe: DatePipe) {
    console.log('ClienteProvider - constructor');
	
    //this.carregaLista();
	  //this.lista = this.storage.get(this.chave);
  }
  
/*
  carregaLista(){
    console.log('ClienteProvider - carregaLista()');
    this.storage.ready().then(()=>{
      this.storage.get(this.chave).then((registros) => {
        if(registros){
          this.lista = registros;
		      console.log('1');
        }else{
          this.lista = [];
		      console.log('ClienteProvider valdinei');
        }
      });
    });
  }
  
  setStorage(chave, valor){
    console.log('ClienteProvider - setStorage');
    this.storage.set(chave, valor); 
  }
  
  getStorage(chave){
    console.log('ClienteProvider - getStorage');
    return this.storage.get(chave); 
  }
  
  listar(){
    //alert(this.lista);
    console.log('ClienteProvider - listar()');
    return this.lista;
  }
  
  adicionar(registro:any){
    this.storage.ready().then(()=>{
      this.lista.push(registro);
      this.storage.set(this.chave, this.lista);
    });
  }
  
  atualizar(cliente, dados){
    for(let chave in this.lista){
      if(this.lista[chave] == cliente){
        this.lista[chave]= dados;
        this.storage.set(this.chave, this.lista);
      }
    }
  }
*/



public insert(cliente: Cliente) {
    let key = this.datepipe.transform(new Date(), 'ddMMyyyyHHmmss');
    return this.save(key, cliente);
  }

  public update(key: string, cliente: Cliente) {
    return this.save(key, cliente);
  }

  private save(key: string, cliente: Cliente) {
    return this.storage.set(key, cliente);
  }

  public remove(key: string) {
    return this.storage.remove(key);
  }

  public getAll() {
    let clientes: ClienteList[] = [];
    return this.storage.forEach((value: Cliente, key: string, itrationNumber: Number) => {
      let cliente = new ClienteList();
      cliente.key = key;
      cliente.cliente = value;
      clientes.push(cliente);
    })
      .then(()=> {
        return Promise.resolve(clientes);
      })
      .catch((error)=> {
        return Promise.reject(error);
      });
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
}

export class ClienteList {
  key: string;
  cliente: Cliente;
}

