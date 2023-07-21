//to include any html file in another html file
$(function () {
    var includes = $('[data-include]')
    $.each(includes, function () {
        var file = $(this).data('include')
        $(this).load(file)
    });
})
var trending_interval, pause = false;
var idtracker = 0, urlprev = '';
var completelyloaded = 0;
function handleHashChange() {
    // console.log('called in handlehashchange by: ' + arguments.callee.caller)
    // let navigationTiming = performance.getEntriesByType("navigation")[0];
    // if (navigationTiming.type === "reload") {
    //     window.location.hash = ""; 
    //     console.log("reolaoded")
    //     return;
    // }

    var newhash = window.location.hash;
    if (window.location.hash != '') {

        hasharray = newhash.split('/');
        section = hasharray[0].slice(1);
        if (urlprev != newhash && urlprev != "" && currentmodal != "") { $('#' + currentmodal).modal('hide'); }
        urlprev = newhash;
        if (section == 'comic' || section == 'comics') {
            if (hasharray[1] == "" || hasharray == null) {
                $("#navmodal").modal('show');
                filtereddata('all_comics_nav_modal');
            } else {
                get_comics_modaldata(hasharray[1]);
                $('#comicmodal').modal('show');
            }
        } else if (section == "standup") {
            $('#standup_modal').modal('show');
            standup_nav_modal(hasharray[1])
        } else if (section == "specials") {

            if (hasharray[1] == "" || hasharray == null) {
                $('#specials_navmodal').modal('show')
                filtereddata('specials_nav_modal', 'specialsdata');
            } else {

                $('#specialsmodal').modal('show');
                get_specials_modaldata(hasharray[1]);
            }
        } else if (section == "search") {
            $('#searchpage').modal('show');
            urlsearch = changespacetodash(hasharray[1], true);
            getsuggestions(obj);
            searchpageresults();
        } else if (section == "movies") {

            if (hasharray[1] == "" || hasharray == null) {
                $('#movies_page').modal('show')
                filter_data_movies('movies_page', true);
            } else {

                $('#moviemodal').modal('show');
                movies_modal(hasharray[1]);
            }
        }
        else if (section == "Popular_comics") {
            $("#popularcomics_navmodal").modal('show');
            popular_comics_cards('popularcomics_navmodalbody');
        }
    }
    else {
        $('.modal').modal('hide');
    }
}

function changehash(hash) {
    // console.log('called in change has by: ' + arguments.callee.caller)

    // window.location.hash = '';
    window.location.hash = hash;
    // handleHashChange();
}

