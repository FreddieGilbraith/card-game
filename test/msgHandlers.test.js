import { createSystem, defineActor } from "../src";

describe("message handlers", () => {
	const rootActor = defineActor("root", {
		IMMEDIATE_RESPONSE: (msg, { dispatch, parent }) => {
			dispatch(parent, { type: "REPLY", for: msg });
		},

		DELAYED_RESPONSE: async (msg, { dispatch, parent }) => {
			await new Promise((done) => setTimeout(done, 100));

			dispatch(parent, { type: "REPLY", for: msg });
		},
	});

	it("can have its function specified in a msg-type-switch format", async () => {
		const system = createSystem({
			root: rootActor,
		});

		system.dispatch({ type: "IMMEDIATE_RESPONSE" });
		const initReply = await system.next();
		expect(initReply).toEqual({
			type: "REPLY",
			for: { type: "IMMEDIATE_RESPONSE" },
		});

		system.dispatch({ type: "DELAYED_RESPONSE" });
		const initReply = await system.next();
		expect(initReply).toEqual({
			type: "REPLY",
			for: { type: "DELAYED_RESPONSE" },
		});
	});
});
