import { combineReducers } from 'redux';

import stocks from './stocks';
import companies from './companies';
import selectedSymbol from './selectedSymbol';
import lastUpdatedDate from './lastUpdatedDate';
import decisiveIndexes from './decisiveIndexes';
import notes from './notes';
import account from './account';
import post from './post';

const rootReducer = combineReducers({
  stocks,
  companies,
  selectedSymbol,
  lastUpdatedDate,
  decisiveIndexes,
  notes,
  account,
  post
});

export default rootReducer;
