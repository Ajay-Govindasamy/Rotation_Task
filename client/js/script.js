/**
 * validating Input Fields to check if the entered data is valid or not before processing it
 * @param {*} fieldObject validates the input field angle(degrees) from the User Interface
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
 * @description Solution 1- onclick of 'Rotate' button to execute the rotate algorithm Logic
 */
function rotateImageMethodOne(event) {
  event.preventDefault();
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
      console.log(currentImage);
      //Testing the algorithm's performance
      var startTime;
      var endTime;
      startTime = performance.now();
      result = rotator.rotate(currentImage, angle);
      endTime = performance.now();
      let timeTaken = endTime - startTime;
      let memoryInfo = performance.memory;
      console.log(memoryInfo);

      const newimageData = imageDataConverted.createImageData(
        result.width,
        result.height
      );

      for (let i = 0; i < newimageData.data.length; i++)
        newimageData.data[i] = result.data[i];

      convertedImageCanvas.width = newimageData.width;
      convertedImageCanvas.height = newimageData.height;

      imageDataConverted.putImageData(newimageData, 0, 0);
      evaluateImageQuality();
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
 * @description Solution 2- onclick of 'Rotate' button to execute the rotate algorithm Logic
 */
function fetchRotateAPIcallMethodTwo(event) {
  event.preventDefault();
  const apiEndPoint =
    'https://ilw1b2437a.execute-api.us-east-1.amazonaws.com/production/imageRotate';
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

      let _data = {
        image: imageData,
        angle: angle,
      };

      var startTime;
      var endTime;
      startTime = performance.now();
      const response = await fetch(apiEndPoint, {
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
        evaluateImageQuality();
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

/** Calculating Image sizes and resolution Metrics */
evaluateImageQuality = () => {
  let originalImageCanvas = document.getElementById('originalImageCanvas');
  let convertedImageCanvas = document.getElementById('convertedImageCanvas');
  const originalSize = Math.round(
    originalImageCanvas.toDataURL('image/jpeg').length
  );
  const origResolution =
    originalImageCanvas.width + 'x' + originalImageCanvas.height;
  const convImageSize = Math.round(
    convertedImageCanvas.toDataURL('image/jpeg').length
  );
  const convResolution =
    convertedImageCanvas.width + 'x' + convertedImageCanvas.height;

  document.getElementById(
    'OrigImgTitle'
  ).innerHTML = `Original Image:\n size(${originalSize}  KB)  Resolution: (${origResolution})`;
  document.getElementById(
    'RotImgTitle'
  ).innerHTML = `Rotated Image:\n size(${convImageSize} KB) Resolution: (${convResolution})`;
};

//anonymous IIFE function that runs automatically when the script is loaded initially without any explicit invoke.
(function () {
  document
    .getElementById('fileId')
    .addEventListener('change', readImageData, false);
})();
