# TET-Project1
Subject: Special Topics in Telematics

By: Felipe Macías Herrera 

Email: fmacias1@eafit.edu.co

1. Project description: 
    
    Application developed with Mongodb, Express, Nodejs, Javascript, Google Maps API for Javascript
    Each user is able to create and delete routes by adding geolocalization coordinates to this route. 
    Besides, each route can be shared with other registered users.
    
2. Instructions:
    
    To install Nodejs modules:
    
        npm install

    To run the application in the localhost:3000
    
        npm start

    To install mongodb follow this guide based on your operative system
    
        https://docs.mongodb.com/manual/installation/
    
3. Persistence
    
        User:
        {
            name:{
                type: String,
                required: true
            },
            email:{
                type: String,
                required: true
            },
            username:{
                type: String,
                required: true
            },
            password:{
                type: String,
                required: true
            }
        }

        Points:
        {
            latitude:{
                type: String,
                required: true
            },
            longitude:{
                type: String,
                required: true
            },
            username:{
                type: String,
                required: true
            },
            route:{
                type: String,
                required: true
            },
            date:{
                type: Date,
                default: Date.now,
                required: true
            },
        }

        Routes:
        {
            name:{
                type: String,
                required: true
            },
            username:{
                type: String,
                required: true
            },
            date:{
                type: Date,
                default: Date.now,
                required: true
            },
        }

        Shared_routes:
            route:{
                type: String,
                required: true
            },
            owner:{
                type: String,
                required: true
            },
            viewers:{
                type: [String],
                require: false
            },
            date:{
                type: Date,
                default: Date.now,
                required: true
            }

4. Web services
    

5. Deployment (DCA and IaaS Cloud of AWS) with docker
    
    DCA
        
        https://fmacias1.dis.eafit.edu.co/

    IaaS Cloud of AWS
        
        https://ec2-3-93-231-16.compute-1.amazonaws.com/
