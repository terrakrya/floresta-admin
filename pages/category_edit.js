import { Mutation, Query } from 'react-apollo';
import { withRouter } from 'next/router';
import App from '../components/App';
import Form from '../components/forms/category';
import SAVE_CATEGORY from '../queries/saveCategory.gql';
import CATEGORIES from '../queries/categories.gql';

const Page = ({ client, data, update }) => (
	<App goBack={'/project_edit'}>
		<Form
			data={data}
			update={update}
		/>
	</App>	
)

const CategoryEdit = ({ router: { query } }) => {
	if (Object.entries(query).length !== 0 || query.constructor !== Object) {
		return (
			<Mutation mutation={SAVE_CATEGORY}>
				{(update, { error: errorUpdate, client: clientUpdate }) => (
					<Query query={CATEGORIES} variables={{ slug: query.slug }}>
						{({ loading, data, error }) => {
							if (!loading && data) {
								return (
									<Page
										update={update}
										data={data.projectCategories[0]}
										client={clientUpdate}
									/>
								)
							}
							else return <h1>Loading...</h1>
						}}
					</Query>
				)}
			</Mutation>
		)
	} else {
		return (
			<Mutation mutation={SAVE_CATEGORY}>
				{(update, { error: errorUpdate, client: clientUpdate }) => (
					<Page client={clientUpdate} update={update} />
				)}
			</Mutation>
		);
	}
}

export default withRouter(CategoryEdit)