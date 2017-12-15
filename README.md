# RxJS Schedule Retry [![Build Status](https://travis-ci.org/dotDeeka/rxjs-schedule-retry.svg?branch=master)](https://travis-ci.org/dotDeeka/rxjs-schedule-retry)

RxJS Schedule Retry is in pre 1.0 release, which means its api is not stable and there could be breaking
changes with any point release.

This is a third party RxJS 5 operator to schedule retries at variable intervals, a "backoff retry".

Example:
```typescript
import { scheduleRetry } from '@dotdeeka/rxjs-schedule-retry';
import 'rxjs/add/operator/let';

// lets assume someObservable$ is in scope somewhere and it is of type Observable<any>
someObservable$
  .let(scheduleRetry(300, 500, 800)
  .subscribe(
    () => console.log('next called'),
    () => console.log('error called'),
    () => console.log('complete called')
  );
```

In the above example if ```someObservable$``` emits an error the first time through, scheduleRetry will
wait 300 milliseconds and try it again. If it fails again it'll wait another 500 milliseconds and try again,
same thing if it fails again, it'll wait 800ms and try again.

If at any point the observable is successful scheduleRetry will stop retrying and call next. If scheduleRetry
gets to the end of the retry schedule and it hasn't been successful it will error and give you a chance
to handle that error.
