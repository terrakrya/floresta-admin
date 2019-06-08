import React from 'react';
import Router from 'next/router';
import { Query, Mutation } from 'react-apollo';
import { withRouter } from 'next/router';

import SAVE_VILLAGE from '../queries/saveVillage.gql';
import REMOVE_VILLAGE from '../queries/removeVillage.gql';
import VILLAGE from '../queries/village.gql';
import VillageForm from '../components/forms/village';
import App from '../components/App';
import Loading from '../components/Loading';

const VillageEdit = ({ router: { query: { slug, id } } }) => {
	return (
		<App>
			{!slug &&
			!id && (
				<Mutation mutation={SAVE_VILLAGE}>
					{(saveVillage, { error: errorSaveVillage, client: clientSaveVillage }) => {
						return <VillageForm update={saveVillage} client={clientSaveVillage} />;
					}}
				</Mutation>
			)}
			{(slug || id) && (
				<Query query={VILLAGE} variables={{ slug, id }}>
					{({ loading, error, data }) => (
						<Mutation mutation={SAVE_VILLAGE}>
							{(saveVillage, { error: errorSaveVillage, client: clientSaveVillage }) => (
								<Mutation mutation={REMOVE_VILLAGE}>
									{(removeVillage, { error: errorRemoveVillage, client: clientRemoveVillage }) => {
										console.log(data, loading, error);
										if (!loading && !error && data) {
											return (
												<VillageForm
													update={saveVillage}
													remove={removeVillage}
													data={data.village}
													client={clientSaveVillage}
												/>
											);
										} else return <Loading />;
									}}
								</Mutation>
							)}
						</Mutation>
					)}
				</Query>
			)}
		</App>
	);
};

export default withRouter(VillageEdit);
