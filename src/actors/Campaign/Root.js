import * as R from "ramda";

import { register } from "./system";

import PartiesManager from "./PartiesManager";

register(Root);

export default function Root({ acquire, self, dispatch, msg, state, log, children }) {
	switch (msg.type) {
		case "Start": {
			break;
		}

		case "Mount": {
			acquire.partiesManager(PartiesManager);
			dispatch(self, { type: "UpdateTimestamp" });
			break;
		}

		case "RequestRender": {
			dispatch(children.partiesManager, msg);
			dispatch(self, { type: "UpdateRender" });
			break;
		}

		case "Ping": {
			dispatch(msg.src, { type: "Pong" });
			break;
		}

		case "UpdateTimestamp": {
			dispatch(self, { type: "UpdateRender" });
			return R.assoc("timestamp", new Date().toISOString());
		}

		case "UpdateRender": {
			dispatch("Engine:render", { path: ["campaign", "timestamp"], value: state.timestamp });
			break;
		}

		case "CreateNewParty": {
			dispatch(children.partiesManager, msg);
			break;
		}

		default: {
			if (msg.type !== "Start" && msg.type !== "Mount") log(msg);
			break;
		}
	}
}
