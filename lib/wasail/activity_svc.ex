defmodule Wasail.ActivitySvc do
  require Logger

  def get_ip_info(ip) do
    case Wasail.IpInfo.get_by_ip(ip) do
      nil ->
        try do
          db_rec =
            construct_url(ip)
            |> Wasail.Util.Http.get()
            |> Wasail.IpInfo.insert!()

          Wasail.IpInfo.get(db_rec.id)
        rescue
          err ->
            Logger.error("error retrieving ip info for #{ip}: #{inspect(err)}")
            nil
        end

      rec ->
        # Logger.warning("retrieving ip info from db")
        rec
    end
  end

  def record_report_activity(ip, report_id) do
    ip_rec = get_ip_info(ip)

    Wasail.Activity.insert(%{
      ip_info_id: ip_rec.id,
      activity_type: "view_report",
      report_id: report_id
    })
  end

  def record_chapter_activity(ip, chapter_id) do
    ip_rec = get_ip_info(ip)

    Wasail.Activity.insert(%{
      ip_info_id: ip_rec.id,
      activity_type: "view_chapter",
      chapter_id: chapter_id
    })
  end

  def record_search_activity(ip, search_str) do
    ip_rec = get_ip_info(ip)

    Wasail.Activity.insert(%{
      ip_info_id: ip_rec.id,
      activity_type: "search",
      search_str: search_str
    })
  end

  # curl("http://ipinfo.io/63.118.230.241?token=80366a6b3782bf")
  def construct_url(ip) do
    Application.get_env(:wasail, :ip_info_url) <>
      ip <> "?token=" <> Application.get_env(:wasail, :ip_info_token)
  end
end
