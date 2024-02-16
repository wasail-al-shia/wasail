defmodule Wasail.Schema.IpInfo do
  use Ecto.Schema

  schema "ip_info" do
    field :ip, :string
    field :country, :string
    field :region, :string
    field :city, :string
    has_many :activities, Wasail.Schema.Activity, preload_order: [desc: :inserted_at]
    timestamps()
  end
end
