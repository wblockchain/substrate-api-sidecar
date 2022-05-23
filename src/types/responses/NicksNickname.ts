// import { u128 } from '@polkadot/types/primitive';
import { Balance } from '@polkadot/types/interfaces';

import { IAt } from '.';

// export interface INickname {
// 	/**
// 	 * The nickname registered for an address
// 	 */
// 	nickname: String;
// 	/**
// 	 * The units in which substrate records balances.
// 	 */
// 	deposit: IAt;
// }

export interface INickname {
	at: IAt;
	/**
	 * The nickname registered for an address
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	nickname: string | null;
	/**
	 * The units in which substrate records balances.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	deposit: Balance | null;
}
