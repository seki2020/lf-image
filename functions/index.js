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

const ERR = {
  NoSuchDoc: "No such document!"
};

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

// View all images or with keyword
app.get("/images", async (req, res, next) => {
  const { idToken, kw } = req.query;
  try {
    //To validate credential
    await admin.auth().verifyIdToken(req.query.idToken);

    //To get records from database
    const snapshot = await firebaseHelper.firestore.queryData(
      db,
      IMAGECOLLECTION,
      [],
      ["timestamp", "desc"]
    );

    //In case the document is not existed
    if (snapshot === ERR.NoSuchDoc) {
      res.status(500).send(ERR.NoSuchDoc);
    }

    //Convert data model
    let dataIds = _.keys(snapshot);
    let data = _.values(snapshot).map((doc, index) => {
      const newDoc = doc;
      newDoc.Id = dataIds[index];
      return newDoc;
    });

    //Filter by keyword
    if (kw) {
      console.log("keyword", kw);
      data = data.filter(image => {
        return (
          image.apiResult.filter(api => {
            const kwTrim2 = _.trim(kw).toLowerCase();
            const DescriptionTrim = _.trim(api.description).toLowerCase();
            console.log(
              DescriptionTrim.includes(kwTrim2) || DescriptionTrim == kwTrim2
            );
            return (
              DescriptionTrim.includes(kwTrim2) || DescriptionTrim == kwTrim2
            );
          }).length > 0
        );
      });
    }
    res.status(200).send(data);
  } catch (err) {
    res.send(err);
  }
});

app.post("/images/", async (request, response, next) => {
  //Inbound query string
  const imageUrl = _.trim(request.body.imgUrl);
  const idToken = request.body.idToken;
  console.log("image to add", imageUrl);

  if (!imageUrl) response.send("Image Url empty.");
  if (!idToken) response.send("Auth failed.");

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

app.delete("/image/", async (request, response, next) => {
  //Inbound query string
  const imageId = _.trim(request.body.imageId || request.query.imageId);
  const idToken = request.body.idToken || request.query.idToken;
  console.log("image to remove", imageId);

  if (!imageId) response.send("Image Id empty.");
  if (!idToken) response.send("Auth failed.");

  try {
    // ckeck session validation
    await admin.auth().verifyIdToken(idToken);

    const res = await firebaseHelper.firestore.deleteDocument(
      db,
      IMAGECOLLECTION,
      imageId
    );
    console.log("delete result", res);
    response.status(200).send(res);
  } catch (err) {
    response.send(err);
  }
});
