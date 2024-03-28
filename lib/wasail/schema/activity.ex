defmodule Wasail.Schema.Activity do
  use Ecto.Schema

  schema "activity" do
    belongs_to :ip_info, Wasail.Schema.IpInfo
    field :user_agent, :string
    field :report_id, :integer
    field :chapter_id, :integer
    field :search_str, :string
    field :activity_type, :string
    field :desc, :string
    timestamps()
  end
end
