var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
				  });
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
var __generator =
	(this && this.__generator) ||
	function (thisArg, body) {
		var _ = {
				label: 0,
				sent: function () {
					if (t[0] & 1) throw t[1];
					return t[1];
				},
				trys: [],
				ops: [],
			},
			f,
			y,
			t,
			g;
		return (
			(g = { next: verb(0), throw: verb(1), return: verb(2) }),
			typeof Symbol === 'function' &&
				(g[Symbol.iterator] = function () {
					return this;
				}),
			g
		);
		function verb(n) {
			return function (v) {
				return step([n, v]);
			};
		}
		function step(op) {
			if (f) throw new TypeError('Generator is already executing.');
			while (_)
				try {
					if (
						((f = 1),
						y &&
							(t =
								op[0] & 2
									? y['return']
									: op[0]
									? y['throw'] || ((t = y['return']) && t.call(y), 0)
									: y.next) &&
							!(t = t.call(y, op[1])).done)
					)
						return t;
					if (((y = 0), t)) op = [op[0] & 2, t.value];
					switch (op[0]) {
						case 0:
						case 1:
							t = op;
							break;
						case 4:
							_.label++;
							return { value: op[1], done: false };
						case 5:
							_.label++;
							y = op[1];
							op = [0];
							continue;
						case 7:
							op = _.ops.pop();
							_.trys.pop();
							continue;
						default:
							if (
								!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
								(op[0] === 6 || op[0] === 2)
							) {
								_ = 0;
								continue;
							}
							if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
								_.label = op[1];
								break;
							}
							if (op[0] === 6 && _.label < t[1]) {
								_.label = t[1];
								t = op;
								break;
							}
							if (t && _.label < t[2]) {
								_.label = t[2];
								_.ops.push(op);
								break;
							}
							if (t[2]) _.ops.pop();
							_.trys.pop();
							continue;
					}
					op = body.call(thisArg, _);
				} catch (e) {
					op = [6, e];
					y = 0;
				} finally {
					f = t = 0;
				}
			if (op[0] & 5) throw op[1];
			return { value: op[0] ? op[1] : void 0, done: true };
		}
	};
