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
  format: "$date $time [$level] <$metadata> $message\n",
  metadata: [:module, :function, :request_id]

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
