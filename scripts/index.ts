import {AbstractRoute, DuploConfig, DuploInstance, Floor, ProcessExport, Route} from "@duplojs/duplojs";
import {duploExtends, duploInjector} from "@duplojs/editor-tools";
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
	if(instance.config.rebuildProcess !== false)instance.config.rebuildProcess = true;
	if(instance.config.rebuildAbstractRoutes !== false)instance.config.rebuildAbstractRoutes = true;
	

	const makeDestructFloor = (): Floor<{}> => {
		const d = {};

		return {
			pickup: (index) => d[index],
			d,
			drop: (index, value) => {d[index] = value;}
		};
	};
    
	const replaceMakeFloor = (rebuild?: boolean) => 
		(duplose: Route | ProcessExport | AbstractRoute) => {
		
			duploExtends(
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
				rebuild
			);
		};

	instance.addHook("onDeclareRoute", replaceMakeFloor(instance.config.rebuildRoutes));
	instance.addHook("onDeclareAbstractRoute", replaceMakeFloor(instance.config.rebuildAbstractRoutes));
	instance.addHook("onCreateProcess", replaceMakeFloor(instance.config.rebuildProcess));
}
