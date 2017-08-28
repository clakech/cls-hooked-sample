# NodeJS CorrelationId Tracing Sample using ExpressJS & Asyn_hooks [https://clakech.github.io/cls-hooked-sample/](https://clakech.github.io/cls-hooked-sample/)

\#NodeJS #CLS #ExpressJS #asyn_hooks #tracing #logging #correlationId #transactionId #thread-local #experimental

How-to trace a unique identifier of your current request with a simple logger to be able to follow all the different processes involve ?

## Mostly use and read [https://github.com/Jeff-Lewis/cls-hooked](https://github.com/Jeff-Lewis/cls-hooked)

## The End 😎

> OK... let's share a quick reminder!

## Tracing requirement: logging with a correlationId / transactioId to be able to debug anf follow the differents processes involve in a specific request. Using NodeJS.

In your system, you have an API that manager some inputs, process those input to deliver a value and may answer something.

To be able to maintain this code, you may have differents services and layers with different purpose and abstraction level:

* The first service is managing input to dispatch the different processes to execute.
* Another service can be processing some datas input to compute them with some other datas from your database to get any valuable result.
* Yet another service may send a notification to an external service.
* Last service is an abstraction of your database to manipulate datas more easily from other services.
* Etc. etc...

OK so what ?

What we need is to be able to debug your system when an unexpected error occurs for a specific request
So we want to filter ours logs to show only the informations dealing with this request to be able to understand in which service we may have a problem to solve.
To filter ours logs, we need that each log from a specific request have a common unique identifier. This identier must be different for each different request of course.
This a common requirement in IT projects. It is quite easy to have this kind of feature with .NET or Java but with NodeJS, the 'non thread based but event loop system' still do not have this must-have feature yet.

There are some existing solutions for ages but they are not really reassuring the community.

You could add a context parameter to all your services API signatures. This is a boring but working solution. But developer hate boring stuff. And this is not really scalable for big codebase and there is no widely spread common practices around this approach.

There is a Domain API in NodeJS since v0.10 or v0.12 but is deprecated since v4 with no explicity stable replacement. So it is hard to stand your code on top of this feature because we know this one will be removed very soon.

There are some alternatives like [continuation-local-storage](https://github.com/othiym23/node-continuation-local-storage) aka CLS based on [async-listener](https://github.com/othiym23/async-listener) but the latter was *removed* from NodeJS v0.12.
Then we have the AsyncWrap another *unofficial* and *undocumented* solution shipped within NodeJS v6 and v7.
And now we have the async_hooks experimental but accepted in the NodeJS Enhancement Proposals. 

Bref. Nothing perfect, but still we can have some fun hacking with those tools.

