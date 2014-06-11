document.body.setBkg = function(url){
  document.body.style.background = "url("+url+") no-repeat center center fixed";
  document.body.style.backgroundSize = "cover";
};

function init(failureCount)
{
  httpinvoke('https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=0c1cd5ed45e07e03fbdf0d81d5e19914&photoset_id=72157636033468076&format=json&nojsoncallback=1', 'GET', function(err, body, statusCode) {
      if(err || statusCode != 200) {
          if (failureCount > 0)
            init(failureCount--);
          else
            return console.log('flickr failure', err);
      }
      var photoset = JSON.parse(body).photoset;
      for (var i = 0; i < photoset.photo.length; i++) {
        var p = photoset.photo[i];
        var img = document.createElement('img');
        img.onload = function()
        {
          this._isLoaded = true;
          if (typeof(document.body._bkg) === "undefined")
          {
            document.body.setBkg(this.src);
            document.body._bkgs = [];
            document.body._bkg = 0;
          }
          document.body._bkgs.push(this);
        };
        img.src = "https://farm"+p.farm+".staticflickr.com/"+p.server+"/"+p.id+"_"+p.secret+"_b.jpg";
      };
      setInterval(function(){
        if (document.body._bkg + 1 > document.body._bkgs.length)
          document.body._bkg = 0;
        if (document.body._bkgs.length > 0)
          document.body.setBkg(document.body._bkgs[document.body._bkg++].src);
      },5000);
  });
  //this api requires auth..what a scam.
  httpinvoke('https://api.twitter.com/1.1/users/show.json?screen_name=b3ngr33ni3r', 'GET', function(err, body, statusCode) {
     if(err || statusCode != 200) {
        // if (failureCount > 0)
        //   init(failureCount--);
        // else
        return console.log('twitter failure', err);
      }
      var user = JSON.parse(body);
      var descNodes = document.body.querySelectorAll(".description");
      for (var i = 0; i < descNodes.length; i++) {
        descNodes[i].text = user.description;
      };
      var locNodes = document.body.querySelectorAll(".location");
      for (var i = 0; i < locNodes.length; i++) {
        locNodes[i].text = user.location;
      };
  });
}

//init our page, with 3x flickr api timeout
init(3);