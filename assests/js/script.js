// This is the javascript file
var mainScreenDOM = document.querySelector("#outLayer");
var mainScreenDOMJQ = $('#outLayer');

var searchNewReleaseList = $('#nowShowing');
var searchPopularList = $('#Popular');
var searchTopRatedList = $('#TopRated');
var searchList = $('#search-form');
var favouritesList = $('#favourites');
var openMovieModal = $('#ex1');



var modalMovieImageItm = document.querySelector("#modalMovieImage");
var modalMovieTitleItm = document.querySelector("#modalMoviesTitle");
var modalMovieDescItm = document.querySelector("#modalMovieDesc");
var modalMovieGenreItm = document.querySelector("#modalMovieGenre");
var modalMoviePopItm = document.querySelector("#modalMoviePop");
var pageTitleItm = document.querySelector("#pageTitle");
var addToFavouritesItm = $('#addToFavourites');
var favoriteList;
var localStorageHistory = [];

document.addEventListener('DOMContentLoaded', () => {
  let bodyElement = document.querySelector("body")
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
    bodyElement.style.position = "fixed";
    bodyElement.style.overflow = "hidden";
    bodyElement.style.width = "100%";
    bodyElement.style.height = "100%";
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
    bodyElement.style.position = "unset";
    bodyElement.style.overflow = "unset";
    bodyElement.style.width = "unset";
    bodyElement.style.height = "unset";
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});

function init() {
  favoriteList = [];
  var localStorageHistory = JSON.parse(localStorage.getItem("movieFavourites"));
  if(!!localStorageHistory){
    favoriteList = [...localStorageHistory];
  }
};

function buttonClickNewRelease(event) {
  var appID = 'edae2dbf4933f27205a897a516b34101';
  var apiUrl = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' + appID;

  fetch(apiUrl)

  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    displayMovieList(data);
    pageTitleItm.textContent = "New Releases";
  });
};

function buttonClickPopular(event, pageNum) {
  var appID = 'edae2dbf4933f27205a897a516b34101';
  var pageNum = 1;

  var apiUrl = 'https://api.themoviedb.org/3/movie/popular?api_key='+ appID + '&language=en-US&page='+ pageNum;
  
fetch(apiUrl)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  displayMovieList(data);
  pageTitleItm.textContent = "Popular Movies";
});

};

function buttonClickTopRated(event, pageNum) {
  var appID = 'edae2dbf4933f27205a897a516b34101';

  //var pageNum = 1;
  var apiUrl = 'https://api.themoviedb.org/3/movie/top_rated?api_key='+ appID + '&language=en-US&page='+ pageNum;
  
fetch(apiUrl)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  displayMovieList(data);
  pageTitleItm.textContent = "Top Rated Movies";
});
};

function addMovieToFavourites(event) {
  var element = event.target;
  var movieNum = element.getAttribute("movie-id");

    
    if(favoriteList.includes(parseInt(movieNum,10))){
      favoriteList.splice(favoriteList.indexOf(parseInt(movieNum,10)), 1);
      addToFavouritesItm.text("Add to Favourites");

    }else{
      addToFavouritesItm.text("Remove from Favourites");
      favoriteList.push(parseInt(movieNum,10));
      localStorage.setItem("movieFavourites", JSON.stringify(favoriteList));

    }

};

function buttonSearch(event, title) {

  if(!title){
    return;
  }
  title = title.trim();

  var appID = 'edae2dbf4933f27205a897a516b34101';
  var pageNum = 1;
  var apiUrl = 'https://api.themoviedb.org/3/search/movie?api_key='+ appID + '&language=en-US&page='+ pageNum + '&query=' + title;

fetch(apiUrl)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  displayMovieList(data);
  pageTitleItm.textContent = "Search for Movies - \""+ title +"\"";

});
};

