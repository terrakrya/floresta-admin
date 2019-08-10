import React from "react"
import Router from "next/router"
import { Query, Mutation } from "react-apollo"
import { withRouter } from "next/router"

import SAVE_PROJECT from "../queries/saveProject.gql"
import REMOVE_PROJECT from "../queries/removeProject.gql"
import PROJECT from "../queries/project.gql"
import CATEGORIES from "../queries/categories.gql"
import TAGS from "../queries/tags.gql"

// import PROJECT from '../queries/project.gql'

import ProjectForm from "../components/forms/project"
import App from "../components/App"
import Loading from "../components/Loading"

const ProjectEdit = ({
  router: {
    query: { slug, id }
  }
}) => {
  return (
    <App>
      {!slug && !id && (
        <Mutation mutation={SAVE_PROJECT}>
          {(
            saveProject,
            { error: errorSaveProject, client: clientSaveProject }
          ) => {
            return (
              <Query query={TAGS}>
                {({
                  loading: loadingTags,
                  error: errorTags,
                  data: dataTags
                }) => (
                  <Query query={CATEGORIES}>
                    {({
                      loading: loadingCategories,
                      error: errorCategories,
                      data: dataCategories
                    }) => {
                      const categories = loadingCategories
                        ? "loading"
                        : dataCategories.categories
                      const tags = loadingCategories
                        ? "loading"
                        : dataTags.projectTags
                      return (
                        <ProjectForm
                          categories={categories}
                          tags={tags}
                          update={saveProject}
                          client={clientSaveProject}
                        />
                      )
                    }}
                  </Query>
                )}
              </Query>
            )
          }}
        </Mutation>
      )}
      {(slug || id) && (
        <Query query={PROJECT} variables={{ slug, id }}>
          {({
            loading: loadingProject,
            error: errorProject,
            data: dataProject
          }) => (
            <Query query={CATEGORIES}>
              {({
                loading: loadingCategories,
                error: errorCategories,
                data: dataCategories
              }) => (
                <Mutation mutation={SAVE_PROJECT}>
                  {(
                    saveProject,
                    { error: errorSaveProject, client: clientSaveProject }
                  ) => (
                    <Mutation mutation={REMOVE_PROJECT}>
                      {(
                        removeProject,
                        {
                          error: errorRemoveProject,
                          client: clientRemoveProject
                        }
                      ) => {
                        return (
                          <Query query={TAGS}>
                            {({
                              loading: loadingTags,
                              error: errorTags,
                              data: dataTags
                            }) => {
                              const project = dataProject
                                ? dataProject.project
                                : "loading"
                              const tags = dataTags
                                ? dataTags.projectTags
                                : loadingTags
                                ? "loading"
                                : "error"
                              const categories = loadingCategories
                                ? "loading"
                                : dataCategories.categories
                              return (
                                <ProjectForm
                                  tags={tags}
                                  update={saveProject}
                                  remove={removeProject}
                                  project={project}
                                  client={clientSaveProject}
                                  categories={categories}
                                />
                              )
                            }}
                          </Query>
                        )
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

export default withRouter(ProjectEdit)
