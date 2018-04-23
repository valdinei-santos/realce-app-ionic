import { IProduto } from './IProduto';
import { ICliente } from './ICliente';

export interface IPedido{
  id?: number;
  cliente: ICliente;
  data: string;
  status: string;
  itens: IProduto[];
}