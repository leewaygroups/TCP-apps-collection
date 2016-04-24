# TCP Client App

TCP client software that operates from the command line. (Supports only JSON as a single line commands).

### SETUP STEPS
1. Ensure you have nodejs installed on your machine. If note visit https://nodejs.org/en/ and follow the directions for installations.
2. Download and unzip this application to a directory.
3. CD to application root directory (same directory as package.json file).
4. run ```npm install``` 
5. run ```npm install -g ```
6. run ```  npm link ```
7. type ``` client ``` and ENTER at the console to run this client app.

#### NOTE:
1. Remote server (PORT: `undisclosed`, HOST: `undisclosed`) is expected to reject non valid JSON messages with an error reply to client.
   To avoid this time wasting roundtrip, this client application checks for invalid JSON input and rejects them earlier.

2. (a) On initiation of this client app, it auto connects to server.
   (b) This client will send any valid JSON to server.
   (c) User must login to worker process running on server in order to execute worker specific instructions:
    ```js
    i)   { "request" : "count" }
    ii)  { "request" : "time" }
    iii) { "request" : "count", "id" : "abc" }
    ```
    (d) This client application will reject worker specific instructions with "not loggedIn message" if they are sent when user is not loggedIn to worker process on serve.
    (e)  Any response from server to this client is printed out as nicely as possible in table formart at console.

### Requirement document
1. You will be connecting to a server running on PORT: `undisclosed`, HOST: `undisclosed` (The IP/PORT used during dev is hereby removed. However, a testServer mimicing the true server's features is currently a WIP and can be found in app dir. ). 
2. All messages to be send over the connection will be JSON as a single line. This is a "line
delimited" protocol. Do not send linebreaks in your JSON, but explain how you will
support them if you are requested to send them. You can be sent more than one
message at a time by the server process.
3. Most messages will have a type attribute to describe what they are for.
4. Your program will need to "log in" by specifying your "name" You will identify your
connection by sending a JSON object with a key / value pair of "name" / NAME.
Example: { "name" : "foo" }
5. Your program will receive heartbeat messages. You should make sure you are receiving
them, and if you do not receive a heartbeat for more than 2 seconds, you should
reconnect and re-login (this will happen randomly)
6. Any messages sent that are not valid JSON will result in an error that is sent back to you.
7. Any valid message you send will not be acknowledged, also you will not get an echo for
what you sent to the server.
8. There are two commands that you can send once you are logged in to a "worker"
process that is also connected to the server.
Those commands are:
count : How many requests have been made since the startup of the
worker process.
Example: { "request" : "count" }
The response will be a well formatted JSON object.
time : The current date/time and a random number
Example: { "request" : "time" }
The response will be a well formatted JSON object.
Also, you can specify an "id" on which the worker will use in the reply, this is an
optional parameter.
Example: { "request" : "count", "id" : "abc" }
9. It is possible for any message you receive to not be a well formatted JSON message.


### Acceptance Criteria
Your program should demonstrate the following as well as demonstrate good coding practices.
1. Connect and log into the system.
2. Handle heartbeats appropriately and depict the reconnection logic if you do not receive a
heartbeat.
3. Handle input from STDIN so your user can manually send JSON data to the server
process.
4. Receive responses for only requests your client sends.
5. Verify and validate input to be sent, and also handle errors sent by the server.
6. If the random number sent back from the result of the "time" call is greater than 30, it
should print out a message saying so.
7. Provide a way to send both the "count" and "time" calls to the worker process and show the results in a nicely formatted way.