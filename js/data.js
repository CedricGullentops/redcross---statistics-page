// Getting data from back-end
const userAction = async () => {
    const response = await fetch('https://redcrossbackend.azurewebsites.net/Analytics/assistance.json', {
        method: 'POST',
        body: myBody, // string or object
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const myJson = await response.json(); //extract JSON from the http response
    // do something with myJson

}