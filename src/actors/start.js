import "babel-core/register";
import "babel-polyfill";

import createDynamicSystemTransportSet from "../actorSystemTools/createDynamicSystemTransport";
import createNamedRealizerIdb from "../actorSystemTools/createNamedRealizerIdb";

import createEngineActorSystem from "./Engine/system";
import createConfigActorSystem from "./Config/system";

import EngineRoot from "./Engine/Root";
import ConfigRoot from "./Config/Root";

async function bootConfigSystem(db, system) {
	try {
		const rootBundle = await new Promise((done, fail) => {
			const transaction = db.transaction(["actorBundles"], "readwrite");
			transaction.onerror = fail;

			const request = transaction.objectStore("actorBundles").index("name").get("Root");

			request.onsuccess = () => {
				done(request.result);
			};
			request.onerror = fail;
		});

		system.mount(rootBundle.self);

		return rootBundle.self;
	} catch (e) {
		return system.spawn.root(ConfigRoot);
	}
}

async function main() {
	const createDynamicSystemTransport = createDynamicSystemTransportSet();
	const configDb = await createNamedRealizerIdb("config");

	const engineActorSystem = createEngineActorSystem(createDynamicSystemTransport);
	const configActorSystem = createConfigActorSystem(createDynamicSystemTransport, configDb);

	const configAddr = await bootConfigSystem(configDb, configActorSystem);

	engineActorSystem.spawn.root(EngineRoot, `Config:${configAddr}`, createDynamicSystemTransport);
}
main();
