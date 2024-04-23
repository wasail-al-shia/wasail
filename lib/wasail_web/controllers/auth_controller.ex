defmodule WasailWeb.AuthController do
  require Logger
  use WasailWeb, :controller
  plug Ueberauth

  alias Ueberauth.Strategy.Helpers

  def request(conn, _params) do
    render(conn, "request.html", callback_url: Helpers.callback_url(conn))
  end

  def delete(conn, _params) do
    conn
    |> clear_session()
    |> Plug.Conn.put_status(303)
    |> redirect(to: "/")
  end

  def callback(%{assigns: %{ueberauth_failure: _fails}} = conn, _params) do
    # Logger.info("Failed to authenticate")

    conn
    |> redirect(to: "/")
  end

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    # Logger.info("In callback: #{inspect(auth)}")

    is_admin = Wasail.Util.Sys.is_admin(auth.uid)
    is_reviewer = Wasail.Util.Sys.is_reviewer(auth.info.email)

    user_info =
      %{
        uid: auth.uid,
        name: auth.info.name,
        email: auth.info.email,
        avatar_url: auth.info.image,
        is_admin: is_admin,
        is_reviewer: is_reviewer || is_admin
      }

    # Logger.info("Logged in user info: #{inspect(user_info)}")
    ip = conn.remote_ip |> Tuple.to_list() |> Enum.join(".")
    user_agent = get_req_header(conn, "user-agent") |> List.first()
    Wasail.ActivitySvc.record_login(ip, user_agent, auth.info.email, auth.uid)

    conn
    |> put_session(:user_info, user_info)
    |> configure_session(renew: true)
    |> redirect(to: "/")
  end

  def admin?(conn) do
    session = get_session(conn)
    user_info = session["user_info"] || %{is_admin: false}
    user_info.is_admin
  end
end
