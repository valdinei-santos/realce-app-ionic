import { Directive, Attribute } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[mask]', // Attribute selector
  host: {
    '(keyup)': 'onInputChange($event)'
  }
})
export class MaskDirective {
    maskPattern: string;
    placeHolderCounts: number;
    dividers: string[];
    modelValue: string;
    viewValue: string;

    constructor(public model: NgModel,
                @Attribute("mask") maskPattern: string) {
        console.log('Hello MaskDirective Directive');
        this.dividers = maskPattern.replace(/\*/g, "").split("");
        this.dividers.push(" ");
        this.generatePattern(maskPattern);
    }

    onInputChange(event) {
      console.log('mask - onInputChange');
      this.modelValue = this.getModelValue(event);
      let stringToFormat = this.modelValue;
      if (stringToFormat.length < 10) {
          stringToFormat = this.padString(stringToFormat);
      }

      this.viewValue = this.format(stringToFormat);
      this.writeValue(event.target, this.viewValue);
    }

    writeValue(target, value) {
      console.log('mask - writeValue');
        return target.value = value;
    }

    generatePattern(patternString) {
      console.log('mask - generatePattern');
        this.placeHolderCounts = (patternString.match(/\*/g) || []).length;
        for (let i = 0; i < this.placeHolderCounts; i++) {
            patternString = patternString.replace('*', "{" + i + "}");
        }
        this.maskPattern = patternString;
    }

    format(s) {
        console.log('mask - format');
        var formattedString = this.maskPattern;
        for (let i = 0; i < this.placeHolderCounts; i++) {
            formattedString = formattedString.replace("{" + i + "}", s.charAt(i));
        }
        return formattedString;
    }

    padString(s) {
        console.log('mask - padString');
        var pad = "          ";
        return (s + pad).substring(0, pad.length);
    }

    getModelValue(event) {
        console.log('mask - getModelValue');
        var modelValue = event.target.value;
        for (var i = 0; i < this.dividers.length; i++) {
            while (modelValue.indexOf(this.dividers[i]) > -1) {
                modelValue = modelValue.replace(this.dividers[i], "");
            }
        }
        return modelValue;
    }

}
