# NodeJS CorrelationId Tracing Sample using ExpressJS & Asyn_hooks [https://clakech.github.io/cls-hooked-sample/](https://clakech.github.io/cls-hooked-sample/)

\#NodeJS #CLS #ExpressJS #asyn_hooks #tracing #logging #correlationId #transactionId #thread-local

How-to trace a unique identifier of your current request with a simple logger to be able to follow all the different processes involve ?

## Mostly use and read [https://github.com/Jeff-Lewis/cls-hooked](https://github.com/Jeff-Lewis/cls-hooked)

## The End 😎

> OK... let's share a quick reminder!

## Tracing requirement: logging with a correlationId / transactioId to be able to debug anf follow the differents processes involve in a specific request. Using NodeJS.

In your system, you have an API that manager some inputs, process those input to deliver a value and may answer something.

To be able to maintain this code, you may have differents services and layers with different purpose and abstraction level.

The first service is managing input to dispatch the different process to execute.

Another service can be 
