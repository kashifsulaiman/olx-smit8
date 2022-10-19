import {
    signInFirebase, signUpFirebase,
    postAdToDb, uploadImage, getAdsFromDb,
    getRealtimeAds
} from '../config/firebase.js'

//this will get all the ads
getAds()

window.signUp = async function () {
    //1. values get karunga
    const allInputs = document.getElementsByTagName('input')

    const email = allInputs[0].value
    const password = allInputs[1].value
    const fullname = allInputs[2].value
    const age = allInputs[3].value

    //2. firebase ka signin function call karunga
    try {
        await signUpFirebase({ email, password, fullname, age })
        alert('Registered Successfully')
    } catch (e) {
        const errorElem = document.getElementById('error')
        errorElem.innerHTML = e.message
    }

    //3. success alert
    //4. navigate to dashboard 
}


window.signIn = async function () {
    //1. values get karunga
    const email = document.getElementsByTagName('input')[0].value
    const password = document.getElementsByTagName('input')[1].value

    //2. firebase ka signin function call karunga
    try {
        await signInFirebase(email, password)
        alert('Successfully signed in')
    } catch (e) {
        const errorElem = document.getElementById('error')
        errorElem.innerHTML = e.message
    }

    //3. success alert
    //4. navigate to dashboard 
}

window.postAd = async function () {
    const title = document.getElementById('title').value
    const price = document.getElementById('price').value
    debugger
    const image = document.getElementById('image').files[0]

    try {
        const imageUrl = await uploadImage(image)
        await postAdToDb(title, price, imageUrl)
        alert('Ad posted successfully')
    } catch (e) {
        console.log('e', e.message)
    }
}

function getAds() {
    //1
    getRealtimeAds((ads) => {
        //4
        const adsElem = document.getElementById('ads')

        adsElem.innerHTML = ''
        for (let item of ads) {
            adsElem.innerHTML += `<div onclick="goToDetail('${item.id}')" style='border: 1px solid gray; margin: 5px; display: inline-block; width: 120px;'>
            <img src=${item.imageUrl} width='120'/>
            <h2>${item.title}</h2>
            <h3>${item.price}</h3>
        </div>`
        }
    })











    // const ads = await getAdsFromDb()
    // const adsElem = document.getElementById('ads')

    // /*for(var i = 0; i < item.length; i++) {
    //     item[i]
    // }*/
    // for (let item of ads) {
    //     adsElem.innerHTML += `<div onclick="goToDetail('${item.id}')" style='border: 1px solid gray; margin: 5px; display: inline-block; width: 120px;'>
    //         <img src=${item.imageUrl} width='120'/>
    //         <h2>${item.title}</h2>
    //         <h3>${item.price}</h3>
    //     </div>`
    // }
}

window.goToDetail = async function (id) {
    location.href = `detail.html?id=${id}`
}
