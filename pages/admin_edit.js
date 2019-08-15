import React from "react"
import { withRouter } from "next/router"
import { Query, Mutation } from "react-apollo"
import App from "../components/App"

import SAVE_ADMIN from "../queries/saveAdmin.gql"
import ADMINS from "../queries/admins.gql"
import Loading from "../components/Loading"
import Form from "../components/forms/admin"

const AdminEdit = ({
  router: {
    query: { id }
  }
}) => {
  return (
    <App>
      {!id && (
        <Mutation mutation={SAVE_ADMIN}>
          {(saveAdmin, { error: errorSaveAdmin, client: clientSaveAdmin }) => {
            return <Form update={saveAdmin} client={clientSaveAdmin} create />
          }}
        </Mutation>
      )}
      {id && (
        <Query query={ADMINS} variables={{ id }}>
          {({ loading, error, data }) => (
            <Mutation mutation={SAVE_ADMIN}>
              {(
                saveAdmin,
                { error: errorSaveAdmin, client: clientSaveAdmin }
              ) => {
                console.log(data)
                if (!loading && !error && data) {
                  return (
                    <Form
                      update={saveAdmin}
                      data={data.admins[0]}
                      error={errorSaveAdmin}
                    />
                  )
                } else return <Loading />
              }}
            </Mutation>
          )}
        </Query>
      )}
    </App>
  )
}

export default withRouter(AdminEdit)
