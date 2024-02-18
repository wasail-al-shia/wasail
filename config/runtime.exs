import Config

# executed after compilation and before the system starts

if config_env() == :prod do
  config :wasail, Wasail.Repo, url: System.fetch_env!("DATABASE_URL")
  config :wasail, WasailWeb.Endpoint, secret_key_base: System.fetch_env!("SECRET_KEY_BASE")
end

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_secret: System.fetch_env!("GGL_OAUTH_CLNT_SCRT_WAS")

# config :wasail, Wasail.Mailer, password: System.fetch_env!("SES_SMTP_PASSWORD")
config :wasail, :ip_info_token, System.fetch_env!("IP_INFO_TOKEN")
