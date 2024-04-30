export class Requests {
    static host = "http://localhost:3000/api"
    static headers = {
        'Content-type': 'application/json',
        'Accept': 'application/json',
    }

    static async login(body) {
        const response = await fetch(this.host + '/login', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body)
        })

        return await response.json();
    }

    static async register(body) {
        const response = await fetch(this.host + '/signup', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body)
        })

        return await response.json();
    }

    static async logout(body) {
        const response = await fetch(this.host + '/logout', {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify(body)
        })

        return await response.json();
    }
}