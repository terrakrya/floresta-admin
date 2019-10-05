import Link from "next/link"
import { withRouter } from "next/router"
import { ApolloConsumer } from "react-apollo"

import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import DashboardIcon from "@material-ui/icons/DashboardOutlined"
import AboutIcon from "@material-ui/icons/FingerprintOutlined"
import CategoriesIcon from "@material-ui/icons/CallSplitOutlined"
import AdminIcon from "@material-ui/icons/PeopleOutlineOutlined"
import ProjectIcon from "@material-ui/icons/AssignmentOutlined"
import VillageIcon from "@material-ui/icons/WallpaperOutlined"
import AnalyticsIcon from "@material-ui/icons/PollOutlined"
import TagsIcon from "@material-ui/icons/StyleOutlined"
import ContentIcon from "@material-ui/icons/PersonalVideoOutlined"
import NewsIcon from "@material-ui/icons/PictureInPictureOutlined"
import LogoutIcon from "@material-ui/icons/ExitToAppOutlined"

import List from "@material-ui/core/List"
import Divider from "@material-ui/core/Divider"

import { logout } from "../lib/auth"

const DrawerList = ({ classes, email, name, router: { pathname } }) => (
  <ApolloConsumer>
    {client => (
      <div className='list'>
        <div className={`${classes.toolbar} nav-toolbar`}>
          {name && name}
          {!name && email && email}
        </div>
        <Divider />
        <Link href='/'>
          <ListItem button disabled={pathname === "/"}>
            <ListItemIcon>
              <ContentIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
        </Link>
        <Link href='/about'>
          <ListItem button disabled={pathname === "/about"}>
            <ListItemIcon>
              <AboutIcon />
            </ListItemIcon>
            <ListItemText primary={"Quem somos"} />
          </ListItem>
        </Link>
        <Link href='/villages'>
          <ListItem button disabled={pathname === "/villages"}>
            <ListItemIcon>
              <VillageIcon />
            </ListItemIcon>
            <ListItemText primary={"Aldeias"} />
          </ListItem>
        </Link>
        <Link href='/categories'>
          <ListItem button disabled={pathname === "/categories"}>
            <ListItemIcon>
              <CategoriesIcon />
            </ListItemIcon>
            <ListItemText primary={"Linhas de açÃo"} />
          </ListItem>
        </Link>
        <Link href='/tags'>
          <ListItem button disabled={pathname === "/tags"}>
            <ListItemIcon>
              <TagsIcon />
            </ListItemIcon>
            <ListItemText primary={"Tags"} />
          </ListItem>
        </Link>
        <Link href='/projects'>
          <ListItem button disabled={pathname === "/projects"}>
            <ListItemIcon>
              <ProjectIcon />
            </ListItemIcon>
            <ListItemText primary={"Projetos"} />
          </ListItem>
        </Link>
        <Link href='/news'>
          <ListItem button disabled={pathname === "/news"}>
            <ListItemIcon>
              <NewsIcon />
            </ListItemIcon>
            <ListItemText primary={"Notícias"} />
          </ListItem>
        </Link>
        <Divider />
        <List>
          {/* <Link href='/'>
            <ListItem button disabled={pathname === "/"}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={"Painel"} />
            </ListItem>
          </Link> */}
          {/* <Link href='/analytics'>
            <ListItem button disabled={pathname === '/analytics'}>
              <ListItemIcon><AnalyticsIcon /></ListItemIcon>
              <ListItemText primary={"Analítica"} />
            </ListItem>
          </Link>
          <Divider /> */}
          <Link href='/admins'>
            <ListItem button disabled={pathname === "/admins"}>
              <ListItemIcon>
                <AdminIcon />
              </ListItemIcon>
              <ListItemText primary={"Administradores"} />
            </ListItem>
          </Link>
          <ListItem button>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Sair"} onClick={() => logout(client)} />
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
)

export default withRouter(DrawerList)
