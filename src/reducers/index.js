import { combineReducers } from 'redux';

import stocks from './stocks';
import companies from './companies';
import selectedSymbol from './selectedSymbol';
import lastUpdatedDate from './lastUpdatedDate';
import decisiveIndexes from './decisiveIndexes';

const rootReducer = combineReducers({
  stocks,
  companies,
  selectedSymbol,
  lastUpdatedDate,
  decisiveIndexes
});

export default rootReducer;
