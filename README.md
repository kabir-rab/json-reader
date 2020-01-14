# json-reader
A simple REST API built on node.js to allow users to read json (including nested json) files from a location (local/network) and serve them via API which then can be consumed in Qlik Sense or QlikView via the Qlik's native **REST connector**.

_IMPORTANT! This was developed as a PoC, use it at your own risk if you are using this on production._


# Why
Wanted to demonstrate how to build and deploy a REST API to add more functionalities in Qlik Sense for loading data without having to run additional services. Idea is to use a simple and very light-weight node.js application that can be used by the **REST connector**.


# Contents
1. [Prerequisites](#prerequisites)
2. [Setting up the node.js application](#Setting-up-the-node-js-application)
3. [Configuring Qlik Sense Service Dispatcher](#Configuring-Qlik-Sense-Service-Dispatcher)
4. [Using the API](#Using-the-API)
    1. [GET parameter details](#GET-parameter-details)
    2. [Response](#Response)
    3. [Response codes](#Response-codes)
    

# Setup
## Prerequisites
_Please make sure you have backup of the environment/server which you wish to test this on._


## Setting up the node.js application
Download and unzip this repo to the following location of your Qlik Sense server where you wish to run the API from. 

_Location of the Qlik Sense installation folder may vary as this is depending on where Qlik Sense has been installed._ 
```
%programfiles%\Qlik\Sense\ServiceDispatcher\Node
```


## Configuring Qlik Sense Service Dispatcher
You will setup the Qlik Sense Service Dispatcher to make sure that this API is running as a service alongside with all the other Qlik Services. This will also make sure the service restarts during a server reboot or Qlik services reboot. To achieve this, you will need to make changes to the "services.conf" file (you can use any editors such as **notepad**) at the following location - 
_Please make sure you backup the original file before making any changes to this. You will require admin privileges to make changes to this file_
```
%programfiles%\Qlik\Sense\ServiceDispatcher
```

This file should contain something similar to below - 
```
[globals]
LogPath="${ALLUSERSPROFILE}\Qlik\Sense\Log"
MigrationPort=4545
DataPrepPort=4949
BrokerPort=4900
HubPort=9029
CapabilityPort=9031
AboutPort=9032
ConverterPort=3003
OdagPort=9098
WESPort=9080
DepgraphPort=9079
DownloadPrepPort=9090
HybridSetupConsolePort=5929
QrsPort=4242
PrecedentPort=4950
PrecedentEnginePort=4747
AdvanaPort=50057
MobilityRegistrarPort=9082
NotifierPort=9081

[migration-service]
Identity=Qlik.migration-service
DisplayName=App Migration
ExePath=Node\node.exe
Script=..\MigrationService\index.js

...... and lots more
```

Add the following to the very bottom of this file and save it.
_Please make sure you amend the **script** path below to reflect the folder name you have given during extracting the GitHub repository few steps above._
```
[jsonreader]
Identity=Qlik.jsonreader
Enabled=true
DisplayName=jsonreader
ExecType=nodejs
ExePath=Node\node.exe
Script=Node\json-reader\index.js
```

Now restart the "Qlik Sense Service Dispatcher" service by going to Windows Services. This should now start your API.


## Using the API 
You can use any REST client to test the API including Qlik's own REST connector in Qlik Sense/QlikView.

By default - The API will be running in http and not https. It will be running on localhost and listening to port 3000. Default address/url should be as below - 
```
http://localhost:3000/
```

You can try accessing the API root from a browser with-in the server. You should retrieve the following response -
```json
{"info":"This is a simple REST API built on node.js to allow users to read json files from a location and serve them via API."}
```

To read a json file using this API - make sure you place the json file on the server or in a network drive where the Qlik Service account have access to. Then use the following endpoint as per the example below - 

```
http://localhost:3000/json?path=D:\jsonfile.json
```
or curl example - 
```curl
curl --location --request GET 'http://localhost:3000/json?path=D:\jsonfile.json'
```


### GET parameter details
The API call shown above can be broken by - 
 
 | Key | Description |
 | --- | --- |
 | Host | http://localhost |
 | Port | 3000 |
 | Endpoint | /json |
 | Request Parameter | path=[path to your json file which is accessible by the account running qlik services] |


### Response
If you have a valid json file at the path provided in the query parameter, then this should return status of 200 with the json from the file. Example (provided this was the content of the file you are reading) -
```json
{
    "id": "0001",
    "type": "donut",
    "name": "Cake",
    "ppu": 0.55,
    "batters": {
        "batter": [
            {
                "id": "1001",
                "type": "Regular"
            },
            {
                "id": "1002",
                "type": "Chocolate"
            },
            {
                "id": "1003",
                "type": "Blueberry"
            },
            {
                "id": "1004",
                "type": "Devil's Food"
            }
        ],
    },
    "topping": [
        {
            "id": "5001",
            "type": "None"
        },
        {
            "id": "5002",
            "type": "Glazed"
        },
        {
            "id": "5005",
            "type": "Sugar"
        },
        {
            "id": "5007",
            "type": "Powdered Sugar"
        },
        {
            "id": "5006",
            "type": "Chocolate with Sprinkles"
        },
        {
            "id": "5003",
            "type": "Chocolate"
        },
        {
            "id": "5004",
            "type": "Maple"
        }
    ],
}
```


### Response codes
Below table shows the response codes for this APi and what they mean.

| Code | Description |
| --- | --- |
| 200 | **OK** - All worked |
| 400 | **Bad Request** - This is usually result of missing the "path" parameter. Either the Parameter key is invalid or no key/value been provided |
| 500 | **Internal Server Error** - This can be result of a invalid/inaccessible file location - _example - trying to read a json file from an internet location_ |
