import {AbstractRoute, DuploConfig, DuploInstance, Floor, MergeAbstractRoute, Process, Route} from "@duplojs/duplojs";
import {duploExtends, duploInject} from "@duplojs/editor-tools";
import packageJson from "../package.json";

declare module "@duplojs/duplojs" {
	interface Plugins {
		"@duplojs/destruct-floor": {version: string},
	}

    interface Floor<floor extends {}>{
        readonly d: {readonly [prop in keyof floor]: floor[prop]}
    }
}

export default function duploDestructFloor(instance: DuploInstance<DuploConfig>){
	instance.plugins["@duplojs/destruct-floor"] = {version: packageJson.version};

	const makeDestructFloor = (): Floor<{}> => {
		const d = {};

		return {
			pickup: (index) => d[index],
			d,
			drop: (index, value) => {d[index] = value;}
		};
	};
    
	const replaceMakeFloor = (duplose: Route | Process | AbstractRoute | MergeAbstractRoute) => {
		if(duplose instanceof MergeAbstractRoute) return; 

		duploExtends(
			duplose, 
			{makeDestructFloor}
		);
			
		duploInject(
			duplose, 
			({}, d) => {
				d.stringDuploseFunction = d.stringDuploseFunction.replace(
					"this.makeFloor", 
					"this.extensions.makeDestructFloor"
				);
			}
		);
	};

	instance.addHook("onDeclareRoute", replaceMakeFloor);
	instance.addHook("onDeclareAbstractRoute", replaceMakeFloor);
	instance.addHook("onCreateProcess", replaceMakeFloor);
}
