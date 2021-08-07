import React from "react";
import * as R from "ramda";
import { Link } from "react-router-dom";

import Button from "./Button";
import PartyDashboard from "./PartyDashboard";
import { CampaignWrapper } from "./Wrapper";
import { useGameDispatch, useGameState } from "./useGameState";

function PartyListItem({ partyAddr, onClick }) {
	const dispatch = useGameDispatch();
	const partyInfo = useGameState((s) => s.campaign.party?.[partyAddr]);

	React.useEffect(() => {
		dispatch(partyAddr, { type: "RequestRender" });
	}, [dispatch, partyAddr]);

	return (
		<div className="p-2">
			<Button color="white" move="wild" onClick={onClick}>
				<h3 className="text-lg border-b-2 border-black">{partyInfo?.name}</h3>
			</Button>
		</div>
	);
}

function PartyList({ setFocusedParty }) {
	const dispatch = useGameDispatch();
	const campaignAddr = useGameState(R.path(["campaign", "addr"]));
	const parties = useGameState(R.pathOr([], ["campaign", "parties"]));

	return (
		<CampaignWrapper>
			<h2 className="text-xl">Parties</h2>

			<ol className="p-2">
				{parties.map((partyAddr) => (
					<li key={partyAddr}>
						<PartyListItem
							partyAddr={partyAddr}
							onClick={setFocusedParty.bind(null, partyAddr)}
						/>
					</li>
				))}
			</ol>

			<Button
				color="green"
				move="down"
				onClick={dispatch.bind(null, campaignAddr, { type: "CreateNewParty" })}
				onKeyDown={console.bind}
			>
				Create New Party
			</Button>

			<div className="py-2" />

			<Button color="red" move="down" as={Link} to={`/campaign/${campaignAddr}`}>
				Back
			</Button>
		</CampaignWrapper>
	);
}

export default function CampaignPartyConfig() {
	const dispatch = useGameDispatch();
	const campaignAddr = useGameState(R.path(["campaign", "addr"]));
	const [focusedParty, setFocusedParty] = React.useState(null);

	React.useEffect(() => {
		dispatch(campaignAddr, { type: "RequestRender" });
	}, [dispatch, campaignAddr]);

	if (focusedParty) {
		return <PartyDashboard party={focusedParty} />;
	} else {
		return <PartyList setFocusedParty={setFocusedParty} />;
	}
}
