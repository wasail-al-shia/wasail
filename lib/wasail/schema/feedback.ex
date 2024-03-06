defmodule Wasail.Schema.Feedback do
  use Ecto.Schema

  schema "feedback" do
    belongs_to :report, Wasail.Schema.Report
    field :sender_name, :string
    field :sender_email, :string
    field :comment, :string
    field :reviewed, :boolean
    field :resolution, :string
    timestamps()
  end
end
