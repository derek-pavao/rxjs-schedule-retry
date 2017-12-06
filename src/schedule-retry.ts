import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export function scheduleRetry(...timeouts: number[]) {

  return function (source: Observable<any>) {
    let tryNumber = 0;
    return new Observable((observer) => {
      source.subscribe(
        (val) => observer.next(val),
        (err) => doSubscribe(observer),
        () => observer.complete()
      )
    });

    function doSubscribe(observer: Observer<any>) {
      const timeoutTime = timeouts[tryNumber];
      if (typeof timeoutTime === 'undefined') {
        observer.complete();
      } else {

        tryNumber++;
        setTimeout(() => {
          source.subscribe(
            (val) => observer.next(val),
            (err) => doSubscribe(observer),
            () => observer.complete()
          )
        }, timeoutTime);
      }
    }


  };
}
