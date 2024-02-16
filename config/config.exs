# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :wasail,
  ecto_repos: [Wasail.Repo],
  bk_cd_ws: "ws",
  #                  shuaybi                tasneemshoeb             wasail.al.shia
  admin_uids: ["113405576099734332839", "108485062904594919718", "115106629340710687706"],
  admin_emails: ["wasail.al.shia@gmail.com", "shuaybi@gmail.com"],
  ip_info_url: "http://ipinfo.io/"

# Configures the endpoint
config :wasail, WasailWeb.Endpoint,
  url: [host: "localhost"],
  render_errors: [view: WasailWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Wasail.PubSub,
  server: true,
  live_view: [signing_salt: "k7hJvwdq"]

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :wasail, Wasail.Mailer, adapter: Swoosh.Adapters.Local

# Swoosh API client is needed for adapters other than SMTP.
config :swoosh, :api_client, false

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.14.0",
  default: [
    args:
      ~w(js/index.js --bundle --target=es2017 --loader:.js=jsx --loader:.woff=file --loader:.woff2=file --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :ueberauth, Ueberauth,
  providers: [
    google: {Ueberauth.Strategy.Google, [default_scope: "email profile"]}
    # ...
  ]

config :ueberauth, Ueberauth.Strategy.Google.OAuth,
  client_id: "674843619114-5hi78muj3l1p5dvadvi5ufvg5kqj7618.apps.googleusercontent.com"

# url to view local emails: localhost:4000/mailbox
config :wasail, Wasail.Mailer, adapter: Swoosh.Adapters.Local

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
