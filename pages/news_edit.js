import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks'

import { withRouter } from 'next/router'

import SAVE_NEWS from '../queries/saveNews.gql'
import REMOVE_NEWS from '../queries/removeNews.gql'
import NEWS from '../queries/news.gql'
import NEWSORDERS from '../queries/newsOrders.gql'
import TAGS from '../queries/tags.gql'
import NewsForm from '../components/forms/news'
import App from '../components/App'
import Loading from '../components/Loading'

const NewsEdit = ({
  router: {
    query: { slug, id }
  }
}) => {
  const orderList = useQuery(NEWSORDERS)
  return (
    <App>
      {!slug && !id && (
        <Mutation mutation={SAVE_NEWS}>
          {(saveNews, { error: errorSaveNews, client: clientSaveNews }) => {
            return (
              <NewsForm
                orderList={orderList.data.newsAll.filter(i => i.order !== null)}
                update={saveNews}
                client={clientSaveNews}
                create
              />
            )
          }}
        </Mutation>
      )}
      {(slug || id) && (
        <Query query={NEWS} variables={{ id }}>
          {({ loading, error, data }) => (
            <Query query={TAGS}>
              {({ loading: loadingTags, error: errorTags, data: dataTags }) => (
                <Mutation mutation={SAVE_NEWS}>
                  {(
                    saveNews,
                    { error: errorSaveNews, client: clientSaveNews }
                  ) => (
                    <Mutation mutation={REMOVE_NEWS}>
                      {(
                        removeNews,
                        { error: errorRemoveNews, client: clientRemoveNews }
                      ) => {
                        if (
                          !loading &&
                          !loadingTags &&
                          !error &&
                          !errorTags &&
                          dataTags &&
                          data &&
                          !orderList.loading &&
                          !orderList.error &&
                          orderList.data
                        ) {
                          return (
                            <NewsForm
                              update={saveNews}
                              remove={removeNews}
                              data={data.news}
                              tagList={dataTags.projectTags}
                              client={clientSaveNews}
                              orderList={orderList.data.newsAll
                                .filter(i => i.order)
                                .map(i => {
                                  return {
                                    name: `${i.order}`
                                  }
                                })}
                            />
                          )
                        } else return <Loading />
                      }}
                    </Mutation>
                  )}
                </Mutation>
              )}
            </Query>
          )}
        </Query>
      )}
    </App>
  )
}

export default withRouter(NewsEdit)
