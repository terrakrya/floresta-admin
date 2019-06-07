import App from '../components/App';
import { Query } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import PROJECTS from '../queries/projects.gql';
import ProjectItem from '../components/ProjectItem';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Loading from '../components/Loading';

const styles = {
	fab: {
		position: 'fixed',
		right: '5%',
		bottom: '5%'
	}
};

const Projects = ({ classes }) => (
	<App>
		<Query query={PROJECTS}>
			{({ loading: loadingProjects, error: errorProjects, data: dataProjects }) => {
				if (loadingProjects) return <h1>Loading</h1>;
				if (errorProjects) {
					console.log(errorProjects);
					return <h1>Error</h1>;
				}
				if (dataProjects) {
					return (
						<div className="projectList">
							{dataProjects.projects &&
								dataProjects.projects.map((p) => <ProjectItem key={p.id} {...p} />)}
							<Link href="/project_edit">
								<Fab color="primary" aria-label="Add" className={classes.fab}>
									<AddIcon />
								</Fab>
							</Link>
						</div>
					);
				}
			}}
		</Query>
		<style jsx>{`
			.projectList {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				flex-flow: row wrap;
			}
		`}</style>
	</App>
);

export default withStyles(styles)(Projects);
