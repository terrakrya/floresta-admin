import Link from 'next/link';
import { withRouter } from 'next/router';
import { ApolloConsumer } from 'react-apollo';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import AdminIcon from '@material-ui/icons/PeopleOutlineOutlined';
import ProjectIcon from '@material-ui/icons/AssignmentOutlined';
import AnalyticsIcon from '@material-ui/icons/PollOutlined';
import ContentIcon from '@material-ui/icons/PersonalVideoOutlined';
import LogoutIcon from '@material-ui/icons/ExitToAppOutlined';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import { logout } from '../lib/auth';

const DrawerList = ({ classes, email, name, router: { pathname } }) => (
	<ApolloConsumer>
		{(client) => (
			<div className="list">
				<div className={`${classes.toolbar} nav-toolbar`}>
					{name && name}
					{!name && email && email}
				</div>
				<Divider />
				<List>
					<Link prefetch href="/">
						<ListItem button disabled={pathname === '/'}>
							<ListItemIcon>
								<DashboardIcon />
							</ListItemIcon>
							<ListItemText primary={'Painel'} />
						</ListItem>
					</Link>
					<Link prefetch href="/projects">
						<ListItem button disabled={pathname === '/projects'}>
							<ListItemIcon>
								<ProjectIcon />
							</ListItemIcon>
							<ListItemText primary={'Projetos'} />
						</ListItem>
					</Link>
					<Link prefetch href="/admins">
						<ListItem button disabled={pathname === '/admins'}>
							<ListItemIcon>
								<AdminIcon />
							</ListItemIcon>
							<ListItemText primary={'Administradores'} />
						</ListItem>
					</Link>
					{/* <Link prefetch href='/analytics'>
            <ListItem button disabled={pathname === '/analytics'}>
              <ListItemIcon><AnalyticsIcon /></ListItemIcon>
              <ListItemText primary={"Analítica"} />
            </ListItem>
          </Link> */}
					<Divider />
					<Link prefetch href="/portal">
						<ListItem button disabled={pathname === '/portal'}>
							<ListItemIcon>
								<ContentIcon />
							</ListItemIcon>
							<ListItemText primary={'Portal'} />
						</ListItem>
					</Link>
					<ListItem button>
						<ListItemIcon>
							<LogoutIcon />
						</ListItemIcon>
						<ListItemText primary={'Sair'} onClick={() => logout(client)} />
					</ListItem>
				</List>
				<style jsx>{`
					.nav-toolbar {
						text-align: center;
					}
					.nav-toolbar {
						padding-top: 15px;
					}
				`}</style>
			</div>
		)}
	</ApolloConsumer>
);

export default withRouter(DrawerList);
