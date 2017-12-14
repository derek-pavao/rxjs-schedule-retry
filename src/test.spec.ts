import { expect, use } from 'chai';
import * as sinonChai from 'sinon-chai';
import { Observable } from 'rxjs/Observable';
import { useFakeTimers, spy, SinonFakeTimers } from 'sinon';

import { scheduleRetry } from './schedule-retry';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/do';

use(sinonChai);

describe('scheduleRetry()', () => {
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

  it ('should accept an array of numbers', () => {
    expect(scheduleRetry([0, 200, 500])).to.not.throw;
  });

  it ('should return a function that returns and instance of an Observable', () => {
    expect(scheduleRetry(0, 200, 500)(new Observable())).to.be.instanceof(Observable);
  });

  it ('should retry an observable as many times as there are args', () => {
    const mockSubject = new Subject();
    const mock$ = mockSubject.asObservable();
    const nextSpy = spy();
    const errorSpy = spy();
    const completeSpy = spy();


    mock$.let(scheduleRetry(0, 500))
      .subscribe(nextSpy, errorSpy, completeSpy);

    mockSubject.error({});
    clock.tick(500);
    expect(nextSpy).to.not.have.been.called;
    expect(errorSpy).to.have.been.called;
  });

  it ('should not attach it self to Observable.prototype', () => {
    const observableProto = Observable.prototype as any;
    expect(observableProto.scheduleRetry).to.be.undefined;
  });

  it ('should pass through the original value', (done) => {
    const mockSubject = new Subject();
    const value = {'one': 1};
    const mock$ = mockSubject.asObservable();

    mock$
      .let(scheduleRetry(0, 100))
      .subscribe((val) => {
        expect(value).to.equal(val);
        done();
      });

    mockSubject.next(value);
    clock.tick(101);
  });

  it ('should call the error handler if it gets to the end of the retry schedule', () => {
    const mockSubject = new Subject();
    const err = {'err': 'something went wrong. Whoopsies!'};
    const mock$ = mockSubject.asObservable();

    mock$.let(scheduleRetry(0, 100))
      .subscribe(null, (err) => {
        expect(err).to.equal(err);
      });

    mockSubject.error(err);
    clock.tick(10);
    mockSubject.error(err);
    clock.tick(100);
    mockSubject.error(err);
    clock.tick(101);
    mockSubject.error(err);
  });

});
