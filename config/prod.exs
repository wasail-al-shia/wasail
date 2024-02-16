import Config

# Configure your database
config :wasail, Wasail.Repo,
  timeout: :timer.minutes(10),
  pool_size: 3,
  ssl: true,
  ssl_opts: [verify: :verify_none],
  queue_target: :timer.minutes(10)

config :wasail, WasailWeb.Endpoint,
  http: [ip: {0, 0, 0, 0}, port: 4000],
  server: true,
  debug_errors: true,
  check_origin: false

config :logger, :console,
  format: "[$level] <$metadata> $message\n",
  metadata: [:module, :function]

config :wasail, Wasail.Mailer,
  adapter: Swoosh.Adapters.SMTP,
  relay: "email-smtp.us-east-1.amazonaws.com",
  username: "AKIAX2FDSD5JIEEAGO5G",
  port: 25,
  retries: 2,
  no_mx_lookups: false

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
