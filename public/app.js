//Asynchoronous vs Synchoronous

const email = 'support@gmail.com'

getAllPosts()

function getAllPosts() {
    const postsElem = document.getElementById('posts')

    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(res => res.json())
        .then(res => {
            for (let i = 0; i < res.length; i++) {
                const h2 = document.createElement('h2')
                h2.innerHTML = res[i].title

                const p = document.createElement('p')
                p.innerHTML = res[i].body

                const div = document.createElement('div')
                div.className = 'item'
                div.id = `post-${res[i].id}`

                const button = document.createElement('button')
                button.innerHTML = 'Comments'
                button.setAttribute('onclick', `getComments(${res[i].id})`)

                div.appendChild(h2)
                div.appendChild(p)
                div.appendChild(button)
                postsElem.appendChild(div)
            }
        })
}


function getComments(id) {
    const elem = document.getElementById(`post-${id}`)

    fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
        .then(res => res.json())
        .then(res => {
            const commentsElem = document.createElement('div')
            commentsElem.className = 'comments'

            for (let i = 0; i < res.length; i++) {
                const h2 = document.createElement('h3')
                h2.innerHTML = res[i].email

                const p = document.createElement('p')
                p.innerHTML = res[i].body

                commentsElem.appendChild(h2)
                commentsElem.appendChild(p)
            }

            elem.appendChild(commentsElem)
        })
}