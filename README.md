# concepta-api-sails

Welcome to Concepta API SailsJS Version test project

## Testing

1) Submit a POST request to `https://concepta-api-sails.herokuapp.com/v1/tickets`, considering the following properties:
   
   a) Header:
        
        * Content-Type  application/json
    
    b) Body (request payload):
        
        * Raw json example:
        
           {
                "Language": "ENG",
                "Currency": "USD",
                "Destination": "MCO",
                "DateFrom": "11/26/2019",
                "DateTO": "11/29/2019",
                "Occupancy": {
                    "AdultCount": "1",
                    "ChildCount": "1",
                    "ChildAges": ["10"]
                }
           }

2) Alternatively you can load and run the Postman collection:

    `concepta-api-sails.postman_collection.json`

## Running the server

1) You can launch the app from the Terminal:


    > cd concepta-api-sails
    
    > sails lift
   
  
## License

2019 - By Lorena Lira
