import App from "../components/App"
import { withStyles } from "@material-ui/core/styles"
import PROJECTS from "../queries/projects.gql"
import Table from "../components/Table"
import Form from "../components/forms/contentForm"

const styles = {
  fab: {
    position: "fixed",
    right: "5%",
    bottom: "5%"
  }
}

const Projects = ({ classes }) => (
  <App>
    <Form
      title='Texto sobre a página'
      field='projectsHtml'
      style={{ paddingBottom: 80 }}
    />
    <Table
      query={PROJECTS}
      title='Projetos'
      returnUrl='/projects'
      editUrl='/project_edit?id='
      columns={[
        { title: "ID", field: "id" },
        { title: "Nome", field: "name" },
        { title: "Linhas de Ação", field: "categories.name" },
        { title: "Criado", field: "createdAt" }
      ]}
    />

    <style jsx>{``}</style>
  </App>
)

export default withStyles(styles)(Projects)
