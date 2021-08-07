import React from "react";
import { Switch, useHistory, Route } from "react-router-dom";

import { useGameDispatch, useGameState } from "./useGameState";

import SelectCampaign from "./SelectCampaign";
import CampaignDashboard from "./CampaignDashboard";
import CampaignPartyConfig from "./CampaignPartyConfig";
import Playground from "./Playground";

function Loading() {
	const history = useHistory();
	const engineStatus = useGameState((s) => s.engine.status);

	React.useEffect(() => {
		if (engineStatus === "Running") {
			history.push("/select-campaign");
		}
	}, [history, engineStatus]);

	return <div>Loading...</div>;
}

function Noop() {
	return null;
}

function CampaignResumer() {
	const engineAddr = useGameState((s) => s.engine.addr);
	const dispatch = useGameDispatch();

	React.useEffect(() => {
		if (engineAddr) {
			dispatch(engineAddr, { type: "ResumeCurrentCampaign" });
		}
	}, [dispatch, engineAddr]);

	return null;
}

export default function Routes() {
	return (
		<React.Fragment>
			<Switch>
				<Route
					path="/campaign/:campaign/config/party/:partyAddr?"
					component={CampaignPartyConfig}
				/>

				<Route path="/campaign/:campaign/skirmish" component={Noop} />
				<Route path="/campaign-dashboard" component={CampaignDashboard} />
				<Route path="/select-campaign" component={SelectCampaign} />
				<Route path="/playground" component={Playground} />

				<Route component={Loading} />
			</Switch>

			<CampaignResumer />
		</React.Fragment>
	);
}
