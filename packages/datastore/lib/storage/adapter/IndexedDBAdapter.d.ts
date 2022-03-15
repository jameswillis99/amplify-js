import { ModelInstanceCreator } from '../../datastore/datastore';
import {
	InternalSchema,
	ModelInstanceMetadata,
	ModelPredicate,
	NamespaceResolver,
	OpType,
	PaginationInput,
	PersistentModel,
	PersistentModelConstructor,
	QueryOne,
} from '../../types';
import { Adapter } from './index';
declare class IndexedDBAdapter implements Adapter {
	private schema;
	private namespaceResolver;
	private modelInstanceCreator;
	private getModelConstructorByModelName;
	private db;
	private initPromise;
	private resolve;
	private reject;
	private dbName;
	private checkPrivate;
	private getStorenameForModel;
	private getStorename;
	setUp(
		theSchema: InternalSchema,
		namespaceResolver: NamespaceResolver,
		modelInstanceCreator: ModelInstanceCreator,
		getModelConstructorByModelName: (
			namsespaceName: string,
			modelName: string
		) => PersistentModelConstructor<any>,
		sessionId?: string
	): Promise<void>;
	private _get;
	save<T extends PersistentModel>(
		model: T,
		condition?: ModelPredicate<T>
	): Promise<[T, OpType.INSERT | OpType.UPDATE][]>;
	private load;
	query<T extends PersistentModel>(
		modelConstructor: PersistentModelConstructor<T>,
		predicate?: ModelPredicate<T>,
		pagination?: PaginationInput<T>
	): Promise<T[]>;
	private getById;
	private getAll;
	private idFromPredicate;
	private filterOnPredicate;
	private inMemoryPagination;
	private enginePagination;
	queryOne<T extends PersistentModel>(
		modelConstructor: PersistentModelConstructor<T>,
		firstOrLast?: QueryOne
	): Promise<T | undefined>;
	delete<T extends PersistentModel>(
		modelOrModelConstructor: T | PersistentModelConstructor<T>,
		condition?: ModelPredicate<T>
	): Promise<[T[], T[]]>;
	private deleteItem;
	private deleteTraverse;
	clear(): Promise<void>;
	batchSave<T extends PersistentModel>(
		modelConstructor: PersistentModelConstructor<any>,
		items: ModelInstanceMetadata[]
	): Promise<[T, OpType][]>;
}
declare const _default: IndexedDBAdapter;
export default _default;
