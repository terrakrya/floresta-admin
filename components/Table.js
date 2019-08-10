import { Query } from "react-apollo"
import MaterialTable from "material-table"
import { useEffect } from "react"
import { withRouter } from "next/router"

import Loading from "../components/Loading"
import Error from "../components/Error"

const List = ({
  data,
  push,
  doRefresh,
  refresh,
  returnUrl,
  editUrl,
  title,
  columns,
  noCreate
}) => {
  const createUrl = editUrl.split("?")[0]
  useEffect(() => {
    if (doRefresh) {
      async function reload() {
        await refresh()
        push(returnUrl)
      }
      reload()
    }
  }, [doRefresh, push])
  let actions = [
    {
      icon: "edit",
      tooltip: "Editar",
      onClick: (event, rowData) =>
        push(`${editUrl || "/news_edit?id="}${rowData.id}`)
    },
    {
      icon: "refresh",
      tooltip: "Atualizar",
      isFreeAction: true,
      onClick: () => refresh()
    }
  ]
  if (!noCreate) {
    actions.push({
      icon: "add",
      tooltip: "Criar",
      isFreeAction: true,
      onClick: event => push(createUrl || "/news_edit")
    })
  }
  return (
    <MaterialTable
      title={title || "Tabela"}
      columns={columns}
      actions={actions}
      data={data}
      options={{
        search: true,
        actionsColumnIndex: -1
      }}
      localization={{
        body: {
          emptyDataSourceMessage: "Sem dados"
        },
        header: {
          actions: "Editar"
        },
        toolbar: {
          searchTooltip: "Buscar",
          searchPlaceholder: "Buscar"
        },
        pagination: {
          labelRowsSelect: "linhas",
          // labelDisplayedRows: " {from}-{to} xete {count}",
          firstTooltip: "Primeira pagina",
          previousTooltip: "Pagina anterior",
          nextTooltip: "Proxima pagina",
          lastTooltip: "Ultima pagina"
        }
      }}
    />
  )
}

let Table = props => {
  const doRefresh = props.router.query.refresh === "" ? true : false
  return (
    <Query query={props.query}>
      {({ loading, error, data, refetch }) => {
        if (loading) return <Loading />
        if (error) {
          console.log(error)
          return <Error />
        }
        if (data) {
          return (
            <List
              {...props}
              data={data[Object.keys(data)[0]]}
              doRefresh={doRefresh}
              push={props.router.push}
              refresh={refetch}
            />
          )
        }
      }}
    </Query>
  )
}

Table = withRouter(Table)

export default Table
