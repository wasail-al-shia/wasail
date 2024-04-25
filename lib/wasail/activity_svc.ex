defmodule Wasail.ActivitySvc do
  require Logger

  def get_ip_info(ip) do
    case Wasail.IpInfo.get_by_ip(ip) do
      nil ->
        try do
          # TODO: Add retry logic
          db_rec =
            construct_url(ip)
            |> Wasail.Util.Http.get()
            |> Wasail.IpInfo.insert!()

          Wasail.IpInfo.get(db_rec.id)
        rescue
          err ->
            Logger.error("error retrieving ip info for #{ip}: #{inspect(err)}")
            Wasail.IpInfo.insert!(%{ip: ip})
        end

      rec ->
        # Logger.warning("retrieving ip info from db")
        rec
    end
  end

  def record_download_book_activity(ip, user_agent, book_code, volume_no) do
    ip_rec = get_ip_info(ip)
    type = "dwnld: #{book_code}_#{volume_no}"

    Wasail.Activity.insert(%{
      ip_info_id: ip_rec.id,
      user_agent: user_agent,
      activity_type: type
    })
  end

  def record_download_file_activity(ip, user_agent, bucket, filename) do
    ip_rec = get_ip_info(ip)
    type = "file: #{filename}"

    Wasail.Activity.insert(%{
      ip_info_id: ip_rec.id,
      user_agent: user_agent,
      activity_type: type,
      desc: bucket
    })
  end

  def record_report_activity(ip, user_agent, report_id) do
    ip_rec = get_ip_info(ip)

    Wasail.Activity.insert(%{
      ip_info_id: ip_rec.id,
      user_agent: user_agent,
      activity_type: "view_report",
      report_id: report_id
    })
  end

  def record_chapter_activity(ip, user_agent, chapter_id) do
    ip_rec = get_ip_info(ip)

    Wasail.Activity.insert(%{
      ip_info_id: ip_rec.id,
      user_agent: user_agent,
      activity_type: "view_chapter",
      chapter_id: chapter_id
    })
  end

  def record_search_activity(ip, user_agent, search_str) do
    ip_rec = get_ip_info(ip)

    Wasail.Activity.insert(%{
      ip_info_id: ip_rec.id,
      user_agent: user_agent,
      activity_type: "search",
      search_str: search_str
    })
  end

  def record_page_activity(ip, user_agent, page) do
    ip_rec = get_ip_info(ip)

    Wasail.Activity.insert(%{
      ip_info_id: ip_rec.id,
      user_agent: user_agent,
      activity_type: "vw_pg: #{page}"
    })
  end

  def record_login(ip, user_agent, email, uid) do
    ip_rec = get_ip_info(ip)

    Wasail.Activity.insert(%{
      ip_info_id: ip_rec.id,
      user_agent: user_agent,
      activity_type: "login",
      desc: "#{email} (#{uid})"
    })
  end

  def record_feedback_activity(ip, user_agent, report_id, name) do
    ip_rec = get_ip_info(ip)

    Wasail.Activity.insert(%{
      ip_info_id: ip_rec.id,
      user_agent: user_agent,
      activity_type: "feedback",
      report_id: report_id,
      desc: name
    })
  end

  def record_contact(ip, user_agent, name) do
    ip_rec = get_ip_info(ip)

    Wasail.Activity.insert(%{
      ip_info_id: ip_rec.id,
      user_agent: user_agent,
      activity_type: "contact",
      desc: name
    })
  end

  # curl("http://ipinfo.io/63.118.230.241?token=80366a6b3782bf")
  def construct_url(ip) do
    Application.get_env(:wasail, :ip_info_url) <>
      ip <> "?token=" <> Application.get_env(:wasail, :ip_info_token)
  end
end
