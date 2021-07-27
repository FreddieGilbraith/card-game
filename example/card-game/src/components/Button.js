import React from "react";
import cn from "classnames";

function getRandom(xs) {
	return xs[Math.floor(Math.random() * xs.length)];
}

export default function Button({ color, move, as = "button", className, ...props }) {
	const Component = as;

	const [wildFocusTransform] = React.useState(
		(() => {
			return [
				getRandom(["-translate-x-1", "-translate-y-1", "translate-x-1", "translate-y-1"]),
				getRandom([
					"-rotate-2",
					"-rotate-3",
					"-rotate-6",
					"rotate-2",
					"rotate-3",
					"rotate-6",
				]),
			];
		})(),
	);

	return (
		<Component
			data-keyboard-focusable
			className={cn(
				className,
				"bold",
				"px-6",
				"py-3",
				"rounded",
				"shadow",
				"text-3xl",
				"text-white",
				"cursor-pointer",

				"transition-all",
				"transform",

				"border-2",

				"hover:shadow-2xl",
				"focus:shadow-2xl",

				{
					"focus:-translate-y-1 hover:-translate-y-1": move === "up",
					"focus:translate-y-1 hover:translate-y-1": move === "down",
					[wildFocusTransform.map((x) => `focus:${x} hover:${x}`).join(" ")]:
						move === "wild",
				},
				{
					"bg-green-700 border-green-800 focus:bg-green-600 focus:text-green-100 focus:border-green-500 hover:bg-green-600 hover:text-green-100 hover:border-green-500":
						color === "green",
					"bg-blue-700 border-blue-800 focus:bg-blue-600 focus:text-blue-100 focus:border-blue-500 hover:bg-blue-600 hover:text-blue-100 hover:border-blue-500":
						color === "blue",
					"bg-red-700 border-red-800 focus:bg-red-600 focus:text-red-100 focus:border-red-500 hover:bg-red-600 hover:text-red-100 hover:border-red-500":
						color === "red",
				},
			)}
			{...props}
		/>
	);
}
