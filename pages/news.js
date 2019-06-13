import App from '../components/App';
import { Query } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import NEWS_ALL from '../queries/newsAll.gql';
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

const News = ({ classes }) => (
	<App>
		<Query query={NEWS_ALL}>
			{({ loading: loadingNews, error: errorNews, data: dataNews }) => {
				if (loadingNews) return <Loading />;
				if (errorNews) {
					console.log(errorNews);
					return <h1>Error</h1>;
				}
				if (dataNews) {
					return (
						<div className="list">
							{dataNews.news && dataNews.news.map((p) => <VillageItem key={p.id} {...p} />)}
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

export default withStyles(styles)(News);
