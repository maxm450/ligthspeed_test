class ServiceCall {
    constructor(method) {
        this.method = method || 'GET'; //default method
        this.timeout = 60000;
        this.server = "/api/contacts";
        this.URI = '';
        this.request = {};

        this._prepareRequest();
    }


    _prepareRequest() {
        this.request = {
            method: this.method,
            headers: new Headers({
                'Content-Type': 'multipart/form-data'
            })
        }
    }

    _ojectToJson(o) {
        return JSON.stringify(o);
    }

    _addBodyToRequest(d) {
        this.request.body = this._ojectToJson(d);
    }

    makeCall(payload) {
        const parseJson = (response) => {
            if (response) {
                return response.json();
            } 

            return {};
        };
        
        if(payload) {
            this._addBodyToRequest(payload);
        }

        return fetch(this.server.concat(this.URI), this.request)
        .then(parseJson) //parse json response into object
        .then( function (data) {
           return data; //give back data to promise
        })
        .catch(
            function(error) {
                return Promise.reject(error);
            }
        );
    }

}

export default ServiceCall;