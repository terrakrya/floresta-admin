import App from "../components/App"
import NEWS_ALL from "../queries/newsAll.gql"
import Table from "../components/Table"

export default ({ classes }) => {
  return (
    <App>
      <Table
        query={NEWS_ALL}
        returnUrl={"/news"}
        editUrl={"/news_edit?id="}
        title='Noticias'
        columns={[
          { title: "ID", field: "id" },
          { title: "Titulo", field: "title" },
          { title: "Criado", field: "createdAt", type: "datetime" }
        ]}
      />
      <style jsx>{``}</style>
    </App>
  )
}
