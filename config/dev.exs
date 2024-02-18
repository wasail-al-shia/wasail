import Config

# Configure your database
config :wasail, Wasail.Repo,
  url: "ecto://postgres:postgres@localhost/wasail_dev",
  show_sensitive_data_on_connection_error: true,
  port: 5433,
  pool_size: 10

# Use following command to run postgres in docker:
# docker run --restart=always  --name pg-wasail -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=wasail_dev -v pgdata:/var/lib/postgresql/data_wasail  -d -p 5433:5432 postgres

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with esbuild to bundle .js and .css sources.
config :wasail, WasailWeb.Endpoint,
  # Binding to loopback ipv4 address prevents access from other machines.
  # Change to `ip: {0, 0, 0, 0}` to allow access from other machines.
  http: [ip: {127, 0, 0, 1}, port: 4000],
  check_origin: false,
  code_reloader: true,
  debug_errors: true,
  secret_key_base: "JKsC/H0NHR5Sng9LoceeSXr9gOfq+FL7yGLhTxfFQGIkzITFTR8DbMtAegpTHaHE",
  watchers: [
    # Start the esbuild watcher by calling Esbuild.install_and_run(:default, args)
    esbuild: {Esbuild, :install_and_run, [:default, ~w(--sourcemap=inline --watch)]}
  ]

# Watch static and templates for browser reloading.
config :wasail, WasailWeb.Endpoint,
  live_reload: [
    patterns: [
      ~r"priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$",
      ~r"priv/gettext/.*(po)$",
      ~r"lib/wasail_web/(live|views)/.*(ex)$",
      ~r"lib/wasail_web/templates/.*(eex)$"
    ]
  ]

# url to view local emails: localhost:4000/mailbox
config :wasail, Wasail.Mailer, adapter: Swoosh.Adapters.Local
# config :wasail, Wasail.Mailer, adapter: Swoosh.Adapters.ExAwsAmazonSES
# config :swoosh, :api_client, Swoosh.ApiClient.Hackney

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Initialize plugs at runtime for faster development compilation
config :phoenix, :plug_init_mode, :runtime
