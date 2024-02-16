# duplojs-destruct-floor
[![NPM version](https://img.shields.io/npm/v/@duplojs/destruct-floor)](https://www.npmjs.com/package/@duplojs/destruct-floor)

## Instalation
```
npm i @duplojs/destruct-floor
```

## Utilisation
```ts
import Duplo, {zod} from "@duplojs/duplojs";
import duploDestructFloor from "@duplojs/destruct-floor";

const duplo = Duplo({port: 1506, host: "localhost", environment: "DEV"});
duplo.use(duploDestructFloor);

duplo.declareRoute("GET", "/")
.extract({
    query: {
        number: zod.coerce.number()
    },
})
.handler(({d: {number}}, response) => {
    response.code(200).send(number);
});
```