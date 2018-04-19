## Notes for README.md
##Communicating with Service Worker

4 ways to communicate with a Service Worker are exposed and tested

#### Fetch
Any fetch is intercepted by the Service Worker which responds with a standard HTTP Response

#### Call and response
* A call to TransportsProxy is passed as a message to the SW
* The SW calls the method with that name on Transports.
* The result of the method is sent back as a message or an error
* TransportsProxy returns to the caller

#### Unsolicited messages from the SW
* The SW can send a message to one client, or all of them
* An eventListener on TransportsProxy catches the message and interprets event.data = {command, ...}

#### Callbacks TODO-SW
* The call to TransportProxy includes a callback
* SW calls the function with its own callback which includes the Message port
* The SW callback relays to the Message Port
* TP will send each response message to the callback
* The effect should be the same for the caller as if calling the Transports method directly with a callback
