defmodule WasailWeb.PageController do
  require Logger
  use WasailWeb, :controller
  import Plug.Conn

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

  def record_page_view(conn, %{"page" => page}) do
    ip = conn.remote_ip |> Tuple.to_list() |> Enum.join(".")
    user_agent = get_req_header(conn, "user-agent") |> List.first()
    session = get_session(conn)
    user_info = session["user_info"]

    case user_info do
      %{is_admin: true} ->
        json(conn, %{status: :ok, desc: "skipping record page view for admin"})

      %{is_reviewer: true} ->
        json(conn, %{status: :ok, desc: "skipping record page view for reviewer"})

      _ ->
        Wasail.ActivitySvc.record_page_activity(ip, user_agent, page)
        json(conn, %{status: :ok, desc: "recorded page view"})
    end
  end

  def download_book(conn, %{"bookCode" => book_code, "volumeNo" => volume_no}) do
    file_nm = "#{book_code}#{volume_no}.pdf"

    content =
      ExAws.S3.download_file("wasail.documents", file_nm, :memory)
      |> ExAws.stream!()
      |> Enum.into([])
      |> IO.iodata_to_binary()

    content_disposition = ContentDisposition.format(disposition: "inline", filename: file_nm)
    mime_type = "application/pdf"

    user_agent = get_req_header(conn, "user-agent") |> List.first()
    ip = conn.remote_ip |> Tuple.to_list() |> Enum.join(".")
    Wasail.ActivitySvc.record_download_book_activity(ip, user_agent, book_code, volume_no)

    conn
    |> put_resp_content_type(mime_type)
    |> put_resp_header("content-disposition", content_disposition)
    |> put_resp_header("file-name", file_nm)
    |> send_resp(:ok, content)
  end

  def sitemap(conn, _params) do
    text(conn, Wasail.Util.Sys.generate_sitemap_text())
  end
end
