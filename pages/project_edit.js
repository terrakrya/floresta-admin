import React from 'react';
import Router from 'next/router';
import { Query, Mutation } from 'react-apollo';
import { withRouter } from 'next/router';

import SAVE_PROJECT from '../queries/saveProject.gql';
import CATEGORIES from '../queries/categories.gql'
import TAGS from '../queries/tags.gql'

// import PROJECT from '../queries/project.gql'

import ProjectForm from '../components/forms/project';
import App from '../components/App';
import Loading from '../components/Loading';

const ProjectEdit = ({ router: { query: { key } } }) => {
	return (
		<App>
			{!key && (
				<Mutation mutation={SAVE_PROJECT}>
					{(saveProject, { error: errorSaveProject, client: clientSaveProject }) => {
						return (
              <Query query={TAGS}>
                {({ loading: loadingTags, error: errorTags, data: dataTags }) => (
                  <Query query={CATEGORIES}>
                  {({ loading: loadingCategories, error: errorCategories, data: dataCategories }) => {
                    const categories = loadingCategories ? null : dataCategories.projectCategories
                    const tags = loadingCategories ? null : dataTags.projectTags
                    return (
                      <ProjectForm
                        categories={categories}
                        tags={tags}
                        onSubmit={async (values) => {
                          const res = await saveProject({ variables: { input: values } });
                          console.log('CREATE RES', res);
                          if (errorSaveProject) console.log('ERROR do something...', errorSaveProject);
                          // const { allprojects } = clientSaveProject.cache.readQuery({ query: ALL_ISSUES_LOCAL})
                          // clientSaveProject.writeData({ data: {
                          //   allprojects: Object.assign(allprojects, res.data.saveProject)
                          // }})
                          Router.push('/projects');
                        }}
                      />
                    )
                  }}
                </Query>
                )}
              </Query>
						);
					}}
				</Mutation>
			)}
			{/* {key && 
        <Query query={PROJECT} variables={{ issueKey: key }}>
          {({ loading: loadingproject, error: errorproject, data: dataproject }) => {
            if (loadingproject) return <Loading />
            return (
              <Mutation mutation={SAVE_PROJECT}>
                {(updateproject, { error: errorupdateproject, client: clientUpdate }) => {
                  return (
                    <ProjectForm
                      onSubmit={async (values) => {
                        // console.log('VALUES', values)
                        const res = await updateproject({ variables: { input: values, issueId: dataproject.project.id } })
                        // console.log(res)
                        if (errorupdateproject) console.log('ERROR do something...')
                        // const localData = clientUpdate.cache.readQuery({ query: ALL_ISSUES_LOCAL})
                        // console.log('Local', localData)
                        // clientUpdate.writeData({ data: {
                        //   project: res.data.updateproject
                        // }})
                        Router.push('/issues')
                      }}
                      project={dataproject.project}
                      publishCall={publishprojectCall}
                      publish={publishproject}
                    />
                  )}
                }}
              </Mutation>
            )
          }}
        </Query>
      } */}
		</App>
	);
};

export default withRouter(ProjectEdit);
