defmodule Wasail.Schema.Comment do
  use Ecto.Schema

  schema "comment" do
    belongs_to :report, Wasail.Schema.Report
    field :comment_seq_no, :integer
    field :comment_eng, :string
    field :comment_arb, :string
    timestamps()
  end
end
