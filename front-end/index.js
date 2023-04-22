const API_BASE_URL = 'https://zx99y1s10k.execute-api.us-west-2.amazonaws.com/dev';
      
function displayResponse(data) {
  const responseElement = document.getElementById('response');
  responseElement.innerHTML = '';
  console.log(data)
  if (isValidImageUrl(data)) {
    // console.log(data)
    data = data.replace(/^"|"$/g, '').replace(/^&quot;|&quot;$/g, '');
    const img = document.createElement('img');
    img.setAttribute("src", data);
    responseElement.appendChild(img);
  } else {
    const pre = document.createElement('pre');
    try {
      const json = JSON.parse(data);
      pre.textContent = JSON.stringify(json, null, 2);
    } catch (e) {
      pre.textContent = data;
    }
    responseElement.appendChild(pre);
  }
}

function isValidImageUrl(url) {
  return url.match(/[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)"$/) != null;
}

function getUrl() {
  return API_BASE_URL + document.getElementById('url').value;
}

function toggleDataField(requestType) {
  const dataField = document.getElementById('data');
  const dataLabel = document.querySelector("label[for='data']");
  const formatJsonButton = document.getElementById('formatJsonButton');
  const uploadImageButton = document.getElementById('uploadImageButton');
  const chooseFileButton = document.getElementById('imageFile');
  if (['PUT', 'POST'].includes(requestType)) {
    dataField.style.display = 'block';
    dataLabel.style.display = 'block';
    formatJsonButton.style.display = 'inline-block';
    uploadImageButton.style.display = 'inline-block';
    chooseFileButton.style.display = 'inline-block';
  } else {
    dataField.style.display = 'none';
    dataLabel.style.display = 'none';
    formatJsonButton.style.display = 'none';
    uploadImageButton.style.display = 'none';
    chooseFileButton.style.display = 'none';
  }
}

function formatJson() {
  const dataField = document.getElementById('data');
  try {
    const json = JSON.parse(dataField.value);
    dataField.value = JSON.stringify(json, null, 2);
  } catch (e) {
    console.error(e);
  }
}

function encodeImageFileAsURL() {
  const file = document.getElementById('imageFile').files[0];
  const reader = new FileReader();
  reader.onloadend = function() {
    document.getElementById('data').value = reader.result;
  };
  reader.readAsDataURL(file);
}

document.getElementById('requestType').addEventListener('change', (event) => {
  toggleDataField(event.target.value);
});

document.getElementById('formatJsonButton').addEventListener('click', () => {
  formatJson();
});

document.getElementById('apiForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const requestType = document.getElementById('requestType').value;
  const url = getUrl();
  const data = document.getElementById('data').value;
  fetch(url, {
    method: requestType,
    headers: {
      'Content-Type': 'application/json'
    },
    body: ['GET', 'DELETE'].includes(requestType) ? null : data
  })
    .then((response) => response.text())
    .then((data) => {
      displayResponse(data);
    })
    .catch((error) => console.error(error));
});