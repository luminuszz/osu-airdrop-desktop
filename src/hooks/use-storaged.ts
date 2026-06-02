import { useCallback, useSyncExternalStore } from "react";
import { eventName, type StorageKey, storage } from "../lib/storage";

export function useStorageValue<T>(key: StorageKey, defaultValue?: T) {
	const ac = new AbortController();

	const snapshotValue = useSyncExternalStore(
		(storageChanged) => {
			window.addEventListener(
				eventName,
				(e) => {
					const { detail } = e as CustomEvent<string>;

					console.log({ detail });

					if (detail === key) {
						storageChanged();
					}
				},
				{
					signal: ac.signal,
				},
			);

			return () => {
				ac.abort();
			};
		},
		() => storage.get(key) ?? defaultValue,
	);

	const setStorageValue = useCallback(
		(value: T) => {
			storage.set(key, value);
		},
		[key],
	);

	return [snapshotValue, setStorageValue] as [T, typeof setStorageValue];
}
