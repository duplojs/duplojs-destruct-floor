import {AbstractRoute, DuploConfig, DuploInstance, Floor, ProcessExport, Route} from "@duplojs/duplojs";
import {duploExtend, duploInjector} from "@duplojs/editor-tools";
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
	
	if(instance.config.rebuildRoutes !== false)instance.config.rebuildRoutes = true;

	const makeDestructFloor = (): Floor<{}> => {
		const d = {};

		return {
			pickup: (index) => d[index],
			d,
			drop: (index, value) => {d[index] = value;}
		};
	};
    
	const replaceMakeFloor = (duplose: Route | ProcessExport | AbstractRoute) => {
		
		duploExtend(
			duplose, 
			{makeDestructFloor}
		);

		duploInjector(
			duplose, 
			(d) => {
				d.stringFunction = d.stringFunction.replace(
					"this.makeFloor", 
					"this.extends.makeDestructFloor"
				);
			},
			// instance.config.rebuildRoutes || undefined
		);
	};

	instance.addHook("onDeclareRoute", replaceMakeFloor);
	instance.addHook("onDeclareAbstractRoute", replaceMakeFloor);
	instance.addHook("onCreateProcess", replaceMakeFloor);
}
