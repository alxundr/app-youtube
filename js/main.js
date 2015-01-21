// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms

// Gloval variables
var requestOptions,
    nextPageToken, 
    prevPageToken, 
    currentPage,
    totalResults = 0,
    RESULTS_PER_PAGE = 5,
/*    apiKey = 'AIzaSyAsrEtZKoqWvCg39nc82gBV1yR2qXrElEU';*/
    apiKey;

function initComponents() {
    $('#next-page').hide();       
    $('#prev-page').hide();
    $('.dropdown').hide();
    $('#search-btn').addClass('disabled');
    totalResults = 0;
    $('#search-input').val('');
    $('#response-title').html('');
    $('#response-total').html('');
    $('#response-page').html('');
    $('#response').html('');
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
} 

// Called automatically when JavaScript client library is loaded
function onClientLoad() {    
    initComponents();
    var length = $('#search-input').val().length;
    if (length > 0) {
        $('#search-btn').removeClass('disabled');
    } 
    $('#signout-btn').click(signOut);
    apiKey = getUrlParameter('apiKey');
    if (apiKey) {
        gapi.client.load('youtube', 'v3', onYouTubeApiLoad);        
    } else {
        window.location.replace("http://127.0.0.1:9000/login.html");
    }
    
}

function signOut() { 
    apiKey = '';
    window.location.replace("http://127.0.0.1:9000/login.html");
}

// Called automatically when YouTube API interface is loaded.
function onYouTubeApiLoad() {
    gapi.client.setApiKey(apiKey);   

    $('#search-input').keyup(checkInputChange);    

    $('#search-input').select(checkInputChange);

    $('#search-btn').click(submitQuery);

    $('#next-page').click(nextPage);

    $('#prev-page').click(prevPage);

    $(document.body).on('click', '.result .item', function() {
        var className = $(this).parent().attr('class');
        if (className === 'result current mouseover' || 
            className === 'result mouseover current' ||
            className === 'result current') {
            $(this).parent().removeClass('current');
            $(this).parent().children('.description').hide();
        } else {
            $('.result').removeClass('current');
            $('.description').hide();
            $(this).parent().addClass('current');
            $(this).parent().children('.description').show();
        } 
    });

    $(document.body).on('mouseover', '.result .item', function() {
        $(this).parent().addClass('mouseover');
        $(this).parent().mouseout(function() {
            $(this).removeClass('mouseover');
        });
    });
        
    $(document.body).keypress(function(event) {
        if (totalResults > 0 && $(this) != $('#search-input')) {
            // to go up
            if (event.keyCode === 38) {
                var currentVideo = $('.current');
                var nextVideo = currentVideo.prev();
                if (nextVideo.length != 0) {
                    currentVideo.removeClass('current');
                    currentVideo.children('.description').hide();
                    nextVideo.addClass('current');
                    nextVideo.children('.description').show();
                }                
            } 
            // to go down
            else if (event.keyCode === 40) {
                var currentVideo = $('.current');
                var nextVideo = currentVideo.next();
                if (nextVideo.length != 0) {
                    currentVideo.removeClass('current');
                    currentVideo.children('.description').hide();
                    nextVideo.addClass('current');
                    nextVideo.children('.description').show();
                }
                
            }
        }
        if($(this) != $('#search-input') && event.keyCode === 37 && totalResults > 0) {
            prevPage();
        } 
        if ($(this) != $('#search-input') && event.keyCode === 39 && totalResults > 0) {
            nextPage();
        }

    });
    
    
}

function checkInputChange(event) {
    if ($('#search-input').val().length > 0) {
        $('#search-btn').removeClass('disabled');
        if (event.keyCode === 13) {
            submitQuery();
        }
    } else {
        $('#search-btn').addClass('disabled');     
    }   
}

function submitQuery() {
    query = $('#search-input').val();
    $('#search-input').val('');
    $('#search-btn').addClass('disabled');           
    totalResults = 0;
    $('#next-page').hide();       
    $('#prev-page').hide();
    if (query.length > 0) {
        search(query);    
    }    
}

