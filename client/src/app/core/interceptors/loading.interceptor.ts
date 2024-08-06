import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BusyService } from "../services/busy.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  urlsToIgnore: Array<string>;

  constructor(private busyService: BusyService) {
    this.urlsToIgnore = [ 'auth' ];
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isValidRequestForInterceptor(request.url)) {
      this.busyService.busy();
    }
    return next.handle(request).pipe(
      finalize(() => {
        this.busyService.idle();
      })
    );
  }

  private isValidRequestForInterceptor(requestUrl: string): boolean {
    const positionIndicator = 'api/';
    const position = requestUrl.indexOf(positionIndicator);
    if (position > 0) {
      const destination: string = requestUrl.substring(position + positionIndicator.length);
      for (const address of this.urlsToIgnore) {
        if (new RegExp(address).test(destination)) {
          return false;
        }
      }
    }
    return true;
  }
}
