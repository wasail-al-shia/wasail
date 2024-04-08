defmodule Wasail.Util.Sys do
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

  @sitemap_file "priv/static/sitemap.txt"
  @site_url "https://wasail-al-shia.net"

  def generate_sitemap do
    File.rm(@sitemap_file)

    {:ok, file} = File.open(@sitemap_file, [:write])
    IO.write(file, "#{@site_url}\n")
    IO.write(file, "#{@site_url}/about\n")

    Wasail.Chapter.get_ids()
    |> Enum.each(fn id ->
      IO.write(file, "#{@site_url}/c/#{id}\n")
    end)

    File.close(file)
  end
end
