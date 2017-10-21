var Botkit = require('botkit');

var controller = Botkit.slackbot();
var bot = controller.spawn({
    token: "xoxb-252194470720-q0itcWeRJAxgCzVlNEk1pCkF"
})
bot.startRTM(function (err, bot, payload) {
    if (err) {
        throw new Error('Could not connect to Slack');
    }
});
  
controller.hears(['hi','hello'],['ambient','direct_message','direct_mention'],function(bot,message) {
  bot.startConversation(message, askDetails);
});

askDetails = function(response, convo) {
  convo.ask("What Infomrmation you are looking from the salesforce ?", function(response, convo) {
    convo.say("Awesome.");
    askSize(response, convo);
    convo.next();
  });
}
askSize = function(response, convo) {
  convo.ask("What size do you want?", function(response, convo) {
    convo.say("Ok.")
    askWhereDeliver(response, convo);
    convo.next();
  });
}
askWhereDeliver = function(response, convo) { 
  convo.ask("So where do you want it delivered?", function(response, convo) {
    convo.say("Ok! Goodbye.");
    convo.next();
  });
}