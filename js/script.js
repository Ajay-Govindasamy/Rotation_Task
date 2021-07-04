/**
 * validating Input Fields to check if the entered data is valid or not before processing it
 * @param {*} fieldObject validates the input field angle from the User Interface
 */
function validateField(fieldObject) {
  fieldObject.value > 0 && fieldObject.value <= 360
    ? (document.getElementById('angleError').innerHTML = '')
    : (document.getElementById('angleError').innerHTML =
        'Enter value between 1 and 360');
}

//Initial image, height and initializing Rotator class from backend-NodeJS
let image = { height: 0, width: 0 };
let rotator = new Rotator();

/**
 * @description Reading the user uploaded image and fetching the ImageData Object from the image
 * @param {*} e binds the event to target
 */
function readImageData(e) {
  let originalCanvas = document.getElementById('originalImageCanvas');
  let imageDataObject = originalCanvas.getContext('2d');
  let fileReader = new FileReader();
  fileReader.onload = function (event) {
    let newImage = new Image();
    newImage.onload = () => {
      originalCanvas.width = newImage.width;
      originalCanvas.height = newImage.height;
      imageDataObject.drawImage(newImage, 0, 0);

      image.height = newImage.height;
      image.width = newImage.width;
    };
    newImage.src = event.target.result;
  };
  fileReader.readAsDataURL(e.target.files[0]);
}

/**
 * @description onclick of 'Rotate' button to execute the rotate algorithm Logic
 */
function rotateImageMethodOne() {
  document.getElementById('loader').classList.remove('hide');
  let timeOut = setTimeout(function () {
    let originalImageCanvas = document.getElementById('originalImageCanvas');
    let imageDataOriginal = originalImageCanvas.getContext('2d');
    let convertedImageCanvas = document.getElementById('convertedImageCanvas');
    let imageDataConverted = convertedImageCanvas.getContext('2d');
    let angle = parseFloat(document.getElementById('angle').value);
    let currentImage = null;
    try {
      currentImage = imageDataOriginal.getImageData(
        0,
        0,
        image.width,
        image.height
      );
      let result = currentImage;

      //Testing the algorithm's performance
      var startTime;
      var endTime;
      startTime = performance.now();
      result = rotator.rotate(currentImage, angle);
      endTime = performance.now();
      let timeTaken = endTime - startTime;

      const newimageData = imageDataConverted.createImageData(
        result.width,
        result.height
      );

      for (let i = 0; i < newimageData.data.length; i++)
        newimageData.data[i] = result.data[i];

      convertedImageCanvas.width = newimageData.width;
      convertedImageCanvas.height = newimageData.height;

      imageDataConverted.putImageData(newimageData, 0, 0);

      const options = {
        style: {
          main: {
            background: '#27ae60',
            color: '#fff',
          },
        },
      };
      iqwerty.toast.toast(
        'Image Rotation Algorithm took ' + `${timeTaken}` + ' milliseconds',
        options
      );
    } catch (error) {
      M.toast({
        html: 'Oops, something went wrong. Please check your inputs.',
      });
      document.getElementById('loader').classList.add('hide');
      clearTimeout(timeOut);
    }

    document.getElementById('loader').classList.add('hide');
    clearTimeout(timeOut);
  }, 100);
}

/**
 * @description onclick of 'Rotate' button to execute the rotate algorithm Logic
 */
function fetchRotateAPIcallMethodTwo() {
  document.getElementById('loader').classList.remove('hide');
  let timeOut = setTimeout(async function () {
    let originalImageCanvas = document.getElementById('originalImageCanvas');
    let imageDataOriginal = originalImageCanvas.getContext('2d');
    let convertedImageCanvas = document.getElementById('convertedImageCanvas');
    let imageDataConverted = convertedImageCanvas.getContext('2d');
    let angle = parseFloat(document.getElementById('angle').value);
    let currentImage = null;

    try {
      currentImage = imageDataOriginal.getImageData(
        0,
        0,
        image.width,
        image.height
      );

      const imageData = (({ width, height, data }) => ({
        width,
        height,
        data,
      }))(currentImage);

      const apiUrl = 'http://localhost:3000/imageRotate';
      let _data = {
        image: imageData,
        angle: angle,
      };

      var startTime;
      var endTime;
      startTime = performance.now();
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(_data),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });

      if (response.status == 200) {
        const responseData = await response.json();
        endTime = performance.now();
        let timeTaken = endTime - startTime;
        const newimageData = imageDataConverted.createImageData(
          responseData.width,
          responseData.height
        );

        for (let i = 0; i < newimageData.data.length; i++)
          newimageData.data[i] = responseData.data[i];

        convertedImageCanvas.width = newimageData.width;
        convertedImageCanvas.height = newimageData.height;

        imageDataConverted.putImageData(newimageData, 0, 0);
        const options = {
          style: {
            main: {
              background: '#27ae60',
              color: '#fff',
            },
          },
        };
        iqwerty.toast.toast(
          'Image Rotation Algorithm took ' + `${timeTaken}` + ' milliseconds',
          options
        );
      }
    } catch (error) {
      M.toast({
        html: 'Oops, something went wrong. Please check your inputs.',
      });
      document.getElementById('loader').classList.add('hide');
      clearTimeout(timeOut);
    }

    document.getElementById('loader').classList.add('hide');
    clearTimeout(timeOut);
  }, 100);
}

//anonymous IIFE function that runs automatically when the script is loaded initially without any explicit invoke.
(function () {
  document
    .getElementById('fileId')
    .addEventListener('change', readImageData, false);
  document
    .getElementById('rotateButton')
    .addEventListener('click', fetchRotateAPIcallMethodTwo);
})();
