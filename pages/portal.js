import React from 'react'
import { Query, Mutation } from 'react-apollo'
import App from '../components/App'
import CONTENT from '../queries/content.gql'
import PortalGeneral from '../components/PortalGeneral'
import PortalAbout from '../components/PortalAbout'

import Loading from '../components/Loading'

export default (props) => {
  return (
    <App>
      <Query query={CONTENT}>
        {({ loading: loadingContent, error: errorContent, data: dataContent }) => {
          if (loadingContent) return <Loading />
          if (errorContent) return <h3>Error!!</h3>
          {if (dataContent) {
            return (
              <div>
                <PortalGeneral content={dataContent.content}  />
                <PortalAbout content={dataContent.content}  />
              </div>
            )
          }}
        }}
      </Query>
    </App>
  )
}
