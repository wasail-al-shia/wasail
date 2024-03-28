defmodule WasailWeb.Graphql.ContextPlug do
  @behaviour Plug
  require Logger

  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _default) do
    session = get_session(conn)
    user_agent = get_req_header(conn, "user-agent") |> List.first()
    client_ip = conn.remote_ip |> Tuple.to_list() |> Enum.join(".")

    context = %{
      user_info: session["user_info"],
      client_ip: client_ip,
      user_agent: user_agent
    }

    Absinthe.Plug.put_options(conn, context: context)
  end
end
