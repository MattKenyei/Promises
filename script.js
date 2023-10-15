function http(){
    return{
        get(url, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.addEventListener("load", () =>{
                    if(Math.floor (xhr.status/100) !== 2){
                        cb(`ERROR. STATUS: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response)
                });
            
                xhr.addEventListener("error", ()=>{
                    cb(`ERROR. STATUS: ${xhr.status}`, xhr);
                });
            
                xhr.send();
            } catch (error) {
                cb(error);
            }
        },
        post(url, body, headers, cb) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", url);
                xhr.addEventListener("load", () =>{
                    if(Math.floor (xhr.status/100) !== 2){
                        cb(`ERROR. STATUS: ${xhr.status}`, xhr);
                        return;
                    }
                    const response = JSON.parse(xhr.responseText);
                    cb(null, response)
                });
            
                xhr.addEventListener("error", ()=>{
                    cb(`ERROR. STATUS: ${xhr.status}`, xhr);
                });
                if(headers){
                    Object.entries(headers).forEach(([key, value]) =>{
                        xhr.setRequestHeader(key, value);
                    })
                }
            
                xhr.send(JSON.stringify(body));
            } catch (error) {
                cb(error);
            }
        }
    }
}


const myhttp = http();

//variant 1
function getPosts(id){
    return new Promise((resolve, reject) => {
        myhttp.get(`https://jsonplaceholder.typicode.com/posts/${id}`, (err, res) =>{
        if (err)
            reject(err);
        resolve(res);
        });
    });

}
function getComments(post){
    const { id } = post;
    return new Promise((resolve, reject) => {
        myhttp.get(`https://jsonplaceholder.typicode.com/comments?postId=${id}`, (err, res) =>{
        if (err)
            reject(err);
        resolve({post, comments: res});
        });
    });
}
function getUser(comm){
    const {post: {userId},} = comm;
    return new Promise((resolve, reject) => {
        myhttp.get(`https://jsonplaceholder.typicode.com/users/${userId}`, (err, res) =>{
        if (err)
            reject(err);
        resolve({...comm, user:res});
        });
    });
}

//check
// getPosts(50).then(post => getComments(post)).then(comm => getUser(comm)).then(user => console.log(user))
//     .catch(err=> console.log(err)).finally(()=> console.log('the end'));

//promiseALL variant
function getPost(id){
    return new Promise((resolve, reject) => {
        myhttp.get(`https://jsonplaceholder.typicode.com/posts/${id}`, (err, res) =>{
        if (err)
            reject(err);
        resolve(res);
        });
    });

}
function getComment(id){
    return new Promise((resolve, reject) => {
        myhttp.get(`https://jsonplaceholder.typicode.com/comments?postId=${id}`, (err, res) =>{
        if (err)
            reject(err);
        resolve(res);
        });
    });
}
function getUser2(userId){
    return new Promise((resolve, reject) => {
        myhttp.get(`https://jsonplaceholder.typicode.com/users/${userId}`, (err, res) =>{
        if (err)
            reject(err);
        resolve(res);
        });
    });
}

Promise.all([
    getPost(1),
    getComment(1),
    getUser2(1)
]).then((fulldata) => console.log(fulldata)).catch(err => console.log(err));