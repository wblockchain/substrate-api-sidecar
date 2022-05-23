// import { ApiDecoration } from '@polkadot/api/types';
// import { bool, Null, Struct, u128, } from '@polkadot/types';
import { Bytes, Option, StorageKey } from '@polkadot/types';
import { AssetId, Balance, BlockHash } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';
import { u8aToString } from '@polkadot/util';

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
		const historicApi = await api.at(hash);

		const { number } = await api.rpc.chain.getHeader(hash);
		const response = await historicApi.query.nicks.nameOf<
			Option<ITuple<[Bytes, Balance]>>
		>(address);
		const at = {
			hash,
			height: number.toNumber().toString(10),
		};
		let nickname, deposit;
		if (response?.isSome) {
			const someResponse = response.unwrap();
			nickname = u8aToString(someResponse[0]);
			deposit = someResponse[1];

			return {
				at,
				nickname,
				deposit,
			};
		}

		return {
			at,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			nickname: null,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			deposit: null,
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
