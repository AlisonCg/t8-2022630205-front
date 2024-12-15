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

// Cambiar el URL base a la dirección de tus funciones en Azure
const cliente = new WSClient("http://localhost:7071/api");