import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentTimeAgo',
  pure: false
})
export class MomentTimeAgoPipe implements PipeTransform, OnDestroy {
  interval: any;
  count = 0;

  constructor(private ref: ChangeDetectorRef) {
    this.interval = setInterval(() => {
      this.count++;
      this.ref.markForCheck();
    }, 60000)
  }

  transform(value: moment.MomentInput) {
    if (value === '' || value === null || value === undefined) {
      return '';
    }
    return moment(value).local().fromNow();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
