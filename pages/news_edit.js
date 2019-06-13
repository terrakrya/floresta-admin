import React from 'react';
import Router from 'next/router';
import { Query, Mutation } from 'react-apollo';
import { withRouter } from 'next/router';

import SAVE_NEWS from '../queries/saveNews.gql';
import REMOVE_NEWS from '../queries/removeNews.gql';
import NEWS from '../queries/news.gql';
import NewsForm from '../components/forms/news';
import App from '../components/App';
import Loading from '../components/Loading';

const NewsEdit = ({ router: { query: { slug, id } } }) => {
	return (
		<App>
			{!slug &&
			!id && (
				<Mutation mutation={SAVE_NEWS}>
					{(saveNews, { error: errorSaveNews, client: clientSaveNews }) => {
						return <NewsForm update={saveNews} client={clientSaveNews} />;
					}}
				</Mutation>
			)}
			{(slug || id) && (
				<Query query={NEWS} variables={{ id }}>
					{({ loading, error, data }) => (
						<Mutation mutation={SAVE_NEWS}>
							{(saveNews, { error: errorSaveNews, client: clientSaveNews }) => (
								<Mutation mutation={REMOVE_NEWS}>
									{(removeNews, { error: errorRemoveNews, client: clientRemoveNews }) => {
										console.log(data, loading, error);
										if (!loading && !error && data) {
											return (
												<NewsForm
													update={saveNews}
													remove={removeNews}
													data={data.news}
													client={clientSaveNews}
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

export default withRouter(NewsEdit);
