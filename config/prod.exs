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

config :logger,
  backends: [
    :console,
    {LoggerFileBackend, :debug},
    {LoggerFileBackend, :info},
    {LoggerFileBackend, :error}
  ],
  sync_threshold: 150,
  discard_threshold: 1000

config :logger, :debug,
  path: "log/debug.log",
  level: :info,
  format: "$date $time [$level] <$metadata> $message\n",
  metadata: [:module, :function, :request_id, :trade_id, :weight_by, :entity_id, :security_id]

config :logger, :info,
  path: "log/info.log",
  level: :info,
  format: "$date $time [$level] <$metadata> $message\n",
  metadata: [:module, :function, :request_id, :trade_id, :weight_by, :entity_id, :security_id]

config :logger, :error,
  path: "log/error.log",
  level: :error,
  format: "$date $time [$level] <$metadata> $message\n",
  metadata: [:module, :function, :request_id]

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
