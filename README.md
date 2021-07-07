The project structure is divided into two parts.

1. client(browser) - Contains the User Interface and styles for the web page.
2. backend - contains the Rotator class which can be accessed directly from the browser or through REST API call to Node server.

Technologies Used:
HTML5, CSS3 ,ES6 JavaScript, NodeJS, AWS API Gateway, serverless framework, AWS Lambda, AWS CloudWatch.
The Application can be accessed/tested from the below link,

Deployed in GitHub pages - Link: https://ajay-govindasamy.github.io/Rotation_Task/

• Validation checks for the inputs are added both in browser and server level. Documented the code using JSDoc comments

TWO SOLUTIONS:

• index.html is the start point of the application

As stated in the rules of the requirement 'The class/method must run in node and browser'

The rotate method can be accessed from calling either of the below methods available in client folder --> js--> 'script.js' file,

i) function rotateImageMethodOne(event) - accessing from browser by calling 'Rotator.js' file

ii) function fetchRotateAPIcallMethodTwo(event) - accessing the algorithm from AWS API endpoint (invoked as AWS lambda function using Node server runtime environment)

• Please find the API endpoint access URL below,
https://ilw1b2437a.execute-api.us-east-1.amazonaws.com/production/imageRotate

• Deployed the AWS lambda function using cloud serverless framework (https://www.serverless.com/)

• API responses are logged in AWS CloudWatch.

• As a security measure, added CORS(Cross Origin Resource Sharing) access to load the resources from the server.

• Image Upload file size is restricted to 1 MB to reduce the payload when sending the ImageData (Uint8ClampedArray ) buffer information to the Node server in REST API call
