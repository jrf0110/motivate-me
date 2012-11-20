Players = new Meteor.Collection("players");

var isLoggedIn = function(){
  return !!Session.get('player');
};

var backs = [];

var $page, $backBtn;

var registerBackPage = function(page){
  if (backs.length > 0){
    if (backs[backs.length - 1] !== page) backs.push(page);
  }else backs.push(page);
  if (backs.length === 1){
    $backBtn.style.visibility = 'visible';
  }
};

var getBackPage = function(){
  if (backs.length === 1){
    $backBtn.style.visibility = 'hidden';
  }
  return backs.pop();
};

var goToPage = function(page, data){
  $page.innerHTML = "";
  $page.appendChild(Meteor.render(function(){
    return Template[page](data);
  }));
};

if (Meteor.isClient) {
  document.addEventListener('DOMContentLoaded', function(){
    $page = document.getElementById('page');
    $backBtn = document.querySelector('header .back');

    $backBtn.style.visibility = (backs.length > 0) ? 'visible' : 'hidden';

    if (isLoggedIn()){
      goToPage('leaderboard', Players);
    }else{
      goToPage('login')
    }
  });

  Template.leaderboard.players = function(){
    return Players.find({}, { sort: { score: -1 } })
  };

  Template.header.loggedIn = isLoggedIn();


  Template.header.events({
    'click .back': function(){
      if (backs.length > 0){
        goToPage(getBackPage());
      }
    }

  , 'click .login-out': function(e){

    }
  });

  Template.player.events({
    'click .add-point': function(e){
      Players.update(this.id, { $inc: { score: 1 } });
    }
  });

  Template.login.events({
    'click .login-btn': function(e){
      console.log("submit");
    }

  , 'click .register': function(e){
      e.preventDefault();
      registerBackPage('login');
      goToPage('register');
    }
  });

  Template.register.events({
    'submit #create-account-form': function(e){
      var player = {
        name:     e.target.querySelector('.name-field').value
      , password: e.target.querySelector('.password-field').value
      };

      console.log(player);

      Players.insert(player);
    }
  });
};

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
