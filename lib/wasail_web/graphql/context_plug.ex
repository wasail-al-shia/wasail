defmodule WasailWeb.Graphql.ContextPlug do
  @behaviour Plug
  require Logger

  import Plug.Conn

  def init(opts), do: opts

  def call(conn, _default) do
    session = get_session(conn)
    ctx = %{user_info: session["user_info"], client_ip: conn.remote_ip}
    # Logger.info("Absinthe context = #{inspect(ctx)}")
    Absinthe.Plug.put_options(conn, context: ctx)
  end
end
