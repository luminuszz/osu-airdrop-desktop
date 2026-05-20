import axios from "axios";

export const osuBackend = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

osuBackend.interceptors.request.use(
	(config) => {
		config.headers["Authorization"] = `Bearer ${localStorage.getItem(
			"@ousu-airdrop-token",
		)}`;

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);
