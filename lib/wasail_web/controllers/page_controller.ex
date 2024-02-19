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

  def download_book(conn, %{"bookCode" => code, "volumeNo" => volume}) do
    file_nm = "#{code}#{volume}.pdf"

    content =
      ExAws.S3.download_file("wasail.documents", file_nm, :memory)
      |> ExAws.stream!()
      |> Enum.into([])
      |> IO.iodata_to_binary()

    content_disposition = ContentDisposition.format(disposition: "inline", filename: file_nm)
    mime_type = "application/pdf"

    conn
    |> put_resp_content_type(mime_type)
    |> put_resp_header("content-disposition", content_disposition)
    |> put_resp_header("file-name", file_nm)
    |> send_resp(:ok, content)
  end
end
