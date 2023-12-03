import Duplo, {zod} from "@duplojs/duplojs";
import duploDestructFloor from "../../scripts";
import {parentPort} from "worker_threads";

const duplo = Duplo({port: 1506, host: "0.0.0.0"});
duplo.use(duploDestructFloor);

const testAbstract = duplo.declareAbstractRoute("testAbstract")
.extract({
	query: {
		number: zod.coerce.number()
	},
})
.cut(({d: {number}}) => ({test1: number}), ["test1"])
.build(["test1"]);

const testProcess = duplo.createProcess("testProcess")
.extract({
	query: {
		number: zod.coerce.number()
	},
})
.cut(({d: {number}}) => ({test2: number}), ["test2"])
.build(["test2"]);

testAbstract({pickup: ["test1"]})
.declareRoute("GET", "/test/1")
.process(
	testProcess,
	{pickup: ["test2"]}
)
.handler(({d: {test1, test2}}, res) => {
	res.code(200).info("s").send(test1 + test2);
});

duplo.launch(() => parentPort?.postMessage("ready"));
