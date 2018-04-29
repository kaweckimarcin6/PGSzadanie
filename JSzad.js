var text_field_text;
var song_array = [];
var request_data;
var played_song = -1;
var current_page = 0;

function truncate_text(text, length) {
    if(text.length > length) {
        return text.substr(0, length) + '...';
    }
    return text;
}

class song {
    constructor(artist, title, image, audio) {
        this.artist = artist;
        this.title = title;
        this.image = image;
        this.audio = new Audio(audio);
    }

    // to_console_log() {
    //     console.log(this.artist);
    //     console.log(this.title);
    // }

    draw_tile() {
        this.tile_div = document.createElement("div");
        var image = document.createElement("img");
        var tile_text_div = document.createElement("div");
        var title_text_h1 = document.createElement("h1");
        var author_text_p = document.createElement("p");
        this.tile_div.className = "tile";
        //this.tile_div.addEventListener("click", on_tile_clicked);
        image.className = "tile_img";
        tile_text_div.className = "tile_text";
        title_text_h1.className = "title_text";
        author_text_p.className = "author_text";

        image.src = this.image;
        title_text_h1.innerHTML = truncate_text(this.title, 40);
        author_text_p.innerHTML = truncate_text(this.artist,20);

        document.getElementById("tile_holder").appendChild(this.tile_div);
        this.tile_div.appendChild(image);
        this.tile_div.appendChild(tile_text_div);
        tile_text_div.appendChild(title_text_h1);
        tile_text_div.appendChild(author_text_p);
    }
}

function req() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://itunes.apple.com/search?term=' + text_field_text + '&entity=song&limit=100');
    request.onload = function () {
        request_data = JSON.parse(request.responseText);
        stop_playing();
        song_array = [];
        played_song = -1;

        for(var i=0; i < request_data.resultCount; i++) {
            song_array.push(new song(request_data.results[i].artistName, request_data.results[i].trackName, request_data.results[i].artworkUrl100,
                request_data.results[i].previewUrl));
        }
        show_results(request_data);
        if(song_array.length > 0) {
            draw_page_buttons();
        }
        else {
            var btn_hldr = document.getElementById("button_holder");
            btn_hldr.innerHTML="";
        }
    };
    request.send();
}

function search_button_clicked() {
    var tile_holder = document.getElementById("tile_holder");
    tile_holder.innerHTML = "";
    current_page = 0;
    text_field_text = document.getElementById("text_field_search").value;
    req();
}

function show_results(data) {
    if(data.resultCount == 0){
        document.getElementById("found_songs").textContent="Sorry, no matches found";
        found_songs.style.visibility = 'visible';
    }
    else {
        if(data.resultCount > 99) {
            document.getElementById("found_songs").textContent = "Found over 99 songs";
            found_songs.style.visibility = 'visible';
        }
        else {
            document.getElementById("found_songs").textContent = "Found " + data.resultCount + " songs";
            found_songs.style.visibility = 'visible';
        }

        for(var i = current_page*9; i < current_page*9 + 9 && i < song_array.length; i++) {
            song_array[i].draw_tile();
            song_array[i].tile_div.addEventListener("click", on_tile_clicked(i));
        }
    }
}

function stop_playing() {
    if(played_song !== -1) {
        song_array[played_song].audio.pause();
        song_array[played_song].tile_div.className = "tile";
        played_song = -1;
    }
}


// function on_tile_clicked(id) {
//     return function () {
//
//         if(played_song == -1) {
//             song_array[id].audio.play();
//             played_song = id;
//             song_array[id].tile_div.className="tile_selected";
//         }
//         else {
//             if (played_song == id) {
//
//                 song_array[played_song].audio.pause();
//                 song_array[id].tile_div.className="tile";
//                 played_song = -1;
//             }
//             else {
//                 song_array[played_song].audio.pause();
//                 song_array[played_song].tile_div.className="tile";
//                 song_array[id].audio.play();
//                 song_array[id].tile_div.className="tile_selected";
//                 played_song = id;
//             }
//         }
//         console.log(id + " tile clicked");
//
//     }
// }




function on_tile_clicked(id) {
    return function () {

        if(played_song == -1) {
            song_array[id].audio.play();
            played_song = id;
            song_array[id].tile_div.className="tile_selected";
        }
        else {
            if (played_song == id) {

                song_array[played_song].audio.pause();
                song_array[id].tile_div.className="tile";
                played_song = -1;
            }
            else {
                song_array[played_song].audio.pause();
                song_array[played_song].tile_div.className="tile";
                song_array[id].audio.play();
                song_array[id].tile_div.className="tile_selected";
                played_song = id;
            }
        }
        console.log(id + " tile clicked");

    }
}


function on_prev_page_clicked() {
    return function () {
        if (current_page !== 0) {
            current_page--;

            tile_holder.innerHTML = "";
            show_results(request_data);
            stop_playing();
        }
        console.log("page: " + current_page);
    }
}

function on_next_page_clicked() {
    return function () {
        if(current_page < (Math.ceil(song_array.length/9) - 1)) {
            current_page++;

            tile_holder.innerHTML = "";
            show_results(request_data);
            stop_playing();
        }
        console.log("page: " + current_page);
        console.log("number of pages: " + Math.ceil(song_array.length/9));
    }
}

function draw_page_buttons() {

    var btn_hldr = document.getElementById("button_holder");
    btn_hldr.innerHTML="";

    var prev_page = document.createElement("button");
    var next_page = document.createElement("button");

    prev_page.className="page_button";
    next_page.className="page_button";

    prev_page.innerHTML="<< prev";
    next_page.innerHTML="next >>";

    prev_page.addEventListener("click", on_prev_page_clicked());
    next_page.addEventListener("click", on_next_page_clicked());

    document.getElementById("button_holder").appendChild(prev_page);
    document.getElementById("button_holder").appendChild(next_page);
}