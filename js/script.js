function formSubmit(event) {
  var formEl = document.forms.imageDatas;
  var formData = new FormData(formEl);

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const arr = new Uint8ClampedArray(formData.get('buffer'));

  // Iterate through every pixel
  for (let i = 0; i < arr.length; i += 4) {
    arr[i + 0] = 0; // R value
    arr[i + 1] = 190; // G value
    arr[i + 2] = 0; // B value
    arr[i + 3] = 255; // A value
  }

  // Initialize a new ImageData object
  let imageData = new ImageData(arr, 200);

  // Draw image data to the canvas
  ctx.putImageData(imageData, 20, 20);
}

//validating Input Fields
function validateField(fieldObject) {
  switch (fieldObject.name) {
    case 'buffer':
      Math.sign(fieldObject.value) == 1
        ? (document.getElementById('bufferError').innerHTML = '')
        : (document.getElementById('bufferError').innerHTML =
            'Enter positive buffer value');
      break;
    case 'width':
      Math.sign(fieldObject.value) == 1
        ? (document.getElementById('widthError').innerHTML = '')
        : (document.getElementById('widthError').innerHTML =
            'Enter positive width value');
      break;
    case 'height':
      Math.sign(fieldObject.value) == 1
        ? (document.getElementById('heightError').innerHTML = '')
        : (document.getElementById('heightError').innerHTML =
            'Enter positive height value');
      break;
    case 'angle':
      fieldObject.value > 0 && fieldObject.value <= 360
        ? (document.getElementById('angleError').innerHTML = '')
        : (document.getElementById('angleError').innerHTML =
            'Enter value between 1 and 360');
      break;
    default:
      break;
  }
}
