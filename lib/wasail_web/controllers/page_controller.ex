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

  def record_dwnld_chapter(conn, %{"chapter_id" => chapter_id}) do
    ip = conn.remote_ip |> Tuple.to_list() |> Enum.join(".")
    user_agent = get_req_header(conn, "user-agent") |> List.first()
    session = get_session(conn)
    user_info = session["user_info"]

    case user_info do
      %{is_admin: true} ->
        json(conn, %{status: :ok, desc: "skipping record dwnld for admin"})

      %{is_reviewer: true} ->
        json(conn, %{status: :ok, desc: "skipping record dwnled for reviewer"})

      _ ->
        Wasail.ActivitySvc.record_dwnld_chapter_activity(ip, user_agent, chapter_id)
        json(conn, %{status: :ok, desc: "recorded dwnld activity"})
    end
  end

  def record_dwnld_section(conn, %{"section_id" => section_id}) do
    ip = conn.remote_ip |> Tuple.to_list() |> Enum.join(".")
    user_agent = get_req_header(conn, "user-agent") |> List.first()
    session = get_session(conn)
    user_info = session["user_info"]

    case user_info do
      %{is_admin: true} ->
        json(conn, %{status: :ok, desc: "skipping record dwnld for admin"})

      %{is_reviewer: true} ->
        json(conn, %{status: :ok, desc: "skipping record dwnled for reviewer"})

      _ ->
        Wasail.ActivitySvc.record_dwnld_section_activity(ip, user_agent, section_id)
        json(conn, %{status: :ok, desc: "recorded dwnld activity"})
    end
  end

  def get_file(conn, %{"bucket" => bucket, "filename" => filename}) do
    content =
      ExAws.S3.download_file("wasail.#{bucket}", filename, :memory)
      |> ExAws.stream!()
      |> Enum.into([])
      |> IO.iodata_to_binary()

    content_disposition = ContentDisposition.format(disposition: "inline", filename: filename)
    mime_type = "application/pdf"

    user_agent = get_req_header(conn, "user-agent") |> List.first()
    ip = conn.remote_ip |> Tuple.to_list() |> Enum.join(".")
    Wasail.ActivitySvc.record_download_file_activity(ip, user_agent, bucket, filename)

    conn
    |> put_resp_content_type(mime_type)
    |> put_resp_header("content-disposition", content_disposition)
    |> put_resp_header("file-name", filename)
    |> send_resp(:ok, content)
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

  def book_stats(conn, %{"book_id" => book_id}) do
    bid = String.to_integer(book_id)
    missing = Wasail.Report.find_missing(bid)
    num_reports = Wasail.Book.num_reports(bid)

    range = Wasail.Report.get_all_report_no_by_book_id(book_id)
    duplicates = range -- Enum.uniq(range)

    json(conn, %{
      required_num: Wasail.Util.Sys.total_number_of_reports(bid),
      existing_num: num_reports,
      percent_complete: Wasail.Util.Sys.percent_complete(num_reports, bid),
      duplicates: duplicates,
      hidden: Wasail.Report.get_hidden(book_id),
      under_review: Wasail.Report.get_under_review(book_id),
      missing: Enum.take(missing, 10),
      total_missing: Enum.count(missing)
    })
  end
end
