import * as R from "ramda";

import { register } from "./system";

register(KnownCampaigns);

export default function KnownCampaigns({ log, msg, dispatch, state }) {
	switch (msg.type) {
		case "Mount": {
			return R.over(R.lensProp("knownCampaigns"), R.defaultTo([]));
		}

		case "AddKnownCampaign": {
			return R.over(
				R.lensProp("knownCampaigns"),
				R.append({
					id: msg.newCampaignId,
				}),
			);
		}

		case "RequestCurrentCampaign": {
			dispatch(msg.src, {
				type: "RespondCurrentCampaign",
				currentCampaign: state.currentCampaign,
			});
			break;
		}

		case "RequestKnownCampaigns": {
			dispatch(msg.src, {
				type: "RespondKnownCampaigns",
				knownCampaigns: state.knownCampaigns,
			});
			break;
		}

		case "SetCurrentCampaign": {
			return R.assoc("currentCampaign", msg.id);
		}

		default: {
			if (msg.type !== "Start" && msg.type !== "Mount") {
				log(msg);
				break;
			}
		}
	}
}
