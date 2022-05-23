// import { ApiDecoration } from '@polkadot/api/types';
// import { bool, Null, Struct, u128, } from '@polkadot/types';
import { StorageKey } from '@polkadot/types';
import { AssetId, Balance, BlockHash } from '@polkadot/types/interfaces';

// import { u128 } from '@polkadot/types/primitive';
// import { BadRequest } from 'http-errors';
import { INickname } from '../../types/responses';
import { AbstractService } from '../AbstractService';

export class NicksService extends AbstractService {
	/**
	 * Fetch the nickname assosiated with an address
	 *
	 * @param hash `BlockHash` to make call at
	 * @param address `AccountId` associated with the nickname
	 */
	async fetchNickname(hash: BlockHash, address: string): Promise<INickname> {
		const { api } = this;
		// const { number } = await api.rpc.chain.getHeader(hash);
		// const response = await api.query.nicks.nameOf(address) as <ITuple<[Bytes, Balance]>>
		const response = await api.query.nicks.nameOf(address);
		console.log('Keys', Object.keys(response));
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const nickname = response[0];
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const deposit: Balance = response[1];
		console.log('Hash', hash);
		console.log('Nickname:', nickname);
		console.log('Response:', response);
		console.log('hello');

		return {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			nickname: nickname,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			deposit: deposit,
		};
		// deposit: { hash: hash, height: number.toString() },
	}

	/**
	 * @param keys Extract `assetId`s from an array of storage keys
	 */
	extractAssetIds(keys: StorageKey<[AssetId]>[]): AssetId[] {
		return keys.map(({ args: [assetId] }) => assetId);
	}

	// /**
	//  * Checks if the historicApi has the assets pallet. If not
	//  * it will throw a BadRequest error.
	//  *
	//  * @param historicApi Decorated historic api
	//  */
	// private checkAssetsError(historicApi: ApiDecoration<'promise'>): void {
	// 	if (!historicApi.query.assets) {
	// 		throw new BadRequest(
	// 			`The runtime does not include the assets pallet at this block.`
	// 		);
	// 	}
	// }
}
