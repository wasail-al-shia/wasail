defmodule Wasail.Mailer do
  require Logger
  use Swoosh.Mailer, otp_app: :wasail

  import Swoosh.Email

  def send_contact_us_email(subject, comment, to_name, to_email) do
    payload = %{data: %{name: to_name, comment: comment}}
    html_body = get_html_body("contact_us.html", payload)
    send_html(subject, html_body, to_name, to_email)
  end

  def send_report_feedback(report_id, comment, to_name, to_email) do
    report = Wasail.Report.get(report_id)
    chapter = report.chapter
    section = chapter.section
    book = section.book

    site_url = Application.get_env(:wasail, :ws_site_url)

    payload = %{
      data: %{
        sender_name: to_name,
        report_no: report.report_no,
        chapter_no: chapter.chapter_no,
        chapter_nm: chapter.name_eng,
        section_no: section.section_no,
        section_nm: section.name_eng,
        book_nm_vol: "#{book.name_eng} Vol. #{book.volume_no}",
        report_url: "#{site_url}/h/#{report.report_no}",
        comment: comment
      }
    }

    html_body = get_html_body("report_feedback.html", payload)
    subject = "Feedback on Hadith #{inspect(report.report_no)}"
    send_html(subject, html_body, to_name, to_email)
  end

  def send_html(subject, html_body, to_name, to_email) do
    # Logger.info("In send with body #{inspect(html_body)}")

    new()
    |> from(verified_identity())
    |> to({to_name, to_email})
    |> cc(admin_emails())
    |> bcc(bcc_emails())
    |> subject(subject)
    |> html_body(html_body)
    |> deliver()
  end

  def get_html_body(template, payload) do
    WasailWeb.EmailView
    |> Phoenix.View.render_to_string(template, payload)
  end

  def admin_emails, do: Application.get_env(:wasail, :admin_emails)
  def bcc_emails, do: Application.get_env(:wasail, :bcc_emails)
  def verified_identity, do: Application.get_env(:wasail, :ses_verified_identity_for_smtp)
end
