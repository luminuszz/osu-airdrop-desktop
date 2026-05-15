import axios from "axios";

export const osuBackend = axios.create({
	baseURL: import.meta.env.API_URL,
});

osuBackend.interceptors.request.use(
	(config) => {
		config.headers["Authorization"] = localStorage.getItem(
			"@ousu-airdrop-token",
		);

		return config;
	},
	(error) => {
		console.log(error);
		return Promise.reject(error);
	},
);
