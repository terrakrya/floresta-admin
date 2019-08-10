import App from "../components/App"
import { withStyles } from "@material-ui/core/styles"
import PROJECTS from "../queries/projects.gql"
import Table from "../components/Table"

const styles = {
  fab: {
    position: "fixed",
    right: "5%",
    bottom: "5%"
  }
}

const Projects = ({ classes }) => (
  <App>
    <Table
      query={PROJECTS}
      title='Projetos'
      returnUrl='/projects'
      editUrl='/project_edit?id='
      columns={[
        { title: "ID", field: "id" },
        { title: "Nome", field: "name" },
        { title: "Criado", field: "createdAt" }
      ]}
    />

    <style jsx>{``}</style>
  </App>
)

export default withStyles(styles)(Projects)
