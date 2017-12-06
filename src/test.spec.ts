import { expect, use } from 'chai';
import * as sinonChai from 'sinon-chai';
import { Observable } from 'rxjs/Observable';
import { useFakeTimers, spy, SinonFakeTimers } from 'sinon';

import { scheduleRetry } from './schedule-retry';
import { Subject } from 'rxjs/Subject';

use(sinonChai);

describe('something', () => {
  let clock: SinonFakeTimers;

  beforeEach(() => {
    clock = useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it ('should return a function', () => {
    expect(scheduleRetry(0, 200, 500)).to.be.a('function');
  });

  it ('should return a function that returns and instance of an Observable', () => {
    expect(scheduleRetry(0, 200, 500)(new Observable())).to.be.instanceof(Observable);
  });

  it ('should retry an observable as many times as there are args', () => {
    const mockSubject = new Subject();
    const mock$ = mockSubject.asObservable();
    const subscribeSpy = spy(mock$, 'subscribe');

    scheduleRetry(0, 500)(mock$).subscribe();
    mockSubject.error({});
    clock.tick(501);
    expect(subscribeSpy).to.have.been.calledThrice;
  });

});
