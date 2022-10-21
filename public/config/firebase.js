import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js'
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, where, getDocs, onSnapshot, query } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js'
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js"

const firebaseConfig = {
    apiKey: "AIzaSyBsB7EgfO6SDcQQdy1y9vihnjOXsd1LRNY",
    authDomain: "olx-smit8.firebaseapp.com",
    projectId: "olx-smit8",
    storageBucket: "olx-smit8.appspot.com",
    messagingSenderId: "201892631281",
    appId: "1:201892631281:web:17ad67ef72cf33ec0b8f50"
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

function signInFirebase(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
    // .then((userCredential) => {
    //     // Signed in 
    //     const user = userCredential.user;
    //     // ...
    //     alert('Successfully Logged In')

    // })
    // .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;

    //     console.log('Error: ', errorMessage)
    // });
}

async function signUpFirebase(userInfo) {
    const { email, password } = userInfo

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await addUserToDb(userInfo, userCredential.user.uid)
}

function addUserToDb(userInfo, uid) {
    const { email, fullname, age } = userInfo

    return setDoc(doc(db, "users", uid), { email, fullname, age })
    // return addDoc(collection(db, "users"), { email, fullname, age })
}

function postAdToDb(title, price, imageUrl) {
    const userId = auth.currentUser.uid
    return addDoc(collection(db, "ads"), { title, price, imageUrl, userId })
}

async function uploadImage(image) {
    const storageRef = ref(storage, `images/${image.name}`)
    const snapshot = await uploadBytes(storageRef, image)
    const url = await getDownloadURL(snapshot.ref)
    return url
}

async function getAdsFromDb() {
    const querySnapshot = await getDocs(collection(db, "ads"))
    const ads = []
    querySnapshot.forEach((doc) => {
        ads.push({ id: doc.id, ...doc.data() })
    });
    return ads
}

function getRealtimeAds(callback) {
    //2
    onSnapshot(collection(db, "ads"), (querySnapshot) => {
        const ads = []

        querySnapshot.forEach((doc) => {
            ads.push({ id: doc.id, ...doc.data() })
        });
        //3
        callback(ads)
    })
}

function getFirebaseAd(id) {
    const docRef = doc(db, "ads", id)
    return getDoc(docRef)
}

async function checkChatroom(adUserId) {
    const userId = auth.currentUser.uid
    const q = query(collection(db, "chatrooms"),
        where(`users.${userId}`, "==", true),
        where(`users.${adUserId}`, "==", true))

    const querySnapshot = await getDocs(q)

    let room
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        room = { _id: doc.id, ...doc.data() }
    })
    return room
}

function createChatroom(adUserId) {
    const userId = auth.currentUser.uid
    const obj =  {
        users: { 
            [userId]: true, 
            [adUserId]: true 
        },
        createdAt: Date.now()
    } 
    return addDoc(collection(db, "chatrooms"), obj)
}

export {
    signInFirebase,
    signUpFirebase,
    postAdToDb,
    uploadImage,
    getAdsFromDb,
    getRealtimeAds,
    getFirebaseAd,
    checkChatroom,
    createChatroom
}

/*
 1. Install nodejs from website
 2. Verify using node -v and npm -v in CMD
 3. npm install -g firebase-tools
 4. Open cmd inside project's folder
 5. firebase login
 6. firebase init
 7. move all the relevant HTML, CSS, JS & Media files
 into public folder
 8. firebase deploy
*/