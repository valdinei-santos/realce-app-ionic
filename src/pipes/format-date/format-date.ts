import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {

  transform(value: any, ...args) {
    //return value.toLowerCase();
    if (value) {
	    if (value.length < 10) {
	      return value;
	    }
	    const dateArray = value.split('-');
	    if (dateArray.length !== 3) {
	      return value;
	    }
	    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
	    return Intl.DateTimeFormat('pt-BR').format(date);

	    // Para poder passar o locale como parametro e formatar conforme o parametro passado. Ex: (item.date_launch | formatDate:'en-US')
	    /* transform(value: any, locale = 'pt-BR'): any {
	      if (value.length < 10) {
	        return value;
	      }
	      const dateArray = value.split('-');
	      if (dateArray.length !== 3) {
	        return value;
	      }
	      let date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
	      return Intl.DateTimeFormat(locale).format(date); */
	}
  }

}
