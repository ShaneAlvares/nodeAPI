import express from "express";
import bodyParser from "body-parser";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdHAHNDGjhn1uM_9ZPXlzuMfItzEIlbEQ",
  authDomain: "ipccwtwogroup.firebaseapp.com",
  projectId: "ipccwtwogroup",
  storageBucket: "ipccwtwogroup.appspot.com",
  messagingSenderId: "1032273871913",
  appId: "1:1032273871913:web:439a13b2b4eacaf6684838"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

async function getCollection(db, colName) {
  const dataCol = collection(db, colName);
  const dataSnapshot = await getDocs(dataCol);
  const DataList = dataSnapshot.docs.map((doc) => doc.data());
  return DataList;
}

async function addToCollection(db, colName, json) {
  const UUID = new Date().getTime();
  delete json.collection;
  json.UUID = UUID;
  await setDoc(doc(db, colName, UUID.toString()), json);
}

// async function deleteFromCollection(db, colName, id) {
//     await deleteDoc(doc(db, colName, id));
// }

const api = express();
api.use(bodyParser.json());
api.use(bodyParser.urlencoded());
api.use(bodyParser.urlencoded({ extended: true }));

api.get("/all", (req, res) => {
    getCollection(database, "GPSDetails")
    .then((value) => {
        let students = [];
        value.forEach(function (stundet){
            students[students.length] = stundet;
        })
        res.send(students);
    })
    .catch((err) => {
      res.send("Error reading from DB");
      console.log(err);
    });
});

api.post("/insert", (req, res) => {
  addToCollection(database, "GPSDetails", req.body)
    .then((value) => {
      res.send("Done");
    })
    .catch((err) => {
      res.send("Error writing to DB");
      console.log(err);
    });
});


// api.post("/student/delete", (req, res) => {
    
//     deleteFromCollection(database, req.body.collection, req.body.uuid);
//     res.redirect("/");
// });



const port = process.env.PORT || 8080;
api.listen(port, () => console.log(`Express server listening on port ${port}`));
