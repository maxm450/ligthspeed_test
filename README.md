Base webpack structure was take from https://github.com/crsandeep/simple-react-full-stack

and ui archirecture used ant-design
https://ant.design/

This app use React as client app,  Express as server and MongoDB as data base.

To run the app, `npm run dev` is enough. It will run both api and app servers.

The JSON structure needs to look like this: 
```
{
    "name": "test6",
    "jobTitle": "test",
    "address": "sdfdsf",
    "phoneNumbers": [
        {
            number: "555-555-5555",
            prefix: ""
        }
    ],
    "email": "retrretrrte"
}
```

where:
- `name` is a String
- `jobTitle` is a string
- `address` is a string
- `phoneNumbers` is an Array of Phone, where Phone contains 2 elements. Number and siffix where both are Strings
- `email` is a String
