import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClienteProvider, Cliente } from '../../providers/cliente/cliente';
import { ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-cadastro-cliente',
  templateUrl: 'cadastro-cliente.html',
})
export class CadastroClientePage {
  
  myForm: FormGroup;
  cliente: Cliente = new Cliente(); 
  editando:boolean = false;
  model: Cliente;
  key: string;
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
			        public clienteProvider:ClienteProvider,
			        public toast: ToastController) {

    this.model = new Cliente();
    this.myForm = this.createForm(); 
  }

  ionViewDidLoad() {
    if (this.navParams.data.id) { // Edit
      this.editando = true;
      this.clienteProvider.get(this.navParams.data.id)
        .then((result: Cliente) => {
          this.model = result;
          this.myForm.patchValue(result);
        })
        .catch(() => {
          this.toast.create({ message: 'Erro ao carregar um cliente.', duration: 3000, position: 'botton' }).present();
      });
    } else {
      this.editando = false;
    }
  }

  protected createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(""),
      nome: new FormControl("", Validators.required),
      codigo: new FormControl(""),
      fone: new FormControl(""),
      celular: new FormControl("", Validators.required),
      endereco: new FormControl("", Validators.required),
      bairro: new FormControl(""),
      cidade: new FormControl(""),
      cnpj: new FormControl(""),
      inscricao_est: new FormControl(""),
    });
  }

  save() {
    if (this.saveCliente()) {
      this.toast.create({ message: 'Cliente salvo!', duration: 3000, position: 'center' }).present();
      if (this.navParams.data.isEdit) {
        this.navCtrl.getPrevious().data.editBack = true;
      }
      this.navCtrl.pop();
    } else {
      this.toast.create({ message: 'Erro ao salvar o Cliente!', duration: 3000, position: 'center' }).present();
    }
  }

  private saveCliente() {
    const newCliente: Cliente = this.myForm.getRawValue();
    if (newCliente.id) {
      return this.clienteProvider.update(newCliente);
    } else {
      return this.clienteProvider.insert(newCliente);
    }
  }
  
  cancelar(){
    //this.navCtrl.setRoot(HomePage);
    this.navCtrl.pop();
  }
  

}
