const { createStore } = require('redux');
const { createAction, createActions, handleActions } = require('redux-actions');

const increment = createAction('INCREMENT');
const decrement = createAction('DECREMENT');

test('createAction(type)', () => {
  expect(increment()).toEqual({ type: 'INCREMENT' });
  expect(increment(10)).toEqual({ type: 'INCREMENT', payload: 10 });
  expect(decrement()).toEqual({ type: 'DECREMENT' });
  expect(decrement([1, 42])).toEqual({ type: 'DECREMENT', payload: [1, 42] });
});
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

const store = createStore(reducer, initialState);
store.dispatch(increment(12));
console.log(store.getState());
store.dispatch(decrement(2));
console.log(store.getState());

// ==================================================================

const noop = createAction('NOOP');
const error = new TypeError('not a number');

test('noop', () => {
  expect(noop(error)).toEqual({
    type: 'NOOP',
    payload: error,
    error: true
  });
});

// ==================================================================

const noop2 = createAction('NOOP2', amount => amount);
const noop3 = createAction('NOOP3');

test('createAction(type, payloadCreator)', () => {
  expect(noop2(2)).toEqual({
    type: 'NOOP2',
    payload: 2
  });
  expect(noop3(3)).toEqual({
    type: 'NOOP3',
    payload: 3
  });
});

// ==================================================================

const updateAdminUser = createAction('UPDATE_ADMIN_USER', updates => updates, () => ({ admin: true }));

test('createAction(type, payloadCreator, metaCreator)', () => {
  expect(updateAdminUser({ name: 'foo' })).toEqual({
    type: 'UPDATE_ADMIN_USER',
    payload: { name: 'foo' },
    meta: { admin: true }
  });
});

// ==================================================================

const actionCreators = createActions({
  APP: {
    COUNTER: {
      INCREMENT: [
        amount => ({ amount }), // payload
        amount => ({ key: 'value', amount }) // meta
      ],
      DECREMENT: amount => ({ amount: -amount }),
      SET: undefined
    },
    NOTIFY: [
      (username, message) => ({ message: `${username}: ${message}` }), // payload
      (username, message) => ({ username, message }) // meta
    ]
  }
});

test('createActions(actionMap)', () => {
  expect(actionCreators.app.counter.increment(1)).toEqual({
    type: 'APP/COUNTER/INCREMENT',
    payload: { amount: 1 },
    meta: { key: 'value', amount: 1 }
  });

  expect(actionCreators.app.counter.decrement(1)).toEqual({
    type: 'APP/COUNTER/DECREMENT',
    payload: { amount: -1 }
  });

  expect(actionCreators.app.counter.set(100)).toEqual({
    type: 'APP/COUNTER/SET',
    payload: 100
  });

  expect(actionCreators.app.notify('lzg', 'Hi')).toEqual({
    type: 'APP/NOTIFY',
    payload: {
      message: 'lzg: Hi'
    },
    meta: {
      username: 'lzg',
      message: 'Hi'
    }
  });
});

// ==================================================================

const { actionOne, actionTwo, actionThree } = createActions(
  {
    // function form; payload creator defined inline
    ACTION_ONE: (key, value) => ({ [key]: value }),

    // array form
    ACTION_TWO: [
      first => [first], // payload
      (first, second) => ({ second }) // meta
    ]

    // trailing action type string form; payload creator is the identity
  },
  'ACTION_THREE'
);
test('createActions(actionMap, ...identityActions)', () => {
  expect(actionOne('key', 1)).toEqual({
    type: 'ACTION_ONE',
    payload: { key: 1 }
  });

  expect(actionTwo('first', 'second')).toEqual({
    type: 'ACTION_TWO',
    payload: ['first'],
    meta: { second: 'second' }
  });

  expect(actionThree(3)).toEqual({
    type: 'ACTION_THREE',
    payload: 3
  });
});
