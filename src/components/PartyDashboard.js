import React from "react";
import * as R from "ramda";

import { useGameDispatch, useGameState } from "./useGameState";
import { CampaignWrapper } from "./Wrapper";

export default function PartyDashboard({ party }) {
	const dispatch = useGameDispatch();
	const campaignAddr = useGameState(R.path(["campaign", "addr"]));
	const partyInfo = useGameState(R.path(["parties", party]));

	console.log({ campaignAddr, partyInfo });

	return <CampaignWrapper />;
}
