import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCurrency',
})
export class FormatCurrencyPipe implements PipeTransform {

  transform(value: any, ...args) {
    //return value.toLowerCase();
    return new Intl.NumberFormat('pt-BR').format(value);

    // Para adicionar o simbolo do REAL (R$). Usar o style.
    /* transform(value: any, args?: any): any {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value); */

    // Para possibilitar o envio da parametro locale via PIPE. Ex: {{ valor | formatCurrency:'en-US' }}
    /* transform(value: any, locale = 'pt-BR'): any {
      return new Intl.NumberFormat(locale).format(value); */

  }
}
