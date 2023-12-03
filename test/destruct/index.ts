import {zod} from "@duplojs/duplojs";
import {workerTesting} from "@duplojs/worker-testing";

export default workerTesting(
	__dirname + "/route.ts",
	[
		{
			title: "destruct floor",
			url: "http://localhost:1506/test/1",
			method: "GET",
			query: {number: 33},
			response: {
				code: 200,
				info: "s",
				body: zod.literal("66"),
			}
		},
	]
);
