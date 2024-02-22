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

    user_info =
      %{
        uid: auth.uid,
        name: auth.info.name,
        email: auth.info.email,
        avatar_url: auth.info.image,
        is_admin: Wasail.Util.Sys.is_admin(auth.uid)
      }

    # Logger.info("Logged in user info: #{inspect(user_info)}")

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
