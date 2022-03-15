'use strict';
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
Object.defineProperty(exports, '__esModule', { value: true });
var buffer_1 = require('buffer');
var ulid_1 = require('ulid');
var uuid_1 = require('uuid');
var types_1 = require('./types');
var amazon_cognito_identity_js_1 = require('amazon-cognito-identity-js');
exports.exhaustiveCheck = function (obj, throwOnError) {
	if (throwOnError === void 0) {
		throwOnError = true;
	}
	if (throwOnError) {
		throw new Error('Invalid ' + obj);
	}
};
exports.isNullOrUndefined = function (val) {
	return typeof val === 'undefined' || val === undefined || val === null;
};
exports.validatePredicate = function (model, groupType, predicatesOrGroups) {
	var filterType;
	var isNegation = false;
	if (predicatesOrGroups.length === 0) {
		return true;
	}
	switch (groupType) {
		case 'not':
			filterType = 'every';
			isNegation = true;
			break;
		case 'and':
			filterType = 'every';
			break;
		case 'or':
			filterType = 'some';
			break;
		default:
			exports.exhaustiveCheck(groupType);
	}
	var result = predicatesOrGroups[filterType](function (predicateOrGroup) {
		if (types_1.isPredicateObj(predicateOrGroup)) {
			var field = predicateOrGroup.field,
				operator = predicateOrGroup.operator,
				operand = predicateOrGroup.operand;
			var value = model[field];
			return exports.validatePredicateField(value, operator, operand);
		}
		if (types_1.isPredicateGroup(predicateOrGroup)) {
			var type = predicateOrGroup.type,
				predicates = predicateOrGroup.predicates;
			return exports.validatePredicate(model, type, predicates);
		}
		throw new Error('Not a predicate or group');
	});
	return isNegation ? !result : result;
};
exports.validatePredicateField = function (value, operator, operand) {
	switch (operator) {
		case 'ne':
			return value !== operand;
		case 'eq':
			return value === operand;
		case 'le':
			return value <= operand;
		case 'lt':
			return value < operand;
		case 'ge':
			return value >= operand;
		case 'gt':
			return value > operand;
		case 'between':
			var _c = __read(operand, 2),
				min = _c[0],
				max = _c[1];
			return value >= min && value <= max;
		case 'beginsWith':
			return !exports.isNullOrUndefined(value) && value.startsWith(operand);
		case 'contains':
			return !exports.isNullOrUndefined(value) && value.indexOf(operand) > -1;
		case 'notContains':
			return exports.isNullOrUndefined(value) || value.indexOf(operand) === -1;
		default:
			exports.exhaustiveCheck(operator, false);
			return false;
	}
};
exports.isModelConstructor = function (obj) {
	return obj && typeof obj.copyOf === 'function';
};
var nonModelClasses = new WeakSet();
function registerNonModelClass(clazz) {
	nonModelClasses.add(clazz);
}
exports.registerNonModelClass = registerNonModelClass;
exports.isNonModelConstructor = function (obj) {
	return nonModelClasses.has(obj);
};
/*
  When we have GSI(s) with composite sort keys defined on a model
    There are some very particular rules regarding which fields must be included in the update mutation input
    The field selection becomes more complex as the number of GSIs with composite sort keys grows

    To summarize: any time we update a field that is part of the composite sort key of a GSI, we must include:
     1. all of the other fields in that composite sort key
     2. all of the fields from any other composite sort key that intersect with the fields from 1.

     E.g.,
     Model @model
        @key(name: 'key1' fields: ['hk', 'a', 'b', 'c'])
        @key(name: 'key2' fields: ['hk', 'a', 'b', 'd'])
        @key(name: 'key3' fields: ['hk', 'x', 'y', 'z'])

    Model.a is updated => include ['a', 'b', 'c', 'd']
    Model.c is updated => include ['a', 'b', 'c', 'd']
    Model.d is updated => include ['a', 'b', 'c', 'd']
    Model.x is updated => include ['x', 'y', 'z']

    This function accepts a model's attributes and returns grouped sets of composite key fields
    Using our example Model above, the function will return:
    [
        Set('a', 'b', 'c', 'd'),
        Set('x', 'y', 'z'),
    ]

    This gives us the opportunity to correctly include the required fields for composite keys
    When crafting the mutation input in Storage.getUpdateMutationInput

    See 'processCompositeKeys' test in util.test.ts for more examples
*/
exports.processCompositeKeys = function (attributes) {
	var extractCompositeSortKey = function (_c) {
		var // ignore the HK (fields[0]) we only need to include the composite sort key fields[1...n]
			_d = __read(_c.properties.fields),
			sortKeyFields = _d.slice(1);
		return sortKeyFields;
	};
	var compositeKeyFields = attributes
		.filter(types_1.isModelAttributeCompositeKey)
		.map(extractCompositeSortKey);
	/*
        if 2 sets of fields have any intersecting fields => combine them into 1 union set
        e.g., ['a', 'b', 'c'] and ['a', 'b', 'd'] => ['a', 'b', 'c', 'd']
    */
	var combineIntersecting = function (fields) {
		return fields.reduce(function (combined, sortKeyFields) {
			var sortKeyFieldsSet = new Set(sortKeyFields);
			if (combined.length === 0) {
				combined.push(sortKeyFieldsSet);
				return combined;
			}
			// does the current set share values with another set we've already added to `combined`?
			var intersectingSetIdx = combined.findIndex(function (existingSet) {
				return __spread(existingSet).some(function (f) {
					return sortKeyFieldsSet.has(f);
				});
			});
			if (intersectingSetIdx > -1) {
				var union = new Set(
					__spread(combined[intersectingSetIdx], sortKeyFieldsSet)
				);
				// combine the current set with the intersecting set we found above
				combined[intersectingSetIdx] = union;
			} else {
				// none of the sets in `combined` have intersecting values with the current set
				combined.push(sortKeyFieldsSet);
			}
			return combined;
		}, []);
	};
	var initial = combineIntersecting(compositeKeyFields);
	// a single pass pay not be enough to correctly combine all the fields
	// call the function once more to get a final merged list of sets
	var combined = combineIntersecting(initial);
	return combined;
};
exports.establishRelationAndKeys = function (namespace) {
	var relationship = {};
	var keys = {};
	Object.keys(namespace.models).forEach(function (mKey) {
		var e_1, _c, e_2, _d;
		relationship[mKey] = { indexes: [], relationTypes: [] };
		keys[mKey] = {};
		var model = namespace.models[mKey];
		Object.keys(model.fields).forEach(function (attr) {
			var fieldAttribute = model.fields[attr];
			if (
				typeof fieldAttribute.type === 'object' &&
				'model' in fieldAttribute.type
			) {
				var connectionType = fieldAttribute.association.connectionType;
				relationship[mKey].relationTypes.push({
					fieldName: fieldAttribute.name,
					modelName: fieldAttribute.type.model,
					relationType: connectionType,
					targetName: fieldAttribute.association['targetName'],
					associatedWith: fieldAttribute.association['associatedWith'],
				});
				if (connectionType === 'BELONGS_TO') {
					relationship[mKey].indexes.push(
						fieldAttribute.association['targetName']
					);
				}
			}
		});
		if (model.attributes) {
			keys[mKey].compositeKeys = exports.processCompositeKeys(model.attributes);
			try {
				for (
					var _e = __values(model.attributes), _f = _e.next();
					!_f.done;
					_f = _e.next()
				) {
					var attribute = _f.value;
					if (!types_1.isModelAttributeKey(attribute)) {
						continue;
					}
					if (types_1.isModelAttributePrimaryKey(attribute)) {
						keys[mKey].primaryKey = attribute.properties.fields;
					}
					var fields = attribute.properties.fields;
					try {
						for (
							var fields_1 = ((e_2 = void 0), __values(fields)),
								fields_1_1 = fields_1.next();
							!fields_1_1.done;
							fields_1_1 = fields_1.next()
						) {
							var field = fields_1_1.value;
							// only add index if it hasn't already been added
							var exists = relationship[mKey].indexes.includes(field);
							if (!exists) {
								relationship[mKey].indexes.push(field);
							}
						}
					} catch (e_2_1) {
						e_2 = { error: e_2_1 };
					} finally {
						try {
							if (fields_1_1 && !fields_1_1.done && (_d = fields_1.return))
								_d.call(fields_1);
						} finally {
							if (e_2) throw e_2.error;
						}
					}
				}
			} catch (e_1_1) {
				e_1 = { error: e_1_1 };
			} finally {
				try {
					if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
				} finally {
					if (e_1) throw e_1.error;
				}
			}
		}
	});
	return [relationship, keys];
};
var topologicallySortedModels = new WeakMap();
exports.traverseModel = function (
	srcModelName,
	instance,
	namespace,
	modelInstanceCreator,
	getModelConstructorByModelName
) {
	var relationships = namespace.relationships;
	var modelConstructor = getModelConstructorByModelName(
		namespace.name,
		srcModelName
	);
	var relation = relationships[srcModelName];
	var result = [];
	var newInstance = modelConstructor.copyOf(instance, function (draftInstance) {
		relation.relationTypes.forEach(function (rItem) {
			var modelConstructor = getModelConstructorByModelName(
				namespace.name,
				rItem.modelName
			);
			switch (rItem.relationType) {
				case 'HAS_ONE':
					if (instance[rItem.fieldName]) {
						var modelInstance = void 0;
						try {
							modelInstance = modelInstanceCreator(
								modelConstructor,
								instance[rItem.fieldName]
							);
						} catch (error) {
							// Do nothing
							console.log(error);
						}
						result.push({
							modelName: rItem.modelName,
							item: instance[rItem.fieldName],
							instance: modelInstance,
						});
						// targetName will be defined for Has One if feature flag
						// https://docs.amplify.aws/cli/reference/feature-flags/#useAppsyncModelgenPlugin
						// is true (default as of 5/7/21)
						// Making this conditional for backward-compatibility
						if (rItem.targetName) {
							draftInstance[rItem.targetName] =
								draftInstance[rItem.fieldName].id;
							delete draftInstance[rItem.fieldName];
						} else {
							draftInstance[rItem.fieldName] =
								draftInstance[rItem.fieldName].id;
						}
					}
					break;
				case 'BELONGS_TO':
					if (instance[rItem.fieldName]) {
						var modelInstance = void 0;
						try {
							modelInstance = modelInstanceCreator(
								modelConstructor,
								instance[rItem.fieldName]
							);
						} catch (error) {
							// Do nothing
						}
						var isDeleted = draftInstance[rItem.fieldName]._deleted;
						if (!isDeleted) {
							result.push({
								modelName: rItem.modelName,
								item: instance[rItem.fieldName],
								instance: modelInstance,
							});
						}
					}
					if (draftInstance[rItem.fieldName]) {
						draftInstance[rItem.targetName] = draftInstance[rItem.fieldName].id;
						delete draftInstance[rItem.fieldName];
					}
					break;
				case 'HAS_MANY':
					// Intentionally blank
					break;
				default:
					exports.exhaustiveCheck(rItem.relationType);
					break;
			}
		});
	});
	result.unshift({
		modelName: srcModelName,
		item: newInstance,
		instance: newInstance,
	});
	if (!topologicallySortedModels.has(namespace)) {
		topologicallySortedModels.set(
			namespace,
			Array.from(namespace.modelTopologicalOrdering.keys())
		);
	}
	var sortedModels = topologicallySortedModels.get(namespace);
	result.sort(function (a, b) {
		return (
			sortedModels.indexOf(a.modelName) - sortedModels.indexOf(b.modelName)
		);
	});
	return result;
};
exports.getIndex = function (rel, src) {
	var index = '';
	rel.some(function (relItem) {
		if (relItem.modelName === src) {
			index = relItem.targetName;
		}
	});
	return index;
};
exports.getIndexFromAssociation = function (indexes, src) {
	var index = indexes.find(function (idx) {
		return idx === src;
	});
	return index;
};
var NAMESPACES;
(function (NAMESPACES) {
	NAMESPACES['DATASTORE'] = 'datastore';
	NAMESPACES['USER'] = 'user';
	NAMESPACES['SYNC'] = 'sync';
	NAMESPACES['STORAGE'] = 'storage';
})((NAMESPACES = exports.NAMESPACES || (exports.NAMESPACES = {})));
var DATASTORE = NAMESPACES.DATASTORE;
exports.DATASTORE = DATASTORE;
var USER = NAMESPACES.USER;
exports.USER = USER;
var SYNC = NAMESPACES.SYNC;
exports.SYNC = SYNC;
var STORAGE = NAMESPACES.STORAGE;
exports.STORAGE = STORAGE;
var privateModeCheckResult;
exports.isPrivateMode = function () {
	return new Promise(function (resolve) {
		var dbname = uuid_1.v4();
		var db;
		var isPrivate = function () {
			privateModeCheckResult = false;
			resolve(true);
		};
		var isNotPrivate = function () {
			return __awaiter(void 0, void 0, void 0, function () {
				return __generator(this, function (_c) {
					switch (_c.label) {
						case 0:
							if (!(db && db.result && typeof db.result.close === 'function'))
								return [3 /*break*/, 2];
							return [4 /*yield*/, db.result.close()];
						case 1:
							_c.sent();
							_c.label = 2;
						case 2:
							return [4 /*yield*/, indexedDB.deleteDatabase(dbname)];
						case 3:
							_c.sent();
							privateModeCheckResult = true;
							return [2 /*return*/, resolve(false)];
					}
				});
			});
		};
		if (privateModeCheckResult === true) {
			return isNotPrivate();
		}
		if (privateModeCheckResult === false) {
			return isPrivate();
		}
		if (indexedDB === null) return isPrivate();
		db = indexedDB.open(dbname);
		db.onerror = isPrivate;
		db.onsuccess = isNotPrivate;
	});
};
var randomBytes = function (nBytes) {
	return buffer_1.Buffer.from(
		new amazon_cognito_identity_js_1.WordArray().random(nBytes).toString(),
		'hex'
	);
};
var prng = function () {
	return randomBytes(1).readUInt8(0) / 0xff;
};
function monotonicUlidFactory(seed) {
	var ulid = ulid_1.monotonicFactory(prng);
	return function () {
		return ulid(seed);
	};
}
exports.monotonicUlidFactory = monotonicUlidFactory;
/**
 * Uses performance.now() if available, otherwise, uses Date.now() (e.g. react native without a polyfill)
 *
 * The values returned by performance.now() always increase at a constant rate,
 * independent of the system clock (which might be adjusted manually or skewed
 * by software like NTP).
 *
 * Otherwise, performance.timing.navigationStart + performance.now() will be
 * approximately equal to Date.now()
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#Example
 */
