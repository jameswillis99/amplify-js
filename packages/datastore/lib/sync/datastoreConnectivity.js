'use strict';
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
var __importStar =
	(this && this.__importStar) ||
	function (mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null)
			for (var k in mod)
				if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
		result['default'] = mod;
		return result;
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
var api_1 = __importStar(require('@aws-amplify/api'));
var zen_observable_ts_1 = __importDefault(require('zen-observable-ts'));
var core_1 = require('@aws-amplify/core');
var datastoreReachability_1 = require('./datastoreReachability');
var logger = new core_1.ConsoleLogger('DataStore');
var RECONNECTING_IN = 5000; // 5s this may be configurable in the future
var DataStoreConnectivity = /** @class */ (function () {
	function DataStoreConnectivity() {
		this.connectionStatus = {
			online: false,
		};
	}
	DataStoreConnectivity.prototype.status = function (pollOffline) {
		var _this = this;
		if (this.observer) {
			throw new Error('Subscriber already exists');
		}
		return new zen_observable_ts_1.default(function (observer) {
			_this.observer = observer;
			// Will be used to forward socket connection changes, enhancing Reachability
			_this.subscription =
				datastoreReachability_1.ReachabilityMonitor.subscribe(function (_a) {
					var online = _a.online;
					_this.connectionStatus.online = online;
					var observerResult = __assign({}, _this.connectionStatus); // copyOf status
					observer.next(observerResult);
				});
			if (pollOffline && pollOffline.enabled) {
				_this.interval = setInterval(function () {
					return __awaiter(_this, void 0, void 0, function () {
						var err_1;
						return __generator(this, function (_a) {
							switch (_a.label) {
								case 0:
									_a.trys.push([0, 2, , 3]);
									return [
										4 /*yield*/,
										api_1.default.graphql({
											query:
												'query MyQuery {\n\t\t\t\t\t\t\t__typename\n\t\t\t\t\t\t  }',
											authMode:
												api_1.GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
										}),
									];
								case 1:
									_a.sent();
									if (this.connectionStatus.online === false) {
										// do not trigger subscriptions
										this.observer.next({ online: true });
										this.connectionStatus.online = true;
									}
									return [3 /*break*/, 3];
								case 2:
									err_1 = _a.sent();
									if (this.connectionStatus.online === true) {
										// do not trigger subscriptions
										this.observer.next({ online: false });
										this.connectionStatus.online = false;
									}
									return [3 /*break*/, 3];
								case 3:
									return [2 /*return*/];
							}
						});
					});
				}, pollOffline.interval || RECONNECTING_IN);
			}
			return function () {
				clearInterval(_this.interval);
				clearTimeout(_this.timeout);
				_this.unsubscribe();
			};
		});
	};
	DataStoreConnectivity.prototype.unsubscribe = function () {
		if (this.subscription) {
			clearTimeout(this.timeout);
			this.subscription.unsubscribe();
		}
	};
	DataStoreConnectivity.prototype.socketDisconnected = function () {
		var _this = this;
		if (this.observer && typeof this.observer.next === 'function') {
			this.connectionStatus.online = false;
			this.observer.next({ online: false }); // Notify network issue from the socket
			this.timeout = setTimeout(function () {
				var observerResult = __assign({}, _this.connectionStatus); // copyOf status
				_this.observer.next(observerResult);
			}, RECONNECTING_IN); // giving time for socket cleanup and network status stabilization
		}
	};
	DataStoreConnectivity.prototype.networkDisconnected = function () {
		return __awaiter(this, void 0, void 0, function () {
			return __generator(this, function (_a) {
				if (this.observer && typeof this.observer.next === 'function') {
					this.connectionStatus.online = false;
					this.observer.next({ online: false }); // Notify network issue from the socket
				}
				return [2 /*return*/];
			});
		});
	};
	return DataStoreConnectivity;
})();
exports.default = DataStoreConnectivity;
//# sourceMappingURL=datastoreConnectivity.js.map
