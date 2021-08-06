import { register } from "./system";

register(Party);

export default function Party({ log, msg, dispatch, self }) {
	switch (msg.type) {
		case "RequestRender": {
			dispatch("Engine:render", {
				path: ["campaign", "party", self],
				value: { name: "New Party" },
			});
			break;
		}

		default: {
			if (msg.type !== "Start" && msg.type !== "Mount") {
				log(msg);
				break;
			}
		}
	}
}
