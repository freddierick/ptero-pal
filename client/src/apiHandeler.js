
const baseUrl = "https://fre.rest";




async function requestPOST(data,url, token = true){
    return await  requestSend("POST",data,url, token)
};


async function requestGET(url, token = true){
    return await requestSend("GET",null,url, token)
};

async function checkAuth(url, token = true){
    let Authorization = localStorage.getItem('Authorization');
    if (!Authorization) return false;
    let response = await requestGET("/checkAuth")
    if (response == true) return true;
    return false;
    
};


async function requestSend(type,data,url, token = true){
    return await new Promise( async (res,rej) => {
        const requestOptions = {
            method: type,
            headers: { 'Content-Type': 'application/json' },
        };
        if (data) requestOptions.body =  JSON.stringify(data);
        if (token) requestOptions.headers.Authorization = localStorage.getItem('Authorization');
        await fetch(baseUrl+url,requestOptions ) 
        .then(res => res.json())
        .then((result) => {
            console.log(result)
            res(result);
        }).catch( (error) => (
            rej(error)
        ))
    });
};

export {
    requestSend,
    requestGET,
    requestPOST,
    checkAuth
};