const { createStore } = require('redux');
const { createAction, handleActions } = require('redux-actions');

const increment = createAction('INCREMENT');
const decrement = createAction('DECREMENT');

const initialState = { counter: 0 };
const reducer = handleActions(
  {
    INCREMENT: (state, action) => ({
      counter: state.counter + action.payload
    }),
    DECREMENT: (state, action) => ({
      counter: state.counter - action.payload
    })
  },
  initialState
);
// const reducer = handleActions(
//   new Map(
//     [
//       increment,
//       (state, action) => ({
//         counter: state.counter + action.payload
//       })
//     ],
//     [
//       decrement,
//       (state, action) => ({
//         counter: state.counter - action.payload
//       })
//     ]
//   ),
//   initialState
// );

test('handleAction', () => {
  const store = createStore(reducer, initialState);
  store.dispatch(increment(12));
  expect(store.getState()).toEqual({ counter: 12 });
  store.dispatch(decrement(2));
  expect(store.getState()).toEqual({ counter: 10 });
});
