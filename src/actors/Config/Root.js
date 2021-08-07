import { register } from "./system";

import KnownCampaigns from "./KnownCampaigns";

register(Root);

export default function Root({ acquire, children, spawn, log, msg, dispatch }) {
	switch (msg.type) {
		case "Mount": {
			acquire.knownCampaigns(KnownCampaigns);
			break;
		}

		case "IntroEngine": {
			dispatch(msg.src, { type: "ConfirmStartup" });
			break;
		}

		case "AddKnownCampaign":
		case "RequestCurrentCampaign":
		case "RequestKnownCampaigns":
		case "SetCurrentCampaign": {
			dispatch(children.knownCampaigns, msg);
			break;
		}

		default: {
			if (msg.type !== "Start" && msg.type !== "Mount") log(msg);
			break;
		}
	}
}
