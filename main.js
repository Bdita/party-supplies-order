// On page load, AJAX Get request
window.onload = function () {
  $.ajax({
        url: "http://127.0.0.1:5000/api/v1/supplies",
        type: "GET",
        cache: false,
        success: function(response) {
          addElement(response.result);
        },
        // get etag from response and store in sessionStorage
        complete: function(XMLHttpRequest, response) {
          var etagServer = XMLHttpRequest.getResponseHeader('ETag');
          if (sessionStorage.length == 0) {
            sessionStorage.setItem('etag', etagServer);
          }else {
            var etagCache = sessionStorage.getItem('etag');
            // get the updated etag and replace old etag from sessionStorage
            if (etagCache != etagServer) {
              sessionStorage.removeItem('etag');
              sessionStorage.setItem('etag', etagServer);
            }
            else {
              console.log("Not Modified");
            }
          }
        }
      });
}

function addElement(items) {
  var string = "Ordered By:";
  items.map((item, key) => {
    // function call to create new div element
    createDisplayDiv(item);
  });
}

function createDisplayDiv(data) {
  // create new div element with id displaySupply
  var displayDiv = document.createElement("div");
  displayDiv.setAttribute("id","displaySupply");
  changeCardColor(displayDiv, data.supply);
  // create divs for display texts
  createTextDivs(displayDiv, data);
  document.getElementById("displaySupplyContainer").appendChild(displayDiv);
}

function createTextDivs(divElement, data) {
  // For Displaying supply name
  var divForSupply = document.createElement("div");
  divForSupply.appendChild(document.createTextNode(data.supply));
  divForSupply.setAttribute("id", "supplyName");
  divElement.appendChild(divForSupply);
  // For displaying amount number
  var divForAmount = document.createElement("div");
  divForAmount.appendChild(document.createTextNode(data.amount));
  divForAmount.setAttribute("id", "amountNum");
  divElement.appendChild(divForAmount);
  // For displaying "Ordered by:" text
  var divForOrder = document.createElement("div");
  divForOrder.appendChild(document.createTextNode("Ordered By:"));
  divForOrder.setAttribute("id", "orderText");
  divElement.appendChild(divForOrder);
  // For displaying name
  var divForName = document.createElement("div");
  divForName.appendChild(document.createTextNode(data.name));
  divForName.setAttribute("id", "personName");
  divElement.appendChild(divForName);
}

// On form submit, AJAX post request
var supplyForm = document.getElementById("supplyForm");

// function to alert the user that data has been modified.
function errorMessage() {
  alert("Please refresh the page before placing the order to retrieve updated data. Sorry for the inconvinience. ");
}

// on form submit, first validate, then make get request to compare etag and do accordingly
supplyForm.onsubmit = function(event, callback) {
  event.preventDefault(); //Prevents page from Reloading

  var name = supplyForm.name.value;
  var supply = supplyForm.supply.value;
  var amount = supplyForm.amount.value;
  var data = {
       "name" : name,
       "supply" : supply,
       "amount" : amount,
   }

  if (isNaN(amount) || amount < 1 || amount > 10) {
      supplyForm.amount.focus();
      text = "Please enter amount from 1 to 10";
      document.getElementById("amountError").innerHTML = text;
  } else {
    var etagCache = sessionStorage.getItem('etag');
    $.ajax({
          url: "http://127.0.0.1:5000/api/v1/supplies",
          type: "POST",
          cache: false,
          data: JSON.stringify(data),
          contentType: 'application/json;charset=UTF-8',
          headers: {
                       "If-Match": etagCache
                   },
          success: function(response) {
             createDisplayDiv(response.result);
             $.ajax({
                   url: "http://127.0.0.1:5000/api/v1/supplies",
                   type: "GET",
                   cache: false,
                   complete: function(XMLHttpRequest, response) {
                     var etagServer = XMLHttpRequest.getResponseHeader('ETag');
                     sessionStorage.removeItem('etag');
                     sessionStorage.setItem('etag', etagServer);
                  }
              });
           },
          complete: function(XMLHttpRequest, response) {
            // if response status code is 412 display an error alert
            var etagServer = XMLHttpRequest.getResponseHeader('ETag');
            // get the updated etag and replace old etag from sessionStorage
            if (XMLHttpRequest.status == 412) {
                errorMessage();
            }
          }
        });
  }
};

// change background color according to supply name
function changeCardColor(div, supplyName) {
  if (supplyName == "Beers") {
    div.style.backgroundColor =  "#84F70A";
  } else if (supplyName == "Balloons") {
      div.style.backgroundColor =  "#F77C58";
  } else {
      div.style.backgroundColor =  "#FCFF3B";
  }
}