function buttonOpenModal(event) {
  var element = event.target;
  var movieNum = element.getAttribute("movie-id");
  
  var appID = 'edae2dbf4933f27205a897a516b34101';
  var apiUrl = 'https://api.themoviedb.org/3/movie/'+ movieNum +'?api_key='+ appID + '&language=en-US';

fetch(apiUrl)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  var posterPath = 'https://image.tmdb.org/t/p/w500'+data.poster_path;
  modalMovieImageItm.setAttribute('src', posterPath);

  modalMovieTitleItm.textContent = data.title;
  modalMovieDescItm.textContent = data.overview;
  addToFavouritesItm.attr("movie-id",movieNum);

  var genreArr = [];
  for(var i = 0;i<data.genres.length;i++){
    genreArr.push(data.genres[i].name);
  }
  var genres = genreArr.join(", ");
  modalMovieGenreItm.textContent = genres;
  modalMoviePopItm.textContent = data.vote_average;

if(favoriteList.includes(parseInt(movieNum,10))){
  addToFavouritesItm.text("Remove from Favourites");

}else{
  addToFavouritesItm.text("Add to Favourites");
}
  
  

  openMovieModal.modal('open');
});

};

function buttonSearchFavourites(event) {
  mainScreenDOMJQ.empty();

  for( var i = 0 ; i < favoriteList.length; i++){
    var appID = 'edae2dbf4933f27205a897a516b34101';
    var apiUrl = 'https://api.themoviedb.org/3/movie/' + favoriteList[i] + '?api_key='+ appID + '&language=en-US';

    fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {    
      
      var posterPath = 'https://image.tmdb.org/t/p/w500'+data.poster_path;
 
      var cardLayer = document.createElement("div");
      cardLayer.classList.add('column','is-one-quarter-desktop','is-half-tablet');

      var cardLayerInner = document.createElement("div");
      cardLayerInner.classList.add('card');

      var cardLink = document.createElement("a");
      cardLink.setAttribute('href', "#");

      var cardImage = document.createElement("div");
      cardImage.classList.add('card-image');

      var cardFig = document.createElement("figure");
      cardFig.classList.add('image','is-5by2');

      var cardImg = document.createElement("img");
      cardImg.setAttribute('src', posterPath);
      cardImg.setAttribute('movie-id', data.id);


      cardFig.appendChild(cardImg);
      cardImage.appendChild(cardFig);
      cardLink.appendChild(cardImage);
      cardLayerInner.appendChild(cardLink);
      cardLayer.appendChild(cardLayerInner);
      mainScreenDOM.appendChild(cardLayer);
      




    });
    pageTitleItm.textContent = "Your Favourite Movies";

  }
    

  }


var displayMovieList = function (data){
  mainScreenDOMJQ.empty();
    for( var i = 0 ; i < data.results.length; i++){
        //this skips movies with no posters
        if(data.results[i].poster_path == null){
          continue;
        }
        var posterPath = 'https://image.tmdb.org/t/p/w500'+data.results[i].poster_path;
 
        var cardLayer = document.createElement("div");
        cardLayer.classList.add('column','is-one-quarter-desktop','is-half-tablet');

    var cardLayer = document.createElement("div");
    cardLayer.classList.add('column', 'is-one-quarter-desktop', 'is-half-tablet');

    var cardLayerInner = document.createElement("div");
    cardLayerInner.classList.add('card');

    var cardLink = document.createElement("a");
    cardLink.setAttribute('href', "#");

    var cardImage = document.createElement("div");
    cardImage.classList.add('card-image');


        var cardImg = document.createElement("img");
        cardImg.setAttribute('src', posterPath);
        cardImg.setAttribute('movie-id', data.results[i].id);
        addToFavouritesItm.attr("movie-id",data.id);

        cardFig.appendChild(cardImg);
        cardImage.appendChild(cardFig);
        cardLink.appendChild(cardImage);
        cardLayerInner.appendChild(cardLink);
        cardLayer.appendChild(cardLayerInner);
        mainScreenDOM.appendChild(cardLayer);
    }

};

init();



searchNewReleaseList.on('click', buttonClickNewRelease);
searchPopularList.on('click', event =>  buttonClickPopular(event, 1));
searchTopRatedList.on('click', event => buttonClickTopRated(event, 1));
searchList.on('submit', event => buttonSearch(event, $( "#searchBar" ).val()));
favouritesList.on('click', buttonSearchFavourites);
mainScreenDOMJQ.on('click', buttonOpenModal);

addToFavouritesItm.on('click', addMovieToFavourites);
