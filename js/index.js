//using jquery here for the submit function to work when pressing enter
$('#form').submit(function() {
  searchWiki();
  return false;
});

function searchWiki() {

  //declare function success for use in api request
  function success(result) {

    var resultList = document.getElementById("result-list");

    //timeout used to leave time for the css transition
    //without timeout, there is only a transition on the first search
    setTimeout(function() {
      //empty resultlist
      resultList.innerHTML = "";
      //if no result, alert user
      if (result[1].length === 0) {
        resultList.innerHTML = "<h4>No results for " + result[0] + "</h4>";
      } else {
        //loop through search result and add them to the dom
        for (i = 0; i < result[1].length; i++) {
          var name = result[1][i];
          var desc = result[2][i];
          var link = result[3][i];

          //create "a" tag under the result list div
          var a = document.createElement("a");
          a.setAttribute("href", link);
          a.setAttribute("target", "_blank");
          a.className = "list-group-item";
          resultList.appendChild(a);

          //create div tag under a
          var div = document.createElement("div");
          div.className = "list-group";
          a.appendChild(div);

          //create h4 tag under div
          var h4 = document.createElement("h4");
          h4.className = "list-group-item-heading";
          h4.innerHTML = name;
          div.appendChild(h4);

          //create p class under div
          var p = document.createElement("p");
          p.className = "list-group-item-text";
          p.innerHTML = desc;
          div.appendChild(p);

        }
      }

      resultList.style.opacity = "1";

    }, 250);

  }

  //declare variables for apiCall
  var resultList = document.getElementById("result-list");
  var article = document.getElementById("search").value;
  
  //opacity change for css transition
  resultList.style.opacity = "0";
  
  if (article === "") {
    setTimeout(function() {
      resultList.innerHTML = "<h4>Please enter a search value</h4>";
      resultList.style.opacity = 1;
    }, 250);
  } else {
    var apiCall = "https://cors-everywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + article;
    //create request to api
    var xhr = new XMLHttpRequest();
    xhr.open("GET", apiCall, true);

    //event listener because async=true
    xhr.onreadystatechange = function(oEvent) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          success(JSON.parse(xhr.responseText));
        } else {
          console.log("Error", xhr.statusText);
        }
      }
    };

    xhr.send();
  }
}