class WSClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async postJson(endpoint, data) {
        const response = await fetch(`${this.baseURL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-functions-key": "Fj4ZfUfvxmfYsNeBy6y4kHWUgoQPdWqy9CONgEf004-gAzFuXSI8Mg=="
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }
}

const cliente = new WSClient("https://t8-12345678-a.azurewebsites.net/api");
