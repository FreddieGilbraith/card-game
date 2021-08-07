import * as R from "ramda";

import { register } from "./system";

register(KnownCampaigns);

export default function KnownCampaigns({ log, msg, dispatch, state }) {
	switch (msg.type) {
		case "Mount": {
			return R.over(R.lensProp("knownCampaigns"), R.defaultTo([]));
		}

		case "RequestKnownCampaigns": {
			log(state);
			dispatch(msg.src, {
				type: "RespondKnownCampaigns",
				knownCampaigns: state.knownCampaigns,
			});
			break;
		}

		case "AddKnownCampaign": {
			return R.over(
				R.lensProp("knownCampaigns"),
				R.append({
					id: msg.newCampaignId,
				}),
			);
		}

		default: {
			if (msg.type !== "Start" && msg.type !== "Mount") {
				log(msg);
				break;
			}
		}
	}
}
