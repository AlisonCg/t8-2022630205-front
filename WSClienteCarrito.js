class WSClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async postJson(endpoint, data) {
        const response = await fetch(`${this.baseURL}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return response.json();
    }
}

const cliente = new WSClient("https://t8-2022630205-a.azurewebsites.net/api");