var __read =
	(this && this.__read) ||
	function (o, n) {
		var m = typeof Symbol === 'function' && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o),
			r,
			ar = [],
			e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
				ar.push(r.value);
		} catch (error) {
			e = { error: error };
		} finally {
			try {
				if (r && !r.done && (m = i['return'])) m.call(i);
			} finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
var __values =
	(this && this.__values) ||
	function (o) {
		var s = typeof Symbol === 'function' && Symbol.iterator,
			m = s && o[s],
			i = 0;
		if (m) return m.call(o);
		if (o && typeof o.length === 'number')
			return {
				next: function () {
					if (o && i >= o.length) o = void 0;
					return { value: o && o[i++], done: !o };
				},
			};
		throw new TypeError(
			s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
		);
	};
var __spread =
	(this && this.__spread) ||
	function () {
		for (var ar = [], i = 0; i < arguments.length; i++)
			ar = ar.concat(__read(arguments[i]));
		return ar;
	};
import { browserOrNode, ConsoleLogger as Logger } from '@aws-amplify/core';
import { CONTROL_MSG as PUBSUB_CONTROL_MSG } from '@aws-amplify/pubsub';
import Observable from 'zen-observable-ts';
import { ModelPredicateCreator } from '../predicates';
import { OpType } from '../types';
import { exhaustiveCheck, getNow, SYNC, USER } from '../util';
import DataStoreConnectivity from './datastoreConnectivity';
import { ModelMerger } from './merger';
import { MutationEventOutbox } from './outbox';
import { MutationProcessor } from './processors/mutation';
import { CONTROL_MSG, SubscriptionProcessor } from './processors/subscription';
import { SyncProcessor } from './processors/sync';
import {
	createMutationInstanceFromModelOperation,
	predicateToGraphQLCondition,
} from './utils';
var isNode = browserOrNode().isNode;
var logger = new Logger('DataStore');
var ownSymbol = Symbol('sync');
export var ControlMessage;
(function (ControlMessage) {
	ControlMessage['SYNC_ENGINE_STORAGE_SUBSCRIBED'] = 'storageSubscribed';
	ControlMessage['SYNC_ENGINE_SUBSCRIPTIONS_ESTABLISHED'] =
		'subscriptionsEstablished';
	ControlMessage['SYNC_ENGINE_SYNC_QUERIES_STARTED'] = 'syncQueriesStarted';
	ControlMessage['SYNC_ENGINE_SYNC_QUERIES_READY'] = 'syncQueriesReady';
	ControlMessage['SYNC_ENGINE_MODEL_SYNCED'] = 'modelSynced';
	ControlMessage['SYNC_ENGINE_OUTBOX_MUTATION_ENQUEUED'] =
		'outboxMutationEnqueued';
	ControlMessage['SYNC_ENGINE_OUTBOX_MUTATION_PROCESSED'] =
		'outboxMutationProcessed';
	ControlMessage['SYNC_ENGINE_OUTBOX_STATUS'] = 'outboxStatus';
	ControlMessage['SYNC_ENGINE_NETWORK_STATUS'] = 'networkStatus';
	ControlMessage['SYNC_ENGINE_READY'] = 'ready';
})(ControlMessage || (ControlMessage = {}));
var SyncEngine = /** @class */ (function () {
	function SyncEngine(
		schema,
		namespaceResolver,
		modelClasses,
		userModelClasses,
		storage,
		modelInstanceCreator,
		conflictHandler,
		errorHandler,
		syncPredicates,
		amplifyConfig,
		authModeStrategy
	) {
		if (amplifyConfig === void 0) {
			amplifyConfig = {};
		}
		this.schema = schema;
		this.namespaceResolver = namespaceResolver;
		this.modelClasses = modelClasses;
		this.userModelClasses = userModelClasses;
		this.storage = storage;
		this.modelInstanceCreator = modelInstanceCreator;
		this.syncPredicates = syncPredicates;
		this.amplifyConfig = amplifyConfig;
		this.authModeStrategy = authModeStrategy;
		this.online = false;
		this.modelSyncedStatus = new WeakMap();
		var MutationEvent = this.modelClasses['MutationEvent'];
		this.outbox = new MutationEventOutbox(
			this.schema,
			MutationEvent,
			modelInstanceCreator,
			ownSymbol
		);
		this.modelMerger = new ModelMerger(this.outbox, ownSymbol);
		this.syncQueriesProcessor = new SyncProcessor(
			this.schema,
			this.syncPredicates,
			this.amplifyConfig,
			this.authModeStrategy
		);
		this.subscriptionsProcessor = new SubscriptionProcessor(
			this.schema,
			this.syncPredicates,
			this.amplifyConfig,
			this.authModeStrategy
		);
		this.mutationsProcessor = new MutationProcessor(
			this.schema,
			this.storage,
			this.userModelClasses,
			this.outbox,
			this.modelInstanceCreator,
			MutationEvent,
			this.amplifyConfig,
			this.authModeStrategy,
			conflictHandler,
			errorHandler
		);
		this.datastoreConnectivity = new DataStoreConnectivity();
	}
	SyncEngine.prototype.getModelSyncedStatus = function (modelConstructor) {
		return this.modelSyncedStatus.get(modelConstructor);
	};
	SyncEngine.prototype.start = function (params) {
		var _this = this;
		var pollOffline = params.pollOffline;
		return new Observable(function (observer) {
			logger.log('starting sync engine...');
			var subscriptions = [];
			(function () {
				return __awaiter(_this, void 0, void 0, function () {
					var err_1, startPromise, hasMutationsInOutbox;
					var _this = this;
					return __generator(this, function (_a) {
						switch (_a.label) {
							case 0:
								_a.trys.push([0, 2, , 3]);
								return [4 /*yield*/, this.setupModels(params)];
							case 1:
								_a.sent();
								return [3 /*break*/, 3];
							case 2:
								err_1 = _a.sent();
								observer.error(err_1);
								return [2 /*return*/];
							case 3:
								startPromise = new Promise(function (resolve) {
									_this.datastoreConnectivity
										.status(pollOffline)
										.subscribe(function (_a) {
											var online = _a.online;
											return __awaiter(_this, void 0, void 0, function () {
												var ctlSubsObservable_1,
													dataSubsObservable,
													err_2,
													error_1;
												var _b;
												var _this = this;
												return __generator(this, function (_c) {
													switch (_c.label) {
														case 0:
															if (!(online && !this.online))
																return [3 /*break*/, 10];
															this.online = online;
															observer.next({
																type: ControlMessage.SYNC_ENGINE_NETWORK_STATUS,
																data: {
																	active: this.online,
																},
															});
															dataSubsObservable = void 0;
															if (!isNode) return [3 /*break*/, 1];
															logger.warn(
																'Realtime disabled when in a server-side environment'
															);
															return [3 /*break*/, 6];
														case 1:
															//#region GraphQL Subscriptions
															(_b = __read(
																this.subscriptionsProcessor.start(),
																2
															)),
																// const ctlObservable: Observable<CONTROL_MSG>
																(ctlSubsObservable_1 = _b[0]),
																// const dataObservable: Observable<[TransformerMutationType, SchemaModel, Readonly<{
																// id: string;
																// } & Record<string, any>>]>
																(dataSubsObservable = _b[1]);
															_c.label = 2;
														case 2:
															_c.trys.push([2, 4, , 5]);
															return [
																4 /*yield*/,
																new Promise(function (resolve, reject) {
																	var ctlSubsSubscription =
																		ctlSubsObservable_1.subscribe({
																			next: function (msg) {
																				if (msg === CONTROL_MSG.CONNECTED) {
																					resolve();
																				}
																			},
																			error: function (err) {
																				reject(err);
																				var handleDisconnect =
																					_this.disconnectionHandler();
																				handleDisconnect(err);
																			},
																		});
																	subscriptions.push(ctlSubsSubscription);
																}),
															];
														case 3:
															_c.sent();
															return [3 /*break*/, 5];
														case 4:
															err_2 = _c.sent();
															observer.error(err_2);
															return [2 /*return*/];
														case 5:
															logger.log('Realtime ready');
															observer.next({
																type: ControlMessage.SYNC_ENGINE_SUBSCRIPTIONS_ESTABLISHED,
															});
															_c.label = 6;
														case 6:
															_c.trys.push([6, 8, , 9]);
															return [
																4 /*yield*/,
																new Promise(function (resolve, reject) {
																	var syncQuerySubscription = _this
																		.syncQueriesObservable()
																		.subscribe({
																			next: function (message) {
																				var type = message.type;
																				if (
																					type ===
																					ControlMessage.SYNC_ENGINE_SYNC_QUERIES_READY
																				) {
																					resolve();
																				}
																				observer.next(message);
																			},
																			complete: function () {
																				resolve();
																			},
																			error: function (error) {
																				reject(error);
																			},
																		});
																	if (syncQuerySubscription) {
																		subscriptions.push(syncQuerySubscription);
																	}
																}),
															];
														case 7:
															_c.sent();
															return [3 /*break*/, 9];
														case 8:
															error_1 = _c.sent();
															observer.error(error_1);
															return [2 /*return*/];
														case 9:
															//#endregion
															//#region process mutations
															subscriptions.push(
																this.mutationsProcessor.start().subscribe({
																	next: function (_a) {
																		var modelDefinition = _a.modelDefinition,
																			item = _a.model,
																			hasMore = _a.hasMore,
																			dequeued = _a.dequeued;
																		var modelConstructor =
																			_this.userModelClasses[
																				modelDefinition.name
																			];
																		var model = _this.modelInstanceCreator(
																			modelConstructor,
																			item
																		);
																		_this.storage.runExclusive(function (
																			storage
																		) {
																			return _this.modelMerger.merge(
																				storage,
																				model
																			);
																		});
																		observer.next({
																			type: ControlMessage.SYNC_ENGINE_OUTBOX_MUTATION_PROCESSED,
																			data: {
																				model: modelConstructor,
																				element: model,
																				isDeadLetter: dequeued,
																			},
																		});
																		observer.next({
																			type: ControlMessage.SYNC_ENGINE_OUTBOX_STATUS,
																			data: {
																				isEmpty: !hasMore,
																			},
																		});
																	},
																	error: function (err) {
																		if (err.message === 'Offline') {
																			_this.datastoreConnectivity.networkDisconnected();
																			logger.debug(
																				'Attempted network request but network is unavaliable.'
																			);
																		}
																	},
																})
															);
															//#endregion
															//#region Merge subscriptions buffer
															// TODO: extract to function
															if (!isNode) {
																subscriptions.push(
																	dataSubsObservable.subscribe(function (_a) {
																		var _b = __read(_a, 3),
																			_transformerMutationType = _b[0],
																			modelDefinition = _b[1],
																			item = _b[2];
																		var modelConstructor =
																			_this.userModelClasses[
																				modelDefinition.name
																			];
																		var model = _this.modelInstanceCreator(
																			modelConstructor,
																			item
																		);
																		_this.storage.runExclusive(function (
																			storage
																		) {
																			return _this.modelMerger.merge(
																				storage,
																				model
																			);
																		});
																	})
																);
															}
															return [3 /*break*/, 11];
														case 10:
															if (!online) {
																this.online = online;
																observer.next({
																	type: ControlMessage.SYNC_ENGINE_NETWORK_STATUS,
																	data: {
																		active: this.online,
																	},
																});
																subscriptions.forEach(function (sub) {
																	return sub.unsubscribe();
																});
																subscriptions = [];
															}
															_c.label = 11;
														case 11:
															resolve();
															return [2 /*return*/];
													}
												});
											});
										});
								});
								this.storage
									.observe(null, null, ownSymbol)
									.filter(function (_a) {
										var model = _a.model;
										var modelDefinition = _this.getModelDefinition(model);
										return modelDefinition.syncable === true;
									})
									.subscribe({
										next: function (_a) {
											var opType = _a.opType,
												model = _a.model,
												element = _a.element,
												condition = _a.condition;
											return __awaiter(_this, void 0, void 0, function () {
												var namespace,
													MutationEventConstructor,
													graphQLCondition,
													mutationEvent;
												return __generator(this, function (_b) {
													switch (_b.label) {
														case 0:
															namespace =
																this.schema.namespaces[
																	this.namespaceResolver(model)
																];
															MutationEventConstructor =
																this.modelClasses['MutationEvent'];
															graphQLCondition =
																predicateToGraphQLCondition(condition);
															mutationEvent =
																createMutationInstanceFromModelOperation(
																	namespace.relationships,
																	this.getModelDefinition(model),
																	opType,
																	model,
																	element,
																	graphQLCondition,
																	MutationEventConstructor,
																	this.modelInstanceCreator
																);
															return [
																4 /*yield*/,
																this.outbox.enqueue(
																	this.storage,
																	mutationEvent
																),
															];
														case 1:
															_b.sent();
															observer.next({
																type: ControlMessage.SYNC_ENGINE_OUTBOX_MUTATION_ENQUEUED,
																data: {
																	model: model,
																	element: element,
																},
															});
															observer.next({
																type: ControlMessage.SYNC_ENGINE_OUTBOX_STATUS,
																data: {
																	isEmpty: false,
																},
															});
															return [4 /*yield*/, startPromise];
														case 2:
															_b.sent();
															if (this.online) {
																this.mutationsProcessor.resume();
															}
															return [2 /*return*/];
													}
												});
											});
										},
									});
								observer.next({
									type: ControlMessage.SYNC_ENGINE_STORAGE_SUBSCRIBED,
								});
								return [4 /*yield*/, this.outbox.peek(this.storage)];
							case 4:
								hasMutationsInOutbox = _a.sent() === undefined;
								observer.next({
									type: ControlMessage.SYNC_ENGINE_OUTBOX_STATUS,
									data: {
										isEmpty: hasMutationsInOutbox,
									},
								});
								return [4 /*yield*/, startPromise];
							case 5:
								_a.sent();
								observer.next({
									type: ControlMessage.SYNC_ENGINE_READY,
								});
								return [2 /*return*/];
						}
					});
				});
			})();
			return function () {
				subscriptions.forEach(function (sub) {
					return sub.unsubscribe();
				});
			};
		});
	};
	SyncEngine.prototype.getModelsMetadataWithNextFullSync = function (
		currentTimeStamp
	) {
		return __awaiter(this, void 0, void 0, function () {
			var modelLastSync, _a;
			var _this = this;
			return __generator(this, function (_b) {
				switch (_b.label) {
					case 0:
						_a = Map.bind;
						return [4 /*yield*/, this.getModelsMetadata()];
					case 1:
						modelLastSync = new (_a.apply(Map, [
							void 0,
							_b.sent().map(function (_a) {
								var namespace = _a.namespace,
									model = _a.model,
									lastSync = _a.lastSync,
									lastFullSync = _a.lastFullSync,
									fullSyncInterval = _a.fullSyncInterval,
									lastSyncPredicate = _a.lastSyncPredicate;
								var nextFullSync = lastFullSync + fullSyncInterval;
								var syncFrom =
									!lastFullSync || nextFullSync < currentTimeStamp
										? 0 // perform full sync if expired
										: lastSync; // perform delta sync
								return [
									_this.schema.namespaces[namespace].models[model],
									[namespace, syncFrom],
								];
							}),
						]))();
						return [2 /*return*/, modelLastSync];
				}
			});
		});
	};
	SyncEngine.prototype.syncQueriesObservable = function () {
		var _this = this;
		if (!this.online) {
			return Observable.of();
		}
		return new Observable(function (observer) {
			var syncQueriesSubscription;
			var waitTimeoutId;
			(function () {
				return __awaiter(_this, void 0, void 0, function () {
					var _loop_1, this_1;
					var _this = this;
					return __generator(this, function (_a) {
						switch (_a.label) {
							case 0:
								_loop_1 = function () {
									var count,
										modelLastSync,
										paginatingModels,
										newestFullSyncStartedAt,
										theInterval,
										start,
										duration,
										newestStartedAt,
										msNextFullSync;
									return __generator(this, function (_a) {
										switch (_a.label) {
											case 0:
												count = new WeakMap();
												return [
													4 /*yield*/,
													this_1.getModelsMetadataWithNextFullSync(Date.now()),
												];
											case 1:
												modelLastSync = _a.sent();
												paginatingModels = new Set(modelLastSync.keys());
												return [
													4 /*yield*/,
													new Promise(function (resolve) {
														syncQueriesSubscription = _this.syncQueriesProcessor
															.start(modelLastSync)
															.subscribe({
																next: function (_a) {
																	var namespace = _a.namespace,
																		modelDefinition = _a.modelDefinition,
																		items = _a.items,
																		done = _a.done,
																		startedAt = _a.startedAt,
																		isFullSync = _a.isFullSync;
																	return __awaiter(
																		_this,
																		void 0,
																		void 0,
																		function () {
																			var modelConstructor,
																				modelName,
																				modelMetadata_1,
																				lastFullSync,
																				fullSyncInterval,
																				counts;
																			var _this = this;
																			return __generator(this, function (_b) {
																				switch (_b.label) {
																					case 0:
																						modelConstructor =
																							this.userModelClasses[
																								modelDefinition.name
																							];
																						if (!count.has(modelConstructor)) {
																							count.set(modelConstructor, {
																								new: 0,
																								updated: 0,
																								deleted: 0,
																							});
																							start = getNow();
																							newestStartedAt =
																								newestStartedAt === undefined
																									? startedAt
																									: Math.max(
																											newestStartedAt,
																											startedAt
																									  );
																						}
																						/**
																						 * If there are mutations in the outbox for a given id, those need to be
																						 * merged individually. Otherwise, we can merge them in batches.
																						 */
																						return [
																							4 /*yield*/,
																							this.storage.runExclusive(
																								function (storage) {
																									return __awaiter(
																										_this,
																										void 0,
																										void 0,
																										function () {
																											var idsInOutbox,
																												oneByOne,
																												page,
																												opTypeCount,
																												oneByOne_1,
																												oneByOne_1_1,
																												item,
																												opType,
																												e_1_1,
																												_a,
																												_b,
																												_c,
																												counts;
																											var e_1, _d;
																											return __generator(
																												this,
																												function (_e) {
																													switch (_e.label) {
																														case 0:
																															return [
																																4 /*yield*/,
																																this.outbox.getModelIds(
																																	storage
																																),
																															];
																														case 1:
																															idsInOutbox =
																																_e.sent();
																															oneByOne = [];
																															page =
																																items.filter(
																																	function (
																																		item
																																	) {
																																		if (
																																			!idsInOutbox.has(
																																				item.id
																																			)
																																		) {
																																			return true;
																																		}
																																		oneByOne.push(
																																			item
																																		);
																																		return false;
																																	}
																																);
																															opTypeCount = [];
																															_e.label = 2;
																														case 2:
																															_e.trys.push([
																																2, 7, 8, 9,
																															]);
																															(oneByOne_1 =
																																__values(
																																	oneByOne
																																)),
																																(oneByOne_1_1 =
																																	oneByOne_1.next());
																															_e.label = 3;
																														case 3:
																															if (
																																!!oneByOne_1_1.done
																															)
																																return [
																																	3 /*break*/,
																																	6,
																																];
																															item =
																																oneByOne_1_1.value;
																															return [
																																4 /*yield*/,
																																this.modelMerger.merge(
																																	storage,
																																	item
																																),
																															];
																														case 4:
																															opType =
																																_e.sent();
																															if (
																																opType !==
																																undefined
																															) {
																																opTypeCount.push(
																																	[item, opType]
																																);
																															}
																															_e.label = 5;
																														case 5:
																															oneByOne_1_1 =
																																oneByOne_1.next();
																															return [
																																3 /*break*/, 3,
																															];
																														case 6:
																															return [
																																3 /*break*/, 9,
																															];
																														case 7:
																															e_1_1 = _e.sent();
																															e_1 = {
																																error: e_1_1,
																															};
																															return [
																																3 /*break*/, 9,
																															];
																														case 8:
																															try {
																																if (
																																	oneByOne_1_1 &&
																																	!oneByOne_1_1.done &&
																																	(_d =
																																		oneByOne_1.return)
																																)
																																	_d.call(
																																		oneByOne_1
																																	);
																															} finally {
																																if (e_1)
																																	throw e_1.error;
																															}
																															return [
																																7 /*endfinally*/,
																															];
																														case 9:
																															_b = (_a =
																																opTypeCount.push)
																																.apply;
																															_c = [
																																opTypeCount,
																															];
																															return [
																																4 /*yield*/,
																																this.modelMerger.mergePage(
																																	storage,
																																	modelConstructor,
																																	page
																																),
																															];
																														case 10:
																															_b.apply(
																																_a,
																																_c.concat([
																																	__spread.apply(
																																		void 0,
																																		[_e.sent()]
																																	),
																																])
																															);
																															counts =
																																count.get(
																																	modelConstructor
																																);
																															opTypeCount.forEach(
																																function (_a) {
																																	var _b =
																																			__read(
																																				_a,
																																				2
																																			),
																																		opType =
																																			_b[1];
																																	switch (
																																		opType
																																	) {
																																		case OpType.INSERT:
																																			counts.new++;
																																			break;
																																		case OpType.UPDATE:
																																			counts.updated++;
																																			break;
																																		case OpType.DELETE:
																																			counts.deleted++;
																																			break;
																																		default:
																																			exhaustiveCheck(
																																				opType
																																			);
																																	}
																																}
																															);
																															return [
																																2 /*return*/,
																															];
																													}
																												}
																											);
																										}
																									);
																								}
																							),
																						];
																					case 1:
																						/**
																						 * If there are mutations in the outbox for a given id, those need to be
																						 * merged individually. Otherwise, we can merge them in batches.
																						 */
																						_b.sent();
																						if (!done) return [3 /*break*/, 4];
																						modelName = modelDefinition.name;
																						return [
																							4 /*yield*/,
																							this.getModelMetadata(
																								namespace,
																								modelName
																							),
																						];
																					case 2:
																						modelMetadata_1 = _b.sent();
																						(lastFullSync =
																							modelMetadata_1.lastFullSync),
																							(fullSyncInterval =
																								modelMetadata_1.fullSyncInterval);
																						theInterval = fullSyncInterval;
																						newestFullSyncStartedAt =
																							newestFullSyncStartedAt ===
																							undefined
																								? lastFullSync
																								: Math.max(
																										newestFullSyncStartedAt,
																										isFullSync
																											? startedAt
																											: lastFullSync
																								  );
																						modelMetadata_1 =
																							this.modelClasses.ModelMetadata.copyOf(
																								modelMetadata_1,
																								function (draft) {
																									draft.lastSync = startedAt;
																									draft.lastFullSync =
																										isFullSync
																											? startedAt
																											: modelMetadata_1.lastFullSync;
																								}
																							);
																						return [
																							4 /*yield*/,
																							this.storage.save(
																								modelMetadata_1,
																								undefined,
																								ownSymbol
																							),
																						];
																					case 3:
																						_b.sent();
																						counts =
																							count.get(modelConstructor);
																						this.modelSyncedStatus.set(
																							modelConstructor,
																							true
																						);
																						observer.next({
																							type: ControlMessage.SYNC_ENGINE_MODEL_SYNCED,
																							data: {
																								model: modelConstructor,
																								isFullSync: isFullSync,
																								isDeltaSync: !isFullSync,
																								counts: counts,
																							},
																						});
																						paginatingModels.delete(
																							modelDefinition
																						);
																						if (paginatingModels.size === 0) {
																							duration = getNow() - start;
																							resolve();
																							observer.next({
																								type: ControlMessage.SYNC_ENGINE_SYNC_QUERIES_READY,
																							});
																							syncQueriesSubscription.unsubscribe();
																						}
																						_b.label = 4;
																					case 4:
																						return [2 /*return*/];
																				}
																			});
																		}
																	);
																},
																error: function (error) {
																	observer.error(error);
																},
															});
														observer.next({
															type: ControlMessage.SYNC_ENGINE_SYNC_QUERIES_STARTED,
															data: {
																models: Array.from(paginatingModels).map(
																	function (_a) {
																		var name = _a.name;
																		return name;
																	}
																),
															},
														});
													}),
												];
											case 2:
												_a.sent();
												msNextFullSync =
													newestFullSyncStartedAt +
													theInterval -
													(newestStartedAt + duration);
												logger.debug(
													'Next fullSync in ' +
														msNextFullSync / 1000 +
														' seconds. (' +
														new Date(Date.now() + msNextFullSync) +
														')'
												);
												return [
													4 /*yield*/,
													new Promise(function (res) {
														waitTimeoutId = setTimeout(res, msNextFullSync);
													}),
												];
											case 3:
												_a.sent();
												return [2 /*return*/];
										}
									});
								};
								this_1 = this;
								_a.label = 1;
							case 1:
								if (!!observer.closed) return [3 /*break*/, 3];
								return [5 /*yield**/, _loop_1()];
							case 2:
								_a.sent();
								return [3 /*break*/, 1];
							case 3:
								return [2 /*return*/];
						}
					});
				});
			})();
			return function () {
				if (syncQueriesSubscription) {
					syncQueriesSubscription.unsubscribe();
				}
				if (waitTimeoutId) {
					clearTimeout(waitTimeoutId);
				}
			};
		});
	};
	SyncEngine.prototype.disconnectionHandler = function () {
		var _this = this;
		return function (msg) {
			// This implementation is tied to AWSAppSyncRealTimeProvider 'Connection closed', 'Timeout disconnect' msg
			if (
				PUBSUB_CONTROL_MSG.CONNECTION_CLOSED === msg ||
				PUBSUB_CONTROL_MSG.TIMEOUT_DISCONNECT === msg
			) {
				_this.datastoreConnectivity.socketDisconnected();
			}
		};
	};
	SyncEngine.prototype.unsubscribeConnectivity = function () {
		this.datastoreConnectivity.unsubscribe();
	};
	SyncEngine.prototype.setupModels = function (params) {
		return __awaiter(this, void 0, void 0, function () {
			var fullSyncInterval,
				ModelMetadata,
				models,
				savedModel,
				promises,
				result,
				_a,
				_b,
				modelMetadata,
				modelName,
				e_2_1;
			var e_2, _c;
			var _this = this;
			return __generator(this, function (_d) {
				switch (_d.label) {
					case 0:
						fullSyncInterval = params.fullSyncInterval;
						ModelMetadata = this.modelClasses.ModelMetadata;
						models = [];
						Object.values(this.schema.namespaces).forEach(function (namespace) {
							Object.values(namespace.models)
								.filter(function (_a) {
									var syncable = _a.syncable;
									return syncable;
								})
								.forEach(function (model) {
									models.push([namespace.name, model]);
									if (namespace.name === USER) {
										var modelConstructor = _this.userModelClasses[model.name];
										_this.modelSyncedStatus.set(modelConstructor, false);
									}
								});
						});
						promises = models.map(function (_a) {
							var _b = __read(_a, 2),
								namespace = _b[0],
								model = _b[1];
							return __awaiter(_this, void 0, void 0, function () {
								var modelMetadata,
									syncPredicate,
									lastSyncPredicate,
									prevSyncPredicate,
									syncPredicateUpdated_1;
								var _c, _d, _e, _f;
								return __generator(this, function (_g) {
									switch (_g.label) {
										case 0:
											return [
												4 /*yield*/,
												this.getModelMetadata(namespace, model.name),
											];
										case 1:
											modelMetadata = _g.sent();
											syncPredicate = ModelPredicateCreator.getPredicates(
												this.syncPredicates.get(model),
												false
											);
											lastSyncPredicate = syncPredicate
												? JSON.stringify(syncPredicate)
												: null;
											if (!(modelMetadata === undefined))
												return [3 /*break*/, 3];
											return [
												4 /*yield*/,
												this.storage.save(
													this.modelInstanceCreator(ModelMetadata, {
														model: model.name,
														namespace: namespace,
														lastSync: null,
														fullSyncInterval: fullSyncInterval,
														lastFullSync: null,
														lastSyncPredicate: lastSyncPredicate,
													}),
													undefined,
													ownSymbol
												),
											];
										case 2:
											(_c = __read.apply(void 0, [_g.sent(), 1])),
												(_d = __read(_c[0], 1)),
												(savedModel = _d[0]);
											return [3 /*break*/, 5];
										case 3:
											prevSyncPredicate = modelMetadata.lastSyncPredicate
												? modelMetadata.lastSyncPredicate
												: null;
											syncPredicateUpdated_1 =
												prevSyncPredicate !== lastSyncPredicate;
											return [
												4 /*yield*/,
												this.storage.save(
													this.modelClasses.ModelMetadata.copyOf(
														modelMetadata,
														function (draft) {
															draft.fullSyncInterval = fullSyncInterval;
															// perform a base sync if the syncPredicate changed in between calls to DataStore.start
															// ensures that the local store contains all the data specified by the syncExpression
															if (syncPredicateUpdated_1) {
																draft.lastSync = null;
																draft.lastFullSync = null;
																draft.lastSyncPredicate = lastSyncPredicate;
															}
														}
													)
												),
											];
										case 4:
											(_e = __read.apply(void 0, [_g.sent(), 1])),
												(_f = __read(_e[0], 1)),
												(savedModel = _f[0]);
											_g.label = 5;
										case 5:
											return [2 /*return*/, savedModel];
									}
								});
							});
						});
						result = {};
						_d.label = 1;
					case 1:
						_d.trys.push([1, 6, 7, 8]);
						return [4 /*yield*/, Promise.all(promises)];
					case 2:
						(_a = __values.apply(void 0, [_d.sent()])), (_b = _a.next());
						_d.label = 3;
					case 3:
						if (!!_b.done) return [3 /*break*/, 5];
						modelMetadata = _b.value;
						modelName = modelMetadata.model;
						result[modelName] = modelMetadata;
						_d.label = 4;
					case 4:
						_b = _a.next();
						return [3 /*break*/, 3];
					case 5:
						return [3 /*break*/, 8];
					case 6:
						e_2_1 = _d.sent();
						e_2 = { error: e_2_1 };
						return [3 /*break*/, 8];
					case 7:
						try {
							if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
						} finally {
							if (e_2) throw e_2.error;
						}
						return [7 /*endfinally*/];
					case 8:
						return [2 /*return*/, result];
				}
			});
		});
	};
	SyncEngine.prototype.getModelsMetadata = function () {
		return __awaiter(this, void 0, void 0, function () {
			var ModelMetadata, modelsMetadata;
			return __generator(this, function (_a) {
				switch (_a.label) {
					case 0:
						ModelMetadata = this.modelClasses.ModelMetadata;
						return [4 /*yield*/, this.storage.query(ModelMetadata)];
					case 1:
						modelsMetadata = _a.sent();
						return [2 /*return*/, modelsMetadata];
				}
			});
		});
	};
	SyncEngine.prototype.getModelMetadata = function (namespace, model) {
		return __awaiter(this, void 0, void 0, function () {
			var ModelMetadata, predicate, _a, modelMetadata;
			return __generator(this, function (_b) {
				switch (_b.label) {
					case 0:
						ModelMetadata = this.modelClasses.ModelMetadata;
						predicate = ModelPredicateCreator.createFromExisting(
							this.schema.namespaces[SYNC].models[ModelMetadata.name],
							function (c) {
								return c.namespace('eq', namespace).model('eq', model);
							}
						);
						return [
							4 /*yield*/,
							this.storage.query(ModelMetadata, predicate, {
								page: 0,
								limit: 1,
							}),
						];
					case 1:
						(_a = __read.apply(void 0, [_b.sent(), 1])),
							(modelMetadata = _a[0]);
						return [2 /*return*/, modelMetadata];
				}
			});
		});
	};
	SyncEngine.prototype.getModelDefinition = function (modelConstructor) {
		var namespaceName = this.namespaceResolver(modelConstructor);
		var modelDefinition =
			this.schema.namespaces[namespaceName].models[modelConstructor.name];
		return modelDefinition;
	};
	SyncEngine.getNamespace = function () {
		var namespace = {
			name: SYNC,
			relationships: {},
			enums: {
				OperationType: {
					name: 'OperationType',
					values: ['CREATE', 'UPDATE', 'DELETE'],
				},
			},
			nonModels: {},
			models: {
				MutationEvent: {
					name: 'MutationEvent',
					pluralName: 'MutationEvents',
					syncable: false,
					fields: {
						id: {
							name: 'id',
							type: 'ID',
							isRequired: true,
							isArray: false,
						},
						model: {
							name: 'model',
							type: 'String',
							isRequired: true,
							isArray: false,
						},
						data: {
							name: 'data',
							type: 'String',
							isRequired: true,
							isArray: false,
						},
						modelId: {
							name: 'modelId',
							type: 'String',
							isRequired: true,
							isArray: false,
						},
						operation: {
							name: 'operation',
							type: {
								enum: 'Operationtype',
							},
							isArray: false,
							isRequired: true,
						},
						condition: {
							name: 'condition',
							type: 'String',
							isArray: false,
							isRequired: true,
						},
					},
				},
				ModelMetadata: {
					name: 'ModelMetadata',
					pluralName: 'ModelsMetadata',
					syncable: false,
					fields: {
						id: {
							name: 'id',
							type: 'ID',
							isRequired: true,
							isArray: false,
						},
						namespace: {
							name: 'namespace',
							type: 'String',
							isRequired: true,
							isArray: false,
						},
						model: {
							name: 'model',
							type: 'String',
							isRequired: true,
							isArray: false,
						},
						lastSync: {
							name: 'lastSync',
							type: 'Int',
							isRequired: false,
							isArray: false,
						},
						lastFullSync: {
							name: 'lastFullSync',
							type: 'Int',
							isRequired: false,
							isArray: false,
						},
						fullSyncInterval: {
							name: 'fullSyncInterval',
							type: 'Int',
							isRequired: true,
							isArray: false,
						},
						lastSyncPredicate: {
							name: 'lastSyncPredicate',
							type: 'String',
							isRequired: false,
							isArray: false,
						},
					},
				},
			},
		};
		return namespace;
	};
	return SyncEngine;
})();
export { SyncEngine };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3luYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxhQUFhLElBQUksTUFBTSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDM0UsT0FBTyxFQUFFLFdBQVcsSUFBSSxrQkFBa0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3hFLE9BQU8sVUFBNkIsTUFBTSxtQkFBbUIsQ0FBQztBQUU5RCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdEQsT0FBTyxFQVNOLE1BQU0sR0FTTixNQUFNLFVBQVUsQ0FBQztBQUNsQixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzlELE9BQU8scUJBQXFCLE1BQU0seUJBQXlCLENBQUM7QUFDNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUN2QyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDMUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9FLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNsRCxPQUFPLEVBQ04sd0NBQXdDLEVBQ3hDLDJCQUEyQixHQUUzQixNQUFNLFNBQVMsQ0FBQztBQUVULElBQUEsK0JBQU0sQ0FBcUI7QUFDbkMsSUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFdkMsSUFBTSxTQUFTLEdBQUcsTUFBTSxD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TyxFQUFFLEtBQUs7eUJBQ2Q7d0JBQ0QsU0FBUyxFQUFFOzRCQUNWLElBQUksRUFBRSxXQUFXOzRCQUNqQixJQUFJLEVBQUUsUUFBUTs0QkFDZCxVQUFVLEVBQUUsSUFBSTs0QkFDaEIsT0FBTyxFQUFFLEtBQUs7eUJBQ2Q7d0JBQ0QsS0FBSyxFQUFFOzRCQUNOLElBQUksRUFBRSxPQUFPOzRCQUNiLElBQUksRUFBRSxRQUFROzRCQUNkLFVBQVUsRUFBRSxJQUFJOzRCQUNoQixPQUFPLEVBQUUsS0FBSzt5QkFDZDt3QkFDRCxRQUFRLEVBQUU7NEJBQ1QsSUFBSSxFQUFFLFVBQVU7NEJBQ2hCLElBQUksRUFBRSxLQUFLOzRCQUNYLFVBQVUsRUFBRSxLQUFLOzRCQUNqQixPQUFPLEVBQUUsS0FBSzt5QkFDZDt3QkFDRCxZQUFZLEVBQUU7NEJBQ2IsSUFBSSxFQUFFLGNBQWM7NEJBQ3BCLElBQUksRUFBRSxLQUFLOzRCQUNYLFVBQVUsRUFBRSxLQUFLOzRCQUNqQixPQUFPLEVBQUUsS0FBSzt5QkFDZDt3QkFDRCxnQkFBZ0IsRUFBRTs0QkFDakIsSUFBSSxFQUFFLGtCQUFrQjs0QkFDeEIsSUFBSSxFQUFFLEtBQUs7NEJBQ1gsVUFBVSxFQUFFLElBQUk7NEJBQ2hCLE9BQU8sRUFBRSxLQUFLO3lCQUNkO3dCQUNELGlCQUFpQixFQUFFOzRCQUNsQixJQUFJLEVBQUUsbUJBQW1COzRCQUN6QixJQUFJLEVBQUUsUUFBUTs0QkFDZCxVQUFVLEVBQUUsS0FBSzs0QkFDakIsT0FBTyxFQUFFLEtBQUs7eUJBQ2Q7cUJBQ0Q7aUJBQ0Q7YUFDRDtTQUNELENBQUM7UUFDRixPQUFPLFNBQVMsQ0FBQztJQUNsQixDQUFDO0lBQ0YsaUJBQUM7QUFBRCxDQUFDLEFBMTFCRCxJQTAxQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBicm93c2VyT3JOb2RlLCBDb25zb2xlTG9nZ2VyIGFzIExvZ2dlciB9IGZyb20gJ0Bhd3MtYW1wbGlmeS9jb3JlJztcbmltcG9ydCB7IENPTlRST0xfTVNHIGFzIFBVQlNVQl9DT05UUk9MX01TRyB9IGZyb20gJ0Bhd3MtYW1wbGlmeS9wdWJzdWInO1xuaW1wb3J0IE9ic2VydmFibGUsIHsgWmVuT2JzZXJ2YWJsZSB9IGZyb20gJ3plbi1vYnNlcnZhYmxlLXRzJztcbmltcG9ydCB7IE1vZGVsSW5zdGFuY2VDcmVhdG9yIH0gZnJvbSAnLi4vZGF0YXN0b3JlL2RhdGFzdG9yZSc7XG5pbXBvcnQgeyBNb2RlbFByZWRpY2F0ZUNyZWF0b3IgfSBmcm9tICcuLi9wcmVkaWNhdGVzJztcbmltcG9ydCB7IEV4Y2x1c2l2ZVN0b3JhZ2UgYXMgU3RvcmFnZSB9IGZyb20gJy4uL3N0b3JhZ2Uvc3RvcmFnZSc7XG5pbXBvcnQge1xuXHRDb25mbGljdEhhbmRsZXIsXG5cdENvbnRyb2xNZXNzYWdlVHlwZSxcblx0RXJyb3JIYW5kbGVyLFxuXHRJbnRlcm5hbFNjaGVtYSxcblx0TW9kZWxJbml0LFxuXHRNb2RlbEluc3RhbmNlTWV0YWRhdGEsXG5cdE11dGFibGVNb2RlbCxcblx0TmFtZXNwYWNlUmVzb2x2ZXIsXG5cdE9wVHlwZSxcblx0UGVyc2lzdGVudE1vZGVsLFxuXHRQZXJzaXN0ZW50TW9kZWxDb25zdHJ1Y3Rvcixcblx0U2NoZW1hTW9kZWwsXG5cdFNjaGVtYU5hbWVzcGFjZSxcblx0VHlwZUNvbnN0cnVjdG9yTWFwLFxuXHRNb2RlbFByZWRpY2F0ZSxcblx0QXV0aE1vZGVTdHJhdGVneSxcblx0UG9sbE9mZmxpbmVUeXBlLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBleGhhdXN0aXZlQ2hlY2ssIGdldE5vdywgU1lOQywgVVNFUiB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IERhdGFTdG9yZUNvbm5lY3Rpdml0eSBmcm9tICcuL2RhdGFzdG9yZUNvbm5lY3Rpdml0eSc7XG5pbXBvcnQgeyBNb2RlbE1lcmdlciB9IGZyb20gJy4vbWVyZ2VyJztcbmltcG9ydCB7IE11dGF0aW9uRXZlbnRPdXRib3ggfSBmcm9tICcuL291dGJveCc7XG5pbXBvcnQgeyBNdXRhdGlvblByb2Nlc3NvciB9IGZyb20gJy4vcHJvY2Vzc29ycy9tdXRhdGlvbic7XG5pbXBvcnQgeyBDT05UUk9MX01TRywgU3Vic2NyaXB0aW9uUHJvY2Vzc29yIH0gZnJvbSAnLi9wcm9jZXNzb3JzL3N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBTeW5jUHJvY2Vzc29yIH0gZnJvbSAnLi9wcm9jZXNzb3JzL3N5bmMnO1xuaW1wb3J0IHtcblx0Y3JlYXRlTXV0YXRpb25JbnN0YW5jZUZyb21Nb2RlbE9wZXJhdGlvbixcblx0cHJlZGljYXRlVG9HcmFwaFFMQ29uZGl0aW9uLFxuXHRUcmFuc2Zvcm1lck11dGF0aW9uVHlwZSxcbn0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IHsgaXNOb2RlIH0gPSBicm93c2VyT3JOb2RlKCk7XG5jb25zdCBsb2dnZXIgPSBuZXcgTG9nZ2VyKCdEYXRhU3RvcmUnKTtcblxuY29uc3Qgb3duU3ltYm9sID0gU3ltYm9sKCdzeW5jJyk7XG5cbnR5cGUgU3RhcnRQYXJhbXMgPSB7XG5cdGZ1bGxTeW5jSW50ZXJ2YWw6IG51bWJlcjtcblx0cG9sbE9mZmxpbmU6IFBvbGxPZmZsaW5lVHlwZTtcbn07XG5cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE11dGF0aW9uRXZlbnQge1xuXHRjb25zdHJ1Y3Rvcihpbml0OiBNb2RlbEluaXQ8TXV0YXRpb25FdmVudD4pO1xuXHRzdGF0aWMgY29weU9mKFxuXHRcdHNyYzogTXV0YXRpb25FdmVudCxcblx0XHRtdXRhdG9yOiAoZHJhZnQ6IE11dGFibGVNb2RlbDxNdXRhdGlvbkV2ZW50PikgPT4gdm9pZCB8IE11dGF0aW9uRXZlbnRcblx0KTogTXV0YXRpb25FdmVudDtcblx0cHVibGljIHJlYWRvbmx5IGlkOiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBtb2RlbDogc3RyaW5nO1xuXHRwdWJsaWMgcmVhZG9ubHkgb3BlcmF0aW9uOiBUcmFuc2Zvcm1lck11dGF0aW9uVHlwZTtcblx0cHVibGljIHJlYWRvbmx5IG1vZGVsSWQ6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IGNvbmRpdGlvbjogc3RyaW5nO1xuXHRwdWJsaWMgZGF0YTogc3RyaW5nO1xufVxuXG5kZWNsYXJlIGNsYXNzIE1vZGVsTWV0YWRhdGEge1xuXHRjb25zdHJ1Y3Rvcihpbml0OiBNb2RlbEluaXQ8TW9kZWxNZXRhZGF0YT4pO1xuXHRzdGF0aWMgY29weU9mKFxuXHRcdHNyYzogTW9kZWxNZXRhZGF0YSxcblx0XHRtdXRhdG9yOiAoZHJhZnQ6IE11dGFibGVNb2RlbDxNb2RlbE1ldGFkYXRhPikgPT4gdm9pZCB8IE1vZGVsTWV0YWRhdGFcblx0KTogTW9kZWxNZXRhZGF0YTtcblx0cHVibGljIHJlYWRvbmx5IGlkOiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBuYW1lc3BhY2U6IHN0cmluZztcblx0cHVibGljIHJlYWRvbmx5IG1vZGVsOiBzdHJpbmc7XG5cdHB1YmxpYyByZWFkb25seSBmdWxsU3luY0ludGVydmFsOiBudW1iZXI7XG5cdHB1YmxpYyByZWFkb25seSBsYXN0U3luYz86IG51bWJlcjtcblx0cHVibGljIHJlYWRvbmx5IGxhc3RGdWxsU3luYz86IG51bWJlcjtcblx0cHVibGljIHJlYWRvbmx5IGxhc3RTeW5jUHJlZGljYXRlPzogbnVsbCB8IHN0cmluZztcbn1cblxuZXhwb3J0IGVudW0gQ29udHJvbE1lc3NhZ2Uge1xuXHRTWU5DX0VOR0lORV9TVE9SQUdFX1NVQlNDUklCRUQgPSAnc3RvcmFnZVN1YnNjcmliZWQnLFxuXHRTWU5DX0VOR0lORV9TVUJTQ1JJUFRJT05TX0VTVEFCTElTSEVEID0gJ3N1YnNjcmlwdGlvbnNFc3RhYmxpc2hlZCcsXG5cdFNZTkNfRU5HSU5FX1NZTkNfUVVFUklFU19TVEFSVEVEID0gJ3N5bmNRdWVyaWVzU3RhcnRlZCcsXG5cdFNZTkNfRU5HSU5FX1NZTkNfUVVFUklFU19SRUFEWSA9ICdzeW5jUXVlcmllc1JlYWR5Jyxcblx0U1lOQ19FTkdJTkVfTU9ERUxfU1lOQ0VEID0gJ21vZGVsU3luY2VkJyxcblx0U1lOQ19FTkdJTkVfT1VUQk9YX01VVEFUSU9OX0VOUVVFVUVEID0gJ291dGJveE11dGF0aW9uRW5xdWV1ZWQnLFxuXHRTWU5DX0VOR0lORV9PVVRCT1hfTVVUQVRJT05fUFJPQ0VTU0VEID0gJ291dGJveE11dGF0aW9uUHJvY2Vzc2VkJyxcblx0U1lOQ19FTkdJTkVfT1VUQk9YX1NUQVRVUyA9ICdvdXRib3hTdGF0dXMnLFxuXHRTWU5DX0VOR0lORV9ORVRXT1JLX1NUQVRVUyA9ICduZXR3b3JrU3RhdHVzJyxcblx0U1lOQ19FTkdJTkVfUkVBRFkgPSAncmVhZHknLFxufVxuXG5leHBvcnQgY2xhc3MgU3luY0VuZ2luZSB7XG5cdHByaXZhdGUgb25saW5lID0gZmFsc2U7XG5cblx0cHJpdmF0ZSByZWFkb25seSBzeW5jUXVlcmllc1Byb2Nlc3NvcjogU3luY1Byb2Nlc3Nvcjtcblx0cHJpdmF0ZSByZWFkb25seSBzdWJzY3JpcHRpb25zUHJvY2Vzc29yOiBTdWJzY3JpcHRpb25Qcm9jZXNzb3I7XG5cdHByaXZhdGUgcmVhZG9ubHkgbXV0YXRpb25zUHJvY2Vzc29yOiBNdXRhdGlvblByb2Nlc3Nvcjtcblx0cHJpdmF0ZSByZWFkb25seSBtb2RlbE1lcmdlcjogTW9kZWxNZXJnZXI7XG5cdHByaXZhdGUgcmVhZG9ubHkgb3V0Ym94OiBNdXRhdGlvbkV2ZW50T3V0Ym94O1xuXHRwcml2YXRlIHJlYWRvbmx5IGRhdGFzdG9yZUNvbm5lY3Rpdml0eTogRGF0YVN0b3JlQ29ubmVjdGl2aXR5O1xuXHRwcml2YXRlIHJlYWRvbmx5IG1vZGVsU3luY2VkU3RhdHVzOiBXZWFrTWFwPFxuXHRcdFBlcnNpc3RlbnRNb2RlbENvbnN0cnVjdG9yPGFueT4sXG5cdFx0Ym9vbGVhblxuXHQ+ID0gbmV3IFdlYWtNYXAoKTtcblxuXHRwdWJsaWMgZ2V0TW9kZWxTeW5jZWRTdGF0dXMoXG5cdFx0bW9kZWxDb25zdHJ1Y3RvcjogUGVyc2lzdGVudE1vZGVsQ29uc3RydWN0b3I8YW55PlxuXHQpOiBib29sZWFuIHtcblx0XHRyZXR1cm4gdGhpcy5tb2RlbFN5bmNlZFN0YXR1cy5nZXQobW9kZWxDb25zdHJ1Y3Rvcik7XG5cdH1cblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIHJlYWRvbmx5IHNjaGVtYTogSW50ZXJuYWxTY2hlbWEsXG5cdFx0cHJpdmF0ZSByZWFkb25seSBuYW1lc3BhY2VSZXNvbHZlcjogTmFtZXNwYWNlUmVzb2x2ZXIsXG5cdFx0cHJpdmF0ZSByZWFkb25seSBtb2RlbENsYXNzZXM6IFR5cGVDb25zdHJ1Y3Rvck1hcCxcblx0XHRwcml2YXRlIHJlYWRvbmx5IHVzZXJNb2RlbENsYXNzZXM6IFR5cGVDb25zdHJ1Y3Rvck1hcCxcblx0XHRwcml2YXRlIHJlYWRvbmx5IHN0b3JhZ2U6IFN0b3JhZ2UsXG5cdFx0cHJpdmF0ZSByZWFkb25seSBtb2RlbEluc3RhbmNlQ3JlYXRvcjogTW9kZWxJbnN0YW5jZUNyZWF0b3IsXG5cdFx0Y29uZmxpY3RIYW5kbGVyOiBDb25mbGljdEhhbmRsZXIsXG5cdFx0ZXJyb3JIYW5kbGVyOiBFcnJvckhhbmRsZXIsXG5cdFx0cHJpdmF0ZSByZWFkb25seSBzeW5jUHJlZGljYXRlczogV2Vha01hcDxTY2hlbWFNb2RlbCwgTW9kZWxQcmVkaWNhdGU8YW55Pj4sXG5cdFx0cHJpdmF0ZSByZWFkb25seSBhbXBsaWZ5Q29uZmlnOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge30sXG5cdFx0cHJpdmF0ZSByZWFkb25seSBhdXRoTW9kZVN0cmF0ZWd5OiBBdXRoTW9kZVN0cmF0ZWd5XG5cdCkge1xuXHRcdGNvbnN0IE11dGF0aW9uRXZlbnQgPSB0aGlzLm1vZGVsQ2xhc3Nlc1tcblx0XHRcdCdNdXRhdGlvbkV2ZW50J1xuXHRcdF0gYXMgUGVyc2lzdGVudE1vZGVsQ29uc3RydWN0b3I8YW55PjtcblxuXHRcdHRoaXMub3V0Ym94ID0gbmV3IE11dGF0aW9uRXZlbnRPdXRib3goXG5cdFx0XHR0aGlzLnNjaGVtYSxcblx0XHRcdE11dGF0aW9uRXZlbnQsXG5cdFx0XHRtb2RlbEluc3RhbmNlQ3JlYXRvcixcblx0XHRcdG93blN5bWJvbFxuXHRcdCk7XG5cblx0XHR0aGlzLm1vZGVsTWVyZ2VyID0gbmV3IE1vZGVsTWVyZ2VyKHRoaXMub3V0Ym94LCBvd25TeW1ib2wpO1xuXG5cdFx0dGhpcy5zeW5jUXVlcmllc1Byb2Nlc3NvciA9IG5ldyBTeW5jUHJvY2Vzc29yKFxuXHRcdFx0dGhpcy5zY2hlbWEsXG5cdFx0XHR0aGlzLnN5bmNQcmVkaWNhdGVzLFxuXHRcdFx0dGhpcy5hbXBsaWZ5Q29uZmlnLFxuXHRcdFx0dGhpcy5hdXRoTW9kZVN0cmF0ZWd5XG5cdFx0KTtcblx0XHR0aGlzLnN1YnNjcmlwdGlvbnNQcm9jZXNzb3IgPSBuZXcgU3Vic2NyaXB0aW9uUHJvY2Vzc29yKFxuXHRcdFx0dGhpcy5zY2hlbWEsXG5cdFx0XHR0aGlzLnN5bmNQcmVkaWNhdGVzLFxuXHRcdFx0dGhpcy5hbXBsaWZ5Q29uZmlnLFxuXHRcdFx0dGhpcy5hdXRoTW9kZVN0cmF0ZWd5XG5cdFx0KTtcblx0XHR0aGlzLm11dGF0aW9uc1Byb2Nlc3NvciA9IG5ldyBNdXRhdGlvblByb2Nlc3Nvcihcblx0XHRcdHRoaXMuc2NoZW1hLFxuXHRcdFx0dGhpcy5zdG9yYWdlLFxuXHRcdFx0dGhpcy51c2VyTW9kZWxDbGFzc2VzLFxuXHRcdFx0dGhpcy5vdXRib3gsXG5cdFx0XHR0aGlzLm1vZGVsSW5zdGFuY2VDcmVhdG9yLFxuXHRcdFx0TXV0YXRpb25FdmVudCxcblx0XHRcdHRoaXMuYW1wbGlmeUNvbmZpZyxcblx0XHRcdHRoaXMuYXV0aE1vZGVTdHJhdGVneSxcblx0XHRcdGNvbmZsaWN0SGFuZGxlcixcblx0XHRcdGVycm9ySGFuZGxlclxuXHRcdCk7XG5cdFx0dGhpcy5kYXRhc3RvcmVDb25uZWN0aXZpdHkgPSBuZXcgRGF0YVN0b3JlQ29ubmVjdGl2aXR5KCk7XG5cdH1cblxuXHRzdGFydChwYXJhbXM6IFN0YXJ0UGFyYW1zKSB7XG5cdFx0Y29uc3QgeyBwb2xsT2ZmbGluZSB9ID0gcGFyYW1zO1xuXHRcdHJldHVybiBuZXcgT2JzZXJ2YWJsZTxDb250cm9sTWVzc2FnZVR5cGU8Q29udHJvbE1lc3NhZ2U+PihvYnNlcnZlciA9PiB7XG5cdFx0XHRsb2dnZXIubG9nKCdzdGFydGluZyBzeW5jIGVuZ2luZS4uLicpO1xuXHRcdFx0bGV0IHN1YnNjcmlwdGlvbnM6IFplbk9ic2VydmFibGUuU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuXHRcdFx0KGFzeW5jICgpID0+IHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnNldHVwTW9kZWxzKHBhcmFtcyk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdG9ic2VydmVyLmVycm9yKGVycik7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Y29uc3Qgc3RhcnRQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cdFx0XHRcdFx0dGhpcy5kYXRhc3RvcmVDb25uZWN0aXZpdHlcblx0XHRcdFx0XHRcdC5zdGF0dXMocG9sbE9mZmxpbmUpXG5cdFx0XHRcdFx0XHQuc3Vic2NyaWJlKGFzeW5jICh7IG9ubGluZSB9KSA9PiB7XG5cdFx0XHRcdFx0XHRcdC8vIEZyb20gb2ZmbGluZSB0byBvbmxpbmVcblx0XHRcdFx0XHRcdFx0aWYgKG9ubGluZSAmJiAhdGhpcy5vbmxpbmUpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLm9ubGluZSA9IG9ubGluZTtcblxuXHRcdFx0XHRcdFx0XHRcdG9ic2VydmVyLm5leHQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogQ29udHJvbE1lc3NhZ2UuU1lOQ19FTkdJTkVfTkVUV09SS19TVEFUVVMsXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZTogdGhpcy5vbmxpbmUsXG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0bGV0IGN0bFN1YnNPYnNlcnZhYmxlOiBPYnNlcnZhYmxlPENPTlRST0xfTVNHPjtcblx0XHRcdFx0XHRcdFx0XHRsZXQgZGF0YVN1YnNPYnNlcnZhYmxlOiBPYnNlcnZhYmxlPFxuXHRcdFx0XHRcdFx0XHRcdFx0W1RyYW5zZm9ybWVyTXV0YXRpb25UeXBlLCBTY2hlbWFNb2RlbCwgUGVyc2lzdGVudE1vZGVsXVxuXHRcdFx0XHRcdFx0XHRcdD47XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoaXNOb2RlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsb2dnZXIud2Fybihcblx0XHRcdFx0XHRcdFx0XHRcdFx0J1JlYWx0aW1lIGRpc2FibGVkIHdoZW4gaW4gYSBzZXJ2ZXItc2lkZSBlbnZpcm9ubWVudCdcblx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdC8vI3JlZ2lvbiBHcmFwaFFMIFN1YnNjcmlwdGlvbnNcblx0XHRcdFx0XHRcdFx0XHRcdFtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY29uc3QgY3RsT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxDT05UUk9MX01TRz5cblx0XHRcdFx0XHRcdFx0XHRcdFx0Y3RsU3Vic09ic2VydmFibGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGNvbnN0IGRhdGFPYnNlcnZhYmxlOiBPYnNlcnZhYmxlPFtUcmFuc2Zvcm1lck11dGF0aW9uVHlwZSwgU2NoZW1hTW9kZWwsIFJlYWRvbmx5PHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gaWQ6IHN0cmluZztcblx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gfSAmIFJlY29yZDxzdHJpbmcsIGFueT4+XT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YVN1YnNPYnNlcnZhYmxlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XSA9IHRoaXMuc3Vic2NyaXB0aW9uc1Byb2Nlc3Nvci5zdGFydCgpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgY3RsU3Vic1N1YnNjcmlwdGlvbiA9IGN0bFN1YnNPYnNlcnZhYmxlLnN1YnNjcmliZSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRuZXh0OiBtc2cgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAobXNnID09PSBDT05UUk9MX01TRy5DT05ORUNURUQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXNvbHZlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVqZWN0KGVycik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IGhhbmRsZURpc2Nvbm5lY3QgPSB0aGlzLmRpc2Nvbm5lY3Rpb25IYW5kbGVyKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhhbmRsZURpc2Nvbm5lY3QoZXJyKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdWJzY3JpcHRpb25zLnB1c2goY3RsU3Vic1N1YnNjcmlwdGlvbik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9ic2VydmVyLmVycm9yKGVycik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0bG9nZ2VyLmxvZygnUmVhbHRpbWUgcmVhZHknKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0b2JzZXJ2ZXIubmV4dCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IENvbnRyb2xNZXNzYWdlLlNZTkNfRU5HSU5FX1NVQlNDUklQVElPTlNfRVNUQUJMSVNIRUQsXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0Ly8jZW5kcmVnaW9uXG5cdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0Ly8jcmVnaW9uIEJhc2UgJiBTeW5jIHF1ZXJpZXNcblx0XHRcdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRcdFx0YXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBzeW5jUXVlcnlTdWJzY3JpcHRpb24gPVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuc3luY1F1ZXJpZXNPYnNlcnZhYmxlKCkuc3Vic2NyaWJlKHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG5leHQ6IG1lc3NhZ2UgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCB7IHR5cGUgfSA9IG1lc3NhZ2U7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHR5cGUgPT09XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Q29udHJvbE1lc3NhZ2UuU1lOQ19FTkdJTkVfU1lOQ19RVUVSSUVTX1JFQURZXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlc29sdmUoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9ic2VydmVyLm5leHQobWVzc2FnZSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y29tcGxldGU6ICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlamVjdChlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChzeW5jUXVlcnlTdWJzY3JpcHRpb24pIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdWJzY3JpcHRpb25zLnB1c2goc3luY1F1ZXJ5U3Vic2NyaXB0aW9uKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0XHRcdFx0XHRcdG9ic2VydmVyLmVycm9yKGVycm9yKTtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0Ly8jZW5kcmVnaW9uXG5cblx0XHRcdFx0XHRcdFx0XHQvLyNyZWdpb24gcHJvY2VzcyBtdXRhdGlvbnNcblx0XHRcdFx0XHRcdFx0XHRzdWJzY3JpcHRpb25zLnB1c2goXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLm11dGF0aW9uc1Byb2Nlc3Nvci5zdGFydCgpLnN1YnNjcmliZSh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5leHQ6ICh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kZWxEZWZpbml0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZGVsOiBpdGVtLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGhhc01vcmUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVxdWV1ZWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBtb2RlbENvbnN0cnVjdG9yID0gdGhpcy51c2VyTW9kZWxDbGFzc2VzW1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kZWxEZWZpbml0aW9uLm5hbWVcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRdIGFzIFBlcnNpc3RlbnRNb2RlbENvbnN0cnVjdG9yPGFueT47XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBtb2RlbCA9IHRoaXMubW9kZWxJbnN0YW5jZUNyZWF0b3IoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtb2RlbENvbnN0cnVjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnN0b3JhZ2UucnVuRXhjbHVzaXZlKHN0b3JhZ2UgPT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMubW9kZWxNZXJnZXIubWVyZ2Uoc3RvcmFnZSwgbW9kZWwpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9ic2VydmVyLm5leHQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogQ29udHJvbE1lc3NhZ2UuU1lOQ19FTkdJTkVfT1VUQk9YX01VVEFUSU9OX1BST0NFU1NFRCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kZWw6IG1vZGVsQ29uc3RydWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVsZW1lbnQ6IG1vZGVsLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpc0RlYWRMZXR0ZXI6IGRlcXVldWVkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9ic2VydmVyLm5leHQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogQ29udHJvbE1lc3NhZ2UuU1lOQ19FTkdJTkVfT1VUQk9YX1NUQVRVUyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNFbXB0eTogIWhhc01vcmUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZXJyLm1lc3NhZ2UgPT09ICdPZmZsaW5lJykge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5kYXRhc3RvcmVDb25uZWN0aXZpdHkubmV0d29ya0Rpc2Nvbm5lY3RlZCgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9nZ2VyLmRlYnVnKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnQXR0ZW1wdGVkIG5ldHdvcmsgcmVxdWVzdCBidXQgbmV0d29yayBpcyB1bmF2YWxpYWJsZS4nXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHQvLyNlbmRyZWdpb25cblxuXHRcdFx0XHRcdFx0XHRcdC8vI3JlZ2lvbiBNZXJnZSBzdWJzY3JpcHRpb25zIGJ1ZmZlclxuXHRcdFx0XHRcdFx0XHRcdC8vIFRPRE86IGV4dHJhY3QgdG8gZnVuY3Rpb25cblx0XHRcdFx0XHRcdFx0XHRpZiAoIWlzTm9kZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0c3Vic2NyaXB0aW9ucy5wdXNoKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhU3Vic09ic2VydmFibGUuc3Vic2NyaWJlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdChbX3RyYW5zZm9ybWVyTXV0YXRpb25UeXBlLCBtb2RlbERlZmluaXRpb24sIGl0ZW1dKSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBtb2RlbENvbnN0cnVjdG9yID0gdGhpcy51c2VyTW9kZWxDbGFzc2VzW1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtb2RlbERlZmluaXRpb24ubmFtZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XSBhcyBQZXJzaXN0ZW50TW9kZWxDb25zdHJ1Y3Rvcjxhbnk+O1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBtb2RlbCA9IHRoaXMubW9kZWxJbnN0YW5jZUNyZWF0b3IoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZGVsQ29uc3RydWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGl0ZW1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuc3RvcmFnZS5ydW5FeGNsdXNpdmUoc3RvcmFnZSA9PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLm1vZGVsTWVyZ2VyLm1lcmdlKHN0b3JhZ2UsIG1vZGVsKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdC8vI2VuZHJlZ2lvblxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCFvbmxpbmUpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLm9ubGluZSA9IG9ubGluZTtcblxuXHRcdFx0XHRcdFx0XHRcdG9ic2VydmVyLm5leHQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogQ29udHJvbE1lc3NhZ2UuU1lOQ19FTkdJTkVfTkVUV09SS19TVEFUVVMsXG5cdFx0XHRcdFx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFjdGl2ZTogdGhpcy5vbmxpbmUsXG5cdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0c3Vic2NyaXB0aW9ucy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG5cdFx0XHRcdFx0XHRcdFx0c3Vic2NyaXB0aW9ucyA9IFtdO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHRoaXMuc3RvcmFnZVxuXHRcdFx0XHRcdC5vYnNlcnZlKG51bGwsIG51bGwsIG93blN5bWJvbClcblx0XHRcdFx0XHQuZmlsdGVyKCh7IG1vZGVsIH0pID0+IHtcblx0XHRcdFx0XHRcdGNvbnN0IG1vZGVsRGVmaW5pdGlvbiA9IHRoaXMuZ2V0TW9kZWxEZWZpbml0aW9uKG1vZGVsKTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIG1vZGVsRGVmaW5pdGlvbi5zeW5jYWJsZSA9PT0gdHJ1ZTtcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdC5zdWJzY3JpYmUoe1xuXHRcdFx0XHRcdFx0bmV4dDogYXN5bmMgKHsgb3BUeXBlLCBtb2RlbCwgZWxlbWVudCwgY29uZGl0aW9uIH0pID0+IHtcblx0XHRcdFx0XHRcdFx0Y29uc3QgbmFtZXNwYWNlID1cblx0XHRcdFx0XHRcdFx0XHR0aGlzLnNjaGVtYS5uYW1lc3BhY2VzW3RoaXMubmFtZXNwYWNlUmVzb2x2ZXIobW9kZWwpXTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgTXV0YXRpb25FdmVudENvbnN0cnVjdG9yID0gdGhpcy5tb2RlbENsYXNzZXNbXG5cdFx0XHRcdFx0XHRcdFx0J011dGF0aW9uRXZlbnQnXG5cdFx0XHRcdFx0XHRcdF0gYXMgUGVyc2lzdGVudE1vZGVsQ29uc3RydWN0b3I8TXV0YXRpb25FdmVudD47XG5cdFx0XHRcdFx0XHRcdGNvbnN0IGdyYXBoUUxDb25kaXRpb24gPSBwcmVkaWNhdGVUb0dyYXBoUUxDb25kaXRpb24oY29uZGl0aW9uKTtcblx0XHRcdFx0XHRcdFx0Y29uc3QgbXV0YXRpb25FdmVudCA9IGNyZWF0ZU11dGF0aW9uSW5zdGFuY2VGcm9tTW9kZWxPcGVyYXRpb24oXG5cdFx0XHRcdFx0XHRcdFx0bmFtZXNwYWNlLnJlbGF0aW9uc2hpcHMsXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5nZXRNb2RlbERlZmluaXRpb24obW9kZWwpLFxuXHRcdFx0XHRcdFx0XHRcdG9wVHlwZSxcblx0XHRcdFx0XHRcdFx0XHRtb2RlbCxcblx0XHRcdFx0XHRcdFx0XHRlbGVtZW50LFxuXHRcdFx0XHRcdFx0XHRcdGdyYXBoUUxDb25kaXRpb24sXG5cdFx0XHRcdFx0XHRcdFx0TXV0YXRpb25FdmVudENvbnN0cnVjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMubW9kZWxJbnN0YW5jZUNyZWF0b3Jcblx0XHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0XHRhd2FpdCB0aGlzLm91dGJveC5lbnF1ZXVlKHRoaXMuc3RvcmFnZSwgbXV0YXRpb25FdmVudCk7XG5cblx0XHRcdFx0XHRcdFx0b2JzZXJ2ZXIubmV4dCh7XG5cdFx0XHRcdFx0XHRcdFx0dHlwZTogQ29udHJvbE1lc3NhZ2UuU1lOQ19FTkdJTkVfT1VUQk9YX01VVEFUSU9OX0VOUVVFVUVELFxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRcdFx0XHRcdG1vZGVsLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudCxcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRvYnNlcnZlci5uZXh0KHtcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiBDb250cm9sTWVzc2FnZS5TWU5DX0VOR0lORV9PVVRCT1hfU1RBVFVTLFxuXHRcdFx0XHRcdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRcdFx0XHRcdGlzRW1wdHk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdGF3YWl0IHN0YXJ0UHJvbWlzZTtcblxuXHRcdFx0XHRcdFx0XHRpZiAodGhpcy5vbmxpbmUpIHtcblx0XHRcdFx0XHRcdFx0XHR0aGlzLm11dGF0aW9uc1Byb2Nlc3Nvci5yZXN1bWUoKTtcblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRvYnNlcnZlci5uZXh0KHtcblx0XHRcdFx0XHR0eXBlOiBDb250cm9sTWVzc2FnZS5TWU5DX0VOR0lORV9TVE9SQUdFX1NVQlNDUklCRUQsXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGNvbnN0IGhhc011dGF0aW9uc0luT3V0Ym94ID1cblx0XHRcdFx0XHQoYXdhaXQgdGhpcy5vdXRib3gucGVlayh0aGlzLnN0b3JhZ2UpKSA9PT0gdW5kZWZpbmVkO1xuXHRcdFx0XHRvYnNlcnZlci5uZXh0KHtcblx0XHRcdFx0XHR0eXBlOiBDb250cm9sTWVzc2FnZS5TWU5DX0VOR0lORV9PVVRCT1hfU1RBVFVTLFxuXHRcdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRcdGlzRW1wdHk6IGhhc011dGF0aW9uc0luT3V0Ym94LFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGF3YWl0IHN0YXJ0UHJvbWlzZTtcblxuXHRcdFx0XHRvYnNlcnZlci5uZXh0KHtcblx0XHRcdFx0XHR0eXBlOiBDb250cm9sTWVzc2FnZS5TWU5DX0VOR0lORV9SRUFEWSxcblx0XHRcdFx0fSk7XG5cdFx0XHR9KSgpO1xuXG5cdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHRzdWJzY3JpcHRpb25zLmZvckVhY2goc3ViID0+IHN1Yi51bnN1YnNjcmliZSgpKTtcblx0XHRcdH07XG5cdFx0fSk7XG5cdH1cblxuXHRwcml2YXRlIGFzeW5jIGdldE1vZGVsc01ldGFkYXRhV2l0aE5leHRGdWxsU3luYyhcblx0XHRjdXJyZW50VGltZVN0YW1wOiBudW1iZXJcblx0KTogUHJvbWlzZTxNYXA8U2NoZW1hTW9kZWwsIFtzdHJpbmcsIG51bWJlcl0+PiB7XG5cdFx0Y29uc3QgbW9kZWxMYXN0U3luYzogTWFwPFNjaGVtYU1vZGVsLCBbc3RyaW5nLCBudW1iZXJdPiA9IG5ldyBNYXAoXG5cdFx0XHQoYXdhaXQgdGhpcy5nZXRNb2RlbHNNZXRhZGF0YSgpKS5tYXAoXG5cdFx0XHRcdCh7XG5cdFx0XHRcdFx0bmFtZXNwYWNlLFxuXHRcdFx0XHRcdG1vZGVsLFxuXHRcdFx0XHRcdGxhc3RTeW5jLFxuXHRcdFx0XHRcdGxhc3RGdWxsU3luYyxcblx0XHRcdFx0XHRmdWxsU3luY0ludGVydmFsLFxuXHRcdFx0XHRcdGxhc3RTeW5jUHJlZGljYXRlLFxuXHRcdFx0XHR9KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgbmV4dEZ1bGxTeW5jID0gbGFzdEZ1bGxTeW5jICsgZnVsbFN5bmNJbnRlcnZhbDtcblx0XHRcdFx0XHRjb25zdCBzeW5jRnJvbSA9XG5cdFx0XHRcdFx0XHQhbGFzdEZ1bGxTeW5jIHx8IG5leHRGdWxsU3luYyA8IGN1cnJlbnRUaW1lU3RhbXBcblx0XHRcdFx0XHRcdFx0PyAwIC8vIHBlcmZvcm0gZnVsbCBzeW5jIGlmIGV4cGlyZWRcblx0XHRcdFx0XHRcdFx0OiBsYXN0U3luYzsgLy8gcGVyZm9ybSBkZWx0YSBzeW5jXG5cblx0XHRcdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHRcdFx0dGhpcy5zY2hlbWEubmFtZXNwYWNlc1tuYW1lc3BhY2VdLm1vZGVsc1ttb2RlbF0sXG5cdFx0XHRcdFx0XHRbbmFtZXNwYWNlLCBzeW5jRnJvbV0sXG5cdFx0XHRcdFx0XTtcblx0XHRcdFx0fVxuXHRcdFx0KVxuXHRcdCk7XG5cblx0XHRyZXR1cm4gbW9kZWxMYXN0U3luYztcblx0fVxuXG5cdHByaXZhdGUgc3luY1F1ZXJpZXNPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8XG5cdFx0Q29udHJvbE1lc3NhZ2VUeXBlPENvbnRyb2xNZXNzYWdlPlxuXHQ+IHtcblx0XHRpZiAoIXRoaXMub25saW5lKSB7XG5cdFx0XHRyZXR1cm4gT2JzZXJ2YWJsZS5vZjxDb250cm9sTWVzc2FnZVR5cGU8Q29udHJvbE1lc3NhZ2U+PigpO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgT2JzZXJ2YWJsZTxDb250cm9sTWVzc2FnZVR5cGU8Q29udHJvbE1lc3NhZ2U+PihvYnNlcnZlciA9PiB7XG5cdFx0XHRsZXQgc3luY1F1ZXJpZXNTdWJzY3JpcHRpb246IFplbk9ic2VydmFibGUuU3Vic2NyaXB0aW9uO1xuXHRcdFx0bGV0IHdhaXRUaW1lb3V0SWQ6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+O1xuXG5cdFx0XHQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHR3aGlsZSAoIW9ic2VydmVyLmNsb3NlZCkge1xuXHRcdFx0XHRcdGNvbnN0IGNvdW50OiBXZWFrTWFwPFxuXHRcdFx0XHRcdFx0UGVyc2lzdGVudE1vZGVsQ29uc3RydWN0b3I8YW55Pixcblx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0bmV3OiBudW1iZXI7XG5cdFx0XHRcdFx0XHRcdHVwZGF0ZWQ6IG51bWJlcjtcblx0XHRcdFx0XHRcdFx0ZGVsZXRlZDogbnVtYmVyO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdD4gPSBuZXcgV2Vha01hcCgpO1xuXG5cdFx0XHRcdFx0Y29uc3QgbW9kZWxMYXN0U3luYyA9IGF3YWl0IHRoaXMuZ2V0TW9kZWxzTWV0YWRhdGFXaXRoTmV4dEZ1bGxTeW5jKFxuXHRcdFx0XHRcdFx0RGF0ZS5ub3coKVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0Y29uc3QgcGFnaW5hdGluZ01vZGVscyA9IG5ldyBTZXQobW9kZWxMYXN0U3luYy5rZXlzKCkpO1xuXG5cdFx0XHRcdFx0bGV0IG5ld2VzdEZ1bGxTeW5jU3RhcnRlZEF0OiBudW1iZXI7XG5cdFx0XHRcdFx0bGV0IHRoZUludGVydmFsOiBudW1iZXI7XG5cblx0XHRcdFx0XHRsZXQgc3RhcnQ6IG51bWJlcjtcblx0XHRcdFx0XHRsZXQgZHVyYXRpb246IG51bWJlcjtcblx0XHRcdFx0XHRsZXQgbmV3ZXN0U3RhcnRlZEF0OiBudW1iZXI7XG5cdFx0XHRcdFx0YXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG5cdFx0XHRcdFx0XHRzeW5jUXVlcmllc1N1YnNjcmlwdGlvbiA9IHRoaXMuc3luY1F1ZXJpZXNQcm9jZXNzb3Jcblx0XHRcdFx0XHRcdFx0LnN0YXJ0KG1vZGVsTGFzdFN5bmMpXG5cdFx0XHRcdFx0XHRcdC5zdWJzY3JpYmUoe1xuXHRcdFx0XHRcdFx0XHRcdG5leHQ6IGFzeW5jICh7XG5cdFx0XHRcdFx0XHRcdFx0XHRuYW1lc3BhY2UsXG5cdFx0XHRcdFx0XHRcdFx0XHRtb2RlbERlZmluaXRpb24sXG5cdFx0XHRcdFx0XHRcdFx0XHRpdGVtcyxcblx0XHRcdFx0XHRcdFx0XHRcdGRvbmUsXG5cdFx0XHRcdFx0XHRcdFx0XHRzdGFydGVkQXQsXG5cdFx0XHRcdFx0XHRcdFx0XHRpc0Z1bGxTeW5jLFxuXHRcdFx0XHRcdFx0XHRcdH0pID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IG1vZGVsQ29uc3RydWN0b3IgPSB0aGlzLnVzZXJNb2RlbENsYXNzZXNbXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1vZGVsRGVmaW5pdGlvbi5uYW1lXG5cdFx0XHRcdFx0XHRcdFx0XHRdIGFzIFBlcnNpc3RlbnRNb2RlbENvbnN0cnVjdG9yPGFueT47XG5cblx0XHRcdFx0XHRcdFx0XHRcdGlmICghY291bnQuaGFzKG1vZGVsQ29uc3RydWN0b3IpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvdW50LnNldChtb2RlbENvbnN0cnVjdG9yLCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bmV3OiAwLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHVwZGF0ZWQ6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVsZXRlZDogMCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0c3RhcnQgPSBnZXROb3coKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bmV3ZXN0U3RhcnRlZEF0ID1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRuZXdlc3RTdGFydGVkQXQgPT09IHVuZGVmaW5lZFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PyBzdGFydGVkQXRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDogTWF0aC5tYXgobmV3ZXN0U3RhcnRlZEF0LCBzdGFydGVkQXQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHQvKipcblx0XHRcdFx0XHRcdFx0XHRcdCAqIElmIHRoZXJlIGFyZSBtdXRhdGlvbnMgaW4gdGhlIG91dGJveCBmb3IgYSBnaXZlbiBpZCwgdGhvc2UgbmVlZCB0byBiZVxuXHRcdFx0XHRcdFx0XHRcdFx0ICogbWVyZ2VkIGluZGl2aWR1YWxseS4gT3RoZXJ3aXNlLCB3ZSBjYW4gbWVyZ2UgdGhlbSBpbiBiYXRjaGVzLlxuXHRcdFx0XHRcdFx0XHRcdFx0ICovXG5cdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnN0b3JhZ2UucnVuRXhjbHVzaXZlKGFzeW5jIHN0b3JhZ2UgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBpZHNJbk91dGJveCA9IGF3YWl0IHRoaXMub3V0Ym94LmdldE1vZGVsSWRzKHN0b3JhZ2UpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IG9uZUJ5T25lOiBNb2RlbEluc3RhbmNlTWV0YWRhdGFbXSA9IFtdO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBwYWdlID0gaXRlbXMuZmlsdGVyKGl0ZW0gPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmICghaWRzSW5PdXRib3guaGFzKGl0ZW0uaWQpKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvbmVCeU9uZS5wdXNoKGl0ZW0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc3Qgb3BUeXBlQ291bnQ6IFthbnksIE9wVHlwZV1bXSA9IFtdO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZvciAoY29uc3QgaXRlbSBvZiBvbmVCeU9uZSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IG9wVHlwZSA9IGF3YWl0IHRoaXMubW9kZWxNZXJnZXIubWVyZ2UoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdG9yYWdlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXRlbVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAob3BUeXBlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wVHlwZUNvdW50LnB1c2goW2l0ZW0sIG9wVHlwZV0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9wVHlwZUNvdW50LnB1c2goXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Li4uKGF3YWl0IHRoaXMubW9kZWxNZXJnZXIubWVyZ2VQYWdlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0c3RvcmFnZSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZGVsQ29uc3RydWN0b3IsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwYWdlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0KSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBjb3VudHMgPSBjb3VudC5nZXQobW9kZWxDb25zdHJ1Y3Rvcik7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0b3BUeXBlQ291bnQuZm9yRWFjaCgoWywgb3BUeXBlXSkgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN3aXRjaCAob3BUeXBlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXNlIE9wVHlwZS5JTlNFUlQ6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvdW50cy5uZXcrKztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjYXNlIE9wVHlwZS5VUERBVEU6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvdW50cy51cGRhdGVkKys7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FzZSBPcFR5cGUuREVMRVRFOlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb3VudHMuZGVsZXRlZCsrO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGV4aGF1c3RpdmVDaGVjayhvcFR5cGUpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKGRvbmUpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgeyBuYW1lOiBtb2RlbE5hbWUgfSA9IG1vZGVsRGVmaW5pdGlvbjtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyNyZWdpb24gdXBkYXRlIGxhc3Qgc3luYyBmb3IgdHlwZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsZXQgbW9kZWxNZXRhZGF0YSA9IGF3YWl0IHRoaXMuZ2V0TW9kZWxNZXRhZGF0YShcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRuYW1lc3BhY2UsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kZWxOYW1lXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0Y29uc3QgeyBsYXN0RnVsbFN5bmMsIGZ1bGxTeW5jSW50ZXJ2YWwgfSA9IG1vZGVsTWV0YWRhdGE7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhlSW50ZXJ2YWwgPSBmdWxsU3luY0ludGVydmFsO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG5ld2VzdEZ1bGxTeW5jU3RhcnRlZEF0ID1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRuZXdlc3RGdWxsU3luY1N0YXJ0ZWRBdCA9PT0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQ/IGxhc3RGdWxsU3luY1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0OiBNYXRoLm1heChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRuZXdlc3RGdWxsU3luY1N0YXJ0ZWRBdCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpc0Z1bGxTeW5jID8gc3RhcnRlZEF0IDogbGFzdEZ1bGxTeW5jXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgICk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0bW9kZWxNZXRhZGF0YSA9IChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLm1vZGVsQ2xhc3Nlc1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Lk1vZGVsTWV0YWRhdGEgYXMgUGVyc2lzdGVudE1vZGVsQ29uc3RydWN0b3I8YW55PlxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpLmNvcHlPZihtb2RlbE1ldGFkYXRhLCBkcmFmdCA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZHJhZnQubGFzdFN5bmMgPSBzdGFydGVkQXQ7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZHJhZnQubGFzdEZ1bGxTeW5jID0gaXNGdWxsU3luY1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0PyBzdGFydGVkQXRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdDogbW9kZWxNZXRhZGF0YS5sYXN0RnVsbFN5bmM7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGF3YWl0IHRoaXMuc3RvcmFnZS5zYXZlKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZGVsTWV0YWRhdGEsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dW5kZWZpbmVkLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG93blN5bWJvbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyNlbmRyZWdpb25cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBjb3VudHMgPSBjb3VudC5nZXQobW9kZWxDb25zdHJ1Y3Rvcik7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5tb2RlbFN5bmNlZFN0YXR1cy5zZXQobW9kZWxDb25zdHJ1Y3RvciwgdHJ1ZSk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0b2JzZXJ2ZXIubmV4dCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogQ29udHJvbE1lc3NhZ2UuU1lOQ19FTkdJTkVfTU9ERUxfU1lOQ0VELFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGE6IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZGVsOiBtb2RlbENvbnN0cnVjdG9yLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aXNGdWxsU3luYyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlzRGVsdGFTeW5jOiAhaXNGdWxsU3luYyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvdW50cyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwYWdpbmF0aW5nTW9kZWxzLmRlbGV0ZShtb2RlbERlZmluaXRpb24pO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChwYWdpbmF0aW5nTW9kZWxzLnNpemUgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkdXJhdGlvbiA9IGdldE5vdygpIC0gc3RhcnQ7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9ic2VydmVyLm5leHQoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dHlwZTogQ29udHJvbE1lc3NhZ2UuU1lOQ19FTkdJTkVfU1lOQ19RVUVSSUVTX1JFQURZLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN5bmNRdWVyaWVzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRvYnNlcnZlci5lcnJvcihlcnJvcik7XG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRcdG9ic2VydmVyLm5leHQoe1xuXHRcdFx0XHRcdFx0XHR0eXBlOiBDb250cm9sTWVzc2FnZS5TWU5DX0VOR0lORV9TWU5DX1FVRVJJRVNfU1RBUlRFRCxcblx0XHRcdFx0XHRcdFx0ZGF0YToge1xuXHRcdFx0XHRcdFx0XHRcdG1vZGVsczogQXJyYXkuZnJvbShwYWdpbmF0aW5nTW9kZWxzKS5tYXAoKHsgbmFtZSB9KSA9PiBuYW1lKSxcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Y29uc3QgbXNOZXh0RnVsbFN5bmMgPVxuXHRcdFx0XHRcdFx0bmV3ZXN0RnVsbFN5bmNTdGFydGVkQXQgK1xuXHRcdFx0XHRcdFx0dGhlSW50ZXJ2YWwgLVxuXHRcdFx0XHRcdFx0KG5ld2VzdFN0YXJ0ZWRBdCArIGR1cmF0aW9uKTtcblxuXHRcdFx0XHRcdGxvZ2dlci5kZWJ1Zyhcblx0XHRcdFx0XHRcdGBOZXh0IGZ1bGxTeW5jIGluICR7bXNOZXh0RnVsbFN5bmMgLyAxMDAwfSBzZWNvbmRzLiAoJHtuZXcgRGF0ZShcblx0XHRcdFx0XHRcdFx0RGF0ZS5ub3coKSArIG1zTmV4dEZ1bGxTeW5jXG5cdFx0XHRcdFx0XHQpfSlgXG5cdFx0XHRcdFx0KTtcblxuXHRcdFx0XHRcdGF3YWl0IG5ldyBQcm9taXNlKHJlcyA9PiB7XG5cdFx0XHRcdFx0XHR3YWl0VGltZW91dElkID0gc2V0VGltZW91dChyZXMsIG1zTmV4dEZ1bGxTeW5jKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSkoKTtcblxuXHRcdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdFx0aWYgKHN5bmNRdWVyaWVzU3Vic2NyaXB0aW9uKSB7XG5cdFx0XHRcdFx0c3luY1F1ZXJpZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh3YWl0VGltZW91dElkKSB7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KHdhaXRUaW1lb3V0SWQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9O1xuXHRcdH0pO1xuXHR9XG5cblx0cHJpdmF0ZSBkaXNjb25uZWN0aW9uSGFuZGxlcigpOiAobXNnOiBzdHJpbmcpID0+IHZvaWQge1xuXHRcdHJldHVybiAobXNnOiBzdHJpbmcpID0+IHtcblx0XHRcdC8vIFRoaXMgaW1wbGVtZW50YXRpb24gaXMgdGllZCB0byBBV1NBcHBTeW5jUmVhbFRpbWVQcm92aWRlciAnQ29ubmVjdGlvbiBjbG9zZWQnLCAnVGltZW91dCBkaXNjb25uZWN0JyBtc2dcblx0XHRcdGlmIChcblx0XHRcdFx0UFVCU1VCX0NPTlRST0xfTVNHLkNPTk5FQ1RJT05fQ0xPU0VEID09PSBtc2cgfHxcblx0XHRcdFx0UFVCU1VCX0NPTlRST0xfTVNHLlRJTUVPVVRfRElTQ09OTkVDVCA9PT0gbXNnXG5cdFx0XHQpIHtcblx0XHRcdFx0dGhpcy5kYXRhc3RvcmVDb25uZWN0aXZpdHkuc29ja2V0RGlzY29ubmVjdGVkKCk7XG5cdFx0XHR9XG5cdFx0fTtcblx0fVxuXG5cdHB1YmxpYyB1bnN1YnNjcmliZUNvbm5lY3Rpdml0eSgpIHtcblx0XHR0aGlzLmRhdGFzdG9yZUNvbm5lY3Rpdml0eS51bnN1YnNjcmliZSgpO1xuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyBzZXR1cE1vZGVscyhwYXJhbXM6IFN0YXJ0UGFyYW1zKSB7XG5cdFx0Y29uc3QgeyBmdWxsU3luY0ludGVydmFsIH0gPSBwYXJhbXM7XG5cdFx0Y29uc3QgTW9kZWxNZXRhZGF0YSA9IHRoaXMubW9kZWxDbGFzc2VzXG5cdFx0XHQuTW9kZWxNZXRhZGF0YSBhcyBQZXJzaXN0ZW50TW9kZWxDb25zdHJ1Y3RvcjxNb2RlbE1ldGFkYXRhPjtcblxuXHRcdGNvbnN0IG1vZGVsczogW3N0cmluZywgU2NoZW1hTW9kZWxdW10gPSBbXTtcblx0XHRsZXQgc2F2ZWRNb2RlbDtcblxuXHRcdE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWEubmFtZXNwYWNlcykuZm9yRWFjaChuYW1lc3BhY2UgPT4ge1xuXHRcdFx0T2JqZWN0LnZhbHVlcyhuYW1lc3BhY2UubW9kZWxzKVxuXHRcdFx0XHQuZmlsdGVyKCh7IHN5bmNhYmxlIH0pID0+IHN5bmNhYmxlKVxuXHRcdFx0XHQuZm9yRWFjaChtb2RlbCA9PiB7XG5cdFx0XHRcdFx0bW9kZWxzLnB1c2goW25hbWVzcGFjZS5uYW1lLCBtb2RlbF0pO1xuXHRcdFx0XHRcdGlmIChuYW1lc3BhY2UubmFtZSA9PT0gVVNFUikge1xuXHRcdFx0XHRcdFx0Y29uc3QgbW9kZWxDb25zdHJ1Y3RvciA9IHRoaXMudXNlck1vZGVsQ2xhc3Nlc1tcblx0XHRcdFx0XHRcdFx0bW9kZWwubmFtZVxuXHRcdFx0XHRcdFx0XSBhcyBQZXJzaXN0ZW50TW9kZWxDb25zdHJ1Y3Rvcjxhbnk+O1xuXHRcdFx0XHRcdFx0dGhpcy5tb2RlbFN5bmNlZFN0YXR1cy5zZXQobW9kZWxDb25zdHJ1Y3RvciwgZmFsc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0fSk7XG5cblx0XHRjb25zdCBwcm9taXNlcyA9IG1vZGVscy5tYXAoYXN5bmMgKFtuYW1lc3BhY2UsIG1vZGVsXSkgPT4ge1xuXHRcdFx0Y29uc3QgbW9kZWxNZXRhZGF0YSA9IGF3YWl0IHRoaXMuZ2V0TW9kZWxNZXRhZGF0YShuYW1lc3BhY2UsIG1vZGVsLm5hbWUpO1xuXHRcdFx0Y29uc3Qgc3luY1ByZWRpY2F0ZSA9IE1vZGVsUHJlZGljYXRlQ3JlYXRvci5nZXRQcmVkaWNhdGVzKFxuXHRcdFx0XHR0aGlzLnN5bmNQcmVkaWNhdGVzLmdldChtb2RlbCksXG5cdFx0XHRcdGZhbHNlXG5cdFx0XHQpO1xuXHRcdFx0Y29uc3QgbGFzdFN5bmNQcmVkaWNhdGUgPSBzeW5jUHJlZGljYXRlXG5cdFx0XHRcdD8gSlNPTi5zdHJpbmdpZnkoc3luY1ByZWRpY2F0ZSlcblx0XHRcdFx0OiBudWxsO1xuXG5cdFx0XHRpZiAobW9kZWxNZXRhZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFtbc2F2ZWRNb2RlbF1dID0gYXdhaXQgdGhpcy5zdG9yYWdlLnNhdmUoXG5cdFx0XHRcdFx0dGhpcy5tb2RlbEluc3RhbmNlQ3JlYXRvcihNb2RlbE1ldGFkYXRhLCB7XG5cdFx0XHRcdFx0XHRtb2RlbDogbW9kZWwubmFtZSxcblx0XHRcdFx0XHRcdG5hbWVzcGFjZSxcblx0XHRcdFx0XHRcdGxhc3RTeW5jOiBudWxsLFxuXHRcdFx0XHRcdFx0ZnVsbFN5bmNJbnRlcnZhbCxcblx0XHRcdFx0XHRcdGxhc3RGdWxsU3luYzogbnVsbCxcblx0XHRcdFx0XHRcdGxhc3RTeW5jUHJlZGljYXRlLFxuXHRcdFx0XHRcdH0pLFxuXHRcdFx0XHRcdHVuZGVmaW5lZCxcblx0XHRcdFx0XHRvd25TeW1ib2xcblx0XHRcdFx0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnN0IHByZXZTeW5jUHJlZGljYXRlID0gbW9kZWxNZXRhZGF0YS5sYXN0U3luY1ByZWRpY2F0ZVxuXHRcdFx0XHRcdD8gbW9kZWxNZXRhZGF0YS5sYXN0U3luY1ByZWRpY2F0ZVxuXHRcdFx0XHRcdDogbnVsbDtcblx0XHRcdFx0Y29uc3Qgc3luY1ByZWRpY2F0ZVVwZGF0ZWQgPSBwcmV2U3luY1ByZWRpY2F0ZSAhPT0gbGFzdFN5bmNQcmVkaWNhdGU7XG5cblx0XHRcdFx0W1tzYXZlZE1vZGVsXV0gPSBhd2FpdCB0aGlzLnN0b3JhZ2Uuc2F2ZShcblx0XHRcdFx0XHQoXG5cdFx0XHRcdFx0XHR0aGlzLm1vZGVsQ2xhc3Nlcy5Nb2RlbE1ldGFkYXRhIGFzIFBlcnNpc3RlbnRNb2RlbENvbnN0cnVjdG9yPGFueT5cblx0XHRcdFx0XHQpLmNvcHlPZihtb2RlbE1ldGFkYXRhLCBkcmFmdCA9PiB7XG5cdFx0XHRcdFx0XHRkcmFmdC5mdWxsU3luY0ludGVydmFsID0gZnVsbFN5bmNJbnRlcnZhbDtcblx0XHRcdFx0XHRcdC8vIHBlcmZvcm0gYSBiYXNlIHN5bmMgaWYgdGhlIHN5bmNQcmVkaWNhdGUgY2hhbmdlZCBpbiBiZXR3ZWVuIGNhbGxzIHRvIERhdGFTdG9yZS5zdGFydFxuXHRcdFx0XHRcdFx0Ly8gZW5zdXJlcyB0aGF0IHRoZSBsb2NhbCBzdG9yZSBjb250YWlucyBhbGwgdGhlIGRhdGEgc3BlY2lmaWVkIGJ5IHRoZSBzeW5jRXhwcmVzc2lvblxuXHRcdFx0XHRcdFx0aWYgKHN5bmNQcmVkaWNhdGVVcGRhdGVkKSB7XG5cdFx0XHRcdFx0XHRcdGRyYWZ0Lmxhc3RTeW5jID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0ZHJhZnQubGFzdEZ1bGxTeW5jID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0ZHJhZnQubGFzdFN5bmNQcmVkaWNhdGUgPSBsYXN0U3luY1ByZWRpY2F0ZTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHQpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gc2F2ZWRNb2RlbDtcblx0XHR9KTtcblxuXHRcdGNvbnN0IHJlc3VsdDogUmVjb3JkPHN0cmluZywgTW9kZWxNZXRhZGF0YT4gPSB7fTtcblx0XHRmb3IgKGNvbnN0IG1vZGVsTWV0YWRhdGEgb2YgYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpKSB7XG5cdFx0XHRjb25zdCB7IG1vZGVsOiBtb2RlbE5hbWUgfSA9IG1vZGVsTWV0YWRhdGE7XG5cblx0XHRcdHJlc3VsdFttb2RlbE5hbWVdID0gbW9kZWxNZXRhZGF0YTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmVzdWx0O1xuXHR9XG5cblx0cHJpdmF0ZSBhc3luYyBnZXRNb2RlbHNNZXRhZGF0YSgpOiBQcm9taXNlPE1vZGVsTWV0YWRhdGFbXT4ge1xuXHRcdGNvbnN0IE1vZGVsTWV0YWRhdGEgPSB0aGlzLm1vZGVsQ2xhc3Nlc1xuXHRcdFx0Lk1vZGVsTWV0YWRhdGEgYXMgUGVyc2lzdGVudE1vZGVsQ29uc3RydWN0b3I8TW9kZWxNZXRhZGF0YT47XG5cblx0XHRjb25zdCBtb2RlbHNNZXRhZGF0YSA9IGF3YWl0IHRoaXMuc3RvcmFnZS5xdWVyeShNb2RlbE1ldGFkYXRhKTtcblxuXHRcdHJldHVybiBtb2RlbHNNZXRhZGF0YTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgZ2V0TW9kZWxNZXRhZGF0YShcblx0XHRuYW1lc3BhY2U6IHN0cmluZyxcblx0XHRtb2RlbDogc3RyaW5nXG5cdCk6IFByb21pc2U8TW9kZWxNZXRhZGF0YT4ge1xuXHRcdGNvbnN0IE1vZGVsTWV0YWRhdGEgPSB0aGlzLm1vZGVsQ2xhc3Nlc1xuXHRcdFx0Lk1vZGVsTWV0YWRhdGEgYXMgUGVyc2lzdGVudE1vZGVsQ29uc3RydWN0b3I8TW9kZWxNZXRhZGF0YT47XG5cblx0XHRjb25zdCBwcmVkaWNhdGUgPSBNb2RlbFByZWRpY2F0ZUNyZWF0b3IuY3JlYXRlRnJvbUV4aXN0aW5nPE1vZGVsTWV0YWRhdGE+KFxuXHRcdFx0dGhpcy5zY2hlbWEubmFtZXNwYWNlc1tTWU5DXS5tb2RlbHNbTW9kZWxNZXRhZGF0YS5uYW1lXSxcblx0XHRcdGMgPT4gYy5uYW1lc3BhY2UoJ2VxJywgbmFtZXNwYWNlKS5tb2RlbCgnZXEnLCBtb2RlbClcblx0XHQpO1xuXG5cdFx0Y29uc3QgW21vZGVsTWV0YWRhdGFdID0gYXdhaXQgdGhpcy5zdG9yYWdlLnF1ZXJ5KE1vZGVsTWV0YWRhdGEsIHByZWRpY2F0ZSwge1xuXHRcdFx0cGFnZTogMCxcblx0XHRcdGxpbWl0OiAxLFxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIG1vZGVsTWV0YWRhdGE7XG5cdH1cblxuXHRwcml2YXRlIGdldE1vZGVsRGVmaW5pdGlvbihcblx0XHRtb2RlbENvbnN0cnVjdG9yOiBQZXJzaXN0ZW50TW9kZWxDb25zdHJ1Y3Rvcjxhbnk+XG5cdCk6IFNjaGVtYU1vZGVsIHtcblx0XHRjb25zdCBuYW1lc3BhY2VOYW1lID0gdGhpcy5uYW1lc3BhY2VSZXNvbHZlcihtb2RlbENvbnN0cnVjdG9yKTtcblxuXHRcdGNvbnN0IG1vZGVsRGVmaW5pdGlvbiA9XG5cdFx0XHR0aGlzLnNjaGVtYS5uYW1lc3BhY2VzW25hbWVzcGFjZU5hbWVdLm1vZGVsc1ttb2RlbENvbnN0cnVjdG9yLm5hbWVdO1xuXG5cdFx0cmV0dXJuIG1vZGVsRGVmaW5pdGlvbjtcblx0fVxuXG5cdHN0YXRpYyBnZXROYW1lc3BhY2UoKSB7XG5cdFx0Y29uc3QgbmFtZXNwYWNlOiBTY2hlbWFOYW1lc3BhY2UgPSB7XG5cdFx0XHRuYW1lOiBTWU5DLFxuXHRcdFx0cmVsYXRpb25zaGlwczoge30sXG5cdFx0XHRlbnVtczoge1xuXHRcdFx0XHRPcGVyYXRpb25UeXBlOiB7XG5cdFx0XHRcdFx0bmFtZTogJ09wZXJhdGlvblR5cGUnLFxuXHRcdFx0XHRcdHZhbHVlczogWydDUkVBVEUnLCAnVVBEQVRFJywgJ0RFTEVURSddLFxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHRcdG5vbk1vZGVsczoge30sXG5cdFx0XHRtb2RlbHM6IHtcblx0XHRcdFx0TXV0YXRpb25FdmVudDoge1xuXHRcdFx0XHRcdG5hbWU6ICdNdXRhdGlvbkV2ZW50Jyxcblx0XHRcdFx0XHRwbHVyYWxOYW1lOiAnTXV0YXRpb25FdmVudHMnLFxuXHRcdFx0XHRcdHN5bmNhYmxlOiBmYWxzZSxcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdGlkOiB7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdpZCcsXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICdJRCcsXG5cdFx0XHRcdFx0XHRcdGlzUmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGlzQXJyYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdG1vZGVsOiB7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdtb2RlbCcsXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdFx0XHRpc1JlcXVpcmVkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRpc0FycmF5OiBmYWxzZSxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRkYXRhOiB7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdkYXRhJyxcblx0XHRcdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0XHRcdGlzUmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGlzQXJyYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdG1vZGVsSWQ6IHtcblx0XHRcdFx0XHRcdFx0bmFtZTogJ21vZGVsSWQnLFxuXHRcdFx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRcdFx0aXNSZXF1aXJlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0aXNBcnJheTogZmFsc2UsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0b3BlcmF0aW9uOiB7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdvcGVyYXRpb24nLFxuXHRcdFx0XHRcdFx0XHR0eXBlOiB7XG5cdFx0XHRcdFx0XHRcdFx0ZW51bTogJ09wZXJhdGlvbnR5cGUnLFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRpc0FycmF5OiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0aXNSZXF1aXJlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRjb25kaXRpb246IHtcblx0XHRcdFx0XHRcdFx0bmFtZTogJ2NvbmRpdGlvbicsXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdFx0XHRpc0FycmF5OiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0aXNSZXF1aXJlZDogdHJ1ZSxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0fSxcblx0XHRcdFx0TW9kZWxNZXRhZGF0YToge1xuXHRcdFx0XHRcdG5hbWU6ICdNb2RlbE1ldGFkYXRhJyxcblx0XHRcdFx0XHRwbHVyYWxOYW1lOiAnTW9kZWxzTWV0YWRhdGEnLFxuXHRcdFx0XHRcdHN5bmNhYmxlOiBmYWxzZSxcblx0XHRcdFx0XHRmaWVsZHM6IHtcblx0XHRcdFx0XHRcdGlkOiB7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdpZCcsXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICdJRCcsXG5cdFx0XHRcdFx0XHRcdGlzUmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGlzQXJyYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdG5hbWVzcGFjZToge1xuXHRcdFx0XHRcdFx0XHRuYW1lOiAnbmFtZXNwYWNlJyxcblx0XHRcdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0XHRcdGlzUmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGlzQXJyYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdG1vZGVsOiB7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdtb2RlbCcsXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdFx0XHRpc1JlcXVpcmVkOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRpc0FycmF5OiBmYWxzZSxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRsYXN0U3luYzoge1xuXHRcdFx0XHRcdFx0XHRuYW1lOiAnbGFzdFN5bmMnLFxuXHRcdFx0XHRcdFx0XHR0eXBlOiAnSW50Jyxcblx0XHRcdFx0XHRcdFx0aXNSZXF1aXJlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdGlzQXJyYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxhc3RGdWxsU3luYzoge1xuXHRcdFx0XHRcdFx0XHRuYW1lOiAnbGFzdEZ1bGxTeW5jJyxcblx0XHRcdFx0XHRcdFx0dHlwZTogJ0ludCcsXG5cdFx0XHRcdFx0XHRcdGlzUmVxdWlyZWQ6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRpc0FycmF5OiBmYWxzZSxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRmdWxsU3luY0ludGVydmFsOiB7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdmdWxsU3luY0ludGVydmFsJyxcblx0XHRcdFx0XHRcdFx0dHlwZTogJ0ludCcsXG5cdFx0XHRcdFx0XHRcdGlzUmVxdWlyZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGlzQXJyYXk6IGZhbHNlLFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGxhc3RTeW5jUHJlZGljYXRlOiB7XG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdsYXN0U3luY1ByZWRpY2F0ZScsXG5cdFx0XHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdFx0XHRpc1JlcXVpcmVkOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0aXNBcnJheTogZmFsc2UsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHR9LFxuXHRcdH07XG5cdFx0cmV0dXJuIG5hbWVzcGFjZTtcblx0fVxufVxuIl19