function changespacetodash(str, reverse = false) {
    if (reverse) return str.replace('-', /\s+/g);
    return str.trim().replace(/[ ']+/g, "-");
}

function press_back() {
    if (completelyloaded == 2) window.history.back();
    else { window.location.hash = ''; completelyloaded = 2; }
}

function loadIncludedContent(callback) {
    $("[data-include]").each(function () {
        const file = $(this).data("include");
        $(this).load(file, function () {
            // The included file has finished loading
            console.log("Loaded " + file);
        });
    });
    if (callback) {
        callback();
        completelyloaded++;
        completely_loaded();
    }
}

var currentmodal = '';
window.onload = function () {
    loadIncludedContent(function () {
        console.log('calling')
        loadjs();
        console.log('ending')
        // if (h == 0) 
        // var $div = $("#trendingytplayer");
        // if($div[0].scrollHeight == 0) $div = $("#trendingytplayerimg")
    });
};

function loadjs(){
    console.log('loadjs')
    window.addEventListener("hashchange", handleHashChange);

        $('[data-toggle="tooltip"]').tooltip();
        navbaroptions();

        // Listen for when a modal is shown
        $('.modal').on('shown.bs.modal', function (event) {
            debugger
            var $modal = $(this);
            currentmodal = $modal.attr('id');
        });

        $('.modal').on('hidden.bs.modal', function (event) {
            var modalId = $(event.target).closest(".modal").attr("id");
            if (modalId != 'movies_page' && modalId != 'specials_navmodal') $('.comicytvideos').html("");
            if (window.location.hash != "") {
                var hash = window.location.hash;
                if (hash.match('comic'))
                    $('html, body').animate({
                        scrollTop: $('#all-comic-card-container').offset().top
                    }, 0);
                else if (hash.match('specials'))
                    $('html, body').animate({
                        scrollTop: $('#specials-container').offset().top
                    }, 0);
                else if (hash.match('standup'))
                    $('html, body').animate({
                        scrollTop: $('#standup_videos_container').offset().top
                    }, 0);

            }
        })

        trending_interval = setInterval(function () {
            if (!pause) movetrending('right')
        }, 5000);

        $(document).on('click', '.userrating', function () {
            idtracker++;
            $(this).attr('id', 'r' + idtracker);
        });

        //setting trending list max height acc to yt iframe
        var h = $(window).width() * 0.69 * 9 / 17
        $('#trending-list').css({ "maxHeight": h });
}

function completely_loaded() {
    if (completelyloaded == 2) if (window.location.hash != '') { handleHashChange(); completelyloaded = 0; }
}

// it moves cards list horizontally --------------------------
function move(direction, id) {
    let width = $(window).width() * 0.85;
    var container = document.getElementById(id);
    scrollCompleted = 0;
    angle = 0.75;
    var slideVar = setInterval(function () {
        speed = Math.sin(angle) * 40;
        if (direction == 'left') {
            container.scrollLeft -= speed;
        } else {
            container.scrollLeft += speed;
        }
        scrollCompleted += speed;
        if (scrollCompleted >= width) {
            window.clearInterval(slideVar);
            angle += 0.15;
        }
    }, 10);
}

$(window).resize(function () {
    navbaroptions();
});

//----------------------for filter all comics data---------------------------------
// FILTER  FILTER  FILTER  FILTER  FILTER  FILTER  FILTER  FILTER  FILTER  FILTER                                          
var rows = [];
function filtereddata(fnname, datasource = 'comicdata') {
    rows = Array.from(Array(eval(datasource).length - 1).keys());
    var j = 0, length = 0;
    var countryid = '#' + fnname + '_countryfilter';
    if ($(countryid).val() != 1 && $(countryid).val() != undefined) {
        var country = $(countryid + " :selected").text();
        length = rows.length;
        for (i = 0; i < length; i++) {
            if (eval(datasource)[rows[i - j]]['comiccountry'] != country) { rows.splice(i - j, 1); j++ }
        }
    }
    if (datasource == 'specialsdata') {
        $('#specials-container').scrollLeft(0);
        ispecial = 0;
        j = 0;
        var ottid = '#' + fnname + '_ottfilter';
        if ($(ottid).val() != 1 && $(ottid).val() != undefined) {
            var ott = $(ottid + " :selected").text();
            length = rows.length;
            for (i = 0; i < length; i++) {
                if (eval(datasource)[rows[i - j]]['OTT'] != ott) { rows.splice(i - j++, 1); }
            }
        }
    }
    else if (datasource == 'comicdata') {
        $('#all-comic-card-container').scrollLeft(0);
        currentpos = 0;
        j = 0;
        var genderid = '#' + fnname + '_genderfilter';
        if ($(genderid).val() != 1 && $(genderid).val() != undefined) {
            var gender = $(genderid + " :selected").text();
            length = rows.length;
            for (i = 0; i < length; i++) {
                if (eval(datasource)[rows[i - j]]['comicgender'] != gender) { rows.splice(i - j++, 1); }
            }
        }

        j = 0;
        var ratingid = '#' + fnname + '_ratingfilter';
        if ($(ratingid).val() != 1 && $(ratingid).val() != undefined) {
            var rating = $(ratingid).val();
            length = rows.length;
            for (i = 0; i < length; i++) {
                if (parseInt(eval(datasource)[rows[i - j]]['comicrating']) < rating) { rows.splice(i - j++, 1); }
            }
        }
    }
    else if (datasource == 'standup_videos') {
        $('#standup_videos_container').scrollLeft(0);
        istandup = 0;
        j = 0;
        var categoryid = '#' + fnname + '_categoryfilter';
        if ($(categoryid).val() != 1 && $(categoryid).val() != undefined) {
            var category = $(categoryid + " :selected").text();
            length = rows.length;
            for (i = 0; i < length; i++) {
                if (eval(datasource)[rows[i - j]]['category'] != category) { rows.splice(i - j++, 1); }
            }
        }
    }
    eval(fnname)();
}

//rate emoji
var simleyiconunfilled = `<svg data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" width="25" height="25" style="margin-left: -150px;" viewBox="0 0 122.88 122.88"> <defs> <style> .cls-1 { fill: #fbd433; } .cls-1, .cls-2 { fill-rule: evenodd; }  .cls-2 { fill: #141518; } </style> </defs> <title>rate</title> <path class="cls-1" d="M45.54,2.11A61.42,61.42,0,1,1,2.11,77.34,61.42,61.42,0,0,1,45.54,2.11Z" /> <path class="cls-2" d="M45.78,32.27c4.3,0,7.79,5,7.79,11.27s-3.49,11.27-7.79,11.27S38,49.77,38,43.54s3.48-11.27,7.78-11.27Z" /> <path class="cls-2" d="M77.1,32.27c4.3,0,7.78,5,7.78,11.27S81.4,54.81,77.1,54.81s-7.79-5-7.79-11.27S72.8,32.27,77.1,32.27Z" /> <path d="M28.8,70.82a39.65,39.65,0,0,0,8.83,8.41,42.72,42.72,0,0,0,25,7.53,40.44,40.44,0,0,0,24.12-8.12,35.75,35.75,0,0,0,7.49-7.87.22.22,0,0,1,.31,0L97,73.14a.21.21,0,0,1,0,.29A45.87,45.87,0,0,1,82.89,88.58,37.67,37.67,0,0,1,62.83,95a39,39,0,0,1-20.68-5.55A50.52,50.52,0,0,1,25.9,73.57a.23.23,0,0,1,0-.28l2.52-2.5a.22.22,0,0,1,.32,0l0,0Z" /> </svg>`;
//family filter icons
var family0 = 'assets/icons/veg-red-22.png';
var family2 = 'assets/icons/veg-black-22.png';
var family1 = 'assets/icons/veg-green-22.png';
var family3 = 'assets/icons/veg-brown-22.png';

var comicrowno, prevcarno = -1, emojisize = 25;;
function coloremojis(cardno, id = 'emojis', svg = 'smiley0') {
    if (cardno != prevcarno) {
        prevcarno = cardno;
        for (var i = 0; i < comicdata.length; i++) {
            if (comicdata[i]['comicid'] == cardno) { comicrowno = i; break; }
        }
        comicidforrating = cardno;
        if (id != 'emojis' && $(window).width() < 900) {
            emojisize = 20;
        }
    }

    if (id == 'emojis') $('.ratetitle').html('Rate "' + comicdata[comicrowno]['comicname'] + '" : ' + (parseInt(svg[6]) + 1));
    else if (id == 'standup') $('.ratetitle').html('Rate: ' + (parseInt(svg[6]) + 1));
    else if (id == 'special') $('.ratetitle').html('Rate "' + specialsdata[cardno]['specialname'] + '" : ' + (parseInt(svg[6]) + 1));
    if (id == 'ratingsystem') target = 'ratingsystem'
    else target = 'emojis'
    document.getElementById(target).innerHTML = "";
    i = 0;

    for (; i <= svg.charAt(svg.length - 1); i++)
        document.getElementById(target).innerHTML += '<svg id="smiley' + i + `" onmouseover="coloremojis(` + cardno + `,'` + id + `', this.id)"  width="` + emojisize + `" height="` + emojisize + `" 
                data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><defs><style>.cls-1{fill:#fbd433;}.cls-1,.cls-2{fill-rule:evenodd;}.cls-2{fill:#141518;}</style></defs><title>smiley</title><path class="cls-1" d="M45.54,2.11A61.42,61.42,0,1,1,2.11,77.34,61.42,61.42,0,0,1,45.54,2.11Z"/><path class="cls-2" d="M45.78,32.27c4.3,0,7.79,5,7.79,11.27s-3.49,11.27-7.79,11.27S38,49.77,38,43.54s3.48-11.27,7.78-11.27Z"/><path class="cls-2" d="M77.1,32.27c4.3,0,7.78,5,7.78,11.27S81.4,54.81,77.1,54.81s-7.79-5-7.79-11.27S72.8,32.27,77.1,32.27Z"/><path d="M28.8,70.82a39.65,39.65,0,0,0,8.83,8.41,42.72,42.72,0,0,0,25,7.53,40.44,40.44,0,0,0,24.12-8.12,35.75,35.75,0,0,0,7.49-7.87.22.22,0,0,1,.31,0L97,73.14a.21.21,0,0,1,0,.29A45.87,45.87,0,0,1,82.89,88.58,37.67,37.67,0,0,1,62.83,95a39,39,0,0,1-20.68-5.55A50.52,50.52,0,0,1,25.9,73.57a.23.23,0,0,1,0-.28l2.52-2.5a.22.22,0,0,1,.32,0l0,0Z"/></svg> `;;

    rating = i;

    for (; i < 10; i++) {
        document.getElementById(target).innerHTML += '<svg id="smiley' + i + `" onmouseover="coloremojis(` + cardno + `,'` + id + `',this.id)"  width="` + emojisize + `" height="` + emojisize + `" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><path d="M61.44,0h0V0a61.4,61.4,0,0,1,61.43,61.42h0a61.42,61.42,0,0,1-61.42,61.43h0A61.4,61.4,0,0,1,0,61.45H0A61.39,61.39,0,0,1,61.44,0V0ZM33.17,41.06A3.34,3.34,0,0,1,28,36.84,12.83,12.83,0,0,1,29.8,35a19.51,19.51,0,0,1,11.11-4,17.91,17.91,0,0,1,12.34,3.74A15.81,15.81,0,0,1,55.5,37a3.35,3.35,0,1,1-5.18,4.25A8.23,8.23,0,0,0,49,40a11.37,11.37,0,0,0-7.79-2.26A12.73,12.73,0,0,0,34,40.22a5.87,5.87,0,0,0-.87.84Zm40.8,0a3.34,3.34,0,0,1-5.18-4.22,12.76,12.76,0,0,1,1.8-1.8A19.56,19.56,0,0,1,81.7,31a17.92,17.92,0,0,1,12.35,3.74A16.35,16.35,0,0,1,96.3,37a3.35,3.35,0,1,1-5.18,4.25A8.68,8.68,0,0,0,89.84,40,11.38,11.38,0,0,0,82,37.7a12.75,12.75,0,0,0-7.21,2.52,6.28,6.28,0,0,0-.86.84ZM26.49,75.33a3.34,3.34,0,1,1,5.86-3.19,32.49,32.49,0,0,0,15.84,14.2,38.09,38.09,0,0,0,16.15,3.07,34.41,34.41,0,0,0,15.38-4,27.12,27.12,0,0,0,12.1-13.15A3.34,3.34,0,0,1,98,74.88a33.74,33.74,0,0,1-15,16.37,41,41,0,0,1-18.39,4.83,44.81,44.81,0,0,1-19-3.61,39.08,39.08,0,0,1-19-17.14Zm35-67.5h0A53.64,53.64,0,0,0,7.83,61.44h0a53.65,53.65,0,0,0,53.61,53.61v0h0v0a53.65,53.65,0,0,0,53.6-53.62h0A53.64,53.64,0,0,0,61.44,7.83Z"/></svg> `;
    }
    if (id == 'ratingsystem') {
        document.getElementById(id).innerHTML += `  <button type="button" class="btn btn-warning" id="ratingsystem" onclick="submitrating('ratingsystem' , ` + comicrowno + `)">Rate</button>`;
    }
}

//----------------------------detect scroll end and call all_comics_card()----------------
var once = true;
$(function () {
    $('#all-comic-card-container, #standup_videos_container, #movies_container').scroll(function () {
        var $width = $(this).outerWidth();
        var $scrollWidth = $(this)[0].scrollWidth;

        var $scrollLeft = $(this).scrollLeft();
        if ($scrollWidth - $width < $scrollLeft + 2000 && once) {
            once = false;
            setTimeout(() => {
                if ($(this).is("#all-comic-card-container")) all_comics_cards();
                else if ($(this).is('#standup_videos_container')) standup_list();
                else if ($(this).is('#movies_container')) movies_cards();
                once = true;
            }, 2000)
        }
    });
});


var pagehead = 1;
function pagenolist(np, fnname = 'all_comics_nav_modal', datasource = 'rows', id = "pagenation-list") {
    var noofpages = parseInt((eval(datasource).length) / 30) + 1;
    if (pagehead + np <= noofpages - 4 && pagehead + np > 0) {
        pagehead += np;
        document.getElementById(id).innerHTML = `<li class="page-item ">
        <a class="page-link" href="#" tabindex="-1"  onclick="`+ fnname + `(5,-1)">&#10094;</a></li>`
        for (i = pagehead; i < pagehead + 5; i++) {
            if (i == pageno + np)
                document.getElementById(id).innerHTML += `<li class="page-item active"><a class="page-link" href="#" 
            onclick="`+ fnname + `(` + i + `)">` + i + `</a></li>`;
            else
                document.getElementById(id).innerHTML += `<li class="page-item"><a class="page-link" href="#" 
            onclick="`+ fnname + `(` + i + `)">` + i + `</a></li>`;
        }
        document.getElementById(id).innerHTML += `<li class="page-item">
        <a class="page-link" href="#" onclick="`+ fnname + `(5, 1)">&#10095;</a>
        </li>`;
    }
    pageno += np;
    pageno = pageno < 1 ? 1 : pageno > noofpages ? noofpages : pageno;
    eval(fnname)(pageno);
}

function get_arrows(id) {
    return `<span class="prev" onclick="move('left', '` + id + `')">&#10094;</span>
    <span class="next" onclick="move('notleft', '`+ id + `')">&#10095;</span>`;
}

//------------------------modal for each comic------------------------------------------------
function get_comics_modaldata(rowno) {
    $('#comicmodal').modal('show');
    if (comicdata[0]['comiclanguage'] == undefined) { fetch_all_data('comics'); return; }
    fetch_yt_videos(comicdata[rowno]['comicyt']);
    fetch_comments(comicdata[rowno]['comicid']);
    document.getElementById("comicimage").scrollIntoView({ behavior: 'smooth' });
    document.getElementById("ratingsystem").innerHTML =
        `<img src="assets/icons/star4-20.png" style="color: white;"> ` + comicdata[rowno]['comicrating'] +
        `&nbsp; &nbsp; 
        <img src="assets/icons/star-dotted-20.png" onclick="coloremojis('` + comicdata[rowno]['comicid'] + `', 'ratingsystem')"> `

    document.getElementById('family-filter1').src = eval('family' + comicdata[rowno]['comiccolor']);
    document.getElementById('family-filter1').setAttribute("title", comicdata[rowno]['comiccolor'] == 0 ? 'Abusive' : comicdata[rowno]['comiccolor'] == 1 ? 'Clean comedy' : '18+');
    document.getElementById('comicmodaltitle').innerHTML = comicdata[rowno]['comicname'];
    document.getElementById("comicimage").src = 'assets/comic/' + comicdata[rowno]['imagesource'] + '.png';
    document.getElementById("comicdata").innerHTML = `<p>
        <img src="assets/icons/dob-25.png" wdith="25px" height="25px"> ` + comicdata[rowno]['comicdob']
        + '<br><img src="assets/icons/gender-25.png" wdith="25px" height="25px">  ' + comicdata[rowno]['comicgender']
        + `<br><img src="assets/icons/globe-25.png" wdith="25px" height="25px">  ` + comicdata[rowno]['comiccountry']
        + `<br><img src="assets/icons/language-25.png" wdith="25px" height="25px"> ` + comicdata[rowno]['comiclanguage'] + ` </p>`;
    document.getElementById("comicdescription").innerHTML = comicdata[rowno]['comicdescription'];
    document.getElementById("instagrammodal").href = comicdata[rowno]['comicinsta'];
    document.getElementById("youtubemodal").href = comicdata[rowno]['comicyt'];
    document.getElementById("facebookmodal").href = comicdata[rowno]['comicfb'];
    let genrearray = comicdata[rowno]['comicgenre'].split(",");
    document.getElementById("comicgenre").innerHTML = "";
    for (var j = 0; j < genrearray.length; j++) {
        document.getElementById("comicgenre").innerHTML += `<span class="chip">` + genrearray[j] + `</span>`;
    }
    document.getElementById('commentsubmitbutton').setAttribute("onclick", `submitcomment(` + comicdata[rowno]['comicid'] + `)`);
}

function get_comics_modaldata_ytvideos() {
    //for yt videos in modal
    document.getElementById("modalytvideos").innerHTML = "";
    for (var yt = 0; yt < 3; yt++) {
        document.getElementById("modalytvideos").innerHTML += `<div class="row" style="margin-bottom:1em">
                 <iframe  type="text/html" 
                   allow="clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                   style="padding-left: 0em; padding-right: 0em; border-radius: 20px;  aspect-ratio: 16 / 9;"
                   src="https://www.youtube.com/embed/`+ videoslist[yt] + `" frameborder="0" allowfullscreen>
                 </iframe>
               </div>`;
    }
}

function fill_comments() {
    document.getElementById("commentsection").innerHTML = ""
    for (var j = 0; j < comments.length; j++) {
        document.getElementById("commentsection").innerHTML += `<img src='assets/icons/avatar` + Math.floor(Math.random() * 4) + `.png' alt='A'> <img> &nbsp; <span style="color:white;">` + comments[j]['comments'] + "</span><br>";
    }
}

function submitcomment(comicid) {
    var fieldvalue = $.trim($('#comment').val());
    if (!fieldvalue || fieldvalue == "placeholdertext") {
        $('#comment').attr("placeholder", "Enter some text");
        console.log('failed to add comment')
    } else {
        $.ajax({
            type: "GET",  //type of method
            url: "server/comments.php",  //your page
            data: { comicid: comicid, comment: fieldvalue },// passing the values
            success: function (res) {
                // console.log(res)
                $('#comment').val('');
                $('#comment').attr("placeholder", "Enter comment");
                document.getElementById("commentsection").innerHTML += "<img src='assets/icons/avatar" + Math.floor(Math.random() * 4) + ".png' alt='A'> <img>" + fieldvalue + "<br>";
            }
        });
    }
}

let ratedcomics = new Array() //contains list of comic ids which this user has already given rating
var comicidforrating, rating;
function submitrating(id = 'ratebutton', comicrowno = 0) {
    if (id != 'ratingsystem') {
        document.getElementById('r' + idtracker).innerHTML = ""
        document.getElementById('r' + idtracker).innerHTML += `<img class="ratecard" src="assets/icons/star6-20.png" width="20px" height="20px"> ` + rating;
        $("#myModal").modal('hide');
    }
    else {
        document.getElementById("ratingsystem").innerHTML =
            `<img src="assets/icons/star4-20.png" style="color: white;"> ` + comicdata[comicrowno]['comicrating'] +
            `&nbsp; &nbsp; 
        <img src="assets/icons/star-dotted-20.png" onclick="coloremojis('` + comicdata[comicrowno]['comicid'] + `', 'ratingsystem')"> ` + rating
    }
}

function submitcontactusform() {
    var formdata = ($('#contactusform').serializeArray());
    var name = formdata[0]['value'];
    var email = formdata[1]['value'];
    var reason = formdata[2]['value'];
    var message = formdata[3]['value'];
    if (name == "" || email == "" || reason == "" || message == "") {

    }
    else {
        $.ajax({
            type: "GET",
            url: "server/contactusform.php",
            data: { name: name, email: email, reason: reason, message: message },
            success: function (res) {
                $(':input', "#contactusform").val('')
            },
            error: function (xhr, status, error) {
                console.error(xhr + "error: " + error);
            }
        })
    }
}

//if clicked anywhere except search box and suggestions list , list will be closed
$(document).click(function (evt) {
    //For descendants of menu_content being clicked, remove this check if you do not want to put constraint on descendants.
    if ($(evt.target).closest("#searchmodal").length > 0) return;
    //Do processing of click event here for every element except with id search-list
    else
        document.getElementById("search-list").innerHTML = "";
    document.getElementById("search-list-nav").innerHTML = "";
});