function getNow() {
	if (
		typeof performance !== 'undefined' &&
		performance &&
		typeof performance.now === 'function'
	) {
		return performance.now() | 0; // convert to integer
	} else {
		return Date.now();
	}
}
exports.getNow = getNow;
function sortCompareFunction(sortPredicates) {
	return function compareFunction(a, b) {
		var e_3, _c;
		try {
			// enable multi-field sort by iterating over predicates until
			// a comparison returns -1 or 1
			for (
				var sortPredicates_1 = __values(sortPredicates),
					sortPredicates_1_1 = sortPredicates_1.next();
				!sortPredicates_1_1.done;
				sortPredicates_1_1 = sortPredicates_1.next()
			) {
				var predicate = sortPredicates_1_1.value;
				var field = predicate.field,
					sortDirection = predicate.sortDirection;
				// reverse result when direction is descending
				var sortMultiplier =
					sortDirection === types_1.SortDirection.ASCENDING ? 1 : -1;
				if (a[field] < b[field]) {
					return -1 * sortMultiplier;
				}
				if (a[field] > b[field]) {
					return 1 * sortMultiplier;
				}
			}
		} catch (e_3_1) {
			e_3 = { error: e_3_1 };
		} finally {
			try {
				if (
					sortPredicates_1_1 &&
					!sortPredicates_1_1.done &&
					(_c = sortPredicates_1.return)
				)
					_c.call(sortPredicates_1);
			} finally {
				if (e_3) throw e_3.error;
			}
		}
		return 0;
	};
}
exports.sortCompareFunction = sortCompareFunction;
// deep compare any 2 values
// primitives or object types (including arrays, Sets, and Maps)
// returns true if equal by value
// if nullish is true, treat undefined and null values as equal
// to normalize for GQL response values for undefined fields
function valuesEqual(valA, valB, nullish) {
	var e_4, _c;
	if (nullish === void 0) {
		nullish = false;
	}
	var a = valA;
	var b = valB;
	var nullishCompare = function (_a, _b) {
		return (
			(_a === undefined || _a === null) && (_b === undefined || _b === null)
		);
	};
	// if one of the values is a primitive and the other is an object
	if (
		(a instanceof Object && !(b instanceof Object)) ||
		(!(a instanceof Object) && b instanceof Object)
	) {
		return false;
	}
	// compare primitive types
	if (!(a instanceof Object)) {
		if (nullish && nullishCompare(a, b)) {
			return true;
		}
		return a === b;
	}
	// make sure object types match
	if (
		(Array.isArray(a) && !Array.isArray(b)) ||
		(Array.isArray(b) && !Array.isArray(a))
	) {
		return false;
	}
	if (a instanceof Set && b instanceof Set) {
		a = __spread(a);
		b = __spread(b);
	}
	if (a instanceof Map && b instanceof Map) {
		a = Object.fromEntries(a);
		b = Object.fromEntries(b);
	}
	var aKeys = Object.keys(a);
	var bKeys = Object.keys(b);
	// last condition is to ensure that [] !== [null] even if nullish. However [undefined] === [null] when nullish
	if (aKeys.length !== bKeys.length && (!nullish || Array.isArray(a))) {
		return false;
	}
	// iterate through the longer set of keys
	// e.g., for a nullish comparison of a={ a: 1 } and b={ a: 1, b: null }
	// we want to iterate through bKeys
	var keys = aKeys.length >= bKeys.length ? aKeys : bKeys;
	try {
		for (
			var keys_1 = __values(keys), keys_1_1 = keys_1.next();
			!keys_1_1.done;
			keys_1_1 = keys_1.next()
		) {
			var key = keys_1_1.value;
			var aVal = a[key];
			var bVal = b[key];
			if (!valuesEqual(aVal, bVal, nullish)) {
				return false;
			}
		}
	} catch (e_4_1) {
		e_4 = { error: e_4_1 };
	} finally {
		try {
			if (keys_1_1 && !keys_1_1.done && (_c = keys_1.return)) _c.call(keys_1);
		} finally {
			if (e_4) throw e_4.error;
		}
	}
	return true;
}
exports.valuesEqual = valuesEqual;
exports.isAWSDate = function (val) {
	return !!/^\d{4}-\d{2}-\d{2}(Z|[+-]\d{2}:\d{2}($|:\d{2}))?$/.exec(val);
};
exports.isAWSTime = function (val) {
	return !!/^\d{2}:\d{2}(:\d{2}(.\d+)?)?(Z|[+-]\d{2}:\d{2}($|:\d{2}))?$/.exec(
		val
	);
};
exports.isAWSDateTime = function (val) {
	return !!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(.\d+)?)?(Z|[+-]\d{2}:\d{2}($|:\d{2}))?$/.exec(
		val
	);
};
exports.isAWSTimestamp = function (val) {
	return !!/^\d+$/.exec(String(val));
};
exports.isAWSEmail = function (val) {
	return !!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.exec(
		val
	);
};
exports.isAWSJSON = function (val) {
	try {
		JSON.parse(val);
		return true;
	} catch (_c) {
		return false;
	}
};
exports.isAWSURL = function (val) {
	try {
		return !!new URL(val);
	} catch (_c) {
		return false;
	}
};
exports.isAWSPhone = function (val) {
	return !!/^\+?\d[\d\s-]+$/.exec(val);
};
exports.isAWSIPAddress = function (val) {
	return !!/((^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))$)|(^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$))$/.exec(
		val
	);
};
var DeferredPromise = /** @class */ (function () {
	function DeferredPromise() {
		var self = this;
		this.promise = new Promise(function (resolve, reject) {
			self.resolve = resolve;
			self.reject = reject;
		});
	}
	return DeferredPromise;
})();
exports.DeferredPromise = DeferredPromise;
var DeferredCallbackResolver = /** @class */ (function () {
	function DeferredCallbackResolver(options) {
		this.limitPromise = new DeferredPromise();
		this.raceInFlight = false;
		this.callback = function () {};
		this.defaultErrorHandler = function (msg) {
			if (msg === void 0) {
				msg = 'DeferredCallbackResolver error';
			}
			throw new Error(msg);
		};
		this.callback = options.callback;
		this.errorHandler = options.errorHandler || this.defaultErrorHandler;
		this.maxInterval = options.maxInterval || 2000;
	}
	DeferredCallbackResolver.prototype.startTimer = function () {
		var _this = this;
		this.timerPromise = new Promise(function (resolve, reject) {
			_this.timer = setTimeout(function () {
				resolve(types_1.LimitTimerRaceResolvedValues.TIMER);
			}, _this.maxInterval);
		});
	};
	DeferredCallbackResolver.prototype.racePromises = function () {
		return __awaiter(this, void 0, void 0, function () {
			var winner, err_1;
			return __generator(this, function (_c) {
				switch (_c.label) {
					case 0:
						_c.trys.push([0, 2, 3, 4]);
						this.raceInFlight = true;
						this.startTimer();
						return [
							4 /*yield*/,
							Promise.race([this.timerPromise, this.limitPromise.promise]),
						];
					case 1:
						winner = _c.sent();
						this.callback();
						return [3 /*break*/, 4];
					case 2:
						err_1 = _c.sent();
						this.errorHandler(err_1);
						return [3 /*break*/, 4];
					case 3:
						// reset for the next race
						this.clear();
						this.raceInFlight = false;
						this.limitPromise = new DeferredPromise();
						return [2 /*return*/, winner];
					case 4:
						return [2 /*return*/];
				}
			});
		});
	};
	DeferredCallbackResolver.prototype.start = function () {
		if (!this.raceInFlight) this.racePromises();
	};
	DeferredCallbackResolver.prototype.clear = function () {
		clearTimeout(this.timer);
	};
	DeferredCallbackResolver.prototype.resolve = function () {
		this.limitPromise.resolve(types_1.LimitTimerRaceResolvedValues.LIMIT);
	};
	return DeferredCallbackResolver;
})();
exports.DeferredCallbackResolver = DeferredCallbackResolver;
//# sourceMappingURL=util.js.map
