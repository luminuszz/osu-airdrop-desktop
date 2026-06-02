export const storageKeys = {
	deviceId: "@ousu-airdrop-deviceId",
	deviceName: "@ousu-airdrop-deviceName",
	token: "@ousu-airdrop-token",
	files: "@ousu-aidrop-files",
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

export type FileItem = {
	id: string;
	originalName: string;
	storagePath: string;
};

export class SyncFileStorage {
	private mapToList(map: Map<string, FileItem>): FileItem[] {
		return [...map.values()];
	}

	private getStorageFiles(): Map<string, FileItem> {
		const results = storage.get("files");

		const fileList = (results ? JSON.parse(results) : []) as FileItem[];

		return new Map(fileList.map((item) => [item.id, item]));
	}

	saveFile(file: FileItem) {
		const fileList = this.getStorageFiles();

		fileList.set(file.id, file);

		storage.set("files", JSON.stringify(this.mapToList(fileList)));
	}

	getFileList() {
		const results = storage.get("files");

		const fileList = (results ? JSON.parse(results) : []) as FileItem[];

		return fileList;
	}

	getFile(id: string) {
		const fileList = this.getStorageFiles();

		return fileList.get(id);
	}

	removeFile(id: string) {
		const fileList = this.getStorageFiles();

		fileList.delete(id);

		storage.set("files", JSON.stringify(this.mapToList(fileList)));
	}
}

export const fileStorage = new SyncFileStorage();
