import Config

# config/runtime.exs is executed for all environments, including
# during releases. It is executed after compilation and before the
# system starts, so it is typically used to load production configuration
# and secrets from environment variables or elsewhere. Do not define
# any compile-time configuration in here, as it won't be applied.
# The block below contains prod specific runtime configuration.

# Start the phoenix server if environment is set and running in a release
if System.get_env("PHX_SERVER") && System.get_env("RELEASE_NAME") do
  config :wasail, WasailWeb.Endpoint, server: true
end

if config_env() == :prod do
  config :wasail, Wasail.Repo, url: System.fetch_env!("DATABASE_URL")
  config :wasail, WasailWeb.Endpoint, secret_key_base: System.fetch_env!("SECRET_KEY_BASE")
end

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_secret: System.fetch_env!("GGL_OAUTH_CLNT_SCRT_WAS")
