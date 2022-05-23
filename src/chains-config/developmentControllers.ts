import { ControllerConfig } from '../types/chains-config';
import { initLRUCache } from './cache/lruCache';

export const developmentControllers: ControllerConfig = {
	controllers: ['Blocks', 'PalletsStorage', 'Nicks'],
	options: {
		finalizes: true,
		minCalcFeeRuntime: null,
		blockStore: initLRUCache(),
	},
};
