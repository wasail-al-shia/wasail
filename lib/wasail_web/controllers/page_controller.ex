defmodule WasailWeb.PageController do
  require Logger
  use WasailWeb, :controller

  # disable default phoenix app layout
  plug(:put_root_layout, false)
  plug(:put_layout, false)

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def ping(conn, _params) do
    json(conn, %{status: :ok})
  end

  def user_details(conn, _params) do
    session = get_session(conn)
    json(conn, session["user_info"])
  end
end
