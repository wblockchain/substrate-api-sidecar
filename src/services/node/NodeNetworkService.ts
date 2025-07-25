// Copyright 2017-2025 Parity Technologies (UK) Ltd.
// This file is part of Substrate API Sidecar.
//
// Substrate API Sidecar is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { INodeNetwork } from 'src/types/responses';

import { AbstractService } from '../AbstractService';

export class NodeNetworkService extends AbstractService {
	async fetchNetwork(): Promise<INodeNetwork> {
		const { api } = this;

		const [{ peers: numPeers, isSyncing, shouldHavePeers }, localPeerId, nodeRoles, localListenAddresses] =
			await Promise.all([
				api.rpc.system.health(),
				api.rpc.system.localPeerId(),
				api.rpc.system.nodeRoles(),
				api.rpc.system.localListenAddresses(),
			]);

		let peersInfo;
		try {
			peersInfo = await api.rpc.system.peers();
		} catch {
			peersInfo = 'Cannot query system_peers from node.';
		}

		return {
			nodeRoles,
			numPeers,
			isSyncing,
			shouldHavePeers,
			localPeerId,
			localListenAddresses,
			peersInfo,
		};
	}
}
