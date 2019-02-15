const { createActions, handleAction, handleActions, combineActions } = require('redux-actions');
const { increment, decrement } = createActions({
  INCREMENT: amount => ({ amount }),
  DECREMENT: amount => ({ amount: -amount })
});

const reducer = handleAction(
  combineActions(increment, decrement),
  {
    next: (state, { payload: { amount } }) => ({ ...state, counter: state.counter + amount }),
    throw: state => ({ ...state, counter: 0 })
  },
  { counter: 10 } // initialState
);

test('combineActions', () => {
  expect(reducer(undefined, increment(1))).toEqual({ counter: 11 });
  expect(reducer(undefined, decrement(1))).toEqual({ counter: 9 });
  expect(reducer(undefined, increment(new Error()))).toEqual({ counter: 0 });
  expect(reducer(undefined, decrement(new Error()))).toEqual({ counter: 0 });
});

// ===============================================================================

const reducer2 = handleActions(
  {
    [combineActions(increment, decrement)]: (state, { payload: { amount } }) => ({
      ...state,
      counter: state.counter + amount
    })
  },
  { counter: 10 }
);

console.log(reducer.toString());

test('combintActions2', () => {
  expect(reducer2({ counter: 5 }, increment(5))).toEqual({ counter: 10 });
  expect(reducer2({ counter: 5 }, decrement(5))).toEqual({ counter: 0 });
  expect(reducer2({ counter: 5 }, { type: 'NOT_TYPE', payload: 1000 })).toEqual({ counter: 5 });
  expect(reducer2(undefined, increment(5))).toEqual({ counter: 15 });
});
