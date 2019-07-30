import { Mutation } from 'react-apollo';
import Router from 'next/router';
import ContentGenaralForm from './forms/contentGeneral';
import UPDATE_CONTENT from '../queries/contentUpdate.gql';

export default ({ content }) => (
	<Mutation mutation={UPDATE_CONTENT}>
		{(update, { error: errorUpdate, client: clientUpdate }) => (
			<ContentGenaralForm
				onSubmit={async (values) => {
					const res = await update({ variables: { input: values } });
					await clientUpdate.writeData({
						data: {
							content: {
								...res.data.updateContent
							}
						}
					});
				}}
				content={content}
			/>
		)}
	</Mutation>
);
