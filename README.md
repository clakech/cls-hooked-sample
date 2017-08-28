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

## Experiment the CLS-hooked with ExpressJS

Jeff-Lewis forked the continuation-local-storage to remove async-listener and use AsyncWrap for NodeJS <v8 or async_hooks for NodeJS >v8.2 : [cls-hooked](https://github.com/Jeff-Lewis/cls-hooked)

With the same API from CLS you can add a context to your current NodeJS "thread-local" (lol) / request.

> Continuation-local storage works like thread-local storage in threaded programming, but is based on chains of Node-style callbacks instead of threads. The standard Node convention of functions calling functions is very similar to something called "continuation-passing style" in functional programming, and the name comes from the way this module allows you to set and get values that are scoped to the lifetime of these chains of function calls.

All you have to do is to create a namespace to scope your context informations and they embed your chains of function calls inside a runner.

Warning: this a an experimental "non production ready" solution !

In your main ExpressJS app, create a namespace, then in a middleware ".run()" it and add you context data

```javascript
// index.js

const express = require('express');
const cls = require('cls-hooked');
const correlationIdBinder = require('./correlationIdBinder');
const nestedService = require('./nestedService');
const logger = require('./logger');

const app = express();

const ns = cls.createNamespace('sample');
app.use(correlationIdBinder(ns));

app.get('/', (req, res) => {
    logger('Here we go !');
    nestedService()
        .then(something => res.send(something));
});

app.listen(3000, () =>
    console.log('Example app listening on port 3000!')
);
```

```javascript
// correlationIdBinder.js

const uuidV4 = require('uuid/v4');
const cls = require('cls-hooked');

module.exports = ns => {
    if (!ns) throw new Error('CLS namespace required');

    return function clsifyMiddleware(req, res, next) {
        ns.bindEmitter(req);
        ns.bindEmitter(res);

        ns.run(() => {
            const correlationId = uuidV4();
            cls.getNamespace('sample').set('correlationId', correlationId);
            next();
        });
    };
};
```

Then in each layer / module / service that needs to log some information about current process, just log as you like with you preffered logger system

```
// nestedService.js 

const logger = require('./logger');

module.exports = () => {
    logger('Inside the beast');    
    return Promise.resolve('Hello World!')
}
```

But in your logger implementation, retrieve the current context data from the namespace and add your correlationId in your logs.

```
// logger.js 

const cls = require('cls-hooked');

module.exports = message => {
    const ns = cls.getNamespace('sample');
    const correlationId = ns.get('correlationId');
    console.log(`${correlationId} => ${message}`)
};
```
