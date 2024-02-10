defmodule Wasail.Repo do
  use Ecto.Repo,
    otp_app: :wasail,
    adapter: Ecto.Adapters.Postgres
end
