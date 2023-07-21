var comicdata, trendingdata, specialsdata, videoslist, comments, standup_videos, populardata, moviesdata;

$(document).ready(function () {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {

            // checking country of user
            fetch('https://ipapi.co/country_name/')
                .then(function (response) {
                    response.text().then(txt => {
                        if (txt != "India") {
                            // $('select>option:eq(3)').prop('selected', true);
                            $('#all_comics_cards_countryfilter').val(3);
                            $('#get_specials_list_countryfilter').val(3);
                        }

                    });
                })
                .catch(function (error) {
                });

            // parsing json data and calling their functions
            fulldata = JSON.parse(this.responseText)
            console.log(fulldata)
            trendingdata = fulldata['trending_list'];
            trending_list(-1);
            specialsdata = fulldata['comic_special'];
            filtereddata('get_specials_list', 'specialsdata');
            standup_videos = fulldata['comicvideos'];
            filtereddata('standup_list', 'standup_videos');
            comicdata = fulldata['comics_list'];
            filtereddata('all_comics_cards');
            populardata = fulldata['popular_list'];
            popular_comics_cards();
            moviesdata = fulldata['movies']
            filtereddata('movies_cards', 'moviesdata');
            completelyloaded++;
            completely_loaded();            
        }

    }
    xmlhttp.open("GET", "data.json");
    xmlhttp.send();
});

function fetch_all_data(type) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (type == 'comics')
                comicdata = JSON.parse(this.responseText);
            else if (type == 'movies')
                moviesdata = JSON.parse(this.responseText);
            handleHashChange();
        }
    }
    xmlhttp.open("GET", "/server/database.php?q=" + type, true);
    xmlhttp.send();
}

//-----for yt videos of each comic-----------
function fetch_yt_videos(channel_id) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            videoslist = JSON.parse(this.responseText);
            $('#comicmodal').modal('show');
            get_comics_modaldata_ytvideos();
        }
    }
    xmlhttp.open("GET", "/server/yt.php?q=" + channel_id, true);
    xmlhttp.send();
}

function fetch_comments(comicid) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            comments = JSON.parse(this.responseText);
            fill_comments();
            recommend(comicid);
        }
    }
    xmlhttp.open("GET", "/server/database.php?q=" + comicid, true);
    xmlhttp.send();
}