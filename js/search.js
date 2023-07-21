searchedcomics = new Array();
searchedspecials = new Array();
searchedmovies = new Array();
var count = 0;
const obj = { key: "d" };
urlsearch = "";
// Search suggestions in navbar
function getsuggestions(e, result = "search-list", tosearchloc = "datasearch") {
  document.getElementById(result).innerHTML = "";
  var tosearch = document.getElementById(tosearchloc).value + '';
  tosearch = tosearch.trim()
  if (tosearch == "") {
    if(urlsearch == "")
      return;
    tosearch = urlsearch;
    urlsearch = "";
  }
  searchedcomics.length = 0;
  searchedspecials.length = 0;
  searchedmovies.length = 0;
  count = 0;
  tosearch = tosearch.toUpperCase();
  for (var i = 0; i < comicdata.length && count < 10; i++) {
    if (comicdata[i]['comicname'].trim().toUpperCase().match(tosearch)) {
      searchedcomics.push(i);
      count++;
    }
  }
  for (var i = 0; i < specialsdata.length && count < 20; i++) {
    if (specialsdata[i]['specialname'].trim().toUpperCase().match(tosearch)) {
      searchedspecials.push(i);
      count++
    }
  }
  for (var i = 0; i < moviesdata.length && count < 30; i++){
    if(moviesdata[i]['title'].trim().toUpperCase().match(tosearch)){
      searchedmovies.push(i);
      count++;
    }
  }
  if (e.key == 'Enter') {
    changehash('#search/'+changespacetodash(tosearch))
    return;
  }
  searchlistresults(result);
}

function searchlistresults(result) {
  for (i = 0; i < searchedcomics.length; i++)
    document.getElementById(result).innerHTML += `
          <div class="row suggestion-list-row" onclick="get_comics_modaldata(`+ searchedcomics[i] + `), 
          fetch_yt_videos('`+ comicdata[searchedcomics[i]]['comicyt'] + `'), 
          fetch_comments(`+ comicdata[searchedcomics[i]]['comicid'] + `)" 
          data-bs-toggle="modal" data-bs-target="#comicmodal">
            <div class="col col-lg-8 col-md-8 col-sm-8 col-10">              
              <p> <img src="../assets/icons/user-16.png"></img>  `+ comicdata[searchedcomics[i]]['comicname'] + `</p>              
            </div>
            <div class="col col-2 d-none d-sm-block">
              <p>`+ comicdata[searchedcomics[i]]['comiccountry'] + `</p>
            </div>
            <div class="col col-lg-2 col-md-2 col-sm-2 col-2">              
              <p> <img src="../assets/icons/star-16.png"> `+ comicdata[searchedcomics[i]]['comicrating'] + `</p>              
            </div>
          </div>`;

  for (i = 0; i < searchedspecials.length; i++)
    document.getElementById(result).innerHTML += `
          <div class="row suggestion-list-row" onclick="get_specials_modaldata(`+ searchedspecials[i] + `)" 
          data-bs-toggle="modal" data-bs-target="#specialsmodal">
            <div class="col col-lg-8 col-md-8 col-sm-8 col-10">              
              <p> <img src="../assets/icons/special-16.png"></img>  `+ specialsdata[searchedspecials[i]]['specialname'] + ` ~ ` + specialsdata[searchedspecials[i]]['comicname'] + `</p>              
            </div>
            <div class="col col-2 d-none d-sm-block">
              <p>`+ specialsdata[searchedspecials[i]]['specialyear'] + `</p>
            </div>
            <div class="col col-lg-2 col-md-2 col-sm-2 col-2">              
              <p> <img src="../assets/icons/star-16.png"> `+ specialsdata[searchedspecials[i]]['specialrating'] + `</p>              
            </div>
          </div>`;

  
}

function searchpageresults() {
  document.getElementById('searchpagetitle').innerHTML = 'Search Results (' + count + ')';
  document.getElementById('searchpagecomics').innerHTML = '';
  for (i = 0; i < searchedcomics.length; i++)
    document.getElementById('searchpagecomics').innerHTML += `
      <div class="mycard"  data-bs-target="#comicmodal" onclick="
      get_comics_modaldata(` + searchedcomics[i] + `), 
      fetch_yt_videos('`+ comicdata[searchedcomics[i]]['comicyt'] + `'), 
      fetch_comments(`+ comicdata[searchedcomics[i]]['comicid'] + `)" 
      data-bs-toggle="modal" data-bs-target="#comicmodal"
      style="--bg-img: url('../assets/comic/`+ comicdata[searchedcomics[i]]['imagesource'] + `.png'); position:relative;">
        <p style="text-align:center;"> ` + textellipsis(comicdata[searchedcomics[i]]['comicname'], 17) + ` </p>
      </div> `;

  document.getElementById('searchpagespecials').innerHTML = '';
  for (i = 0; i < searchedspecials.length; i++) {
    document.getElementById('searchpagespecials').innerHTML += `
    <div class="imagecard">
      <img class="landscape-image"
        src="https://i3.wp.com/i.ytimg.com/vi/`+ specialsdata[searchedspecials[i]]['specialpic'] + `/mqdefault.jpg?resize=320&w=320"
        alt="" data-bs-toggle="modal" data-bs-target="#specialsmodal" onclick="get_specials_modaldata(`+ searchedspecials[i] + `)"
        loading="lazy">
      <div><br style="display: block; content:''; margin-top:8px;">
        <p class="card-text" style="float:left;">`+ textellipsis(specialsdata[searchedspecials[i]]['specialname'] + " ~ " +
      specialsdata[searchedspecials[i]]['comicname']) + ` </p>
      </div>
    </div>`
  }

  document.getElementById('searchpagemovies').innerHTML = '';
  for (i=0; i < searchedmovies.length; i++){
    document.getElementById('searchpagemovies').innerHTML += `
    <div class="mycard" style="--bg-img: url('https://image.tmdb.org/t/p/original`+ moviesdata[searchedmovies[i]]['poster_path'] + `'); background-size: 100%; height: 10.5em;" loading="lazy" 
      onclick="changehash('#movies/`+ searchedmovies[i] + `/` + changespacetodash(moviesdata[searchedmovies[i]]['title']) + `');">
    </div>
    `;
  }
}