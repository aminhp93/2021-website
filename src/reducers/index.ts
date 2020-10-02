import { combineReducers } from 'redux';

import stocks from './stocks';
import companies from './companies';
import selectedSymbol from './selectedSymbol';
import lastUpdatedDate from './lastUpdatedDate';
import decisiveIndexes from './decisiveIndexes';
import notes from './notes';

const rootReducer = combineReducers({
  stocks,
  companies,
  selectedSymbol,
  lastUpdatedDate,
  decisiveIndexes,
  notes,
});

export default rootReducer;
