const serviceAccount = require("C:\\firebase-keys\\logical-fabric-firebase-adminsdk-r2757-02edf22e43.json");
//cmd set GOOGLE_APPLICATION_CREDENTIALS=C:\firebase-keys\Logical-Fabric-4237a58a0acb.json
const _ = require("lodash");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebaseHelper = require("firebase-functions-helper");
const express = require("express");
const bodyParser = require("body-parser");

const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();

// admin.initializeApp(functions.config().firebase);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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

// app.get("/images/:imageId", (req, res, next) => {
//   firebaseHelper.firestore
//     .getDocument(db, IMAGECOLLECTION, req.params.imageId)
//     .then(doc => res.status(200).send(doc));
// });

// View all images or with keyword
app.get("/images", async (req, res, next) => {
  try {
    const { idToken, kw } = req.query;

    const decodedToken = await admin.auth().verifyIdToken(req.query.idToken);
    let uid = decodedToken.uid;
    if (!uid) res.send("Auth failed");

    const snapshot = await firebaseHelper.firestore.queryData(
      db,
      IMAGECOLLECTION,
      [],
      ["timestamp", "desc"]
    );

    let data = _.values(snapshot);

    //Search by keyword
    if (kw) {
      console.log("keyword", kw);
      data = data.filter(image => {
        return (
          image.apiResult.filter(api => {
            return api.description.includes(kw);
          }).length > 0
        );
      });
    }

    console.log("data with keyword", data);
    res.status(200).send(data);
  } catch (err) {
    res.send(err);
  }
});

app.post("/images/", async (request, response, next) => {
  //Inbound query string
  const imageUrl = _.trim(request.body.imgUrl || request.query.imgUrl);
  const idToken = request.body.idToken || request.query.idToken;
  console.log("image to add", imageUrl);

  if (!imageUrl) response.send("Image Url empty.");
  if (!idToken) response.send("Auth failed.");

  //todo...it has different effect on Browser and postman,
  //In Postman we use req.query.imgUrl to get params
  //In Brower we use req.body.imgUrl
  //It is wired

  try {
    // ckeck session validation
    await admin.auth().verifyIdToken(idToken);

    // get image url by Google Vision API
    const labels = await client.labelDetection(imageUrl);

    //Save a new record to Firestore
    const refId = await firebaseHelper.firestore.createNewDocument(
      db,
      IMAGECOLLECTION,
      {
        imgUrl: imageUrl,
        timestamp: _.now(),
        apiResult: labels[0].labelAnnotations
      }
    );

    //return newly created record to client
    //todo...propect to move it away
    const newRec = await firebaseHelper.firestore.getDocument(
      db,
      IMAGECOLLECTION,
      refId.id
    );

    response.status(200).send(newRec);
  } catch (err) {
    response.send(err);
  }
});
