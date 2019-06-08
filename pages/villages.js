import App from '../components/App';
import { Query } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import VILLAGES from '../queries/villages.gql';
import VillageItem from '../components/VillageItem';
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

const Villages = ({ classes }) => (
	<App>
		<Query query={VILLAGES}>
			{({ loading: loadingVillages, error: errorVillages, data: dataVillages }) => {
				if (loadingVillages) return <h1>Loading</h1>;
				if (errorVillages) {
					console.log(errorVillages);
					return <h1>Error</h1>;
				}
				if (dataVillages) {
					return (
						<div className="list">
							{dataVillages.villages &&
								dataVillages.villages.map((p) => <VillageItem key={p.id} {...p} />)}
							<Link href="/village_edit">
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
			.list {
				display: flex;
				align-items: center;
				justify-content: flex-start;
				flex-flow: row wrap;
			}
		`}</style>
	</App>
);

export default withStyles(styles)(Villages);
