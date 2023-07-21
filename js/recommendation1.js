var anecdotal = dank = rant = self_depricating = sketch = improv = observational = impression = parody = satire = clean = roast = topical = musical = false;
var comiccolor, comiccountry;

function recommend(comicid) {
    anecdotal = dank = rant = self_depricating = sketch = improv = observational = impression = parody = satire = clean = roast = topical = musical = false;
    for (var i = 0; i < comicdata.length; i++) {
        if (comicdata[i]['comicid'] == comicid) {
            if (comicdata[i]['anecdotal']) anecdotal = true;
            if (comicdata[i]['dank']) dank = true;
            if (comicdata[i]['rant']) rant = true;
            if (comicdata[i]['selfdepricating']) self_depricating = true;
            if (comicdata[i]['sketch']) sketch = true;
            if (comicdata[i]['improv']) improv = true;
            if (comicdata[i]['observational']) observational = true;
            if (comicdata[i]['impression']) impression = true;
            if (comicdata[i]['parody']) parody = true;
            if (comicdata[i]['satire']) satire = true;
            if (comicdata[i]['clean']) clean = true;
            if (comicdata[i]['roast']) roast = true;
            if (comicdata[i]['topical']) topical = true;
            if (comicdata[i]['musical']) musical = true;
            // if(comicdata[i]['ancedotal']) ancedotal=true;
            // if(comicdata[i]['ancedotal']) ancedotal=true;
            comiccolor = comicdata[i]['comiccolor'];
            comiccountry = comicdata[i]['comiccountry']
            recommendationscore();
            break;
        }        
    }

}

function recommendationscore() {
    var score = 0, count = 0;
    document.getElementById('recommendation').innerHTML='';
    for (var i = 0; i < comicdata.length; i++) {
        // debugger;
        score = 0;
        //comic genre
        if (comicdata[i]['anecdotal'] && anecdotal) score++;
        if (comicdata[i]['dank'] && dank) score++;
        if (comicdata[i]['rant'] && rant) score++;
        if (comicdata[i]['selfdepricating'] && self_depricating) score++;
        if (comicdata[i]['sketch'] && sketch) score++;
        if (comicdata[i]['improv'] && improv) score++;
        if (comicdata[i]['observational'] && observational) score++;
        if (comicdata[i]['impression'] && impression) score++;
        if (comicdata[i]['parody'] && parody) score++;
        if (comicdata[i]['satire'] && satire) score++;
        if (comicdata[i]['clean'] && clean) score++;
        if (comicdata[i]['roast'] && roast) score++;
        if (comicdata[i]['topical'] && topical) score++;
        if (comicdata[i]['musical'] && musical) score++;
        //comic color
        if(comicdata[i]['comiccolor'] == comiccolor) score+=3;

        //comic country
        if(comicdata[i]['comiccountry'] == comiccountry) score+=4;

        //rendering data
        if(score>8) {
            count++;
            document.getElementById('recommendation').innerHTML+=`
            <div class="mycard"  data-bs-target="#comicmodal" onclick="
            get_comics_modaldata(` + i + `), 
            fetch_yt_videos('`+ comicdata[i]['comicyt'] + `'), 
            fetch_comments(`+ comicdata[i]['comicid'] + `)" 
            style="--bg-img: url('../assets/comic/`+ comicdata[i]['imagesource'] + `.png'); position:relative;">
            <p style="text-align:center;"> ` + textellipsis(comicdata[i]['comicname'], 17) + ` </p>
            </div> `;
        }
    }
}

