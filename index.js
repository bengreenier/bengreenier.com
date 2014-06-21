jQuery(function($){
  $.get("https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=f3c38ef94bb876d8c88203811b3d4a92&photoset_id=72157636033468076&format=json&nojsoncallback=1",function(data){
    var photoset = data.photoset,
      arr = [];
    for (var i = 0; i < photoset.photo.length; i++) {
      var p = photoset.photo[i];
      arr.push("https://farm"+p.farm+".staticflickr.com/"+p.server+"/"+p.id+"_"+p.secret+"_b.jpg");
    }
    $.backstretch(arr, {duration: 3000, fade: 750});
  });
  $("h1,h2").fitText();
});