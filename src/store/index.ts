import { Action, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import * as Sentry from '@sentry/react';

import rootReducer from 'reducers';


const sentryReduxEnhancer = Sentry.createReduxEnhancer({});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
  enhancers: [sentryReduxEnhancer]
});

if (module.hot) { // eslint-disable-line
  module.hot.accept('reducers', () => { // eslint-disable-line
    const newRootReducer = require('reducers').default; // eslint-disable-line
    store.replaceReducer(newRootReducer)
  })
}

export const dispatch = store.dispatch.bind(store);

export type DispatchType = typeof store.dispatch

export type RootStateType = ReturnType<typeof rootReducer>

export type ThunkActionType = ThunkAction<void, RootStateType, unknown, Action<string>>

export default store
