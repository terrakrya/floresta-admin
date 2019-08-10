import React from "react"
import { Query, Mutation } from "react-apollo"
import App from "../components/App"
import CONTENT from "../queries/content.gql"
import SAVE_CONTENT from "../queries/saveContent.gql"
import Form from "../components/forms/home"
import Loading from "../components/Loading"
import Error from "../components/Error"
export default props => {
  return (
    <App>
      <Mutation mutation={SAVE_CONTENT}>
        {(update, { error: errorUpdate, client: clientUpdate }) => (
          <Query query={CONTENT}>
            {({
              loading: loadingContent,
              error: errorContent,
              data: dataContent,
              refetch
            }) => {
              if (loadingContent) return <Loading />
              if (errorContent) return <Error />
              {
                if (dataContent) {
                  return (
                    <div>
                      <Form
                        content={dataContent.content}
                        update={update}
                        refetch={refetch}
                      />
                    </div>
                  )
                }
              }
            }}
          </Query>
        )}
      </Mutation>
    </App>
  )
}
