const serviceAccount = require("C:\\firebase-keys\\logical-fabric-firebase-adminsdk-r2757-02edf22e43.json")
const _ = require("lodash")

const functions = require("firebase-functions")
const admin = require("firebase-admin")
const firebaseHelper = require("firebase-functions-helper")
const express = require("express")
const bodyParser = require("body-parser")

const vision = require("@google-cloud/vision")
const CLIENT = new vision.ImageAnnotatorClient()

// admin.initializeApp(functions.config().firebase);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()

const app = express()
const main = express()
const cors = require("cors")

app.use(cors({ origin: true }))

//redirect url
main.use("/api/v1", app)
main.use(bodyParser.json())
main.use(bodyParser.urlencoded({ extended: false }))

const IMAGECOLLECTION = "images"

exports.webApi = functions.https.onRequest(main)

app.get("/images/:imageId", (req, res, next) => {
  firebaseHelper.firestore
    .getDocument(db, IMAGECOLLECTION, req.params.imageId)
    .then(doc => res.status(200).send(doc))
})

// View all images
app.get("/images", async (req, res, next) => {
  try {
    const { idToken, kw } = req.query

    const decodedToken = await admin.auth().verifyIdToken(req.query.idToken)
    let uid = decodedToken.uid

    const snapshot = await firebaseHelper.firestore.queryData(
      db,
      IMAGECOLLECTION,
      [],
      ["timestamp", "desc"]
    )

    let data = _.values(snapshot)

    //Search by keyword
    if (kw) {
      console.log("keyword", kw)
      data = data.filter(image => {
        return (
          image.apiResult.filter(api => {
            return api.description.includes(kw)
          }).length > 0
        )
      })
    }

    console.log("data", data)
    res.status(200).send(data)
  } catch (err) {
    res.send(err)
  }
})

app.post("/images/", async (request, response, next) => {
  console.log(request)
  const idToken = request.body.idToken || request.query.idToken
  if (!idToken) {
    response.send("Auth failed.")
  }
  console.log("idToken post", idToken)

  //todo...it has different effect on Browser and postman,
  //In Postman we use req.query.imgUrl to get params
  //In Brower we use req.body.imgUrl
  //It is wired

  try {
    await admin.auth().verifyIdToken(idToken)

    const imageUrl = _.trim(request.body.imgUrl || request.query.imgUrl)
    if (!imageUrl) response.send({ data: false })
    const newRecord = await addImageByUrl(imageUrl, response)
    response.status(200).send(newRecord)
  } catch (err) {
    response.send(err)
  }
})

// function labelDetectionAsync(imageUrl) {
//   return new Promise(resolve => {
//     resolve(CLIENT.labelDetection(imageUrl));
//   });
// }

// function saveResultAsync(json) {
//   return new Promise(resolve => {
//     resolve(
//       firebaseHelper.firestore.createNewDocument(db, IMAGECOLLECTION, json)
//     );
//   });
// }
// function getDocById(id) {
//   return new Promise(resolve => {
//     resolve(firebaseHelper.firestore.getDocument(db, IMAGECOLLECTION, id));
//   });
// }

async function addImageByUrl(imageUrl, response) {
  const labels = await CLIENT.labelDetection(imageUrl)
  const annotations = labels[0].labelAnnotations
  console.log("labels", annotations)

  const record = {
    imgUrl: imageUrl,
    timestamp: _.now(),
    apiResult: annotations
  }
  const refId = await firebaseHelper.firestore.createNewDocument(
    db,
    IMAGECOLLECTION,
    record
  )
  console.log("refId", refId.id)

  const newRec = await firebaseHelper.firestore.getDocument(
    db,
    IMAGECOLLECTION,
    refId.id
  )

  return newRec
}
