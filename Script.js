const url = "https://api.restful-api.dev/objects";

window.onload = function () {
  $("#popUp").hide();
  getObjects();
};

function loadObjects() {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.responseType = "json";
    request.onload = function () {
      if (request.status == 200) {
        resolve(request.response);
      } else {
        reject(Error(request.statusText));
      }
    };
    request.onerror = function () {
      reject(Error("Error: unexpected network error."));
    };
    request.send();
  });
}

function addObject() {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.setRequestHeader("Content-Type", "application/json");
    var data = JSON.stringify({
      color: document.getElementById("color").value,
      price: document.getElementById("price").value,
    });
    var object = JSON.stringify({
      name: document.getElementById("name").value,
      data: data,
    });
    request.onload = function () {
      if (request.status == 200) {
        resolve(request.response);
      } else {
        reject(Error(request.statusText));
      }
    };
    request.onerror = function () {
      reject(Error("Error: unexpected network error."));
    };
    request.send(object);
  });
}

function removeObject(id) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open("DELETE", url + `/${id}`);
    request.onload = function () {
      if (request.status == 200) {
        resolve(request.response);
      } else {
        reject(Error(request.statusText));
      }
    };
    request.onerror = function () {
      reject(Error("Error: unexpected network error."));
    };
    request.send();
  });
}

function modifyObject() {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open("PUT", url + `/${document.getElementsByName("id2")[0].value}`);
    request.setRequestHeader("Content-Type", "application/json");
    var data = JSON.stringify({
      color: document.getElementsByName("color2")[0].value,
      price: document.getElementsByName("price2")[0].value,
    });
    var object = JSON.stringify({
      name: document.getElementsByName("name2")[0].value,
      data: data,
    });
    request.onload = function () {
      if (request.status == 200) {
        resolve(request.response);
      } else {
        reject(Error(request.statusText));
      }
    };
    request.onerror = function () {
      reject(Error("Error: unexpected network error."));
    };
    request.send(object);
  });
}

function getObjects() {
  loadObjects()
    .then((response) => {
      var tbody = document.querySelector("tbody");
      tbody.innerHTML = "";
      response.forEach((object) => {
        if (
          object.data !== null &&
          Object.hasOwn(object.data, "color") &&
          Object.hasOwn(object.data, "price")
        ) {
          insertTr(object, false);
        }
      });
    })
    .catch((reason) => {
      console.error(reason);
    });
}

function saveObject() {
  if (
    document.getElementById("name").value.trim() !== "" &&
    document.getElementById("color").value.trim() !== "" &&
    document.getElementById("price").value.trim() !== ""
  ) {
    addObject()
      .then((response) => {
        var object = JSON.parse(response);
        var data = JSON.parse(object.data);
        object.data = data;
        insertTr(object, true);
      })
      .catch((reason) => {
        console.error(reason);
      });
  }
}

function deleteObject(object) {
  removeObject(object.id)
    .then(() => {
      var rows = document.querySelectorAll("tr");
      rows.forEach((row) => {
        if (row.getAttribute("id") === object.id) {
          row.remove();
          clearInputs();
        }
      });
    })
    .catch((reason) => {
      console.error(reason);
    });
}

function updateObject() {
  if (
    document.getElementsByName("name2")[0].value.trim() !== "" &&
    document.getElementsByName("color2")[0].value.trim() !== "" &&
    document.getElementsByName("price2")[0].value.trim() !== ""
  ) {
    modifyObject()
      .then(() => {
        var rows = document.querySelectorAll("tr");
        rows.forEach((row) => {
          if (
            row.getAttribute("id") ===
            document.getElementsByName("id2")[0].value
          ) {
            var data = JSON.stringify({
              color: document.getElementsByName("color2")[0].value,
              price: document.getElementsByName("price2")[0].value,
            });
            var object = JSON.stringify({
              id: document.getElementsByName("id2")[0].value,
              name: document.getElementsByName("name2")[0].value,
              data: data,
            });

            row.childNodes[1].innerHTML =
              document.getElementsByName("name2")[0].value;
            row.childNodes[2].innerHTML =
              document.getElementsByName("color2")[0].value;
            row.childNodes[3].innerHTML = `$${
              document.getElementsByName("price2")[0].value
            }`;
            row.childNodes[4].innerHTML = `<button onclick='viewObject(${object})'>VIEW</button>`;
            row.childNodes[5].innerHTML = `<button onclick='deleteObject(${object})'>DELETE</button>`;
          }
        });
        $("#popUp").dialog("close");
        clearInputs();
      })
      .catch((reason) => {
        console.error(reason);
      });
  }
}

function insertTr(object, canChange) {
  var tbody = document.querySelector("tbody");
  var row = tbody.insertRow();
  row.setAttribute("id", object.id);
  var id = row.insertCell();
  id.innerHTML = object.id;
  var name = row.insertCell();
  name.innerHTML = object.name;
  var color = row.insertCell();
  color.innerHTML = object.data.color;

  var price = row.insertCell();
  price.innerHTML = `$${object.data.price}`;

  var data = JSON.stringify({
    color: object.data.color,
    price: object.data.price,
  });
  var objectString = JSON.stringify({
    id: object.id,
    name: object.name,
    data: data,
  });

  if (canChange) {
    var view = row.insertCell();
    view.innerHTML = `<button onclick='viewObject(${objectString})'>VIEW</button>`;
    var del = row.insertCell();
    del.innerHTML = `<button onclick='deleteObject(${objectString})'>DELETE</button>`;
  }
  clearInputs();
}

function viewObject(object) {
  var data = JSON.parse(object.data);
  document.getElementsByName("id2")[0].value = object.id;
  document.getElementsByName("name2")[0].value = object.name;
  document.getElementsByName("color2")[0].value = data.color;
  document.getElementsByName("price2")[0].value = data.price;
  $("#popUp")
    .dialog({
      closeText: "",
    })
    .css("font-size", "15px");
}

function clearInputs() {
  document.getElementById("name").value = "";
  document.getElementById("color").value = "";
  document.getElementById("price").value = "";
  document.getElementById("name").focus();
}
