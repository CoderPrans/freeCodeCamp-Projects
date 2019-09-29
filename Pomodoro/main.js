var Tcounter = 0;
var Bcounter = 0;
var sessions = 1;
var timeleft = 1500;
var breakleft = 300;
var myInterval;
var m;
var s;

// to convert in min : sec
function tim(y) {
m = Math.floor(y / 60);
s = y % 60;
return nf(m) + ":" + nf(s);
}

// to format
function nf(x) {
var y = x.toString();
if (y.length == 1) {
  y = "0" + y
}
return y;
}

// when timer clicked
$(".timer").click(function() {

if (!myInterval) {
   myInterval = setInterval(timeIt, 1000);
   $(".lengths").fadeOut();
   $("#reset").fadeOut();
   displayNotification(`timer running!`)
}
else {
  $(".lengths").fadeIn();
  $("#reset").fadeIn();
  clearInterval(myInterval);
  myInterval = false;
  displayNotification(`timer stopped!`)
}
});

function timeIt() {
  if(sessions < 11){
    if (Tcounter < timeleft) {
     Tcounter++;
        $(".timer").html("<b>SESSION  #</b>" + sessions +"<br /><br /><p>" + tim(timeleft - Tcounter) + "</p>");
    }
    else if(timeleft == Tcounter && !Bcounter){
      sessions++;
      Bcounter = 1;
      $(".pomodoro").prepend('<img id="theImg" src="tomato.png" />');
      // play timer sound
      document.getElementById('timer-bling').play();
        displayNotification(`${sessions - 1} ${sessions == 2 ? 'session': 'sessions'} completed`)
    }
    else{
        $(".timer").html("<b>BREAK</b><br /><br /><p>" + tim(breakleft - Bcounter) + "</p>");
      Bcounter++;
      if(Bcounter == breakleft){
        Tcounter = 0;
        Bcounter = 0;
        // play timer sound
        document.getElementById('timer-bling').play();
        displayNotification(`break over!!`)
      }
    }
  } else{
    clearInterval(myInterval);
    myInterval = false;
    $("#reset").click(); }
 }

// when "+" clicked
$("#plusT").click(function() {
if (!myInterval && timeleft < 2700) {
  timeleft += 60;
  Tcounter = 0;
  $(".T").html(Math.floor(timeleft/60));
}
});
// when "-" clicked
$("#minusT").click(function() {
if (!myInterval && Math.floor(timeleft/60) > 1) {
  timeleft -= 60;
  Tcounter = 0;
  $(".T").html(Math.floor(timeleft/60));
}
});

$("#plusB").click(function() {
if (!myInterval && breakleft < 600) {
  breakleft += 60;
  Bcounter = 0;
  $(".B").html(Math.floor(breakleft/60));
}
});

$("#minusB").click(function() {
 if (!myInterval && Math.floor(breakleft/60) > 1) {
  breakleft -= 60;
  Bcounter = 0;
  $(".B").html(Math.floor(breakleft/60));
}
});

$("#reset").click(function(){
if(!myInterval){
    $(".timer").html("<b>SESSION   #</b>1<br /><br /><p>" + tim(timeleft) + "</p>");
  Tcounter = 0;
  sessions = 1;
  $(".pomodoro").text(" ");
}
});

if(Notification.permission != 'granted'){
    Notification.requestPermission(status => console.log("Notification permission status " + status))
}
 
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
} 

function displayNotification(mssg) {
  if(Notification.permission == 'granted') {
      navigator.serviceWorker.getRegistration().then(reg => reg.showNotification(`${mssg}`))
  }
}

