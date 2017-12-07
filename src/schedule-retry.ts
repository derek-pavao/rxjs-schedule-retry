import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

interface ScheduleRetryFunc {
    (...timeouts: number[]): Function;
    (timeouts: number[]): Function;
}

export const scheduleRetry : ScheduleRetryFunc = function (...timeouts : any[]): Function {
  timeouts = Array.isArray(timeouts[0]) ? timeouts[0] : timeouts;
  return function (source: Observable<any>) {
    let tryNumber = 0;
    return new Observable((observer) => sourceSubscribe(observer));
    
    function sourceSubscribe(observer: Observer<any>) {
      source.subscribe(
        (val) => observer.next(val),
        (err) => doSubscribe(observer),
        () => observer.complete()
      );
    }

    function doSubscribe(observer: Observer<any>) {
      const timeoutTime = timeouts[tryNumber];
      if (typeof timeoutTime === 'undefined') {
        observer.complete();
      } else {
        tryNumber++;
        setTimeout(() => {
          sourceSubscribe(observer);
        }, timeoutTime);
      }
    }
  };
}
