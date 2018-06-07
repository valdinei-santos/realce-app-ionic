import { NgModule } from '@angular/core';
import { FormatCurrencyPipe } from './format-currency/format-currency';
import { FormatDatePipe } from './format-date/format-date';
@NgModule({
	declarations: [FormatCurrencyPipe,
    FormatDatePipe],
	imports: [],
	exports: [FormatCurrencyPipe,
    FormatDatePipe]
})
export class PipesModule {}
