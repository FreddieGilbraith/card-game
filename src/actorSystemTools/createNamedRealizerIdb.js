export default async function createNamedRealizerIdb(name) {
	const openDbRequest = indexedDB.open(name, 1);

	const db = await new Promise((done) => {
		openDbRequest.onsuccess = () => {
			done(openDbRequest.result);
		};

		openDbRequest.onupgradeneeded = ({ target: { result: db } }) => {
			const objectStore = db.createObjectStore("actorBundles", { keyPath: "self" });
			objectStore.createIndex("name", "name");
			objectStore.createIndex("nickname", "nickname");
			objectStore.createIndex("parent", "parent");
			objectStore.createIndex("self", "self");
		};
	});

	return db;
}

