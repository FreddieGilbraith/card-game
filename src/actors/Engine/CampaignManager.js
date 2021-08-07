import * as R from "ramda";
import { makeAddress } from "@little-bonsai/ingrates";

import { register } from "./system";
import createCampaignActorSystem from "../Campaign/system";
import bootCampaignActorSystem from "../Campaign/boot";
import createNamedRealizerIdb from "../../actorSystemTools/createNamedRealizerIdb";

register(CampaignManager);

export default async function CampaignManager(
	{ state, self, parent, msg, log, dispatch, query },
	createDynamicSystemTransport,
) {
	switch (msg.type) {
		case "Mount": {
			dispatch(parent, { type: "RequestConfigAddr" });
			break;
		}

		case "IntroEngine": {
			dispatch(parent, { type: "ConfirmStartup" });
			break;
		}

		case "RespondConfigAddr": {
			return R.assoc("configAddr", msg.configAddr);
		}

		case "ResumeCurrentCampaign": {
			const { currentCampaign } = await query(state.configAddr, {
				type: "RequestCurrentCampaign",
			});
			dispatch(self, { type: "MountCampaign", campaign: currentCampaign });
		}

		case "RenderCampaignsList": {
			const { knownCampaigns } = await query(state.configAddr, {
				type: "RequestKnownCampaigns",
			});

			dispatch("render", {
				path: ["engine", "campaigns"],
				value: knownCampaigns.map(R.prop("id")),
			});

			break;
		}

		case "CreateNewCampaign": {
			const newCampaignId = makeAddress();
			await createNamedRealizerIdb(`Campaign:${newCampaignId}`);

			dispatch(state.configAddr, { type: "AddKnownCampaign", newCampaignId });
			dispatch(self, { type: "RenderCampaignsList" });

			break;
		}

		case "MountCampaign": {
			if (state && state.campaignSystems && state.campaignSystems[msg.campaign]) {
				break;
			}

			const campaignDb = await createNamedRealizerIdb(`Campaign:${msg.campaign}`);
			const campaignActorSystem = await createCampaignActorSystem(
				campaignDb,
				msg.campaign,
				createDynamicSystemTransport,
			);

			const campaignRootAddr = await bootCampaignActorSystem(campaignDb, campaignActorSystem);

			dispatch(state.configAddr, { type: "SetCurrentCampaign", id: msg.campaign });
			dispatch("render", { path: ["campaign"], value: { addr: campaignRootAddr } });

			return R.pipe(
				R.assocPath(["campaignRootAddrs", msg.campaign], campaignRootAddr),
				R.assocPath(["campaignSystems", msg.campaign], campaignActorSystem),
			);
		}

		default: {
			if (msg.type !== "Start" && msg.type !== "Mount") log(msg);
			break;
		}
	}
}
