import { combineReducers } from 'redux';
import modal from './modal';
import projectForm from './projectForm';

import { users } from './users'
import { teams, selectedTeamId } from './teams'
import { conversations, selectedConversationId, dmUserId } from './conversations'
import { reducer as authUser } from './authUser'
import { messages } from './messages';
import { threads, newThreads } from './threads';
import { threadNotifications } from './threadNotifications';
import { teamNotifications } from './teamNotifications';
import { userNotifications } from './userNotifications';
import { faviconKey } from './faviconKey';
import { onlineUsers } from './onlineUsers';
import { reactions } from './reactions';
import { primaryView, secondaryView, selectedThreadDetail } from './views';
import { scrolling } from './scrolling';
import { showLatestMessages } from './showLatestMessages';
import { loading } from './loading';
import { newUnreadMesssages } from './newUnreadMesssages';
import { disableAroundAPI } from './disableAroundAPI';
import { selectedProfile } from './selectedProfile';


const rootReducer = combineReducers({
  projectForm,
  modal,
  teams,
  selectedTeamId,
  conversations,
  selectedConversationId,
  dmUserId,
  users,
  authUser,
  messages,
  primaryView,
  secondaryView,
  selectedThreadDetail,
  newThreads,
  threads,
  threadNotifications,
  teamNotifications,
  reactions,
  userNotifications,
  onlineUsers,
  faviconKey,
  scrolling,
  showLatestMessages,
  loading,
  newUnreadMesssages,
  disableAroundAPI,
  selectedProfile
});

export default rootReducer;
