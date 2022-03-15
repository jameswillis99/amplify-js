var __assign =
	(this && this.__assign) ||
	function () {
		__assign =
			Object.assign ||
			function (t) {
				for (var s, i = 1, n = arguments.length; i < n; i++) {
					s = arguments[i];
					for (var p in s)
						if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
				}
				return t;
			};
		return __assign.apply(this, arguments);
	};
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
var __spread =
	(this && this.__spread) ||
	function () {
		for (var ar = [], i = 0; i < arguments.length; i++)
			ar = ar.concat(__read(arguments[i]));
		return ar;
	};
import API, { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import Auth from '@aws-amplify/auth';
import Cache from '@aws-amplify/cache';
import { ConsoleLogger as Logger, Hub } from '@aws-amplify/core';
import { CONTROL_MSG as PUBSUB_CONTROL_MSG } from '@aws-amplify/pubsub';
import Observable from 'zen-observable-ts';
import {
	buildSubscriptionGraphQLOperation,
	getAuthorizationRules,
	getModelAuthModes,
	getUserGroupsFromToken,
	TransformerMutationType,
	getTokenForCustomAuth,
} from '../utils';
import { ModelPredicateCreator } from '../../predicates';
import { validatePredicate } from '../../util';
var logger = new Logger('DataStore');
export var CONTROL_MSG;
(function (CONTROL_MSG) {
	CONTROL_MSG['CONNECTED'] = 'CONNECTED';
})(CONTROL_MSG || (CONTROL_MSG = {}));
export var USER_CREDENTIALS;
(function (USER_CREDENTIALS) {
	USER_CREDENTIALS[(USER_CREDENTIALS['none'] = 0)] = 'none';
	USER_CREDENTIALS[(USER_CREDENTIALS['unauth'] = 1)] = 'unauth';
	USER_CREDENTIALS[(USER_CREDENTIALS['auth'] = 2)] = 'auth';
})(USER_CREDENTIALS || (USER_CREDENTIALS = {}));
var SubscriptionProcessor = /** @class */ (function () {
	function SubscriptionProcessor(
		schema,
		syncPredicates,
		amplifyConfig,
		authModeStrategy
	) {
		if (amplifyConfig === void 0) {
			amplifyConfig = {};
		}
		this.schema = schema;
		this.syncPredicates = syncPredicates;
		this.amplifyConfig = amplifyConfig;
		this.authModeStrategy = authModeStrategy;
		this.typeQuery = new WeakMap();
		this.buffer = [];
	}
	SubscriptionProcessor.prototype.buildSubscription = function (
		namespace,
		model,
		transformerMutationType,
		userCredentials,
		cognitoTokenPayload,
		oidcTokenPayload,
		authMode
	) {
		var aws_appsync_authenticationType =
			this.amplifyConfig.aws_appsync_authenticationType;
		var _a =
				this.getAuthorizationInfo(
					model,
					userCredentials,
					aws_appsync_authenticationType,
					cognitoTokenPayload,
					oidcTokenPayload,
					authMode
				) || {},
			isOwner = _a.isOwner,
			ownerField = _a.ownerField,
			ownerValue = _a.ownerValue;
		var _b = __read(
				buildSubscriptionGraphQLOperation(
					namespace,
					model,
					transformerMutationType,
					isOwner,
					ownerField
				),
				3
			),
			opType = _b[0],
			opName = _b[1],
			query = _b[2];
		return {
			authMode: authMode,
			opType: opType,
			opName: opName,
			query: query,
			isOwner: isOwner,
			ownerField: ownerField,
			ownerValue: ownerValue,
		};
	};
	SubscriptionProcessor.prototype.getAuthorizationInfo = function (
		model,
		userCredentials,
		defaultAuthType,
		cognitoTokenPayload,
		oidcTokenPayload,
		authMode
	) {
		if (cognitoTokenPayload === void 0) {
			cognitoTokenPayload = {};
		}
		if (oidcTokenPayload === void 0) {
			oidcTokenPayload = {};
		}
		var rules = getAuthorizationRules(model);
		// Return null if user doesn't have proper credentials for private API with IAM auth
		var iamPrivateAuth =
			authMode === GRAPHQL_AUTH_MODE.AWS_IAM &&
			rules.find(function (rule) {
				return rule.authStrategy === 'private' && rule.provider === 'iam';
			});
		if (iamPrivateAuth && userCredentials === USER_CREDENTIALS.unauth) {
			return null;
		}
		// Group auth should take precedence over owner auth, so we are checking
		// if rule(s) have group authorization as well as if either the Cognito or
		// OIDC token has a groupClaim. If so, we are returning auth info before
		// any further owner-based auth checks.
		var groupAuthRules = rules.filter(function (rule) {
			return (
				rule.authStrategy === 'groups' &&
				['userPools', 'oidc'].includes(rule.provider)
			);
		});
		var validGroup =
			(authMode === GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS ||
				authMode === GRAPHQL_AUTH_MODE.OPENID_CONNECT) &&
			groupAuthRules.find(function (groupAuthRule) {
				// validate token against groupClaim
				var cognitoUserGroups = getUserGroupsFromToken(
					cognitoTokenPayload,
					groupAuthRule
				);
				var oidcUserGroups = getUserGroupsFromToken(
					oidcTokenPayload,
					groupAuthRule
				);
				return __spread(cognitoUserGroups, oidcUserGroups).find(function (
					userGroup
				) {
					return groupAuthRule.groups.find(function (group) {
						return group === userGroup;
					});
				});
			});
		if (validGroup) {
			return {
				authMode: authMode,
				isOwner: false,
			};
		}
		// Owner auth needs additional values to be returned in order to create the subscription with
		// the correct parameters so we are getting the owner value from the Cognito token via the
		// identityClaim from the auth rule.
		var cognitoOwnerAuthRules =
			authMode === GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
				? rules.filter(function (rule) {
						return (
							rule.authStrategy === 'owner' && rule.provider === 'userPools'
						);
				  })
				: [];
		var ownerAuthInfo;
		cognitoOwnerAuthRules.forEach(function (ownerAuthRule) {
			var ownerValue = cognitoTokenPayload[ownerAuthRule.identityClaim];
			if (ownerValue) {
				ownerAuthInfo = {
					authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
					isOwner: ownerAuthRule.areSubscriptionsPublic ? false : true,
					ownerField: ownerAuthRule.ownerField,
					ownerValue: ownerValue,
				};
			}
		});
		if (ownerAuthInfo) {
			return ownerAuthInfo;
		}
		// Owner auth needs additional values to be returned in order to create the subscription with
		// the correct parameters so we are getting the owner value from the OIDC token via the
		// identityClaim from the auth rule.
		var oidcOwnerAuthRules =
			authMode === GRAPHQL_AUTH_MODE.OPENID_CONNECT
				? rules.filter(function (rule) {
						return rule.authStrategy === 'owner' && rule.provider === 'oidc';
				  })
				: [];
		oidcOwnerAuthRules.forEach(function (ownerAuthRule) {
			var ownerValue = oidcTokenPayload[ownerAuthRule.identityClaim];
			if (ownerValue) {
				ownerAuthInfo = {
					authMode: GRAPHQL_AUTH_MODE.OPENID_CONNECT,
					isOwner: ownerAuthRule.areSubscriptionsPublic ? false : true,
					ownerField: ownerAuthRule.ownerField,
					ownerValue: ownerValue,
				};
			}
		});
		if (ownerAuthInfo) {
			return ownerAuthInfo;
		}
		// Fallback: return authMode or default auth type
		return {
			authMode: authMode || defaultAuthType,
			isOwner: false,
		};
	};
	SubscriptionProcessor.prototype.hubQueryCompletionListener = function (
		completed,
		capsule
	) {
		var event = capsule.payload.event;
		if (event === PUBSUB_CONTROL_MSG.SUBSCRIPTION_ACK) {
			completed();
		}
	};
	SubscriptionProcessor.prototype.start = function () {
		var _this = this;
		var ctlObservable = new Observable(function (observer) {
			var promises = [];
			// Creating subs for each model/operation combo so they can be unsubscribed
			// independently, since the auth retry behavior is asynchronous.
			var subscriptions = {};
			var cognitoTokenPayload, oidcTokenPayload;
			var userCredentials = USER_CREDENTIALS.none;
			(function () {
				return __awaiter(_this, void 0, void 0, function () {
					var credentials,
						err_1,
						session,
						err_2,
						_a,
						aws_cognito_region,
						AuthConfig,
						token,
						federatedInfo,
						currentUser,
						payload,
						err_3;
					var _this = this;
					return __generator(this, function (_b) {
						switch (_b.label) {
							case 0:
								_b.trys.push([0, 2, , 3]);
								return [4 /*yield*/, Auth.currentCredentials()];
							case 1:
								credentials = _b.sent();
								userCredentials = credentials.authenticated
									? USER_CREDENTIALS.auth
									: USER_CREDENTIALS.unauth;
								return [3 /*break*/, 3];
							case 2:
								err_1 = _b.sent();
								return [3 /*break*/, 3];
							case 3:
								_b.trys.push([3, 5, , 6]);
								return [4 /*yield*/, Auth.currentSession()];
							case 4:
								session = _b.sent();
								cognitoTokenPayload = session.getIdToken().decodePayload();
								return [3 /*break*/, 6];
							case 5:
								err_2 = _b.sent();
								return [3 /*break*/, 6];
							case 6:
								_b.trys.push([6, 11, , 12]);
								(_a = this.amplifyConfig),
									(aws_cognito_region = _a.aws_cognito_region),
									(AuthConfig = _a.Auth);
								if (!aws_cognito_region || (AuthConfig && !AuthConfig.region)) {
									throw 'Auth is not configured';
								}
								token = void 0;
								return [4 /*yield*/, Cache.getItem('federatedInfo')];
							case 7:
								federatedInfo = _b.sent();
								if (!federatedInfo) return [3 /*break*/, 8];
								token = federatedInfo.token;
								return [3 /*break*/, 10];
							case 8:
								return [4 /*yield*/, Auth.currentAuthenticatedUser()];
							case 9:
								currentUser = _b.sent();
								if (currentUser) {
									token = currentUser.token;
								}
								_b.label = 10;
							case 10:
								if (token) {
									payload = token.split('.')[1];
									oidcTokenPayload = JSON.parse(
										Buffer.from(payload, 'base64').toString('utf8')
									);
								}
								return [3 /*break*/, 12];
							case 11:
								err_3 = _b.sent();
								logger.debug('error getting OIDC JWT', err_3);
								return [3 /*break*/, 12];
							case 12:
								Object.values(this.schema.namespaces).forEach(function (
									namespace
								) {
									Object.values(namespace.models)
										.filter(function (_a) {
											var syncable = _a.syncable;
											return syncable;
										})
										.forEach(function (modelDefinition) {
											return __awaiter(_this, void 0, void 0, function () {
												var modelAuthModes,
													readAuthModes,
													operations,
													operationAuthModeAttempts,
													authModeRetry;
												var _a, _b, _c;
												var _this = this;
												return __generator(this, function (_d) {
													switch (_d.label) {
														case 0:
															return [
																4 /*yield*/,
																getModelAuthModes({
																	authModeStrategy: this.authModeStrategy,
																	defaultAuthMode:
																		this.amplifyConfig
																			.aws_appsync_authenticationType,
																	modelName: modelDefinition.name,
																	schema: this.schema,
																}),
															];
														case 1:
															modelAuthModes = _d.sent();
															readAuthModes = modelAuthModes.READ;
															subscriptions = __assign(
																__assign({}, subscriptions),
																((_a = {}),
																(_a[modelDefinition.name] =
																	((_b = {}),
																	(_b[TransformerMutationType.CREATE] = []),
																	(_b[TransformerMutationType.UPDATE] = []),
																	(_b[TransformerMutationType.DELETE] = []),
																	_b)),
																_a)
															);
															operations = [
																TransformerMutationType.CREATE,
																TransformerMutationType.UPDATE,
																TransformerMutationType.DELETE,
															];
															operationAuthModeAttempts =
																((_c = {}),
																(_c[TransformerMutationType.CREATE] = 0),
																(_c[TransformerMutationType.UPDATE] = 0),
																(_c[TransformerMutationType.DELETE] = 0),
																_c);
															authModeRetry = function (operation) {
																return __awaiter(
																	_this,
																	void 0,
																	void 0,
																	function () {
																		var _a,
																			transformerMutationType,
																			opName,
																			query,
																			isOwner,
																			ownerField,
																			ownerValue,
																			authMode,
																			authToken,
																			variables,
																			queryObservable,
																			subscriptionReadyCallback;
																		var _this = this;
																		return __generator(this, function (_b) {
																			switch (_b.label) {
																				case 0:
																					(_a = this.buildSubscription(
																						namespace,
																						modelDefinition,
																						operation,
																						userCredentials,
																						cognitoTokenPayload,
																						oidcTokenPayload,
																						readAuthModes[
																							operationAuthModeAttempts[
																								operation
																							]
																						]
																					)),
																						(transformerMutationType =
																							_a.opType),
																						(opName = _a.opName),
																						(query = _a.query),
																						(isOwner = _a.isOwner),
																						(ownerField = _a.ownerField),
																						(ownerValue = _a.ownerValue),
																						(authMode = _a.authMode);
																					return [
																						4 /*yield*/,
																						getTokenForCustomAuth(
																							authMode,
																							this.amplifyConfig
																						),
																					];
																				case 1:
																					authToken = _b.sent();
																					variables = {};
																					if (isOwner) {
																						if (!ownerValue) {
																							observer.error(
																								'Owner field required, sign in is needed in order to perform this operation'
																							);
																							return [2 /*return*/];
																						}
																						variables[ownerField] = ownerValue;
																					}
																					logger.debug(
																						'Attempting ' +
																							operation +
																							' subscription with authMode: ' +
																							readAuthModes[
																								operationAuthModeAttempts[
																									operation
																								]
																							]
																					);
																					queryObservable = API.graphql(
																						__assign(
																							__assign(
																								{
																									query: query,
																									variables: variables,
																								},
																								{ authMode: authMode }
																							),
																							{ authToken: authToken }
																						)
																					);
																					subscriptions[modelDefinition.name][
																						transformerMutationType
																					].push(
																						queryObservable
																							.map(function (_a) {
																								var value = _a.value;
																								return value;
																							})
																							.subscribe({
																								next: function (_a) {
																									var data = _a.data,
																										errors = _a.errors;
																									if (
																										Array.isArray(errors) &&
																										errors.length > 0
																									) {
																										var messages = errors.map(
																											function (_a) {
																												var message =
																													_a.message;
																												return message;
																											}
																										);
																										logger.warn(
																											'Skipping incoming subscription. Messages: ' +
																												messages.join('\n')
																										);
																										_this.drainBuffer();
																										return;
																									}
																									var predicatesGroup =
																										ModelPredicateCreator.getPredicates(
																											_this.syncPredicates.get(
																												modelDefinition
																											),
																											false
																										);
																									var _b = data,
																										_c = opName,
																										record = _b[_c];
																									// checking incoming subscription against syncPredicate.
																									// once AppSync implements filters on subscriptions, we'll be
																									// able to set these when establishing the subscription instead.
																									// Until then, we'll need to filter inbound
																									if (
																										_this.passesPredicateValidation(
																											record,
																											predicatesGroup
																										)
																									) {
																										_this.pushToBuffer(
																											transformerMutationType,
																											modelDefinition,
																											record
																										);
																									}
																									_this.drainBuffer();
																								},
																								error: function (
																									subscriptionError
																								) {
																									var _a =
																											subscriptionError.error,
																										_b = __read(
																											(_a === void 0
																												? {
																														errors: [],
																												  }
																												: _a
																											).errors,
																											1
																										),
																										_c = _b[0],
																										_d = (
																											_c === void 0 ? {} : _c
																										).message,
																										message =
																											_d === void 0 ? '' : _d;
																									if (
																										message.includes(
																											PUBSUB_CONTROL_MSG.REALTIME_SUBSCRIPTION_INIT_ERROR
																										) ||
																										message.includes(
																											PUBSUB_CONTROL_MSG.CONNECTION_FAILED
																										)
																									) {
																										// Unsubscribe and clear subscription array for model/operation
																										subscriptions[
																											modelDefinition.name
																										][
																											transformerMutationType
																										].forEach(function (
																											subscription
																										) {
																											return subscription.unsubscribe();
																										});
																										subscriptions[
																											modelDefinition.name
																										][transformerMutationType] =
																											[];
																										operationAuthModeAttempts[
																											operation
																										]++;
																										if (
																											operationAuthModeAttempts[
																												operation
																											] >= readAuthModes.length
																										) {
																											logger.debug(
																												operation +
																													' subscription failed with authMode: ' +
																													readAuthModes[
																														operationAuthModeAttempts[
																															operation
																														] - 1
																													]
																											);
																											logger.warn(
																												'subscriptionError',
																												message
																											);
																											return;
																										} else {
																											logger.debug(
																												operation +
																													' subscription failed with authMode: ' +
																													readAuthModes[
																														operationAuthModeAttempts[
																															operation
																														] - 1
																													] +
																													'. Retrying with authMode: ' +
																													readAuthModes[
																														operationAuthModeAttempts[
																															operation
																														]
																													]
																											);
																											authModeRetry(operation);
																											return;
																										}
																									}
																									logger.warn(
																										'subscriptionError',
																										message
																									);
																									if (
																										typeof subscriptionReadyCallback ===
																										'function'
																									) {
																										subscriptionReadyCallback();
																									}
																									if (
																										message.includes(
																											'"errorType":"Unauthorized"'
																										) ||
																										message.includes(
																											'"errorType":"OperationDisabled"'
																										)
																									) {
																										return;
																									}
																									observer.error(message);
																								},
																							})
																					);
																					promises.push(
																						(function () {
																							return __awaiter(
																								_this,
																								void 0,
																								void 0,
																								function () {
																									var boundFunction;
																									var _this = this;
																									return __generator(
																										this,
																										function (_a) {
																											switch (_a.label) {
																												case 0:
																													return [
																														4 /*yield*/,
																														new Promise(
																															function (res) {
																																subscriptionReadyCallback =
																																	res;
																																boundFunction =
																																	_this.hubQueryCompletionListener.bind(
																																		_this,
																																		res
																																	);
																																Hub.listen(
																																	'api',
																																	boundFunction
																																);
																															}
																														),
																													];
																												case 1:
																													_a.sent();
																													Hub.remove(
																														'api',
																														boundFunction
																													);
																													return [2 /*return*/];
																											}
																										}
																									);
																								}
																							);
																						})()
																					);
																					return [2 /*return*/];
																			}
																		});
																	}
																);
															};
															operations.forEach(function (op) {
																return authModeRetry(op);
															});
															return [2 /*return*/];
													}
												});
											});
										});
								});
								Promise.all(promises).then(function () {
									return observer.next(CONTROL_MSG.CONNECTED);
								});
								return [2 /*return*/];
						}
					});
				});
			})();
			return function () {
				Object.keys(subscriptions).forEach(function (modelName) {
					subscriptions[modelName][TransformerMutationType.CREATE].forEach(
						function (subscription) {
							return subscription.unsubscribe();
						}
					);
					subscriptions[modelName][TransformerMutationType.UPDATE].forEach(
						function (subscription) {
							return subscription.unsubscribe();
						}
					);
					subscriptions[modelName][TransformerMutationType.DELETE].forEach(
						function (subscription) {
							return subscription.unsubscribe();
						}
					);
				});
			};
		});
		var dataObservable = new Observable(function (observer) {
			_this.dataObserver = observer;
			_this.drainBuffer();
			return function () {
				_this.dataObserver = null;
			};
		});
		return [ctlObservable, dataObservable];
	};
	SubscriptionProcessor.prototype.passesPredicateValidation = function (
		record,
		predicatesGroup
	) {
		if (!predicatesGroup) {
			return true;
		}
		var predicates = predicatesGroup.predicates,
			type = predicatesGroup.type;
		return validatePredicate(record, type, predicates);
	};
	SubscriptionProcessor.prototype.pushToBuffer = function (
		transformerMutationType,
		modelDefinition,
		data
	) {
		this.buffer.push([transformerMutationType, modelDefinition, data]);
	};
	SubscriptionProcessor.prototype.drainBuffer = function () {
		var _this = this;
		if (this.dataObserver) {
			this.buffer.forEach(function (data) {
				return _this.dataObserver.next(data);
			});
			this.buffer = [];
		}
	};
	return SubscriptionProcessor;
})();
export { SubscriptionProcessor };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3N5bmMvcHJvY2Vzc29ycy9zdWJzY3JpcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLE9BQU8sR0FBRyxFQUFFLEVBQWlCLGlCQUFpQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekUsT0FBTyxJQUFJLE1BQU0sbUJBQW1CLENBQUM7QUFDckMsT0FBTyxLQUFLLE1BQU0sb0JBQW9CLENBQUM7QUFDdkMsT0FBTyxFQUFFLGFBQWEsSUFBSSxNQUFNLEVBQUUsR0FBRyxFQUFjLE1BQU0sbUJBQW1CLENBQUM7QUFDN0UsT0FBTyxFQUFFLFdBQVcsSUFBSSxrQkFBa0IsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3hFLE9BQU8sVUFBNkIsTUFBTSxtQkFBbUIsQ0FBQztBQVU5RCxPQUFPLEVBQ04saUNBQWlDLEVBQ2pDLHFCQUFxQixFQUNyQixpQkFBaUIsRUFDakIsc0JBQXNCLEVBQ3RCLHVCQUF1QixFQUN2QixxQkFBcUIsR0FDckIsTUFBTSxVQUFVLENBQUM7QUFDbEIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDekQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRS9DLElBQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRXZDLE1BQU0sQ0FBTixJQUFZLFdBRVg7QUFGRCxXQUFZLFdBQVc7SUFDdEIsc0NBQXVCLENBQUE7QUFDeEIsQ0FBQyxFQUZXLFdBQVcsS0FBWCxXQUFXLFFBRXRCO0FBRUQsTUFBTSxDQUFOLElBQVksZ0JBSVg7QUFKRCxXQUFZLGdCQUFnQjtJQUMzQix1REFBTSxDQUFBO0lBQ04sMkRBQVEsQ0FBQTtJQUNSLHVEQUFNLENBQUE7QUFDUCxDQUFDLEVBSlcsZ0JBQWdCLEtBQWhCLGdCQUFnQixRQUkzQjtBQVNEO0lBWUMsK0JBQ2tCLE1BQXNCLEVBQ3RCLGNBQXlELEVBQ3pELGFBQXVDLEVBQ3ZDLGdCQUFrQztRQURsQyw4QkFBQSxFQUFBLGtCQUF1QztRQUZ2QyxXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUN0QixtQkFBYyxHQUFkLGNBQWMsQ0FBMkM7UUFDekQsa0JBQWEsR0FBYixhQUFhLENBQTBCO1FBQ3ZDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFmbkMsY0FBUyxHQUFHLElBQUksT0FBTyxFQUdyQyxDQUFDO1FBQ0ksV0FBTSxHQUlSLEVBQUUsQ0FBQztJQVFOLENBQUM7SUFFSSxpREFBaUIsR0FBekIsVUFDQyxTQUEwQixFQUMxQixLQUFrQixFQUNsQix1QkFBZ0QsRUFDaEQsZUFBaUMsRUFDakMsbUJBQXlELEVBQ3pELGdCQUFzRCxFQUN0RCxRQUEyQjtRQVVuQixJQUFBLGtGQUE4QixDQUF3QjtRQUN4RCxJQUFBLDZJQVFFLEVBUkEsb0JBQU8sRUFBRSwwQkFBVSxFQUFFLDBCQVFyQixDQUFDO1FBRUgsSUFBQSxpSEFNTCxFQU5NLGNBQU0sRUFBRSxjQUFNLEVBQUUsYUFNdEIsQ0FBQztRQUNGLE9BQU8sRUFBRSxRQUFRLFVBQUEsRUFBRSxNQUFNLFFBQUEsRUFBRSxNQUFNLFFBQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxVQUFVLFlBQUEsRUFBRSxVQUFVLFlBQUEsRUFBRSxDQUFDO0lBQzdFLENBQUM7SUFFTyxvREFBb0IsR0FBNUIsVUFDQyxLQUFrQixFQUNsQixlQUFpQyxFQUNqQyxlQUFrQyxFQUNsQyxtQkFBa0QsRUFDbEQsZ0JBQStDLEVBQy9DLFFBQTJCO1FBRjNCLG9DQUFBLEVBQUEsd0JBQWtEO1FBQ2xELGlDQUFBLEVBQUEscUJBQStDO1FBRy9DLElBQU0sS0FBSyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTNDLG9GQUFvRjtRQUNwRixJQUFNLGNBQWMsR0FDbkIsUUFBUSxLQUFLLGlCQUFpQixDQUFDLE9BQU87WUFDdEMsS0FBSyxDQUFDLElBQUksQ0FDVCxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxZQUFZLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssS0FBSyxFQUExRCxDQUEwRCxDQUNsRSxDQUFDO1FBRUgsSUFBSSxjQUFjLElBQUksZUFBZSxLQUFLLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtZQUNsRSxPQUFPLElBQUksQ0FBQztTQUNaO1FBRUQsd0VBQXdFO1FBQ3hFLDBFQUEwRTtRQUMxRSx3RUFBd0U7UUFDeEUsdUNBQXVDO1FBQ3ZDLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQ2xDLFVBQUEsSUFBSTtZQUNILE9BQUEsSUFBSSxDQUFDLFlBQVksS0FBSyxRQUFRO2dCQUM5QixDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUQ3QyxDQUM2QyxDQUM5QyxDQUFDO1FBRUYsSUFBTSxVQUFVLEdBQ2YsQ0FBQyxRQUFRLEtBQUssaUJBQWlCLENBQUMseUJBQXlCO1lBQ3hELFFBQVEsS0FBSyxpQkFBaUIsQ0FBQyxjQUFjLENBQUM7WUFDL0MsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFBLGFBQWE7Z0JBQ2hDLG9DQUFvQztnQkFDcEMsSUFBTSxpQkFBaUIsR0FBRyxzQkFBc0IsQ0FDL0MsbUJBQW1CLEVBQ25CLGFBQWEsQ0FDYixDQUFDO2dCQUNGLElBQU0sY0FBYyxHQUFHLHNCQUFzQixDQUM1QyxnQkFBZ0IsRUFDaEIsYUFBYSxDQUNiLENBQUM7Z0JBRUYsT0FBTyxTQUFJLGlCQUFpQixFQUFLLGNBQWMsRUFBRSxJQUFJLENBQUMsVUFBQSxTQUFTO29CQUM5RCxPQUFPLGFBQWEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUEsS0FBSyxJQUFJLE9BQUEsS0FBSyxLQUFLLFNBQVMsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDO2dCQUNoRSxDQUFDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBRUosSUFBSSxVQUFVLEVBQUU7WUFDZixPQUFPO2dCQUNOLFFBQVEsVUFBQTtnQkFDUixPQUFPLEVBQUUsS0FBSzthQUNkLENBQUM7U0FDRjtRQUVELDZGQUE2RjtRQUM3RiwwRkFBMEY7UUFDMUYsb0NBQW9DO1FBQ3BDLElBQU0scUJBQXFCLEdBQzFCLFFBQVEsS0FBSyxpQkFBaUIsQ0FBQyx5QkFBeUI7WUFDdkQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQ1osVUFBQSxJQUFJO2dCQUNILE9BQUEsSUFBSSxDQUFDLFlBQVksS0FBSyxPQUFPLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxXQUFXO1lBQTlELENBQThELENBQzlEO1lBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUVQLElBQUksYUFBZ0MsQ0FBQztRQUNyQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUMsVUFBQSxhQUFhO1lBQzFDLElBQU0sVUFBVSxHQUFHLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUVwRSxJQUFJLFVBQVUsRUFBRTtnQkFDZixhQUFhLEdBQUc7b0JBQ2YsUUFBUSxFQUFFLGlCQUFpQixDQUFDLHlCQUF5QjtvQkFDckQsT0FBTyxFQUFFLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJO29CQUM1RCxVQUFVLEVBQUUsYUFBYSxDQUFDLFVBQVU7b0JBQ3BDLFVBQVUsWUFBQTtpQkFDVixDQUFDO2FBQ0Y7UUFDRixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksYUFBYSxFQUFFO1lBQ2xCLE9BQU8sYUFBYSxDQUFDO1NBQ3JCO1FBRUQsNkZBQTZGO1FBQzdGLHVGQUF1RjtRQUN2RixvQ0FBb0M7UUFDcEMsSUFBTSxrQkFBa0IsR0FDdkIsUUFBUSxLQUFLLGlCQUFpQixDQUFDLGNBQWM7WUFDNUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQ1osVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsWUFBWSxLQUFLLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLE1BQU0sRUFBekQsQ0FBeUQsQ0FDaEU7WUFDSCxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRVAsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQUEsYUFBYTtZQUN2QyxJQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFakUsSUFBSSxVQUFVLEVBQUU7Z0JBQ2YsYUFBYSxHQUFHO29CQUNmLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxjQUFjO29CQUMxQyxPQUFPLEVBQUUsYUFBYSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUk7b0JBQzVELFVBQVUsRUFBRSxhQUFhLENBQUMsVUFBVTtvQkFDcEMsVUFBVSxZQUFBO2lCQUNWLENBQUM7YUFDRjtRQUNGLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxhQUFhLEVBQUU7WUFDbEIsT0FBTyxhQUFhLENBQUM7U0FDckI7UUFFRCxpREFBaUQ7UUFDakQsT0FBTztZQUNOLFFBQVEsRUFBRSxRQUFRLElBQUksZUFBZTtZQUNyQyxPQUFPLEVBQUUsS0FBSztTQUNkLENBQUM7SUFDSCxDQUFDO0lBRU8sMERBQTBCLEdBQWxDLFVBQW1DLFNBQW1CLEVBQUUsT0FBbUI7UUFFOUQsSUFBQSw2QkFBSyxDQUNMO1FBRVosSUFBSSxLQUFLLEtBQUssa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUU7WUFDbEQsU0FBUyxFQUFFLENBQUM7U0FDWjtJQUNGLENBQUM7SUFFRCxxQ0FBSyxHQUFMO1FBQUEsaUJBeVVDO1FBclVBLElBQU0sYUFBYSxHQUFHLElBQUksVUFBVSxDQUFjLFVBQUEsUUFBUTtZQUN6RCxJQUFNLFFBQVEsR0FBb0IsRUFBRSxDQUFDO1lBRXJDLDJFQUEyRTtZQUMzRSxnRUFBZ0U7WUFDaEUsSUFBSSxhQUFhLEdBTWIsRUFBRSxDQUFDO1lBQ1AsSUFBSSxtQkFBNkMsRUFDaEQsZ0JBQTBDLENBQUM7WUFDNUMsSUFBSSxlQUFlLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO1lBQzVDLENBQUM7Ozs7Ozs7NEJBSXFCLHFCQUFNLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFBOzs0QkFBN0MsV0FBVyxHQUFHLFNBQStCOzRCQUNuRCxlQUFlLEdBQUcsV0FBVyxDQUFDLGFBQWE7Z0NBQzFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJO2dDQUN2QixDQUFDLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDOzs7Ozs7OzRCQVFYLHFCQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBQTs7NEJBQXJDLE9BQU8sR0FBRyxTQUEyQjs0QkFDM0MsbUJBQW1CLEdBQUcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDOzs7Ozs7OzRCQVNyRCxLQUEyQyxJQUFJLENBQUMsYUFBYSxFQUEzRCxrQkFBa0Isd0JBQUEsRUFBUSxVQUFVLFVBQUEsQ0FBd0I7NEJBQ3BFLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQ0FDOUQsTUFBTSx3QkFBd0IsQ0FBQzs2QkFDL0I7NEJBRUcsS0FBSyxTQUFBLENBQUM7NEJBRVkscUJBQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFBQTs7NEJBQXBELGFBQWEsR0FBRyxTQUFvQztpQ0FDdEQsYUFBYSxFQUFiLHdCQUFhOzRCQUNoQixLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQzs7Z0NBRVIscUJBQU0sSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQUE7OzRCQUFuRCxXQUFXLEdBQUcsU0FBcUM7NEJBQ3pELElBQUksV0FBVyxFQUFFO2dDQUNoQixLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQzs2QkFDMUI7Ozs0QkFHRixJQUFJLEtBQUssRUFBRTtnQ0FDSixPQUFPLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDcEMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUMvQyxDQUFDOzZCQUNGOzs7OzRCQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsS0FBRyxDQUFDLENBQUM7Ozs0QkFJN0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFNBQVM7Z0NBQ3RELE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztxQ0FDN0IsTUFBTSxDQUFDLFVBQUMsRUFBWTt3Q0FBVixzQkFBUTtvQ0FBTyxPQUFBLFFBQVE7Z0NBQVIsQ0FBUSxDQUFDO3FDQUNsQyxPQUFPLENBQUMsVUFBTSxlQUFlOzs7Ozs7b0RBQ04scUJBQU0saUJBQWlCLENBQUM7b0RBQzlDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7b0RBQ3ZDLGVBQWUsRUFBRSxJQUFJLENBQUMsYUFBYTt5REFDakMsOEJBQThCO29EQUNoQyxTQUFTLEVBQUUsZUFBZSxDQUFDLElBQUk7b0RBQy9CLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtpREFDbkIsQ0FBQyxFQUFBOztnREFOSSxjQUFjLEdBQUcsU0FNckI7Z0RBR0ksYUFBYSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUM7Z0RBRTFDLGFBQWEseUJBQ1QsYUFBYSxnQkFDZixlQUFlLENBQUMsSUFBSTtvREFDcEIsR0FBQyx1QkFBdUIsQ0FBQyxNQUFNLElBQUcsRUFBRTtvREFDcEMsR0FBQyx1QkFBdUIsQ0FBQyxNQUFNLElBQUcsRUFBRTtvREFDcEMsR0FBQyx1QkFBdUIsQ0FBQyxNQUFNLElBQUcsRUFBRTs2REFFckMsQ0FBQztnREFFSSxVQUFVLEdBQUc7b0RBQ2xCLHVCQUF1QixDQUFDLE1BQU07b0RBQzlCLHVCQUF1QixDQUFDLE1BQU07b0RBQzlCLHVCQUF1QixDQUFDLE1BQU07aURBQzlCLENBQUM7Z0RBRUkseUJBQXlCO29EQUM5QixHQUFDLHVCQUF1QixDQUFDLE1BQU0sSUFBRyxDQUFDO29EQUNuQyxHQUFDLHVCQUF1QixDQUFDLE1BQU0sSUFBRyxDQUFDO29EQUNuQyxHQUFDLHVCQUF1QixDQUFDLE1BQU0sSUFBRyxDQUFDO3VEQUNuQyxDQUFDO2dEQUdJLGFBQWEsR0FBRyxVQUFNLFNBQVM7Ozs7OztnRUFDOUIsS0FRRixJQUFJLENBQUMsaUJBQWlCLENBQ3pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULGVBQWUsRUFDZixtQkFBbUIsRUFDbkIsZ0JBQWdCLEVBQ2hCLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUNuRCxFQWZRLHVCQUF1QixZQUFBLEVBQy9CLE1BQU0sWUFBQSxFQUNOLEtBQUssV0FBQSxFQUNMLE9BQU8sYUFBQSxFQUNQLFVBQVUsZ0JBQUEsRUFDVixVQUFVLGdCQUFBLEVBQ1YsUUFBUSxjQUFBLENBU1A7Z0VBRWdCLHFCQUFNLHFCQUFxQixDQUM1QyxRQUFRLEVBQ1IsSUFBSSxDQUFDLGFBQWEsQ0FDbEIsRUFBQTs7Z0VBSEssU0FBUyxHQUFHLFNBR2pCO2dFQUVLLFNBQVMsR0FBRyxFQUFFLENBQUM7Z0VBRXJCLElBQUksT0FBTyxFQUFFO29FQUNaLElBQUksQ0FBQyxVQUFVLEVBQUU7d0VBQ2hCLFFBQVEsQ0FBQyxLQUFLLENBQ2IsNEVBQTRFLENBQzVFLENBQUM7d0VBQ0Ysc0JBQU87cUVBQ1A7b0VBRUQsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztpRUFDbkM7Z0VBRUQsTUFBTSxDQUFDLEtBQUssQ0FDWCxnQkFBYyxTQUFTLHFDQUN0QixhQUFhLENBQUMseUJBQXlCLENBQUMsU0FBUyxDQUFDLENBQ2pELENBQ0YsQ0FBQztnRUFFSSxlQUFlLEdBSVYsR0FBRyxDQUFDLE9BQU8scUJBQUcsS0FBSyxPQUFBLEVBQUUsU0FBUyxXQUFBLElBQUssRUFBRSxRQUFRLFVBQUEsRUFBRSxLQUFFLFNBQVMsV0FBQSxJQUFJLENBQUM7Z0VBRzFFLGFBQWEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQ2xDLHVCQUF1QixDQUN2QixDQUFDLElBQUksQ0FDTCxlQUFlO3FFQUNiLEdBQUcsQ0FBQyxVQUFDLEVBQVM7d0VBQVAsZ0JBQUs7b0VBQU8sT0FBQSxLQUFLO2dFQUFMLENBQUssQ0FBQztxRUFDekIsU0FBUyxDQUFDO29FQUNWLElBQUksRUFBRSxVQUFDLEVBQWdCOzRFQUFkLGNBQUksRUFBRSxrQkFBTTt3RUFDcEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOzRFQUMvQyxJQUFNLFFBQVEsR0FJYixNQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBVztvRkFBVCxvQkFBTztnRkFBTyxPQUFBLE9BQU87NEVBQVAsQ0FBTyxDQUFDLENBQUM7NEVBRXZDLE1BQU0sQ0FBQyxJQUFJLENBQ1YsK0NBQTZDLFFBQVEsQ0FBQyxJQUFJLENBQ3pELElBQUksQ0FDRixDQUNILENBQUM7NEVBRUYsS0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDOzRFQUNuQixPQUFPO3lFQUNQO3dFQUVELElBQU0sZUFBZSxHQUFHLHFCQUFxQixDQUFDLGFBQWEsQ0FDMUQsS0FBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLEVBQ3hDLEtBQUssQ0FDTCxDQUFDO3dFQUVNLElBQXFCLFNBQUksRUFBekIsV0FBUSxFQUFSLGVBQXlCLENBQUM7d0VBRWxDLHdEQUF3RDt3RUFDeEQsNkRBQTZEO3dFQUM3RCxnRUFBZ0U7d0VBQ2hFLDJDQUEyQzt3RUFDM0MsSUFDQyxLQUFJLENBQUMseUJBQXlCLENBQzdCLE1BQU0sRUFDTixlQUFlLENBQ2YsRUFDQTs0RUFDRCxLQUFJLENBQUMsWUFBWSxDQUNoQix1QkFBdUIsRUFDdkIsZUFBZSxFQUNmLE1BQU0sQ0FDTixDQUFDO3lFQUNGO3dFQUNELEtBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztvRUFDcEIsQ0FBQztvRUFDRCxLQUFLLEVBQUUsVUFBQSxpQkFBaUI7d0VBRXRCLElBQUEsNEJBRUMsRUFGUTs7MEZBQStCLEVBQXRCLFVBQXFCLEVBQW5CLHNDQUFZLEVBQVosaUNBRW5CLENBQ29CO3dFQUV0QixJQUNDLE9BQU8sQ0FBQyxRQUFRLENBQ2Ysa0JBQWtCLENBQUMsZ0NBQWdDLENBQ25EOzRFQUNELE9BQU8sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQUMsRUFDckQ7NEVBQ0QsK0RBQStEOzRFQUMvRCxhQUFhLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUNsQyx1QkFBdUIsQ0FDdkIsQ0FBQyxPQUFPLENBQUMsVUFBQSxZQUFZLElBQUksT0FBQSxZQUFZLENBQUMsV0FBVyxFQUFFLEVBQTFCLENBQTBCLENBQUMsQ0FBQzs0RUFDdEQsYUFBYSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FDbEMsdUJBQXVCLENBQ3ZCLEdBQUcsRUFBRSxDQUFDOzRFQUVQLHlCQUF5QixDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7NEVBQ3ZDLElBQ0MseUJBQXlCLENBQUMsU0FBUyxDQUFDO2dGQUNwQyxhQUFhLENBQUMsTUFBTSxFQUNuQjtnRkFDRCxNQUFNLENBQUMsS0FBSyxDQUNSLFNBQVMsNENBQ1gsYUFBYSxDQUNaLHlCQUF5QixDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FFeEMsQ0FDRixDQUFDO2dGQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0ZBQzFDLE9BQU87NkVBQ1A7aUZBQU07Z0ZBQ04sTUFBTSxDQUFDLEtBQUssQ0FDUixTQUFTLDRDQUNYLGFBQWEsQ0FDWix5QkFBeUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQ3hDLGtDQUVELGFBQWEsQ0FDWix5QkFBeUIsQ0FBQyxTQUFTLENBQUMsQ0FFcEMsQ0FDRixDQUFDO2dGQUNGLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQztnRkFDekIsT0FBTzs2RUFDUDt5RUFDRDt3RUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxDQUFDO3dFQUUxQyxJQUFJLE9BQU8seUJBQXlCLEtBQUssVUFBVSxFQUFFOzRFQUNwRCx5QkFBeUIsRUFBRSxDQUFDO3lFQUM1Qjt3RUFFRCxJQUNDLE9BQU8sQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUM7NEVBQzlDLE9BQU8sQ0FBQyxRQUFRLENBQUMsaUNBQWlDLENBQUMsRUFDbEQ7NEVBQ0QsT0FBTzt5RUFDUDt3RUFFRCxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29FQUN6QixDQUFDO2lFQUNELENBQUMsQ0FDSCxDQUFDO2dFQUVGLFFBQVEsQ0FBQyxJQUFJLENBQ1osQ0FBQzs7Ozs7b0ZBR0EscUJBQU0sSUFBSSxPQUFPLENBQUMsVUFBQSxHQUFHO29GQUNwQix5QkFBeUIsR0FBRyxHQUFHLENBQUM7b0ZBQ2hDLGFBQWEsR0FBRyxLQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUNuRCxLQUFJLEVBQ0osR0FBRyxDQUNILENBQUM7b0ZBQ0YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0ZBQ2xDLENBQUMsQ0FBQyxFQUFBOztnRkFQRixTQU9FLENBQUM7Z0ZBQ0gsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7Ozs7cUVBQ2pDLENBQUMsRUFBRSxDQUNKLENBQUM7Ozs7cURBQ0YsQ0FBQztnREFFRixVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFqQixDQUFpQixDQUFDLENBQUM7Ozs7cUNBQzVDLENBQUMsQ0FBQzs0QkFDTCxDQUFDLENBQUMsQ0FBQzs0QkFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQXBDLENBQW9DLENBQUMsQ0FBQzs7OztpQkFDdkUsQ0FBQyxFQUFFLENBQUM7WUFFTCxPQUFPO2dCQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsU0FBUztvQkFDM0MsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUN2Qix1QkFBdUIsQ0FBQyxNQUFNLENBQzlCLENBQUMsT0FBTyxDQUFDLFVBQUEsWUFBWSxJQUFJLE9BQUEsWUFBWSxDQUFDLFdBQVcsRUFBRSxFQUExQixDQUEwQixDQUFDLENBQUM7b0JBQ3RELGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FDdkIsdUJBQXVCLENBQUMsTUFBTSxDQUM5QixDQUFDLE9BQU8sQ0FBQyxVQUFBLFlBQVksSUFBSSxPQUFBLFlBQVksQ0FBQyxXQUFXLEVBQUUsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDO29CQUN0RCxhQUFhLENBQUMsU0FBUyxDQUFDLENBQ3ZCLHVCQUF1QixDQUFDLE1BQU0sQ0FDOUIsQ0FBQyxPQUFPLENBQUMsVUFBQSxZQUFZLElBQUksT0FBQSxZQUFZLENBQUMsV0FBVyxFQUFFLEVBQTFCLENBQTBCLENBQUMsQ0FBQztnQkFDdkQsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQU0sY0FBYyxHQUFHLElBQUksVUFBVSxDQUVuQyxVQUFBLFFBQVE7WUFDVCxLQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztZQUM3QixLQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFFbkIsT0FBTztnQkFDTixLQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUMxQixDQUFDLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxhQUFhLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVPLHlEQUF5QixHQUFqQyxVQUNDLE1BQXVCLEVBQ3ZCLGVBQXFDO1FBRXJDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDckIsT0FBTyxJQUFJLENBQUM7U0FDWjtRQUVPLElBQUEsdUNBQVUsRUFBRSwyQkFBSSxDQUFxQjtRQUU3QyxPQUFPLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVPLDRDQUFZLEdBQXBCLFVBQ0MsdUJBQWdELEVBQ2hELGVBQTRCLEVBQzVCLElBQXFCO1FBRXJCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsdUJBQXVCLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUVPLDJDQUFXLEdBQW5CO1FBQUEsaUJBS0M7UUFKQSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1NBQ2pCO0lBQ0YsQ0FBQztJQUNGLDRCQUFDO0FBQUQsQ0FBQyxBQWppQkQsSUFpaUJDO0FBRUQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQVBJLCB7IEdyYXBoUUxSZXN1bHQsIEdSQVBIUUxfQVVUSF9NT0RFIH0gZnJvbSAnQGF3cy1hbXBsaWZ5L2FwaSc7XG5pbXBvcnQgQXV0aCBmcm9tICdAYXdzLWFtcGxpZnkvYXV0aCc7XG5pbXBvcnQgQ2FjaGUgZnJvbSAnQGF3cy1hbXBsaWZ5L2NhY2hlJztcbmltcG9ydCB7IENvbnNvbGVMb2dnZXIgYXMgTG9nZ2VyLCBIdWIsIEh1YkNhcHN1bGUgfSBmcm9tICdAYXdzLWFtcGxpZnkvY29yZSc7XG5pbXBvcnQgeyBDT05UUk9MX01TRyBhcyBQVUJTVUJfQ09OVFJPTF9NU0cgfSBmcm9tICdAYXdzLWFtcGxpZnkvcHVic3ViJztcbmltcG9ydCBPYnNlcnZhYmxlLCB7IFplbk9ic2VydmFibGUgfSBmcm9tICd6ZW4tb2JzZXJ2YWJsZS10cyc7XG5pbXBvcnQge1xuXHRJbnRlcm5hbFNjaGVtYSxcblx0UGVyc2lzdGVudE1vZGVsLFxuXHRTY2hlbWFNb2RlbCxcblx0U2NoZW1hTmFtZXNwYWNlLFxuXHRQcmVkaWNhdGVzR3JvdXAsXG5cdE1vZGVsUHJlZGljYXRlLFxuXHRBdXRoTW9kZVN0cmF0ZWd5LFxufSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQge1xuXHRidWlsZFN1YnNjcmlwdGlvbkdyYXBoUUxPcGVyYXRpb24sXG5cdGdldEF1dGhvcml6YXRpb25SdWxlcyxcblx0Z2V0TW9kZWxBdXRoTW9kZXMsXG5cdGdldFVzZXJHcm91cHNGcm9tVG9rZW4sXG5cdFRyYW5zZm9ybWVyTXV0YXRpb25UeXBlLFxuXHRnZXRUb2tlbkZvckN1c3RvbUF1dGgsXG59IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IE1vZGVsUHJlZGljYXRlQ3JlYXRvciB9IGZyb20gJy4uLy4uL3ByZWRpY2F0ZXMnO1xuaW1wb3J0IHsgdmFsaWRhdGVQcmVkaWNhdGUgfSBmcm9tICcuLi8uLi91dGlsJztcblxuY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcignRGF0YVN0b3JlJyk7XG5cbmV4cG9ydCBlbnVtIENPTlRST0xfTVNHIHtcblx0Q09OTkVDVEVEID0gJ0NPTk5FQ1RFRCcsXG59XG5cbmV4cG9ydCBlbnVtIFVTRVJfQ1JFREVOVElBTFMge1xuXHQnbm9uZScsXG5cdCd1bmF1dGgnLFxuXHQnYXV0aCcsXG59XG5cbnR5cGUgQXV0aG9yaXphdGlvbkluZm8gPSB7XG5cdGF1dGhNb2RlOiBHUkFQSFFMX0FVVEhfTU9ERTtcblx0aXNPd25lcjogYm9vbGVhbjtcblx0b3duZXJGaWVsZD86IHN0cmluZztcblx0b3duZXJWYWx1ZT86IHN0cmluZztcbn07XG5cbmNsYXNzIFN1YnNjcmlwdGlvblByb2Nlc3NvciB7XG5cdHByaXZhdGUgcmVhZG9ubHkgdHlwZVF1ZXJ5ID0gbmV3IFdlYWtNYXA8XG5cdFx0U2NoZW1hTW9kZWwsXG5cdFx0W1RyYW5zZm9ybWVyTXV0YXRpb25UeXBlLCBzdHJpbmcsIHN0cmluZ11bXVxuXHQ+KCk7XG5cdHByaXZhdGUgYnVmZmVyOiBbXG5cdFx0VHJhbnNmb3JtZXJNdXRhdGlvblR5cGUsXG5cdFx0U2NoZW1hTW9kZWwsXG5cdFx0UGVyc2lzdGVudE1vZGVsXG5cdF1bXSA9IFtdO1xuXHRwcml2YXRlIGRhdGFPYnNlcnZlcjogWmVuT2JzZXJ2YWJsZS5PYnNlcnZlcjxhbnk+O1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgc2NoZW1hOiBJbnRlcm5hbFNjaGVtYSxcblx0XHRwcml2YXRlIHJlYWRvbmx5IHN5bmNQcmVkaWNhdGVzOiBXZWFrTWFwPFNjaGVtYU1vZGVsLCBNb2RlbFByZWRpY2F0ZTxhbnk+Pixcblx0XHRwcml2YXRlIHJlYWRvbmx5IGFtcGxpZnlDb25maWc6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fSxcblx0XHRwcml2YXRlIHJlYWRvbmx5IGF1dGhNb2RlU3RyYXRlZ3k6IEF1dGhNb2RlU3RyYXRlZ3lcblx0KSB7fVxuXG5cdHByaXZhdGUgYnVpbGRTdWJzY3JpcHRpb24oXG5cdFx0bmFtZXNwYWNlOiBTY2hlbWFOYW1lc3BhY2UsXG5cdFx0bW9kZWw6IFNjaGVtYU1vZGVsLFxuXHRcdHRyYW5zZm9ybWVyTXV0YXRpb25UeXBlOiBUcmFuc2Zvcm1lck11dGF0aW9uVHlwZSxcblx0XHR1c2VyQ3JlZGVudGlhbHM6IFVTRVJfQ1JFREVOVElBTFMsXG5cdFx0Y29nbml0b1Rva2VuUGF5bG9hZDogeyBbZmllbGQ6IHN0cmluZ106IGFueSB9IHwgdW5kZWZpbmVkLFxuXHRcdG9pZGNUb2tlblBheWxvYWQ6IHsgW2ZpZWxkOiBzdHJpbmddOiBhbnkgfSB8IHVuZGVmaW5lZCxcblx0XHRhdXRoTW9kZTogR1JBUEhRTF9BVVRIX01PREVcblx0KToge1xuXHRcdG9wVHlwZTogVHJhbnNmb3JtZXJNdXRhdGlvblR5cGU7XG5cdFx0b3BOYW1lOiBzdHJpbmc7XG5cdFx0cXVlcnk6IHN0cmluZztcblx0XHRhdXRoTW9kZTogR1JBUEhRTF9BVVRIX01PREU7XG5cdFx0aXNPd25lcjogYm9vbGVhbjtcblx0XHRvd25lckZpZWxkPzogc3RyaW5nO1xuXHRcdG93bmVyVmFsdWU/OiBzdHJpbmc7XG5cdH0ge1xuXHRcdGNvbnN0IHsgYXdzX2FwcHN5bmNfYXV0aGVudGljYXRpb25UeXBlIH0gPSB0aGlzLmFtcGxpZnlDb25maWc7XG5cdFx0Y29uc3QgeyBpc093bmVyLCBvd25lckZpZWxkLCBvd25lclZhbHVlIH0gPVxuXHRcdFx0dGhpcy5nZXRBdXRob3JpemF0aW9uSW5mbyhcblx0XHRcdFx0bW9kZWwsXG5cdFx0XHRcdHVzZXJDcmVkZW50aWFscyxcblx0XHRcdFx0YXdzX2FwcHN5bmNfYXV0aGVudGljYXRpb25UeXBlLFxuXHRcdFx0XHRjb2duaXRvVG9rZW5QYXlsb2FkLFxuXHRcdFx0XHRvaWRjVG9rZW5QYXlsb2FkLFxuXHRcdFx0XHRhdXRoTW9kZVxuXHRcdFx0KSB8fCB7fTtcblxuXHRcdGNvbnN0IFtvcFR5cGUsIG9wTmFtZSwgcXVlcnldID0gYnVpbGRTdWJzY3JpcHRpb25HcmFwaFFMT3BlcmF0aW9uKFxuXHRcdFx0bmFtZXNwYWNlLFxuXHRcdFx0bW9kZWwsXG5cdFx0XHR0cmFuc2Zvcm1lck11dGF0aW9uVHlwZSxcblx0XHRcdGlzT3duZXIsXG5cdFx0XHRvd25lckZpZWxkXG5cdFx0KTtcblx0XHRyZXR1cm4geyBhdXRoTW9kZSwgb3BUeXBlLCBvcE5hbWUsIHF1ZXJ5LCBpc093bmVyLCBvd25lckZpZWxkLCBvd25lclZhbHVlIH07XG5cdH1cblxuXHRwcml2YXRlIGdldEF1dGhvcml6YXRpb25JbmZvKFxuXHRcdG1vZGVsOiBTY2hlbWFNb2RlbCxcblx0XHR1c2VyQ3JlZGVudGlhbHM6IFVTRVJfQ1JFREVOVElBTFMsXG5cdFx0ZGVmYXVsdEF1dGhUeXBlOiBHUkFQSFFMX0FVVEhfTU9ERSxcblx0XHRjb2duaXRvVG9rZW5QYXlsb2FkOiB7IFtmaWVsZDogc3RyaW5nXTogYW55IH0gPSB7fSxcblx0XHRvaWRjVG9rZW5QYXlsb2FkOiB7IFtmaWVsZDogc3RyaW5nXTogYW55IH0gPSB7fSxcblx0XHRhdXRoTW9kZTogR1JBUEhRTF9BVVRIX01PREVcblx0KTogQXV0aG9yaXphdGlvbkluZm8ge1xuXHRcdGNvbnN0IHJ1bGVzID0gZ2V0QXV0aG9yaXphdGlvblJ1bGVzKG1vZGVsKTtcblxuXHRcdC8vIFJldHVybiBudWxsIGlmIHVzZXIgZG9lc24ndCBoYXZlIHByb3BlciBjcmVkZW50aWFscyBmb3IgcHJpdmF0ZSBBUEkgd2l0aCBJQU0gYXV0aFxuXHRcdGNvbnN0IGlhbVByaXZhdGVBdXRoID1cblx0XHRcdGF1dGhNb2RlID09PSBHUkFQSFFMX0FVVEhfTU9ERS5BV1NfSUFNICYmXG5cdFx0XHRydWxlcy5maW5kKFxuXHRcdFx0XHRydWxlID0+IHJ1bGUuYXV0aFN0cmF0ZWd5ID09PSAncHJpdmF0ZScgJiYgcnVsZS5wcm92aWRlciA9PT0gJ2lhbSdcblx0XHRcdCk7XG5cblx0XHRpZiAoaWFtUHJpdmF0ZUF1dGggJiYgdXNlckNyZWRlbnRpYWxzID09PSBVU0VSX0NSRURFTlRJQUxTLnVuYXV0aCkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Ly8gR3JvdXAgYXV0aCBzaG91bGQgdGFrZSBwcmVjZWRlbmNlIG92ZXIgb3duZXIgYXV0aCwgc28gd2UgYXJlIGNoZWNraW5nXG5cdFx0Ly8gaWYgcnVsZShzKSBoYXZlIGdyb3VwIGF1dGhvcml6YXRpb24gYXMgd2VsbCBhcyBpZiBlaXRoZXIgdGhlIENvZ25pdG8gb3Jcblx0XHQvLyBPSURDIHRva2VuIGhhcyBhIGdyb3VwQ2xhaW0uIElmIHNvLCB3ZSBhcmUgcmV0dXJuaW5nIGF1dGggaW5mbyBiZWZvcmVcblx0XHQvLyBhbnkgZnVydGhlciBvd25lci1iYXNlZCBhdXRoIGNoZWNrcy5cblx0XHRjb25zdCBncm91cEF1dGhSdWxlcyA9IHJ1bGVzLmZpbHRlcihcblx0XHRcdHJ1bGUgPT5cblx0XHRcdFx0cnVsZS5hdXRoU3RyYXRlZ3kgPT09ICdncm91cHMnICYmXG5cdFx0XHRcdFsndXNlclBvb2xzJywgJ29pZGMnXS5pbmNsdWRlcyhydWxlLnByb3ZpZGVyKVxuXHRcdCk7XG5cblx0XHRjb25zdCB2YWxpZEdyb3VwID1cblx0XHRcdChhdXRoTW9kZSA9PT0gR1JBUEhRTF9BVVRIX01PREUuQU1BWk9OX0NPR05JVE9fVVNFUl9QT09MUyB8fFxuXHRcdFx0XHRhdXRoTW9kZSA9PT0gR1JBUEhRTF9BVVRIX01PREUuT1BFTklEX0NPTk5FQ1QpICYmXG5cdFx0XHRncm91cEF1dGhSdWxlcy5maW5kKGdyb3VwQXV0aFJ1bGUgPT4ge1xuXHRcdFx0XHQvLyB2YWxpZGF0ZSB0b2tlbiBhZ2FpbnN0IGdyb3VwQ2xhaW1cblx0XHRcdFx0Y29uc3QgY29nbml0b1VzZXJHcm91cHMgPSBnZXRVc2VyR3JvdXBzRnJvbVRva2VuKFxuXHRcdFx0XHRcdGNvZ25pdG9Ub2tlblBheWxvYWQsXG5cdFx0XHRcdFx0Z3JvdXBBdXRoUnVsZVxuXHRcdFx0XHQpO1xuXHRcdFx0XHRjb25zdCBvaWRjVXNlckdyb3VwcyA9IGdldFVzZXJHcm91cHNGcm9tVG9rZW4oXG5cdFx0XHRcdFx0b2lkY1Rva2VuUGF5bG9hZCxcblx0XHRcdFx0XHRncm91cEF1dGhSdWxlXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0cmV0dXJuIFsuLi5jb2duaXRvVXNlckdyb3VwcywgLi4ub2lkY1VzZXJHcm91cHNdLmZpbmQodXNlckdyb3VwID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gZ3JvdXBBdXRoUnVsZS5ncm91cHMuZmluZChncm91cCA9PiBncm91cCA9PT0gdXNlckdyb3VwKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdGlmICh2YWxpZEdyb3VwKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRhdXRoTW9kZSxcblx0XHRcdFx0aXNPd25lcjogZmFsc2UsXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdC8vIE93bmVyIGF1dGggbmVlZHMgYWRkaXRpb25hbCB2YWx1ZXMgdG8gYmUgcmV0dXJuZWQgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSBzdWJzY3JpcHRpb24gd2l0aFxuXHRcdC8vIHRoZSBjb3JyZWN0IHBhcmFtZXRlcnMgc28gd2UgYXJlIGdldHRpbmcgdGhlIG93bmVyIHZhbHVlIGZyb20gdGhlIENvZ25pdG8gdG9rZW4gdmlhIHRoZVxuXHRcdC8vIGlkZW50aXR5Q2xhaW0gZnJvbSB0aGUgYXV0aCBydWxlLlxuXHRcdGNvbnN0IGNvZ25pdG9Pd25lckF1dGhSdWxlcyA9XG5cdFx0XHRhdXRoTW9kZSA9PT0gR1JBUEhRTF9BVVRIX01PREUuQU1BWk9OX0NPR05JVE9fVVNFUl9QT09MU1xuXHRcdFx0XHQ/IHJ1bGVzLmZpbHRlcihcblx0XHRcdFx0XHRcdHJ1bGUgPT5cblx0XHRcdFx0XHRcdFx0cnVsZS5hdXRoU3RyYXRlZ3kgPT09ICdvd25lcicgJiYgcnVsZS5wcm92aWRlciA9PT0gJ3VzZXJQb29scydcblx0XHRcdFx0ICApXG5cdFx0XHRcdDogW107XG5cblx0XHRsZXQgb3duZXJBdXRoSW5mbzogQXV0aG9yaXphdGlvbkluZm87XG5cdFx0Y29nbml0b093bmVyQXV0aFJ1bGVzLmZvckVhY2gob3duZXJBdXRoUnVsZSA9PiB7XG5cdFx0XHRjb25zdCBvd25lclZhbHVlID0gY29nbml0b1Rva2VuUGF5bG9hZFtvd25lckF1dGhSdWxlLmlkZW50aXR5Q2xhaW1dO1xuXG5cdFx0XHRpZiAob3duZXJWYWx1ZSkge1xuXHRcdFx0XHRvd25lckF1dGhJbmZvID0ge1xuXHRcdFx0XHRcdGF1dGhNb2RlOiBHUkFQSFFMX0FVVEhfTU9ERS5BTUFaT05fQ09HTklUT19VU0VSX1BPT0xTLFxuXHRcdFx0XHRcdGlzT3duZXI6IG93bmVyQXV0aFJ1bGUuYXJlU3Vic2NyaXB0aW9uc1B1YmxpYyA/IGZhbHNlIDogdHJ1ZSxcblx0XHRcdFx0XHRvd25lckZpZWxkOiBvd25lckF1dGhSdWxlLm93bmVyRmllbGQsXG5cdFx0XHRcdFx0b3duZXJWYWx1ZSxcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChvd25lckF1dGhJbmZvKSB7XG5cdFx0XHRyZXR1cm4gb3duZXJBdXRoSW5mbztcblx0XHR9XG5cblx0XHQvLyBPd25lciBhdXRoIG5lZWRzIGFkZGl0aW9uYWwgdmFsdWVzIHRvIGJlIHJldHVybmVkIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgc3Vic2NyaXB0aW9uIHdpdGhcblx0XHQvLyB0aGUgY29ycmVjdCBwYXJhbWV0ZXJzIHNvIHdlIGFyZSBnZXR0aW5nIHRoZSBvd25lciB2YWx1ZSBmcm9tIHRoZSBPSURDIHRva2VuIHZpYSB0aGVcblx0XHQvLyBpZGVudGl0eUNsYWltIGZyb20gdGhlIGF1dGggcnVsZS5cblx0XHRjb25zdCBvaWRjT3duZXJBdXRoUnVsZXMgPVxuXHRcdFx0YXV0aE1vZGUgPT09IEdSQVBIUUxfQVVUSF9NT0RFLk9QRU5JRF9DT05ORUNUXG5cdFx0XHRcdD8gcnVsZXMuZmlsdGVyKFxuXHRcdFx0XHRcdFx0cnVsZSA9PiBydWxlLmF1dGhTdHJhdGVneSA9PT0gJ293bmVyJyAmJiBydWxlLnByb3ZpZGVyID09PSAnb2lkYydcblx0XHRcdFx0ICApXG5cdFx0XHRcdDogW107XG5cblx0XHRvaWRjT3duZXJBdXRoUnVsZXMuZm9yRWFjaChvd25lckF1dGhSdWxlID0+IHtcblx0XHRcdGNvbnN0IG93bmVyVmFsdWUgPSBvaWRjVG9rZW5QYXlsb2FkW293bmVyQXV0aFJ1bGUuaWRlbnRpdHlDbGFpbV07XG5cblx0XHRcdGlmIChvd25lclZhbHVlKSB7XG5cdFx0XHRcdG93bmVyQXV0aEluZm8gPSB7XG5cdFx0XHRcdFx0YXV0aE1vZGU6IEdSQVBIUUxfQVVUSF9NT0RFLk9QRU5JRF9DT05ORUNULFxuXHRcdFx0XHRcdGlzT3duZXI6IG93bmVyQXV0aFJ1bGUuYXJlU3Vic2NyaXB0aW9uc1B1YmxpYyA/IGZhbHNlIDogdHJ1ZSxcblx0XHRcdFx0XHRvd25lckZpZWxkOiBvd25lckF1dGhSdWxlLm93bmVyRmllbGQsXG5cdFx0XHRcdFx0b3duZXJWYWx1ZSxcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGlmIChvd25lckF1dGhJbmZvKSB7XG5cdFx0XHRyZXR1cm4gb3duZXJBdXRoSW5mbztcblx0XHR9XG5cblx0XHQvLyBGYWxsYmFjazogcmV0dXJuIGF1dGhNb2RlIG9yIGRlZmF1bHQgYXV0aCB0eXBlXG5cdFx0cmV0dXJuIHtcblx0XHRcdGF1dGhNb2RlOiBhdXRoTW9kZSB8fCBkZWZhdWx0QXV0aFR5cGUsXG5cdFx0XHRpc093bmVyOiBmYWxzZSxcblx0XHR9O1xuXHR9XG5cblx0cHJpdmF0ZSBodWJRdWVyeUNvbXBsZXRpb25MaXN0ZW5lcihjb21wbGV0ZWQ6IEZ1bmN0aW9uLCBjYXBzdWxlOiBIdWJDYXBzdWxlKSB7XG5cdFx0Y29uc3Qge1xuXHRcdFx0cGF5bG9hZDogeyBldmVudCB9LFxuXHRcdH0gPSBjYXBzdWxlO1xuXG5cdFx0aWYgKGV2ZW50ID09PSBQVUJTVUJfQ09OVFJPTF9NU0cuU1VCU0NSSVBUSU9OX0FDSykge1xuXHRcdFx0Y29tcGxldGVkKCk7XG5cdFx0fVxuXHR9XG5cblx0c3RhcnQoKTogW1xuXHRcdE9ic2VydmFibGU8Q09OVFJPTF9NU0c+LFxuXHRcdE9ic2VydmFibGU8W1RyYW5zZm9ybWVyTXV0YXRpb25UeXBlLCBTY2hlbWFNb2RlbCwgUGVyc2lzdGVudE1vZGVsXT5cblx0XSB7XG5cdFx0Y29uc3QgY3RsT2JzZXJ2YWJsZSA9IG5ldyBPYnNlcnZhYmxlPENPTlRST0xfTVNHPihvYnNlcnZlciA9PiB7XG5cdFx0XHRjb25zdCBwcm9taXNlczogUHJvbWlzZTx2b2lkPltdID0gW107XG5cblx0XHRcdC8vIENyZWF0aW5nIHN1YnMgZm9yIGVhY2ggbW9kZWwvb3BlcmF0aW9uIGNvbWJvIHNvIHRoZXkgY2FuIGJlIHVuc3Vic2NyaWJlZFxuXHRcdFx0Ly8gaW5kZXBlbmRlbnRseSwgc2luY2UgdGhlIGF1dGggcmV0cnkgYmVoYXZpb3IgaXMgYXN5bmNocm9ub3VzLlxuXHRcdFx0bGV0IHN1YnNjcmlwdGlvbnM6IHtcblx0XHRcdFx0W21vZGVsTmFtZTogc3RyaW5nXToge1xuXHRcdFx0XHRcdFtUcmFuc2Zvcm1lck11dGF0aW9uVHlwZS5DUkVBVEVdOiBaZW5PYnNlcnZhYmxlLlN1YnNjcmlwdGlvbltdO1xuXHRcdFx0XHRcdFtUcmFuc2Zvcm1lck11dGF0aW9uVHlwZS5VUERBVEVdOiBaZW5PYnNlcnZhYmxlLlN1YnNjcmlwdGlvbltdO1xuXHRcdFx0XHRcdFtUcmFuc2Zvcm1lck11dGF0aW9uVHlwZS5ERUxFVEVdOiBaZW5PYnNlcnZhYmxlLlN1YnNjcmlwdGlvbltdO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSA9IHt9O1xuXHRcdFx0bGV0IGNvZ25pdG9Ub2tlblBheWxvYWQ6IHsgW2ZpZWxkOiBzdHJpbmddOiBhbnkgfSxcblx0XHRcdFx0b2lkY1Rva2VuUGF5bG9hZDogeyBbZmllbGQ6IHN0cmluZ106IGFueSB9O1xuXHRcdFx0bGV0IHVzZXJDcmVkZW50aWFscyA9IFVTRVJfQ1JFREVOVElBTFMubm9uZTtcblx0XHRcdChhc3luYyAoKSA9PiB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Ly8gcmV0cmlldmluZyBjdXJyZW50IEFXUyBDcmVkZW50aWFsc1xuXHRcdFx0XHRcdC8vIFRPRE8gU2hvdWxkIHRoaXMgdXNlIGB0aGlzLmFtcGxpZnkuQXV0aGAgZm9yIFNTUj9cblx0XHRcdFx0XHRjb25zdCBjcmVkZW50aWFscyA9IGF3YWl0IEF1dGguY3VycmVudENyZWRlbnRpYWxzKCk7XG5cdFx0XHRcdFx0dXNlckNyZWRlbnRpYWxzID0gY3JlZGVudGlhbHMuYXV0aGVudGljYXRlZFxuXHRcdFx0XHRcdFx0PyBVU0VSX0NSRURFTlRJQUxTLmF1dGhcblx0XHRcdFx0XHRcdDogVVNFUl9DUkVERU5USUFMUy51bmF1dGg7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdC8vIGJlc3QgZWZmb3J0IHRvIGdldCBBV1MgY3JlZGVudGlhbHNcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Ly8gcmV0cmlldmluZyBjdXJyZW50IHRva2VuIGluZm8gZnJvbSBDb2duaXRvIFVzZXJQb29sc1xuXHRcdFx0XHRcdC8vIFRPRE8gU2hvdWxkIHRoaXMgdXNlIGB0aGlzLmFtcGxpZnkuQXV0aGAgZm9yIFNTUj9cblx0XHRcdFx0XHRjb25zdCBzZXNzaW9uID0gYXdhaXQgQXV0aC5jdXJyZW50U2Vzc2lvbigpO1xuXHRcdFx0XHRcdGNvZ25pdG9Ub2tlblBheWxvYWQgPSBzZXNzaW9uLmdldElkVG9rZW4oKS5kZWNvZGVQYXlsb2FkKCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdC8vIGJlc3QgZWZmb3J0IHRvIGdldCBqd3QgZnJvbSBDb2duaXRvXG5cdFx0XHRcdH1cblxuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdC8vIENoZWNraW5nIGZvciB0aGUgQ29nbml0byByZWdpb24gaW4gY29uZmlnIHRvIHNlZSBpZiBBdXRoIGlzIGNvbmZpZ3VyZWRcblx0XHRcdFx0XHQvLyBiZWZvcmUgYXR0ZW1wdGluZyB0byBnZXQgZmVkZXJhdGVkIHRva2VuLiBXZSdyZSB1c2luZyB0aGUgQ29nbml0byByZWdpb25cblx0XHRcdFx0XHQvLyBiZWNhdXNlIGl0IHdpbGwgYmUgdGhlcmUgcmVnYXJkbGVzcyBvZiB1c2VyL2lkZW50aXR5IHBvb2wgYmVpbmcgcHJlc2VudC5cblx0XHRcdFx0XHRjb25zdCB7IGF3c19jb2duaXRvX3JlZ2lvbiwgQXV0aDogQXV0aENvbmZpZyB9ID0gdGhpcy5hbXBsaWZ5Q29uZmlnO1xuXHRcdFx0XHRcdGlmICghYXdzX2NvZ25pdG9fcmVnaW9uIHx8IChBdXRoQ29uZmlnICYmICFBdXRoQ29uZmlnLnJlZ2lvbikpIHtcblx0XHRcdFx0XHRcdHRocm93ICdBdXRoIGlzIG5vdCBjb25maWd1cmVkJztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRsZXQgdG9rZW47XG5cdFx0XHRcdFx0Ly8gYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblx0XHRcdFx0XHRjb25zdCBmZWRlcmF0ZWRJbmZvID0gYXdhaXQgQ2FjaGUuZ2V0SXRlbSgnZmVkZXJhdGVkSW5mbycpO1xuXHRcdFx0XHRcdGlmIChmZWRlcmF0ZWRJbmZvKSB7XG5cdFx0XHRcdFx0XHR0b2tlbiA9IGZlZGVyYXRlZEluZm8udG9rZW47XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGNvbnN0IGN1cnJlbnRVc2VyID0gYXdhaXQgQXV0aC5jdXJyZW50QXV0aGVudGljYXRlZFVzZXIoKTtcblx0XHRcdFx0XHRcdGlmIChjdXJyZW50VXNlcikge1xuXHRcdFx0XHRcdFx0XHR0b2tlbiA9IGN1cnJlbnRVc2VyLnRva2VuO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICh0b2tlbikge1xuXHRcdFx0XHRcdFx0Y29uc3QgcGF5bG9hZCA9IHRva2VuLnNwbGl0KCcuJylbMV07XG5cdFx0XHRcdFx0XHRvaWRjVG9rZW5QYXlsb2FkID0gSlNPTi5wYXJzZShcblx0XHRcdFx0XHRcdFx0QnVmZmVyLmZyb20ocGF5bG9hZCwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCd1dGY4Jylcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHRsb2dnZXIuZGVidWcoJ2Vycm9yIGdldHRpbmcgT0lEQyBKV1QnLCBlcnIpO1xuXHRcdFx0XHRcdC8vIGJlc3QgZWZmb3J0IHRvIGdldCBvaWRjIGp3dFxuXHRcdFx0XHR9XG5cblx0XHRcdFx0T2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYS5uYW1lc3BhY2VzKS5mb3JFYWNoKG5hbWVzcGFjZSA9PiB7XG5cdFx0XHRcdFx0T2JqZWN0LnZhbHVlcyhuYW1lc3BhY2UubW9kZWxzKVxuXHRcdFx0XHRcdFx0LmZpbHRlcigoeyBzeW5jYWJsZSB9KSA9PiBzeW5jYWJsZSlcblx0XHRcdFx0XHRcdC5mb3JFYWNoKGFzeW5jIG1vZGVsRGVmaW5pdGlvbiA9PiB7XG5cdFx0XHRcdFx0XHRcdGNvbnN0IG1vZGVsQXV0aE1vZGVzID0gYXdhaXQgZ2V0TW9kZWxBdXRoTW9kZXMoe1xuXHRcdFx0XHRcdFx0XHRcdGF1dGhNb2RlU3RyYXRlZ3k6IHRoaXMuYXV0aE1vZGVTdHJhdGVneSxcblx0XHRcdFx0XHRcdFx0XHRkZWZhdWx0QXV0aE1vZGU6IHRoaXMuYW1wbGlmeUNvbmZpZ1xuXHRcdFx0XHRcdFx0XHRcdFx0LmF3c19hcHBzeW5jX2F1dGhlbnRpY2F0aW9uVHlwZSxcblx0XHRcdFx0XHRcdFx0XHRtb2RlbE5hbWU6IG1vZGVsRGVmaW5pdGlvbi5uYW1lLFxuXHRcdFx0XHRcdFx0XHRcdHNjaGVtYTogdGhpcy5zY2hlbWEsXG5cdFx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRcdC8vIHN1YnNjcmlwdGlvbnMgYXJlIGNyZWF0ZWQgb25seSBiYXNlZCBvbiB0aGUgUkVBRCBhdXRoIG1vZGUocylcblx0XHRcdFx0XHRcdFx0Y29uc3QgcmVhZEF1dGhNb2RlcyA9IG1vZGVsQXV0aE1vZGVzLlJFQUQ7XG5cblx0XHRcdFx0XHRcdFx0c3Vic2NyaXB0aW9ucyA9IHtcblx0XHRcdFx0XHRcdFx0XHQuLi5zdWJzY3JpcHRpb25zLFxuXHRcdFx0XHRcdFx0XHRcdFttb2RlbERlZmluaXRpb24ubmFtZV06IHtcblx0XHRcdFx0XHRcdFx0XHRcdFtUcmFuc2Zvcm1lck11dGF0aW9uVHlwZS5DUkVBVEVdOiBbXSxcblx0XHRcdFx0XHRcdFx0XHRcdFtUcmFuc2Zvcm1lck11dGF0aW9uVHlwZS5VUERBVEVdOiBbXSxcblx0XHRcdFx0XHRcdFx0XHRcdFtUcmFuc2Zvcm1lck11dGF0aW9uVHlwZS5ERUxFVEVdOiBbXSxcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHRcdGNvbnN0IG9wZXJhdGlvbnMgPSBbXG5cdFx0XHRcdFx0XHRcdFx0VHJhbnNmb3JtZXJNdXRhdGlvblR5cGUuQ1JFQVRFLFxuXHRcdFx0XHRcdFx0XHRcdFRyYW5zZm9ybWVyTXV0YXRpb25UeXBlLlVQREFURSxcblx0XHRcdFx0XHRcdFx0XHRUcmFuc2Zvcm1lck11dGF0aW9uVHlwZS5ERUxFVEUsXG5cdFx0XHRcdFx0XHRcdF07XG5cblx0XHRcdFx0XHRcdFx0Y29uc3Qgb3BlcmF0aW9uQXV0aE1vZGVBdHRlbXB0cyA9IHtcblx0XHRcdFx0XHRcdFx0XHRbVHJhbnNmb3JtZXJNdXRhdGlvblR5cGUuQ1JFQVRFXTogMCxcblx0XHRcdFx0XHRcdFx0XHRbVHJhbnNmb3JtZXJNdXRhdGlvblR5cGUuVVBEQVRFXTogMCxcblx0XHRcdFx0XHRcdFx0XHRbVHJhbnNmb3JtZXJNdXRhdGlvblR5cGUuREVMRVRFXTogMCxcblx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0XHQvLyBSZXRyeSBmYWlsZWQgc3Vic2NyaXB0aW9ucyB3aXRoIG5leHQgYXV0aCBtb2RlIChpZiBhdmFpbGFibGUpXG5cdFx0XHRcdFx0XHRcdGNvbnN0IGF1dGhNb2RlUmV0cnkgPSBhc3luYyBvcGVyYXRpb24gPT4ge1xuXHRcdFx0XHRcdFx0XHRcdGNvbnN0IHtcblx0XHRcdFx0XHRcdFx0XHRcdG9wVHlwZTogdHJhbnNmb3JtZXJNdXRhdGlvblR5cGUsXG5cdFx0XHRcdFx0XHRcdFx0XHRvcE5hbWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRxdWVyeSxcblx0XHRcdFx0XHRcdFx0XHRcdGlzT3duZXIsXG5cdFx0XHRcdFx0XHRcdFx0XHRvd25lckZpZWxkLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3duZXJWYWx1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdGF1dGhNb2RlLFxuXHRcdFx0XHRcdFx0XHRcdH0gPSB0aGlzLmJ1aWxkU3Vic2NyaXB0aW9uKFxuXHRcdFx0XHRcdFx0XHRcdFx0bmFtZXNwYWNlLFxuXHRcdFx0XHRcdFx0XHRcdFx0bW9kZWxEZWZpbml0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdFx0b3BlcmF0aW9uLFxuXHRcdFx0XHRcdFx0XHRcdFx0dXNlckNyZWRlbnRpYWxzLFxuXHRcdFx0XHRcdFx0XHRcdFx0Y29nbml0b1Rva2VuUGF5bG9hZCxcblx0XHRcdFx0XHRcdFx0XHRcdG9pZGNUb2tlblBheWxvYWQsXG5cdFx0XHRcdFx0XHRcdFx0XHRyZWFkQXV0aE1vZGVzW29wZXJhdGlvbkF1dGhNb2RlQXR0ZW1wdHNbb3BlcmF0aW9uXV1cblx0XHRcdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgYXV0aFRva2VuID0gYXdhaXQgZ2V0VG9rZW5Gb3JDdXN0b21BdXRoKFxuXHRcdFx0XHRcdFx0XHRcdFx0YXV0aE1vZGUsXG5cdFx0XHRcdFx0XHRcdFx0XHR0aGlzLmFtcGxpZnlDb25maWdcblx0XHRcdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRcdFx0Y29uc3QgdmFyaWFibGVzID0ge307XG5cblx0XHRcdFx0XHRcdFx0XHRpZiAoaXNPd25lcikge1xuXHRcdFx0XHRcdFx0XHRcdFx0aWYgKCFvd25lclZhbHVlKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9ic2VydmVyLmVycm9yKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCdPd25lciBmaWVsZCByZXF1aXJlZCwgc2lnbiBpbiBpcyBuZWVkZWQgaW4gb3JkZXIgdG8gcGVyZm9ybSB0aGlzIG9wZXJhdGlvbidcblx0XHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXJpYWJsZXNbb3duZXJGaWVsZF0gPSBvd25lclZhbHVlO1xuXHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdGxvZ2dlci5kZWJ1Zyhcblx0XHRcdFx0XHRcdFx0XHRcdGBBdHRlbXB0aW5nICR7b3BlcmF0aW9ufSBzdWJzY3JpcHRpb24gd2l0aCBhdXRoTW9kZTogJHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhZEF1dGhNb2Rlc1tvcGVyYXRpb25BdXRoTW9kZUF0dGVtcHRzW29wZXJhdGlvbl1dXG5cdFx0XHRcdFx0XHRcdFx0XHR9YFxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0XHRjb25zdCBxdWVyeU9ic2VydmFibGUgPSA8XG5cdFx0XHRcdFx0XHRcdFx0XHRPYnNlcnZhYmxlPHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFsdWU6IEdyYXBoUUxSZXN1bHQ8UmVjb3JkPHN0cmluZywgUGVyc2lzdGVudE1vZGVsPj47XG5cdFx0XHRcdFx0XHRcdFx0XHR9PlxuXHRcdFx0XHRcdFx0XHRcdD4oPHVua25vd24+QVBJLmdyYXBocWwoeyBxdWVyeSwgdmFyaWFibGVzLCAuLi57IGF1dGhNb2RlIH0sIGF1dGhUb2tlbiB9KSk7XG5cdFx0XHRcdFx0XHRcdFx0bGV0IHN1YnNjcmlwdGlvblJlYWR5Q2FsbGJhY2s6ICgpID0+IHZvaWQ7XG5cblx0XHRcdFx0XHRcdFx0XHRzdWJzY3JpcHRpb25zW21vZGVsRGVmaW5pdGlvbi5uYW1lXVtcblx0XHRcdFx0XHRcdFx0XHRcdHRyYW5zZm9ybWVyTXV0YXRpb25UeXBlXG5cdFx0XHRcdFx0XHRcdFx0XS5wdXNoKFxuXHRcdFx0XHRcdFx0XHRcdFx0cXVlcnlPYnNlcnZhYmxlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5tYXAoKHsgdmFsdWUgfSkgPT4gdmFsdWUpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5zdWJzY3JpYmUoe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG5leHQ6ICh7IGRhdGEsIGVycm9ycyB9KSA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoQXJyYXkuaXNBcnJheShlcnJvcnMpICYmIGVycm9ycy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IG1lc3NhZ2VzID0gKDxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlOiBzdHJpbmc7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVtdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdD5lcnJvcnMpLm1hcCgoeyBtZXNzYWdlIH0pID0+IG1lc3NhZ2UpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGxvZ2dlci53YXJuKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGBTa2lwcGluZyBpbmNvbWluZyBzdWJzY3JpcHRpb24uIE1lc3NhZ2VzOiAke21lc3NhZ2VzLmpvaW4oXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnXFxuJ1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCl9YFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuZHJhaW5CdWZmZXIoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCBwcmVkaWNhdGVzR3JvdXAgPSBNb2RlbFByZWRpY2F0ZUNyZWF0b3IuZ2V0UHJlZGljYXRlcyhcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5zeW5jUHJlZGljYXRlcy5nZXQobW9kZWxEZWZpbml0aW9uKSxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZmFsc2Vcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGNvbnN0IHsgW29wTmFtZV06IHJlY29yZCB9ID0gZGF0YTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gY2hlY2tpbmcgaW5jb21pbmcgc3Vic2NyaXB0aW9uIGFnYWluc3Qgc3luY1ByZWRpY2F0ZS5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIG9uY2UgQXBwU3luYyBpbXBsZW1lbnRzIGZpbHRlcnMgb24gc3Vic2NyaXB0aW9ucywgd2UnbGwgYmVcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIGFibGUgdG8gc2V0IHRoZXNlIHdoZW4gZXN0YWJsaXNoaW5nIHRoZSBzdWJzY3JpcHRpb24gaW5zdGVhZC5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFVudGlsIHRoZW4sIHdlJ2xsIG5lZWQgdG8gZmlsdGVyIGluYm91bmRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy5wYXNzZXNQcmVkaWNhdGVWYWxpZGF0aW9uKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlY29yZCxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRwcmVkaWNhdGVzR3JvdXBcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMucHVzaFRvQnVmZmVyKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRyYW5zZm9ybWVyTXV0YXRpb25UeXBlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1vZGVsRGVmaW5pdGlvbixcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWNvcmRcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMuZHJhaW5CdWZmZXIoKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiBzdWJzY3JpcHRpb25FcnJvciA9PiB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRjb25zdCB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGVycm9yOiB7IGVycm9yczogW3sgbWVzc2FnZSA9ICcnIH0gPSB7fV0gfSA9IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcnM6IFtdLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSA9IHN1YnNjcmlwdGlvbkVycm9yO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG1lc3NhZ2UuaW5jbHVkZXMoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0UFVCU1VCX0NPTlRST0xfTVNHLlJFQUxUSU1FX1NVQlNDUklQVElPTl9JTklUX0VSUk9SXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCkgfHxcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bWVzc2FnZS5pbmNsdWRlcyhQVUJTVUJfQ09OVFJPTF9NU0cuQ09OTkVDVElPTl9GQUlMRUQpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly8gVW5zdWJzY3JpYmUgYW5kIGNsZWFyIHN1YnNjcmlwdGlvbiBhcnJheSBmb3IgbW9kZWwvb3BlcmF0aW9uXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN1YnNjcmlwdGlvbnNbbW9kZWxEZWZpbml0aW9uLm5hbWVdW1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRyYW5zZm9ybWVyTXV0YXRpb25UeXBlXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdF0uZm9yRWFjaChzdWJzY3JpcHRpb24gPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRzdWJzY3JpcHRpb25zW21vZGVsRGVmaW5pdGlvbi5uYW1lXVtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0cmFuc2Zvcm1lck11dGF0aW9uVHlwZVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRdID0gW107XG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3BlcmF0aW9uQXV0aE1vZGVBdHRlbXB0c1tvcGVyYXRpb25dKys7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVyYXRpb25BdXRoTW9kZUF0dGVtcHRzW29wZXJhdGlvbl0gPj1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFkQXV0aE1vZGVzLmxlbmd0aFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb2dnZXIuZGVidWcoXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRgJHtvcGVyYXRpb259IHN1YnNjcmlwdGlvbiBmYWlsZWQgd2l0aCBhdXRoTW9kZTogJHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmVhZEF1dGhNb2Rlc1tcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVyYXRpb25BdXRoTW9kZUF0dGVtcHRzW29wZXJhdGlvbl0gLSAxXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1gXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb2dnZXIud2Fybignc3Vic2NyaXB0aW9uRXJyb3InLCBtZXNzYWdlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bG9nZ2VyLmRlYnVnKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YCR7b3BlcmF0aW9ufSBzdWJzY3JpcHRpb24gZmFpbGVkIHdpdGggYXV0aE1vZGU6ICR7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJlYWRBdXRoTW9kZXNbXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3BlcmF0aW9uQXV0aE1vZGVBdHRlbXB0c1tvcGVyYXRpb25dIC0gMVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LiBSZXRyeWluZyB3aXRoIGF1dGhNb2RlOiAke1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZWFkQXV0aE1vZGVzW1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wZXJhdGlvbkF1dGhNb2RlQXR0ZW1wdHNbb3BlcmF0aW9uXVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9YFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXV0aE1vZGVSZXRyeShvcGVyYXRpb24pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsb2dnZXIud2Fybignc3Vic2NyaXB0aW9uRXJyb3InLCBtZXNzYWdlKTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBzdWJzY3JpcHRpb25SZWFkeUNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN1YnNjcmlwdGlvblJlYWR5Q2FsbGJhY2soKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlLmluY2x1ZGVzKCdcImVycm9yVHlwZVwiOlwiVW5hdXRob3JpemVkXCInKSB8fFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtZXNzYWdlLmluY2x1ZGVzKCdcImVycm9yVHlwZVwiOlwiT3BlcmF0aW9uRGlzYWJsZWRcIicpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvYnNlcnZlci5lcnJvcihtZXNzYWdlKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdFx0XHRwcm9taXNlcy5wdXNoKFxuXHRcdFx0XHRcdFx0XHRcdFx0KGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGV0IGJvdW5kRnVuY3Rpb246IGFueTtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHRhd2FpdCBuZXcgUHJvbWlzZShyZXMgPT4ge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHN1YnNjcmlwdGlvblJlYWR5Q2FsbGJhY2sgPSByZXM7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ym91bmRGdW5jdGlvbiA9IHRoaXMuaHViUXVlcnlDb21wbGV0aW9uTGlzdGVuZXIuYmluZChcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRoaXMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXNcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdEh1Yi5saXN0ZW4oJ2FwaScsIGJvdW5kRnVuY3Rpb24pO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0SHViLnJlbW92ZSgnYXBpJywgYm91bmRGdW5jdGlvbik7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KSgpXG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0fTtcblxuXHRcdFx0XHRcdFx0XHRvcGVyYXRpb25zLmZvckVhY2gob3AgPT4gYXV0aE1vZGVSZXRyeShvcCkpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IG9ic2VydmVyLm5leHQoQ09OVFJPTF9NU0cuQ09OTkVDVEVEKSk7XG5cdFx0XHR9KSgpO1xuXG5cdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHRPYmplY3Qua2V5cyhzdWJzY3JpcHRpb25zKS5mb3JFYWNoKG1vZGVsTmFtZSA9PiB7XG5cdFx0XHRcdFx0c3Vic2NyaXB0aW9uc1ttb2RlbE5hbWVdW1xuXHRcdFx0XHRcdFx0VHJhbnNmb3JtZXJNdXRhdGlvblR5cGUuQ1JFQVRFXG5cdFx0XHRcdFx0XS5mb3JFYWNoKHN1YnNjcmlwdGlvbiA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKSk7XG5cdFx0XHRcdFx0c3Vic2NyaXB0aW9uc1ttb2RlbE5hbWVdW1xuXHRcdFx0XHRcdFx0VHJhbnNmb3JtZXJNdXRhdGlvblR5cGUuVVBEQVRFXG5cdFx0XHRcdFx0XS5mb3JFYWNoKHN1YnNjcmlwdGlvbiA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKSk7XG5cdFx0XHRcdFx0c3Vic2NyaXB0aW9uc1ttb2RlbE5hbWVdW1xuXHRcdFx0XHRcdFx0VHJhbnNmb3JtZXJNdXRhdGlvblR5cGUuREVMRVRFXG5cdFx0XHRcdFx0XS5mb3JFYWNoKHN1YnNjcmlwdGlvbiA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblx0XHR9KTtcblxuXHRcdGNvbnN0IGRhdGFPYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGU8XG5cdFx0XHRbVHJhbnNmb3JtZXJNdXRhdGlvblR5cGUsIFNjaGVtYU1vZGVsLCBQZXJzaXN0ZW50TW9kZWxdXG5cdFx0PihvYnNlcnZlciA9PiB7XG5cdFx0XHR0aGlzLmRhdGFPYnNlcnZlciA9IG9ic2VydmVyO1xuXHRcdFx0dGhpcy5kcmFpbkJ1ZmZlcigpO1xuXG5cdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHR0aGlzLmRhdGFPYnNlcnZlciA9IG51bGw7XG5cdFx0XHR9O1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjdGxPYnNlcnZhYmxlLCBkYXRhT2JzZXJ2YWJsZV07XG5cdH1cblxuXHRwcml2YXRlIHBhc3Nlc1ByZWRpY2F0ZVZhbGlkYXRpb24oXG5cdFx0cmVjb3JkOiBQZXJzaXN0ZW50TW9kZWwsXG5cdFx0cHJlZGljYXRlc0dyb3VwOiBQcmVkaWNhdGVzR3JvdXA8YW55PlxuXHQpOiBib29sZWFuIHtcblx0XHRpZiAoIXByZWRpY2F0ZXNHcm91cCkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXG5cdFx0Y29uc3QgeyBwcmVkaWNhdGVzLCB0eXBlIH0gPSBwcmVkaWNhdGVzR3JvdXA7XG5cblx0XHRyZXR1cm4gdmFsaWRhdGVQcmVkaWNhdGUocmVjb3JkLCB0eXBlLCBwcmVkaWNhdGVzKTtcblx0fVxuXG5cdHByaXZhdGUgcHVzaFRvQnVmZmVyKFxuXHRcdHRyYW5zZm9ybWVyTXV0YXRpb25UeXBlOiBUcmFuc2Zvcm1lck11dGF0aW9uVHlwZSxcblx0XHRtb2RlbERlZmluaXRpb246IFNjaGVtYU1vZGVsLFxuXHRcdGRhdGE6IFBlcnNpc3RlbnRNb2RlbFxuXHQpIHtcblx0XHR0aGlzLmJ1ZmZlci5wdXNoKFt0cmFuc2Zvcm1lck11dGF0aW9uVHlwZSwgbW9kZWxEZWZpbml0aW9uLCBkYXRhXSk7XG5cdH1cblxuXHRwcml2YXRlIGRyYWluQnVmZmVyKCkge1xuXHRcdGlmICh0aGlzLmRhdGFPYnNlcnZlcikge1xuXHRcdFx0dGhpcy5idWZmZXIuZm9yRWFjaChkYXRhID0+IHRoaXMuZGF0YU9ic2VydmVyLm5leHQoZGF0YSkpO1xuXHRcdFx0dGhpcy5idWZmZXIgPSBbXTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IHsgU3Vic2NyaXB0aW9uUHJvY2Vzc29yIH07XG4iXX0=
