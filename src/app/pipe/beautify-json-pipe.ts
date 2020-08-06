import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'beautifyJson'
})
export class BeautifyJsonPipe implements PipeTransform {

  transform(val) {
    return JSON.stringify(val, undefined, 4)
      .replace(/ /g, '&nbsp;')
      .replace(/\n/g, '<br/>');
  }

}
