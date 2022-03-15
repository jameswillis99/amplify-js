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
import Auth from '@aws-amplify/auth';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';
import { ModelAttributeAuthProvider, ModelAttributeAuthAllow } from '../types';
function getProviderFromRule(rule) {
	// private with no provider means userPools
	if (rule.allow === 'private' && !rule.provider) {
		return ModelAttributeAuthProvider.USER_POOLS;
	}
	// public with no provider means apiKey
	if (rule.allow === 'public' && !rule.provider) {
		return ModelAttributeAuthProvider.API_KEY;
	}
	return rule.provider;
}
function sortAuthRulesWithPriority(rules) {
	var allowSortPriority = [
		ModelAttributeAuthAllow.CUSTOM,
		ModelAttributeAuthAllow.OWNER,
		ModelAttributeAuthAllow.GROUPS,
		ModelAttributeAuthAllow.PRIVATE,
		ModelAttributeAuthAllow.PUBLIC,
	];
	var providerSortPriority = [
		ModelAttributeAuthProvider.FUNCTION,
		ModelAttributeAuthProvider.USER_POOLS,
		ModelAttributeAuthProvider.OIDC,
		ModelAttributeAuthProvider.IAM,
		ModelAttributeAuthProvider.API_KEY,
	];
	return __spread(rules).sort(function (a, b) {
		if (a.allow === b.allow) {
			return (
				providerSortPriority.indexOf(getProviderFromRule(a)) -
				providerSortPriority.indexOf(getProviderFromRule(b))
			);
		}
		return (
			allowSortPriority.indexOf(a.allow) - allowSortPriority.indexOf(b.allow)
		);
	});
}
function getAuthRules(_a) {
	var rules = _a.rules,
		currentUser = _a.currentUser;
	// Using Set to ensure uniqueness
	var authModes = new Set();
	rules.forEach(function (rule) {
		switch (rule.allow) {
			case ModelAttributeAuthAllow.CUSTOM:
				// custom with no provider -> function
				if (
					!rule.provider ||
					rule.provider === ModelAttributeAuthProvider.FUNCTION
				) {
					authModes.add(GRAPHQL_AUTH_MODE.AWS_LAMBDA);
				}
				break;
			case ModelAttributeAuthAllow.GROUPS:
			case ModelAttributeAuthAllow.OWNER: {
				// We shouldn't attempt User Pool or OIDC if there isn't an authenticated user
				if (currentUser) {
					if (rule.provider === ModelAttributeAuthProvider.USER_POOLS) {
						authModes.add(GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS);
					} else if (rule.provider === ModelAttributeAuthProvider.OIDC) {
						authModes.add(GRAPHQL_AUTH_MODE.OPENID_CONNECT);
					}
				}
				break;
			}
			case ModelAttributeAuthAllow.PRIVATE: {
				// We shouldn't attempt private if there isn't an authenticated user
				if (currentUser) {
					// private with no provider means userPools
					if (
						!rule.provider ||
						rule.provider === ModelAttributeAuthProvider.USER_POOLS
					) {
						authModes.add(GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS);
					} else if (rule.provider === ModelAttributeAuthProvider.IAM) {
						authModes.add(GRAPHQL_AUTH_MODE.AWS_IAM);
					}
				}
				break;
			}
			case ModelAttributeAuthAllow.PUBLIC: {
				if (rule.provider === ModelAttributeAuthProvider.IAM) {
					authModes.add(GRAPHQL_AUTH_MODE.AWS_IAM);
				} else if (
					!rule.provider ||
					rule.provider === ModelAttributeAuthProvider.API_KEY
				) {
					// public with no provider means apiKey
					authModes.add(GRAPHQL_AUTH_MODE.API_KEY);
				}
				break;
			}
			default:
				break;
		}
	});
	return Array.from(authModes);
}
export var multiAuthStrategy = function (_a) {
	var schema = _a.schema,
		modelName = _a.modelName;
	return __awaiter(void 0, void 0, void 0, function () {
		var currentUser, e_1, attributes, authAttribute, sortedRules;
		return __generator(this, function (_b) {
			switch (_b.label) {
				case 0:
					_b.trys.push([0, 2, , 3]);
					return [4 /*yield*/, Auth.currentAuthenticatedUser()];
				case 1:
					currentUser = _b.sent();
					return [3 /*break*/, 3];
				case 2:
					e_1 = _b.sent();
					return [3 /*break*/, 3];
				case 3:
					attributes = schema.namespaces.user.models[modelName].attributes;
					if (attributes) {
						authAttribute = attributes.find(function (attr) {
							return attr.type === 'auth';
						});
						if (authAttribute.properties && authAttribute.properties.rules) {
							sortedRules = sortAuthRulesWithPriority(
								authAttribute.properties.rules
							);
							return [
								2 /*return*/,
								getAuthRules({ currentUser: currentUser, rules: sortedRules }),
							];
						}
					}
					return [2 /*return*/, []];
			}
		});
	});
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlBdXRoU3RyYXRlZ3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXV0aE1vZGVTdHJhdGVnaWVzL211bHRpQXV0aFN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsT0FBTyxJQUFJLE1BQU0sbUJBQW1CLENBQUM7QUFDckMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDN0QsT0FBTyxFQUdOLDBCQUEwQixFQUMxQix1QkFBdUIsR0FDdkIsTUFBTSxVQUFVLENBQUM7QUFFbEIsU0FBUyxtQkFBbUIsQ0FDM0IsSUFBZ0M7SUFFaEMsMkNBQTJDO0lBQzNDLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQy9DLE9BQU8sMEJBQTBCLENBQUMsVUFBVSxDQUFDO0tBQzdDO0lBQ0QsdUNBQXVDO0lBQ3ZDLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQzlDLE9BQU8sMEJBQTBCLENBQUMsT0FBTyxDQUFDO0tBQzFDO0lBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3RCLENBQUM7QUFFRCxTQUFTLHlCQUF5QixDQUFDLEtBQW1DO0lBQ3JFLElBQU0saUJBQWlCLEdBQUc7UUFDekIsdUJBQXVCLENBQUMsTUFBTTtRQUM5Qix1QkFBdUIsQ0FBQyxLQUFLO1FBQzdCLHVCQUF1QixDQUFDLE1BQU07UUFDOUIsdUJBQXVCLENBQUMsT0FBTztRQUMvQix1QkFBdUIsQ0FBQyxNQUFNO0tBQzlCLENBQUM7SUFDRixJQUFNLG9CQUFvQixHQUFHO1FBQzVCLDBCQUEwQixDQUFDLFFBQVE7UUFDbkMsMEJBQTBCLENBQUMsVUFBVTtRQUNyQywwQkFBMEIs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QVMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3pDO2dCQUNELE1BQU07YUFDTjtZQUNEO2dCQUNDLE1BQU07U0FDUDtJQUNGLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFFRCxNQUFNLENBQUMsSUFBTSxpQkFBaUIsR0FBcUIsVUFBTyxFQUd6RDtRQUZBLGtCQUFNLEVBQ04sd0JBQVM7Ozs7Ozs7b0JBSU0scUJBQU0sSUFBSSxDQUFDLHdCQUF3QixFQUFFLEVBQUE7O29CQUFuRCxXQUFXLEdBQUcsU0FBcUMsQ0FBQzs7Ozs7O29CQUs3QyxVQUFVLEdBQUssTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUE3QyxDQUE4QztvQkFFaEUsSUFBSSxVQUFVLEVBQUU7d0JBQ1QsYUFBYSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxJQUFJLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO3dCQUVwRSxJQUFJLGFBQWEsQ0FBQyxVQUFVLElBQUksYUFBYSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUU7NEJBQ3pELFdBQVcsR0FBRyx5QkFBeUIsQ0FDNUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQzlCLENBQUM7NEJBRUYsc0JBQU8sWUFBWSxDQUFDLEVBQUUsV0FBVyxhQUFBLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUM7eUJBQ3pEO3FCQUNEO29CQUNELHNCQUFPLEVBQUUsRUFBQzs7OztDQUNWLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXV0aCBmcm9tICdAYXdzLWFtcGxpZnkvYXV0aCc7XG5pbXBvcnQgeyBHUkFQSFFMX0FVVEhfTU9ERSB9IGZyb20gJ0Bhd3MtYW1wbGlmeS9hcGktZ3JhcGhxbCc7XG5pbXBvcnQge1xuXHRBdXRoTW9kZVN0cmF0ZWd5LFxuXHRNb2RlbEF0dHJpYnV0ZUF1dGhQcm9wZXJ0eSxcblx0TW9kZWxBdHRyaWJ1dGVBdXRoUHJvdmlkZXIsXG5cdE1vZGVsQXR0cmlidXRlQXV0aEFsbG93LFxufSBmcm9tICcuLi90eXBlcyc7XG5cbmZ1bmN0aW9uIGdldFByb3ZpZGVyRnJvbVJ1bGUoXG5cdHJ1bGU6IE1vZGVsQXR0cmlidXRlQXV0aFByb3BlcnR5XG4pOiBNb2RlbEF0dHJpYnV0ZUF1dGhQcm92aWRlciB7XG5cdC8vIHByaXZhdGUgd2l0aCBubyBwcm92aWRlciBtZWFucyB1c2VyUG9vbHNcblx0aWYgKHJ1bGUuYWxsb3cgPT09ICdwcml2YXRlJyAmJiAhcnVsZS5wcm92aWRlcikge1xuXHRcdHJldHVybiBNb2RlbEF0dHJpYnV0ZUF1dGhQcm92aWRlci5VU0VSX1BPT0xTO1xuXHR9XG5cdC8vIHB1YmxpYyB3aXRoIG5vIHByb3ZpZGVyIG1lYW5zIGFwaUtleVxuXHRpZiAocnVsZS5hbGxvdyA9PT0gJ3B1YmxpYycgJiYgIXJ1bGUucHJvdmlkZXIpIHtcblx0XHRyZXR1cm4gTW9kZWxBdHRyaWJ1dGVBdXRoUHJvdmlkZXIuQVBJX0tFWTtcblx0fVxuXHRyZXR1cm4gcnVsZS5wcm92aWRlcjtcbn1cblxuZnVuY3Rpb24gc29ydEF1dGhSdWxlc1dpdGhQcmlvcml0eShydWxlczogTW9kZWxBdHRyaWJ1dGVBdXRoUHJvcGVydHlbXSkge1xuXHRjb25zdCBhbGxvd1NvcnRQcmlvcml0eSA9IFtcblx0XHRNb2RlbEF0dHJpYnV0ZUF1dGhBbGxvdy5DVVNUT00sXG5cdFx0TW9kZWxBdHRyaWJ1dGVBdXRoQWxsb3cuT1dORVIsXG5cdFx0TW9kZWxBdHRyaWJ1dGVBdXRoQWxsb3cuR1JPVVBTLFxuXHRcdE1vZGVsQXR0cmlidXRlQXV0aEFsbG93LlBSSVZBVEUsXG5cdFx0TW9kZWxBdHRyaWJ1dGVBdXRoQWxsb3cuUFVCTElDLFxuXHRdO1xuXHRjb25zdCBwcm92aWRlclNvcnRQcmlvcml0eSA9IFtcblx0XHRNb2RlbEF0dHJpYnV0ZUF1dGhQcm92aWRlci5GVU5DVElPTixcblx0XHRNb2RlbEF0dHJpYnV0ZUF1dGhQcm92aWRlci5VU0VSX1BPT0xTLFxuXHRcdE1vZGVsQXR0cmlidXRlQXV0aFByb3ZpZGVyLk9JREMsXG5cdFx0TW9kZWxBdHRyaWJ1dGVBdXRoUHJvdmlkZXIuSUFNLFxuXHRcdE1vZGVsQXR0cmlidXRlQXV0aFByb3ZpZGVyLkFQSV9LRVksXG5cdF07XG5cblx0cmV0dXJuIFsuLi5ydWxlc10uc29ydChcblx0XHQoYTogTW9kZWxBdHRyaWJ1dGVBdXRoUHJvcGVydHksIGI6IE1vZGVsQXR0cmlidXRlQXV0aFByb3BlcnR5KSA9PiB7XG5cdFx0XHRpZiAoYS5hbGxvdyA9PT0gYi5hbGxvdykge1xuXHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdHByb3ZpZGVyU29ydFByaW9yaXR5LmluZGV4T2YoZ2V0UHJvdmlkZXJGcm9tUnVsZShhKSkgLVxuXHRcdFx0XHRcdHByb3ZpZGVyU29ydFByaW9yaXR5LmluZGV4T2YoZ2V0UHJvdmlkZXJGcm9tUnVsZShiKSlcblx0XHRcdFx0KTtcblx0XHRcdH1cblx0XHRcdHJldHVybiAoXG5cdFx0XHRcdGFsbG93U29ydFByaW9yaXR5LmluZGV4T2YoYS5hbGxvdykgLSBhbGxvd1NvcnRQcmlvcml0eS5pbmRleE9mKGIuYWxsb3cpXG5cdFx0XHQpO1xuXHRcdH1cblx0KTtcbn1cblxuZnVuY3Rpb24gZ2V0QXV0aFJ1bGVzKHtcblx0cnVsZXMsXG5cdGN1cnJlbnRVc2VyLFxufToge1xuXHRydWxlczogTW9kZWxBdHRyaWJ1dGVBdXRoUHJvcGVydHlbXTtcblx0Y3VycmVudFVzZXI6IHVua25vd247XG59KSB7XG5cdC8vIFVzaW5nIFNldCB0byBlbnN1cmUgdW5pcXVlbmVzc1xuXHRjb25zdCBhdXRoTW9kZXMgPSBuZXcgU2V0PEdSQVBIUUxfQVVUSF9NT0RFPigpO1xuXG5cdHJ1bGVzLmZvckVhY2gocnVsZSA9PiB7XG5cdFx0c3dpdGNoIChydWxlLmFsbG93KSB7XG5cdFx0XHRjYXNlIE1vZGVsQXR0cmlidXRlQXV0aEFsbG93LkNVU1RPTTpcblx0XHRcdFx0Ly8gY3VzdG9tIHdpdGggbm8gcHJvdmlkZXIgLT4gZnVuY3Rpb25cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdCFydWxlLnByb3ZpZGVyIHx8XG5cdFx0XHRcdFx0cnVsZS5wcm92aWRlciA9PT0gTW9kZWxBdHRyaWJ1dGVBdXRoUHJvdmlkZXIuRlVOQ1RJT05cblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0YXV0aE1vZGVzLmFkZChHUkFQSFFMX0FVVEhfTU9ERS5BV1NfTEFNQkRBKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGNhc2UgTW9kZWxBdHRyaWJ1dGVBdXRoQWxsb3cuR1JPVVBTOlxuXHRcdFx0Y2FzZSBNb2RlbEF0dHJpYnV0ZUF1dGhBbGxvdy5PV05FUjoge1xuXHRcdFx0XHQvLyBXZSBzaG91bGRuJ3QgYXR0ZW1wdCBVc2VyIFBvb2wgb3IgT0lEQyBpZiB0aGVyZSBpc24ndCBhbiBhdXRoZW50aWNhdGVkIHVzZXJcblx0XHRcdFx0aWYgKGN1cnJlbnRVc2VyKSB7XG5cdFx0XHRcdFx0aWYgKHJ1bGUucHJvdmlkZXIgPT09IE1vZGVsQXR0cmlidXRlQXV0aFByb3ZpZGVyLlVTRVJfUE9PTFMpIHtcblx0XHRcdFx0XHRcdGF1dGhNb2Rlcy5hZGQoR1JBUEhRTF9BVVRIX01PREUuQU1BWk9OX0NPR05JVE9fVVNFUl9QT09MUyk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmIChydWxlLnByb3ZpZGVyID09PSBNb2RlbEF0dHJpYnV0ZUF1dGhQcm92aWRlci5PSURDKSB7XG5cdFx0XHRcdFx0XHRhdXRoTW9kZXMuYWRkKEdSQVBIUUxfQVVUSF9NT0RFLk9QRU5JRF9DT05ORUNUKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRjYXNlIE1vZGVsQXR0cmlidXRlQXV0aEFsbG93LlBSSVZBVEU6IHtcblx0XHRcdFx0Ly8gV2Ugc2hvdWxkbid0IGF0dGVtcHQgcHJpdmF0ZSBpZiB0aGVyZSBpc24ndCBhbiBhdXRoZW50aWNhdGVkIHVzZXJcblx0XHRcdFx0aWYgKGN1cnJlbnRVc2VyKSB7XG5cdFx0XHRcdFx0Ly8gcHJpdmF0ZSB3aXRoIG5vIHByb3ZpZGVyIG1lYW5zIHVzZXJQb29sc1xuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdCFydWxlLnByb3ZpZGVyIHx8XG5cdFx0XHRcdFx0XHRydWxlLnByb3ZpZGVyID09PSBNb2RlbEF0dHJpYnV0ZUF1dGhQcm92aWRlci5VU0VSX1BPT0xTXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRhdXRoTW9kZXMuYWRkKEdSQVBIUUxfQVVUSF9NT0RFLkFNQVpPTl9DT0dOSVRPX1VTRVJfUE9PTFMpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAocnVsZS5wcm92aWRlciA9PT0gTW9kZWxBdHRyaWJ1dGVBdXRoUHJvdmlkZXIuSUFNKSB7XG5cdFx0XHRcdFx0XHRhdXRoTW9kZXMuYWRkKEdSQVBIUUxfQVVUSF9NT0RFLkFXU19JQU0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Y2FzZSBNb2RlbEF0dHJpYnV0ZUF1dGhBbGxvdy5QVUJMSUM6IHtcblx0XHRcdFx0aWYgKHJ1bGUucHJvdmlkZXIgPT09IE1vZGVsQXR0cmlidXRlQXV0aFByb3ZpZGVyLklBTSkge1xuXHRcdFx0XHRcdGF1dGhNb2Rlcy5hZGQoR1JBUEhRTF9BVVRIX01PREUuQVdTX0lBTSk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoXG5cdFx0XHRcdFx0IXJ1bGUucHJvdmlkZXIgfHxcblx0XHRcdFx0XHRydWxlLnByb3ZpZGVyID09PSBNb2RlbEF0dHJpYnV0ZUF1dGhQcm92aWRlci5BUElfS0VZXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdC8vIHB1YmxpYyB3aXRoIG5vIHByb3ZpZGVyIG1lYW5zIGFwaUtleVxuXHRcdFx0XHRcdGF1dGhNb2Rlcy5hZGQoR1JBUEhRTF9BVVRIX01PREUuQVBJX0tFWSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRicmVhaztcblx0XHR9XG5cdH0pO1xuXG5cdHJldHVybiBBcnJheS5mcm9tKGF1dGhNb2Rlcyk7XG59XG5cbmV4cG9ydCBjb25zdCBtdWx0aUF1dGhTdHJhdGVneTogQXV0aE1vZGVTdHJhdGVneSA9IGFzeW5jICh7XG5cdHNjaGVtYSxcblx0bW9kZWxOYW1lLFxufSkgPT4ge1xuXHRsZXQgY3VycmVudFVzZXI7XG5cdHRyeSB7XG5cdFx0Y3VycmVudFVzZXIgPSBhd2FpdCBBdXRoLmN1cnJlbnRBdXRoZW50aWNhdGVkVXNlcigpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0Ly8gTm8gY3VycmVudCB1c2VyXG5cdH1cblxuXHRjb25zdCB7IGF0dHJpYnV0ZXMgfSA9IHNjaGVtYS5uYW1lc3BhY2VzLnVzZXIubW9kZWxzW21vZGVsTmFtZV07XG5cblx0aWYgKGF0dHJpYnV0ZXMpIHtcblx0XHRjb25zdCBhdXRoQXR0cmlidXRlID0gYXR0cmlidXRlcy5maW5kKGF0dHIgPT4gYXR0ci50eXBlID09PSAnYXV0aCcpO1xuXG5cdFx0aWYgKGF1dGhBdHRyaWJ1dGUucHJvcGVydGllcyAmJiBhdXRoQXR0cmlidXRlLnByb3BlcnRpZXMucnVsZXMpIHtcblx0XHRcdGNvbnN0IHNvcnRlZFJ1bGVzID0gc29ydEF1dGhSdWxlc1dpdGhQcmlvcml0eShcblx0XHRcdFx0YXV0aEF0dHJpYnV0ZS5wcm9wZXJ0aWVzLnJ1bGVzXG5cdFx0XHQpO1xuXG5cdFx0XHRyZXR1cm4gZ2V0QXV0aFJ1bGVzKHsgY3VycmVudFVzZXIsIHJ1bGVzOiBzb3J0ZWRSdWxlcyB9KTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIFtdO1xufTtcbiJdfQ==