function search(query) {
    requestOptions = {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: RESULTS_PER_PAGE
    };

    var request = gapi.client.youtube.search.list(requestOptions);
    var headerText = "<h1>Showing results for '<span style='font-style: italic'>" + query + "'</span></h1>";

    $('#response-title').html(headerText);
    currentPage = 1;
    request.execute(onSearchResponse);
}

function nextPage() {
    var totalPages = totalResults / RESULTS_PER_PAGE;      
    if (totalPages > 0 && currentPage < totalPages) { 
        $('#prev-page').show();            
        requestOptions.pageToken = nextPageToken;
        var request = gapi.client.youtube.search.list(requestOptions);
        currentPage++;
        if (currentPage >= totalPages) {
            $('#next-page').hide(); 
        }
        request.execute(onSearchResponse);
    }     
}

function prevPage() {
    var totalPages = totalResults / RESULTS_PER_PAGE;
    if (totalPages > 0 &&  currentPage > 1) {  
        $('#next-page').show();       
        requestOptions.pageToken = prevPageToken;
        var request = gapi.client.youtube.search.list(requestOptions);
        currentPage--;
        if (currentPage === 1) {      
            $('#prev-page').hide();
        }
        request.execute(onSearchResponse);
    }    
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
    if (response.result.nextPageToken) {
        nextPageToken = response.result.nextPageToken;
    }
    if (response.result.prevPageToken) {
        prevPageToken = response.result.prevPageToken;  
    }
    showResponse(response);
}

function showResponse(response) {
    var items = response.result.items;
    
    if (totalResults === 0) {
        totalResults = response.result.pageInfo.totalResults;
        if (totalResults > 0) {
            $('#next-page').show(); 
        }
    }
    
    $('#response-total').html("<h3>about " + totalResults + " results <div class='movie'></div></h3>");
    $('#response-page').html("<h4>page " + currentPage + "</h4>");
    $('#response').html('');

    if (totalResults > 0) {
        for(var index = 0; index < items.length; index++) {
            var video = items[index];
            displayResult(video);
        }
    } else if (totalResults === 0) {
        var textDisplay = "<div class='alert alert-danger' role='alert'>" +
        "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>" +
        "<span class='sr-only'>Error:</span> No results</div>";
        $('#response').html(textDisplay);
    }
    
}

// Display a the information of each video in a table
function displayResult(video) {
    var videoDate = new Date(video.snippet.publishedAt),
        dateOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        },
        views,
        videoDescription = video.snippet.description;
        
    if (videoDescription === '') {
        videoDescription = "no description";
    }
    views = getViews(video.id.videoI);
    var textDisplay = 
    "<div class='result'>" + 
        "<div class='item row'>" + 
            "<div class='col-xs-3'>" + 
                "<img src='" + video.snippet.thumbnails.default.url + "' height='90' width='160'>" + 
            "</div>" + 
            "<div class='col-xs-9'>" + 
                "<p class='title'>" + video.snippet.title + "</p>" +
                "<p class='channel'>by " + "<a href='https://www.youtube.com/user/" + video.snippet.channelTitle + "' target='_blank'>" + video.snippet.channelTitle +"</a></p>" +
                "<p class='channel'>" + videoDate.toLocaleDateString("en-US", dateOptions) + " &middot; " + views + " views</p>" +
                "<p>" + videoDescription + "</p>" +
            "</div>" +
        "</div>" + 
        "<div class='description row'>" + 
            "<div class='col-xs-12'>" + 
                "<div class='embed-responsive embed-responsive-16by9'>" +
                    "<iframe class='embed-responsive-item' src='http://www.youtube.com/embed/" + video.id.videoId + "'></iframe>" +
                "</div>" +
            "</div>" +
        "</div>" +
    "</div>";
    $('#response').append(textDisplay);
}

function getViews(videoId) {
    var url = "http://10.50.27.106:8080/RestApp/rest?message=" + videoId,
        views;
    jQuery.ajax({
        type: 'GET',
        url: url,
        async: false,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data, status, xmlhttp) {
                    views = data.val;
                 },
        error: function (xmlhttp, status) {
                    views = 'error';
                }
    });
//var views = 'error':
    return views;
}
