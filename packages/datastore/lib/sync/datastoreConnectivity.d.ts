import Observable from 'zen-observable-ts';
import { PollOfflineType } from '../types';
declare type ConnectionStatus = {
	online: boolean;
};
export default class DataStoreConnectivity {
	private connectionStatus;
	private observer;
	private subscription;
	private timeout;
	private interval;
	constructor();
	status(pollOffline: PollOfflineType): Observable<ConnectionStatus>;
	unsubscribe(): void;
	socketDisconnected(): void;
	networkDisconnected(): Promise<void>;
}
export {};
