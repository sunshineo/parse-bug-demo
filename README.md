# Demostrate a parse-server bug

https://github.com/parse-community/parse-server/issues/7192

`main.js` create 2 classes with a Date field and added beforeSave to one of them

Steps to reproduct the bug

```
npm i
npm start

# Valid iso works in both classes
curl --location --request POST 'http://localhost:1337/parse/classes/MyClass1' \
--header 'x-parse-application-id: myAppId' \
--header 'x-parse-master-key: masterKey' \
--header 'Content-Type: application/json' \
--data-raw '{"field":{"__type":"Date", "iso":"2021-02-19T01:18:45.062Z"}}'

curl --location --request POST 'http://localhost:1337/parse/classes/MyClass2' \
--header 'x-parse-application-id: myAppId' \
--header 'x-parse-master-key: masterKey' \
--header 'Content-Type: application/json' \
--data-raw '{"field":{"__type":"Date", "iso":"2021-02-19T01:18:45.062Z"}}'


# Empty iso not working in MyClass1 with proper error
curl --location --request POST 'http://localhost:1337/parse/classes/MyClass1' \
--header 'x-parse-application-id: myAppId' \
--header 'x-parse-master-key: masterKey' \
--header 'Content-Type: application/json' \
--data-raw '{"field":{"__type":"Date", "iso": ""}}'

# Empty iso will stuck forever for MyClass2
curl --location --request POST 'http://localhost:1337/parse/classes/MyClass2' \
--header 'x-parse-application-id: myAppId' \
--header 'x-parse-master-key: masterKey' \
--header 'Content-Type: application/json' \
--data-raw '{"field":{"__type":"Date", "iso": ""}}'

```

Error message
```
here at before save for MyClass2
(node:52786) UnhandledPromiseRejectionWarning: Error: Tried to encode an invalid date.
    at encode (/Users/gordon/workspace/forks/bugs/parse-bug-demo/node_modules/parse-server/node_modules/parse/lib/node/encode.js:85:13)
    at _default (/Users/gordon/workspace/forks/bugs/parse-bug-demo/node_modules/parse-server/node_modules/parse/lib/node/encode.js:132:10)
    at SetOp.toJSON (/Users/gordon/workspace/forks/bugs/parse-bug-demo/node_modules/parse-server/node_modules/parse/lib/node/ParseOp.js:155:32)
    at ParseObject._getSaveJSON (/Users/gordon/workspace/forks/bugs/parse-bug-demo/node_modules/parse-server/node_modules/parse/lib/node/ParseObject.js:485:61)
    at success (/Users/gordon/workspace/forks/bugs/parse-bug-demo/node_modules/parse-server/lib/triggers.js:385:45)
    at processTicksAndRejections (internal/process/task_queues.js:93:5)
(node:52786) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 4)
```