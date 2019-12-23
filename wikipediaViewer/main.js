$(document).ready(function(){
// var input;
var searchTerm;
var list;

$("#search").click(function(){
    if ($("#inputText").val().length > 0) {
searchTerm = $("#inputText").val();

var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ searchTerm +"&format=json&callback=?";

   $.ajax({
     type: "GET",
     url: url,
     async:false,
     dataType: "json",
     success: function(data){
       $("#output").html('');
       for(var i = 0; i < data[1].length; i++){
         $("#output").prepend("<a href=" + "'" + data[3][i] + "'" + "target='blank'>" + "<div class='result'><li><h5 class='head'><b>"  + data[1][i] + "</b></h5><p>" + data[2][i] + "</p></li></div></a>");
       }
       $("#inputText").val('');
       $('html,body').animate({
      scrollTop: $("#output").offset().top},
      'slow');
     },
     error: function(message){
       alert("can't load")
     }
   })
    } else { alert('write a key word to search for !!') } 
 });
  $("#inputText").keypress(function(x){
  if(x.keyCode == 13){
    $("#search").click();
  }
});
});
