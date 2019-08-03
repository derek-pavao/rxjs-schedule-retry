import { Observable, Observer, Subscription } from 'rxjs';

export interface ScheduleRetryFunc {
  (...timeouts: number[]): (selector: Observable<any>) => Observable<any>
  (timeouts: number[]): (selector: Observable<any>) => Observable<any>
}

export const scheduleRetry : ScheduleRetryFunc = function (...timeouts : any[]): (selector: Observable<any>) => Observable<any> {
  timeouts = Array.isArray(timeouts[0]) ? timeouts[0] : timeouts;
  return function (source: Observable<any>) {
    let tryCount = 0;
    return new Observable((observer) => {
      return sourceSubscribe(observer);
    });

    function sourceSubscribe(observer: Observer<any>): Subscription {
      return source.subscribe(
        (val) => observer.next(val),
        (err) => doSubscribe(observer, err),
        () => observer.complete()
      );
    }

    function doSubscribe(observer: Observer<any>, err?: any) {
      const timeoutTime = timeouts[tryCount];

      if (typeof timeoutTime === 'undefined') {
        observer.error(err);
        observer.complete();
      } else {
        tryCount++;
        setTimeout(() => {
          sourceSubscribe(observer);
        }, timeoutTime);
      }
    }
  };
};
