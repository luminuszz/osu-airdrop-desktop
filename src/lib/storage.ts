export const storageKeys = {
	deviceId: "@ousu-airdrop-deviceId",
	deviceName: "@ousu-airdrop-deviceName",
	token: "@ousu-airdrop-token",
};

export type StorageKey = keyof typeof storageKeys;

export const storage = {
	set: <T>(key: StorageKey, value: T) => {
		localStorage.setItem(storageKeys[key], JSON.stringify(value));
		dispatchStorageEventChanged(key);
	},
	get: (key: StorageKey) => {
		const value = localStorage.getItem(storageKeys[key]);

		if (value === null) return null;

		try {
			return JSON.parse(value);
		} catch {
			return null;
		}
	},

	remove: (key: StorageKey) => {
		localStorage.removeItem(storageKeys[key]);
		dispatchStorageEventChanged(key);
	},
};

export const eventName = "on_local_storage_change" as const;

export function dispatchStorageEventChanged(keyChanged?: StorageKey) {
	window.dispatchEvent(new CustomEvent(eventName, { detail: keyChanged }));
}
