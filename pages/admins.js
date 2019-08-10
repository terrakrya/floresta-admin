import App from "../components/App"
import { Query } from "react-apollo"
import ADMINS from "../queries/admins.gql"
// import AdminTable from '../components/AdminTable'
import Table from "../components/Table"

export default () => (
  <App>
    <Table
      query={ADMINS}
      returnUrl={"/admins"}
      editUrl={"/admin_edit?id="}
      title='Administradores'
      columns={[
        { title: "ID", field: "id" },
        { title: "E-mail", field: "email" },
        { title: "Nome", field: "firstName" },
        { title: "Sobrenome", field: "lastName" },
        { title: "Função", field: "role" }
      ]}
    />
  </App>
)
