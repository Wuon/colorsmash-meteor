import { Meteor } from 'meteor/meteor';

highscore = new Ground.Collection('highscore');
Meteor.startup(() => {
  // code to run on server at startup
});
