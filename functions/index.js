// const serviceAccount = require("C:\\firebase-keys\\logical-fabric-firebase-adminsdk-r2757-02edf22e43.json");
const _ = require("lodash");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebaseHelper = require("firebase-functions-helper");
const express = require("express");
const bodyParser = require("body-parser");

const vision = require("@google-cloud/vision");
const CLIENT = new vision.ImageAnnotatorClient();

admin.initializeApp(functions.config().firebase);
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const db = admin.firestore();

const app = express();
const main = express();
const cors = require("cors");

app.use(cors({ origin: true }));

//redirect url
main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

const IMAGECOLLECTION = "images";

exports.webApi = functions.https.onRequest(main);

app.get("/images/:imageId", (req, res, next) => {
  firebaseHelper.firestore
    .getDocument(db, IMAGECOLLECTION, req.params.imageId)
    .then(doc => res.status(200).send(doc));
});

// View all images
app.get("/images", (req, res, next) => {
  // return cors(req, res, () => {
  firebaseHelper.firestore
    .backup(db, IMAGECOLLECTION)
    .then(data => res.status(200).send(data));
  // })
});

app.post("/images/", (request, response, next) => {
  //todo...it has different effect on Browser and postman,
  //In Postman we use req.query.imgUrl to get params
  //In Brower we use req.body.imgUrl
  //It is wired !!!
  try {
    const imageUrl = _.trim(request.body.imgUrl || request.query.imgUrl);
    if (!imageUrl) response.send({ data: false });
    addImageByUrl(imageUrl, response);
  } catch (error) {
    console.log(error);
  }
});

function labelDetectionAsync(imageUrl) {
  return new Promise(resolve => {
    resolve(CLIENT.labelDetection(imageUrl));
  });
}

function saveResultAsync(json) {
  return new Promise(resolve => {
    resolve(
      firebaseHelper.firestore.createNewDocument(db, IMAGECOLLECTION, json)
    );
  });
}
function getDocById(id) {
  return new Promise(resolve => {
    resolve(firebaseHelper.firestore.getDocument(db, IMAGECOLLECTION, id));
  });
}

async function addImageByUrl(imageUrl, response) {
  const labels = await labelDetectionAsync(imageUrl);
  const annotations = labels[0].labelAnnotations;
  console.log("labels", annotations);

  const record = {
    imgUrl: imageUrl,
    timestamp: _.now(),
    apiResult: annotations
  };
  const refId = await saveResultAsync(record);
  console.log("refId", refId.id);

  const newRec = await getDocById(refId.id);

  response.send(newRec);
}
