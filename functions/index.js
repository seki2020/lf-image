const admin = require('firebase-admin');
// const serviceAccount = require('C:\\firebase-keys\\logical-fabric-firebase-adminsdk-r2757-02edf22e43.json')
const functions = require('firebase-functions');

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const cors = require('cors')({origin: true});
const _ = require('lodash')

// const cors = require('cors')({
//     origin: true
// });

// Creates a client
const client = new vision.ImageAnnotatorClient();
admin.initializeApp()
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

let db = admin.firestore();

exports.getAllRecord = functions.https.onRequest((request, response) => {
        return cors(request, response, () => {
            db.collection('images').get()
                .then((snapshot) => {
                    let resList = [];
                    snapshot.forEach((doc) => {
                        const data = doc.data()
                        resList.push(data);
                    });

                    response.send({data: _.sortBy(resList, ['timestamp'])})
                })
                .catch((err) => {
                    console.log('Error getting documents', err);
                })
        })
    }
)

exports.detectLabel = functions.https.onRequest((request, response) => {

    return cors(request, response, () => {

        try {
            const imageUrl = _.trim(request.query.imgUrl);
            if (!imageUrl) response.send({data: false});
            callVisionApi(imageUrl).then((labelDetail) => {
                //todo... check api status
                if (!labelDetail[0].labelAnnotations) response.send({data: false});

                console.log('labelDetail', labelDetail);
                const record = {
                    imgUrl: imageUrl,
                    timestamp: _.now(),
                    apiResult: labelDetail[0].labelAnnotations
                }
                console.log('record', record)
                saveResult(record).then((ref) => {

                    console.log('saveResult', ref)
                    record.id = ref.id
                    db.collection('images').doc(ref.id).get().then(doc => {
                        response.send({data: doc.data()})
                    })
                });


            })
        } catch (error) {
            console.log(error);
        }
    })

    // })


})


async function callVisionApi(imgUrl) {


    // Performs label detection on the image file
    return await client.labelDetection(imgUrl);
}

async function saveResult(json) {
    return await db.collection('images').add(json);
}

