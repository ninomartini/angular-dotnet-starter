import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentFormat'
})
export class MomentFormatPipe implements PipeTransform {

  // {{invitation.dateInvited | momentFormat: 'default'}}

  transform(value: moment.MomentInput, format: string) {
    if (value === '0001-01-01T00:00:00') {
      return null;
    }

    if (value === '' || value === null || value === undefined) {
      return '';
    }

    if (format === 'fromNow') {
      return moment.utc(value).local().fromNow();
    } else if (format === 'dateLong') {
      return moment.utc(value).local().format('dddd, MMMM Do YYYY');
    } else if (format === 'dateShort') {
      return moment.utc(value).local().format('M/D/YYYY');
    } else if (format === 'dateTimeShort') {
      return moment.utc(value).local().format('M/D/YY h:mm A');
    } else if (format === 'dateTimeLong') {
      return moment.utc(value).local().format('MM/DD/YYYY h:mm:ss A');
    } else if (format === 'timeOrDate') {
      const d = new Date();
      const d1 = moment.utc(value).local().format('M/D/YY');
      const d2 = moment(d).format('M/D/YY');
      if (d1 === d2) {
        return moment.utc(value).local().format('h:mm A');
      } else {
        return moment.utc(value).local().format('M/D h:mm A');
      }
    } else if (format === 'localToUtc') {
      return moment(value).utc().format('YYYY-MM-DDTHH:mm:ss.SSSS[Z]');
    } else {
      return moment.utc(value).local().format(format);
    }
  }

}
