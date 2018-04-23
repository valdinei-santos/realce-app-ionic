import { IPedido } from './IPedido';

export interface IFolhacarga{
  id?: number;
  date: string;
  pedidos: IPedido[];
}