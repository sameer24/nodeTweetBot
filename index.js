var Twit = require('twit');
var request = require('request');
var fs = require('fs');
var csvparse = require('csv-parse');
var rita = require('rita')
var inputText = 'I am new to node. Trying to find out what is node. Searching for node project';
var tracery = require('tracery-grammar');

/*
1. Create .bash_profile file
2. add below lines with appropriate values
export consumer_key=XXXXX;
export consumer_secret=XXXXXX;
export access_token=XXXXXX;
export access_token_secret=XXXXX;
3. run below command
source .bash_profile
*/
var bot = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret,
    timeout_ms: 60 * 1000,
});

console.log(process.env.consumer_key);

// var markov = new rita.RiMarkov(3);
// markov.loadText(inputText);
// var sentences = markov.generateSentences(3);
// console.log(sentences);

function postStory(){
    var grammar = tracery.createGrammar({
        'character' : ['santosh','arun','ravi'],
        'place' : ['court','bank','office'],
        'object' : ['paper','bribe','letter'],
        'setJob' : [
            '[job:lawyer][actions:argued in court,filed some paper work]',
            '[job:inspector][actions:talk with lawyer, conduted meetings]',
            '[job:office][actions:arreseted peopel,stood in courtroom]'
        ],
        'story' : ['#protagonist# the #job# went to the #place# every day. Usually they #actions#.'],
        'origin' : ['#[#setJob#][protagonist:#character.capitalize#]story#']
    });

    grammar.addModifiers(tracery.baseEngModifiers);
    var story = grammar.flatten('#origin#');
    console.log(story);
    return story;
}
var storyStatus = 'Bot has tweeted @gayatrikelkar' + postStory();

//tweetStatusUpdate(storyStatus);

function tweetStatusUpdate(status){
    bot.post('statuses/update', { status: status })
        .then(function (tweet) {
            console.log(tweet);
        })
        .catch(function (error) {
            throw error;
        })
}

function tweetFollowerList(){
    bot.get('followers/list', { screen_name: 'sameerkelkar',count:200 })
        .then(function (tweets,data) {
            //console.log(tweets);
            tweets.data.users.forEach(function(user) {
                console.log(user.name+' -> '+user.screen_name);
                if (user.screen_name=='nilakshee710'){
                    bot.post('direct_messages/new',{screen_name:'nilakshee710',text:'Bot Message'},
                        function(err,data,response){
                            if(err){}else{console.log('Test Message'+data)}
                        }
                    )
                }
            }, this);
            
        })
        .catch(function (error) {
            throw error;
        })
}
//tweetFollowerList();

function captureTweetFromBoat(){
    var stream = bot.stream("statuses/filter",{track:'@nodetwittappsameer'});

    stream.on('connecting',function(response){
        console.log('connectttting...');
    })
    stream.on('connected',function(response){
        console.log('connected...');
    })
    stream.on('error',function(err){
        console.log('error...'+err);
    })
    stream.on('tweet',function(tweet){
        //console.log(tweet);
        console.log ('Tweet Done By '+tweet.user.screen_name + ' Tweet Id for reply '+ tweet.user.id_str);
        
        console.log(tweet.user.id_str);
        replyUserTweet(tweet.user.id_str);
    });
}
captureTweetFromBoat();
function replyUserTweet(replyTweetID){
        bot.post('statuses/update', { status: 'Thanks for cotacting @nodetwittappsameer I will get back to you Shortly',
         in_reply_to_status_id:replyTweetID   
         })
        .then(function (tweet) {
            console.log(replyTweetID);
            //console.log(tweet);
        })
        .catch(function (error) {
            throw error;
        })
}
console.log('aaaaa');