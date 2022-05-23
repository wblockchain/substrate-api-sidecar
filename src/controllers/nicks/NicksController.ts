import { ApiPromise } from '@polkadot/api';
import { RequestHandler } from 'express';

import { validateAddress } from '../../middleware';
import { NicksService } from '../../services/nicks';
import AbstractController from '../AbstractController';

/**
 * Get nickname set for an address.
 *
 * Paths:
 * - `address`: The address to retrieve the nickname for
 *
 * Query:
 * - (Optional)`at`: Block at which to retrieve nickname set for a given address
 *
 * `/nicks/:address/nickname`
 * Returns:
 * - `nickname`: The nickname for a given address
 * - `deposit`: the amount of tokens held as a deposit to set a nickname
 *
 * Substrate Reference:
 * - Assets Pallet: https://crates.parity.io/pallet_nicks/index.html
 *
 */

export default class NicksController extends AbstractController<NicksService> {
	constructor(api: ApiPromise) {
		super(api, '/nicks/:address', new NicksService(api));
		this.initRoutes();
	}

	protected initRoutes(): void {
		this.router.use(this.path, validateAddress);

		this.safeMountAsyncGetHandlers([['/nickname', this.getNickname]]);
	}

	private getNickname: RequestHandler = async (
		{ params: { address }, query: { at } },
		res
	): Promise<void> => {
		const hash = await this.getHashFromAt(at);

		NicksController.sanitizedSend(
			res,
			await this.service.fetchNickname(hash, address)
		);
	};
}
