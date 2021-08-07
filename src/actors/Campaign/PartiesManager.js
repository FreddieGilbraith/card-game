import * as R from "ramda";

import { register } from "./system";

import Party from "./Party";

register(PartiesManager);

export default function PartiesManager({ children, log, msg, self, state, dispatch, spawn }) {
	switch (msg.type) {
		case "Mount": {
			return R.over(R.lensProp("parties"), R.defaultTo([]));
		}

		case "RequestRender": {
			(children.parties ?? []).map((addr) => dispatch(addr, msg));
			dispatch(self, { type: "RenderPartiesList" });
			break;
		}

		case "RenderPartiesList": {
			dispatch("Engine:render", { path: ["campaign", "parties"], value: state.parties });
			break;
		}

		case "CreateNewParty": {
			dispatch(self, { type: "RenderPartiesList" });
			return R.over(R.lensProp("parties"), R.pipe(R.defaultTo([]), R.append(spawn(Party))));
		}

		default: {
			if (msg.type !== "Start" && msg.type !== "Mount") {
				log(msg);
				break;
			}
		}
	}
}
