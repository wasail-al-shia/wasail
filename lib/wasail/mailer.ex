defmodule Wasail.Mailer do
  use Swoosh.Mailer, otp_app: :wasail

  import Swoosh.Email

  def send_phoenix_view(subject, template, payload, from) do
    payload = %{data: payload}
    body = get_html_body(template, payload)
    send(subject, body, from)
  end

  def send(subject, body, from)
      when is_binary(subject) and is_binary(body) do
    new()
    |> to(admin_emails())
    |> from(from)
    |> subject(subject)
    |> html_body(body)
    |> deliver()
  end

  def get_html_body(template, payload) do
    WasailWeb.EmailView
    |> Phoenix.View.render_to_string(template, payload)
  end

  def admin_emails, do: Application.get_env(:wasail, :admin_emails)
end
