import { nanoid } from "nanoid";

//envelope: { src, msg, snk }

export function defineActor(name, fnOrState, maybeFn) {
	const fn = maybeFn ? maybeFn : fnOrState;
	const initialState = maybeFn ? fnOrState : undefined;
	const stateful = Boolean(maybeFn);

	const nameGenerator = typeof name === "function" ? name : () => name;

	return function createActorInstance(parent, system, ...args) {
		const id = nanoid();
		const name = nameGenerator(...args);
		const postbox = [];
		const children = new Map();
		const friends = new Map();

		let state = initialState;
		let running = false;

		async function checkPostbox(x) {
			if (running || !postbox.length) {
				return;
			}

			running = true;
			const { src, msg, snk } = postbox.shift();

			const ctx = {
				parent,
				children,
				friends,
				args,
				self: id,

				getName: system.getName,
				dispatch: (snk, msg) => system.dispatch({ src: id, msg, snk }),
				forward: (snk) => system.dispatch({ src, msg, snk }),

				spawn: (name, actor, ...args) => {
					const childId = actor(id, system, ...args);
					children.set(name, childId);
					return childId;
				},

				get sender() {
					return src;
				},
			};

			try {
				if (stateful) {
					const response = await fn(state, msg, ctx);
					switch (typeof response) {
						case "function":
							state = response(state);
							break;
						case "undefined":
							break;
						default:
							state = response;
							break;
					}
				} else {
					await fn(msg, ctx);
				}
			} catch (e) {
				console.error(e);
			}

			running = false;

			if (postbox.length) {
				setTimeout(checkPostbox, 0, "f");
				checkPostbox("f");
			}
		}

		function submitEnvelope({ src, msg, snk }) {
			postbox.push({ src, msg, snk });
			checkPostbox();
		}

		system.addSelf(id, { name, submitEnvelope });

		return id;
	};
}

export function createSystem({ root }) {
	const world = new Map();
	const names = new Map();

	const externalSubscriptions = new Set();

	function subscribe(listener) {
		externalSubscriptions.add(listener);
	}

	function next() {
		return new Promise((done) => subscribe(done));
	}

	function getName(id) {
		return names.get(id);
	}

	function dispatch({ src, msg, snk }) {
		if (snk === "__EXTERNAL__") {
			for (const listener of externalSubscriptions) {
				listener(msg);
			}
			return;
		}

		world.get(snk)({
			src,
			msg,
			snk,
		});
	}

	const rootActorAddr = root("__EXTERNAL__", {
		dispatch,
		getName,
		addSelf: (id, { submitEnvelope, name }) => {
			world.set(id, submitEnvelope);
			names.set(id, name);
		},
	});

	dispatch({
		src: "__INTERNAL__",
		msg: { type: "__INIT__" },
		snk: rootActorAddr,
	});

	return {
		subscribe,
		next,
		dispatch: (msg) => {
			dispatch({
				src: "__EXTERNAL__",
				msg,
				snk: rootActorAddr,
			});
		},
	};
}
