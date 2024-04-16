defmodule Wasail.Util.Sys do
  require Logger

  def is_admin(uid) do
    uid in Application.get_env(:wasail, :admin_uids)
  end

  def sleep(seconds) do
    :timer.sleep(seconds * 1000)
  end

  def total_number_of_reports(book_id) do
    report_range(book_id)
    |> Enum.count()
  end

  def percent_complete(n, book_id) do
    case total_number_of_reports(book_id) do
      0 ->
        0

      t ->
        n / t * 100
    end
  end

  def report_range(book_id) do
    case book_id do
      1 -> 0..1299
      2 -> 1300..2865
      _ -> []
    end
  end

  def generate_sitemap_text do
    url = Application.get_env(:wasail, :ws_site_url)

    home = url
    about = url <> "about"

    chapter_links =
      Wasail.Chapter.get_ids()
      |> Enum.map(fn id ->
        "#{url}c/#{id}"
      end)

    Enum.concat([home, about], chapter_links)
    |> Enum.join("\n")
  end

  @sitemap_file "priv/static/sitemap.txt"
  @site_url "https://wasail-al-shia.net"

  def generate_sitemap_file() do
    File.rm(@sitemap_file)

    {:ok, file} = File.open(@sitemap_file, [:write])
    IO.write(file, "#{@site_url}\n")
    IO.write(file, "#{@site_url}/about\n")

    ids = Wasail.Chapter.get_ids()
    last_id = List.last(ids)

    Enum.each(ids, fn id ->
      IO.write(file, "#{@site_url}/c/#{id}\n")
    end)

    # write 70 more for future ids
    (last_id + 1)..(last_id + 70)
    |> Enum.each(fn id ->
      Logger.info("id=#{id}")
      IO.write(file, "#{@site_url}/c/#{id}\n")
    end)

    File.close(file)
  end
end
